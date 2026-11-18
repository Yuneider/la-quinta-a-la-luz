/* Sincroniza la vista con las carpetas de contenido/.
   Lee los textos e imágenes de cada espacio y de cada evidencia UV y escribe js/contenido.js,
   que es lo que carga la vista. Se corre después de cambiar algo en contenido/:

     node scripts/sincronizar.js

   Qué lee en cada carpeta (contenido/NN-espacio/, contenido/uv/NN-evidencia/ y contenido/alrededores/):
     texto/descripcion*.txt   párrafo principal
     texto/titulo.txt         título de la pieza o de la evidencia
     texto/ficha.txt          línea bajo el título de la pieza (solo espacios con pieza)
     texto/fecha.txt          fecha de la evidencia (solo uv/)
     texto/cita.txt           cita destacada, opcional (solo uv/)
     texto/fuente.txt         fuente de la evidencia (solo uv/)
     imagenes/*               todas las imágenes, en orden alfabético
   Los pies de foto están en contenido/pies-de-foto/<carpeta>.txt, una línea por imagen:
     NOMBRE_DE_LA_IMAGEN.jpg | Texto del pie de foto.
   (también vale un .txt con el mismo nombre de la imagen dentro de imagenes/, que tiene prioridad).
   Los textos también pueden ser .md. Cualquier otro archivo (creditos.md, etc.) se ignora.

   Imágenes: las fotos originales pesan varios MB. Si está instalado «sharp» (npm install), cada
   imagen se copia a optimizadas/ en .webp, ya girada según su EXIF, en dos tamaños: una copia
   mediana (máximo 900 px, «-m.webp») que carga el carrusel y una grande (máximo 1600 px) que solo
   se pide al ampliar la foto. Solo se procesan las imágenes nuevas o cambiadas (optimizadas/manifiesto.json).
   Sin sharp se reutilizan las copias que ya existan y, si no hay, se usa el original. */
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const crypto = require("crypto");

const RAIZ = path.join(__dirname, "..");
const CONTENIDO = path.join(RAIZ, "contenido");
const SALIDA = path.join(RAIZ, "js", "contenido.js");
const OPTIMIZADAS = path.join(RAIZ, "optimizadas");
const MANIFIESTO = path.join(OPTIMIZADAS, "manifiesto.json");
const LADO_MAX = 1600, CALIDAD = 78;   // copia grande: vista ampliada
const LADO_MED = 900, CALIDAD_MED = 72; // copia mediana: carrusel del panel
const IMAGEN = /\.(jpe?g|png|webp|gif|avif|svg)$/i;
const RASTER = /\.(jpe?g|png|webp|avif)$/i;
const avisos = [];
let sharp = null;
try { sharp = require("sharp"); } catch { /* sin sharp: se usan copias existentes u originales */ }
const manifiesto = fs.existsSync(MANIFIESTO) ? JSON.parse(fs.readFileSync(MANIFIESTO, "utf8")) : {};
const usadas = new Set();
let procesadas = 0, sinOptimizar = 0;

const orden = (a, b) => a.localeCompare(b, "es", {numeric:true});
const listar = dir => fs.existsSync(dir) ? fs.readdirSync(dir).sort(orden) : [];
const rel = p => path.relative(RAIZ, p).split(path.sep).join("/");
const leer = p => fs.readFileSync(p, "utf8").replace(/^﻿/, "").replace(/\s+/g, " ").trim();

/* Busca texto/<nombre>.txt o .md; con `prefijo` acepta cualquier archivo que empiece así (descripcion4.txt). */
function texto(carpeta, nombre, prefijo){
  const dir = path.join(carpeta, "texto");
  const patron = new RegExp("^" + nombre + (prefijo ? ".*" : "") + "\\.(txt|md)$", "i");
  const hallados = listar(dir).filter(f => patron.test(f));
  if (hallados.length > 1) avisos.push(`${rel(dir)}: hay ${hallados.length} archivos «${nombre}»; se usa ${hallados[0]}`);
  return hallados.length ? leer(path.join(dir, hallados[0])) : "";
}

/* «SALON_DE_LA_ESTUFA_1.jpg» -> «Salón de la estufa» (texto alternativo si no hay pie de foto). */
function nombreLegible(archivo){
  const s = archivo.replace(/\.[^.]+$/, "").replace(/^\d+[_-]/, "").replace(/[_-]+\d*$/, "").replace(/[_-]+/g, " ").trim().toLowerCase();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/* Devuelve {src, med, w, h} de las copias web de `original` (las crea si hace falta). */
async function optimizar(original){
  const clave = rel(original);
  if (!RASTER.test(original)) return {src:clave};
  const hash = crypto.createHash("sha1").update(fs.readFileSync(original)).digest("hex");
  const destino = path.join(OPTIMIZADAS, path.relative(CONTENIDO, original).replace(/\.[^.]+$/, ".webp"));
  const mediana = destino.replace(/\.webp$/, "-m.webp");
  const previo = manifiesto[clave];
  usadas.add(clave);
  const existe = f => f && fs.existsSync(path.join(RAIZ, f));
  if (previo && previo.hash === hash && existe(previo.src) && existe(previo.med)) return previo;
  if (!sharp) { sinOptimizar++; return previo && existe(previo.src) ? previo : {src:clave}; }
  fs.mkdirSync(path.dirname(destino), {recursive:true});
  const base = () => sharp(original).rotate();
  const info = await base().resize(LADO_MAX, LADO_MAX, {fit:"inside", withoutEnlargement:true})
    .webp({quality:CALIDAD, effort:5}).toFile(destino);
  await base().resize(LADO_MED, LADO_MED, {fit:"inside", withoutEnlargement:true})
    .webp({quality:CALIDAD_MED, effort:5}).toFile(mediana);
  procesadas++;
  return manifiesto[clave] = {src:rel(destino), med:rel(mediana), w:info.width, h:info.height, hash};
}

/* Lee contenido/pies-de-foto/<carpeta>.txt: líneas «ARCHIVO.jpg | pie». La clave es el nombre sin
   extensión y sin distinguir mayúsculas, para que cambiar .jpg por .jpeg no rompa el pie. */
const PIES = path.join(CONTENIDO, "pies-de-foto");
const sinExt = f => f.replace(/\.[^.]+$/, "").toLowerCase();
function piesDe(carpeta){
  const archivo = path.join(PIES, path.relative(CONTENIDO, carpeta) + ".txt");
  const pies = new Map();
  if (!fs.existsSync(archivo)) return {pies, archivo};
  fs.readFileSync(archivo, "utf8").replace(/^﻿/, "").split(/\r?\n/).forEach((linea, i) => {
    linea = linea.trim();
    if (!linea || linea.startsWith("#")) return;
    const corte = linea.indexOf("|");
    if (corte < 0) return avisos.push(`${rel(archivo)}, línea ${i + 1}: falta «|» entre la imagen y el pie`);
    pies.set(sinExt(linea.slice(0, corte).trim()), {texto:linea.slice(corte + 1).trim(), linea:i + 1});
  });
  return {pies, archivo};
}

async function imagenes(carpeta){
  const dir = path.join(carpeta, "imagenes");
  const {pies, archivo} = piesDe(carpeta);
  const out = [];
  for (const f of listar(dir).filter(f => IMAGEN.test(f))) {
    const {src, med, w, h} = await optimizar(path.join(dir, f));
    const propio = ["txt", "md"].map(e => path.join(dir, f.replace(/\.[^.]+$/, "." + e))).find(fs.existsSync);
    const enLista = pies.get(sinExt(f));
    pies.delete(sinExt(f));
    const textoPie = propio ? leer(propio) : enLista ? enLista.texto : "";
    out.push(Object.assign({src}, med ? {med} : {}, w ? {w, h} : {}, textoPie ? {pie:textoPie} : {alt:nombreLegible(f)}));
  }
  for (const [nombre, {linea}] of pies) avisos.push(`${rel(archivo)}, línea ${linea}: no hay ninguna imagen «${nombre}» en ${rel(dir)}`);
  return out;
}

async function una(carpeta, campos){
  const item = {};
  for (const c of campos) { const v = texto(carpeta, c, c === "descripcion"); if (v) item[c] = v; }
  item.imgs = await imagenes(carpeta);
  return item;
}

/* Carpetas «NN-nombre» dentro de `dir`, indexadas por su número. */
function carpetas(dir){
  const out = {};
  for (const f of listar(dir)) {
    const m = /^(\d+)-/.exec(f), p = path.join(dir, f);
    if (!m || !fs.statSync(p).isDirectory()) continue;
    const n = Number(m[1]);
    if (out[n]) avisos.push(`${rel(dir)}: dos carpetas con el número ${n}; se usa ${path.basename(out[n])}`);
    else out[n] = p;
  }
  return out;
}

async function recoger(dir, campos){
  const out = {};
  for (const [n, carpeta] of Object.entries(carpetas(dir))) out[n] = await una(carpeta, campos);
  return out;
}

(async () => {
const datos = {
  espacios: await recoger(CONTENIDO, ["titulo", "ficha", "descripcion"]),
  uv: await recoger(path.join(CONTENIDO, "uv"), ["titulo", "fecha", "cita", "descripcion", "fuente"]),
  alrededores: await una(path.join(CONTENIDO, "alrededores"), ["titulo", "descripcion"])
};

/* Borra las copias web de imágenes que ya no están en contenido/ y guarda el manifiesto. */
for (const clave of Object.keys(manifiesto)) {
  if (usadas.has(clave)) continue;
  for (const f of [manifiesto[clave].src, manifiesto[clave].med].filter(Boolean)) {
    const copia = path.join(RAIZ, f);
    if (fs.existsSync(copia)) fs.unlinkSync(copia);
  }
  delete manifiesto[clave];
}
if (procesadas || Object.keys(manifiesto).length !== usadas.size || !fs.existsSync(MANIFIESTO)) {
  fs.mkdirSync(OPTIMIZADAS, {recursive:true});
  const ordenado = Object.fromEntries(Object.keys(manifiesto).sort(orden).map(k => [k, manifiesto[k]]));
  fs.writeFileSync(MANIFIESTO, JSON.stringify(ordenado, null, 2) + "\n");
}
if (sinOptimizar) avisos.push(`${sinOptimizar} imágenes sin copia optimizada (falta sharp: corre «npm install»); se usan los originales, que pesan mucho más.`);

/* Revisa contra js/datos.js que no falte ningún texto que la vista necesita. */
try {
  const fuente = fs.readFileSync(path.join(RAIZ, "js", "datos.js"), "utf8");
  const {ROOMS, HIDDEN} = vm.runInNewContext(`const CONTENIDO = {espacios:{}, uv:{}};\n${fuente}\n;({ROOMS, HIDDEN})`);
  const revisar = (item, etiqueta, campos) => {
    if (!item) return avisos.push(`${etiqueta}: no existe su carpeta en contenido/`);
    campos.filter(c => !item[c]).forEach(c => avisos.push(`${etiqueta}: falta texto/${c}.txt`));
  };
  ROOMS.forEach(r => revisar(datos.espacios[r.id], `Espacio ${r.id} (${r.name})`, r.piece ? ["titulo", "ficha", "descripcion"] : ["descripcion"]));
  Object.values(HIDDEN).forEach(h => revisar(datos.uv[h.n], `Evidencia UV ${h.n}`, ["titulo", "fecha", "descripcion", "fuente"]));
} catch (e) {
  avisos.push("No se pudo revisar js/datos.js: " + e.message);
}

const salida = `/* GENERADO por scripts/sincronizar.js a partir de contenido/. No editar a mano:
   cambia los archivos de contenido/ y vuelve a correr «node scripts/sincronizar.js». */
const CONTENIDO = ${JSON.stringify(datos, null, 2)};
`;
const cambio = !fs.existsSync(SALIDA) || fs.readFileSync(SALIDA, "utf8") !== salida;
if (cambio) fs.writeFileSync(SALIDA, salida);

const total = grupo => Object.values(grupo).reduce((s, i) => s + i.imgs.length, 0);
console.log(`${Object.keys(datos.espacios).length} espacios (${total(datos.espacios)} imágenes), ${Object.keys(datos.uv).length} evidencias UV (${total(datos.uv)} imágenes).`);
console.log(cambio ? "js/contenido.js actualizado." : "js/contenido.js ya estaba al día.");
if (procesadas) console.log(`${procesadas} imágenes optimizadas en optimizadas/.`);
if (avisos.length) console.log("\nAvisos:\n" + avisos.map(a => "  - " + a).join("\n"));
})().catch(e => { console.error(e); process.exit(1); });
