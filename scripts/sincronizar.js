/* Sincroniza la vista con las carpetas de contenido/.
   Lee los textos e imágenes de cada espacio y de cada evidencia UV y escribe js/contenido.js,
   que es lo que carga la vista. Se corre después de cambiar algo en contenido/:

     node scripts/sincronizar.js

   Qué lee en cada carpeta (contenido/NN-espacio/ y contenido/uv/NN-evidencia/):
     texto/descripcion*.txt   párrafo principal
     texto/titulo.txt         título de la pieza o de la evidencia
     texto/ficha.txt          línea bajo el título de la pieza (solo espacios con pieza)
     texto/fecha.txt          fecha de la evidencia (solo uv/)
     texto/cita.txt           cita destacada, opcional (solo uv/)
     texto/fuente.txt         fuente de la evidencia (solo uv/)
     imagenes/*               todas las imágenes, en orden alfabético; el pie de foto es un
                              .txt con el mismo nombre (retrato.jpg -> retrato.txt)
   Los textos también pueden ser .md. Cualquier otro archivo (creditos.md, etc.) se ignora. */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const RAIZ = path.join(__dirname, "..");
const CONTENIDO = path.join(RAIZ, "contenido");
const SALIDA = path.join(RAIZ, "js", "contenido.js");
const IMAGEN = /\.(jpe?g|png|webp|gif|avif|svg)$/i;
const avisos = [];

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

function imagenes(carpeta){
  const dir = path.join(carpeta, "imagenes");
  return listar(dir).filter(f => IMAGEN.test(f)).map(f => {
    const src = rel(path.join(dir, f));
    const pie = ["txt", "md"].map(e => path.join(dir, f.replace(/\.[^.]+$/, "." + e))).find(fs.existsSync);
    const textoPie = pie ? leer(pie) : "";
    return textoPie ? {src, pie:textoPie} : src;
  });
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

function recoger(dir, campos){
  const out = {};
  for (const [n, carpeta] of Object.entries(carpetas(dir))) {
    const item = {};
    for (const c of campos) { const v = texto(carpeta, c, c === "descripcion"); if (v) item[c] = v; }
    item.imgs = imagenes(carpeta);
    out[n] = item;
  }
  return out;
}

const datos = {
  espacios: recoger(CONTENIDO, ["titulo", "ficha", "descripcion"]),
  uv: recoger(path.join(CONTENIDO, "uv"), ["titulo", "fecha", "cita", "descripcion", "fuente"])
};

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
if (avisos.length) console.log("\nAvisos:\n" + avisos.map(a => "  - " + a).join("\n"));
