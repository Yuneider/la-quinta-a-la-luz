/* Panel izquierdo: cartela de cada espacio, guía y ficha de cada hallazgo. */

/* ============ Cartela anclada al plano ============ */
let anchor = null, activeRoom = null, closedAt = 0, guideOpen = true;
const guide = $("guide");
function svgToScreen([x,y]){ const p = plan.createSVGPoint(); p.x = x; p.y = y; const s = p.matrixTransform(plan.getScreenCTM()); return {x:s.x, y:s.y}; }
function mapRect(){ const a = svgToScreen([164,192]), b = svgToScreen([646,720]); return {l:a.x, t:a.y, r:b.x, b:b.y}; }
/* Carrusel: varias imágenes por espacio o evidencia (lista `imgs` en datos.js) */
/* Cada foto se muestra completa (sin recortar) sobre una copia difuminada de sí misma, así las
   verticales, horizontales y panorámicas llenan el mismo marco sin franjas vacías. */
function gallery(imgs, label){
  const list = (imgs || []).map(i => typeof i === "string" ? {src:i} : i);
  if (!list.length) return `<div class="foto">${esc(label)}</div>`;
  // El carrusel carga la copia mediana (`med`); la grande (`src`) solo se pide en la vista ampliada.
  const slides = list.map((im, i) => `<figure class="slide"><span class="blur" aria-hidden="true"></span><img src="${esc(im.med || im.src)}" data-full="${esc(im.src)}" alt="${esc(im.pie || im.alt || label)}"${im.w ? ` width="${im.w}" height="${im.h}"` : ""}${i ? "" : ` fetchpriority="high"`} decoding="async">${im.pie ? `<figcaption>${esc(im.pie)}</figcaption>` : ""}</figure>`).join("");
  const nav = list.length > 1 ? `<button class="gbtn prev" type="button" aria-label="Imagen anterior">‹</button><button class="gbtn next" type="button" aria-label="Imagen siguiente">›</button><span class="gcount">1 / ${list.length}</span>` : "";
  const zoom = `<button class="gzoom" type="button" aria-label="Ver imagen ampliada"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg></button>`;
  return `<div class="gal"><div class="track" tabindex="0" role="group" aria-label="Imágenes: ${esc(label)}">${slides}</div>${nav}${zoom}</div>`;
}
function initGallery(root){
  root.querySelectorAll(".gal").forEach(g => {
    const track = g.querySelector(".track"), count = g.querySelector(".gcount"), n = track.children.length;
    const idx = () => Math.round(track.scrollLeft / track.clientWidth);
    const go = d => track.scrollTo({left: Math.max(0, Math.min(n - 1, idx() + d)) * track.clientWidth, behavior:"smooth"});
    g.querySelector(".prev")?.addEventListener("click", () => go(-1));
    g.querySelector(".next")?.addEventListener("click", () => go(1));
    g.querySelector(".gzoom").addEventListener("click", () => openLightbox(track, idx()));
    track.addEventListener("scroll", () => { if (count) count.textContent = `${idx() + 1} / ${n}`; }, {passive:true});
    track.addEventListener("keydown", e => {
      if (e.key === "ArrowRight"){ e.preventDefault(); go(1); }
      if (e.key === "ArrowLeft"){ e.preventDefault(); go(-1); }
      if (e.key === "Enter"){ e.preventDefault(); openLightbox(track, idx()); }
    });
    track.querySelectorAll("img").forEach((img, i) => {
      const fig = img.parentNode;
      const ready = () => { fig.querySelector(".blur").style.backgroundImage = `url("${img.currentSrc || img.src}")`; fig.classList.add("ready"); };
      if (img.complete && img.naturalWidth) ready(); else img.addEventListener("load", ready);
      img.addEventListener("click", () => openLightbox(track, i));
      img.addEventListener("error", () => { fig.classList.add("missing"); fig.textContent = "No se encontró la imagen: " + img.getAttribute("src"); });
    });
  });
}

/* Vista ampliada: la foto a pantalla completa, con el mismo marco y flechas del carrusel. */
const lightbox = document.createElement("dialog");
lightbox.className = "lightbox";
lightbox.setAttribute("aria-label", "Imagen ampliada");
lightbox.innerHTML = `<figure><img alt=""><figcaption></figcaption></figure>
  <button class="x" type="button" aria-label="Cerrar imagen ampliada">×</button>
  <button class="gbtn prev" type="button" aria-label="Imagen anterior">‹</button><button class="gbtn next" type="button" aria-label="Imagen siguiente">›</button>
  <span class="gcount"></span>`;
document.body.appendChild(lightbox);
let lbImgs = [], lbAt = 0, lbTrack = null;
function showLightbox(i){
  lbAt = (i + lbImgs.length) % lbImgs.length;
  const src = lbImgs[lbAt], img = lightbox.querySelector("img");
  // Mientras llega la copia grande se ve la mediana (ya en caché), sin pantalla vacía.
  img.src = src.getAttribute("src"); img.alt = src.alt;
  const full = src.dataset.full;
  if (full && full !== img.getAttribute("src")) { const big = new Image(); big.onload = () => { if (lbImgs[lbAt] === src) img.src = full; }; big.src = full; }
  const pie = src.parentNode.querySelector("figcaption");
  lightbox.querySelector("figcaption").textContent = pie ? pie.textContent : src.alt;
  lightbox.querySelector(".gcount").textContent = lbImgs.length > 1 ? `${lbAt + 1} / ${lbImgs.length}` : "";
  lightbox.classList.toggle("single", lbImgs.length < 2);
}
function openLightbox(track, i){
  lbImgs = [...track.querySelectorAll("img")]; lbTrack = track;
  if (!lbImgs.length) return;
  showLightbox(i);
  lightbox.showModal();
}
lightbox.querySelector(".x").onclick = () => lightbox.close();
lightbox.querySelector(".prev").onclick = () => showLightbox(lbAt - 1);
lightbox.querySelector(".next").onclick = () => showLightbox(lbAt + 1);
lightbox.addEventListener("click", e => { if (e.target === lightbox || e.target.tagName === "FIGURE") lightbox.close(); });
lightbox.addEventListener("keydown", e => {
  if (e.key === "ArrowRight") showLightbox(lbAt + 1);
  if (e.key === "ArrowLeft") showLightbox(lbAt - 1);
});
// Al cerrar, el carrusel queda en la misma foto que se estaba viendo ampliada.
lightbox.addEventListener("close", () => { if (lbTrack && lbTrack.isConnected) { lbTrack.scrollTo({left: lbAt * lbTrack.clientWidth}); lbTrack.focus({preventScroll:true}); } });

function openCard(html, mode, pt){
  card.className = "card" + (mode ? " " + mode : "");
  card.innerHTML = `<button class="x" type="button" id="closeCard" aria-label="Cerrar">×</button>` + html;
  card.hidden = false; card.scrollTop = 0; card.parentNode.scrollTop = 0; initGallery(card); anchor = pt;
  void card.offsetWidth; card.classList.add("pop");
  $("closeCard").onclick = closeCard;
  placeCard();
}
function closeCard(){ if (lightbox.open) lightbox.close(); if (!card.hidden) closedAt = Date.now(); card.hidden = true; anchor = null; activeRoom = null; setActive(null); }
function placeCard(){}

function openRoom(id){
  const r = ROOMS.find(x => x.id === id);
  setActive(id);
  const before = S.visited.length;
  if (!S.visited.includes(id)) S.visited.push(id);
  let newPiece = false;
  if (r.piece && !S.seen.includes(id)) { S.seen.push(id); newPiece = true; chime(); }
  if (S.visited.length !== before && S.visited.length >= UNLOCK_AT && !S.lanternRoom) { S.lanternRoom = id; drawLantern(id); lanternSound(); }
  let notice = "";
  if (S.lanternRoom && !S.lanternTaken) {
    const lr = ROOMS.find(x => x.id === S.lanternRoom);
    notice = `<div class="notice"><p><b>Apareció una linterna UV</b> en ${esc(lr.name)}. Con ella verás lo que el museo no muestra.</p><button class="btn gold" type="button" id="takeBtn">Tomar la linterna</button></div>`;
  }
  let html;
  if (r.piece) {
    const p = r.piece;
    html = `<div class="head"><span class="big">${pad(r.id)}</span><div class="head-txt"><span class="kicker">Espacio · ${p.code}</span><span class="room-name">${esc(r.name)}</span></div></div>
      <h2>${esc(p.title)}</h2><p class="meta">${esc(p.meta)}</p>
      ${gallery(r.imgs, "Fotografía de la pieza")}
      <p>${esc(p.text)}</p>${notice}`;
  } else {
    // Espacio sin una pieza destacada (jardín, despensa…): se presenta el espacio con sus fotos.
    html = `<div class="head"><span class="big">${pad(r.id)}</span><div class="head-txt"><span class="kicker">Espacio del recorrido</span><span class="room-name">${esc(r.name)}</span></div></div>
      ${r.title ? `<h2>${esc(r.title)}</h2>` : ""}${r.imgs.length ? gallery(r.imgs, r.name) : `<p class="meta">Sin pieza en exhibición.</p>`}<p>${esc(r.space)}</p>${notice}`;
  }
  openCard(html, "", r.c);
  activeRoom = id;
  const tb = $("takeBtn"); if (tb) tb.onclick = takeLantern;
  syncRoomClasses(); updateHUD();
  if (S.visited.length !== before) renderGuide();
}

/* Guía de qué hacer y cómo: acoplada al costado izquierdo (hoja inferior en celular) */
function renderGuide(){
  const touch = matchMedia("(pointer:coarse)").matches;
  let html, mode;
  if (!S.uv) {
    mode = "";
    html = `<div class="kicker row"><span>Cómo se recorre</span><span>${S.visited.length}/${ROOMS.length} espacios</span></div>
      <h2>Bienvenido a la Quinta</h2>
      <p>La casa donde vivió Simón Bolívar en Bogotá. Cada número del plano es un espacio del museo; el punto rojo marca la entrada.</p>
      <ol class="steps">
        <li>${touch ? "Toca un número en el plano o en la fila de números" : "Pasa el cursor sobre un número"} para ver lo que se exhibe allí. El jardín se abre con ${touch ? "un toque" : "clic"}.</li>
        <li>Cuando hayas visitado más de la mitad de los espacios (${UNLOCK_AT} de ${ROOMS.length}) aparecerá una linterna UV.</li>
        <li>Con la linterna, la sala se apaga y la casa se examina como una escena del crimen.</li>
      </ol>
      ${S.lanternTaken ? `<p class="meta">Ya tienes la linterna: enciéndela con el botón violeta.</p>` : S.lanternRoom ? `<p class="meta">La linterna ya apareció en el plano. Tómala.</p>` : ""}
      ${AROUND.imgs.length ? `<button class="btn" type="button" id="aroundBtn">Ver los alrededores de la Quinta ›</button>` : ""}`;
  } else {
    mode = "uvnote";
    const left = HIDDEN_ROOMS.length - S.found.length;
    html = `<div class="kicker row"><span>Examen UV</span><span>${S.found.length}/10</span></div>
      <h2>Lo que no se cuenta</h2>
      <p>La casa quedó a oscuras. ${touch ? "Arrastra el dedo: la luz va un poco por encima de él. Cuando una huella brille, levanta el dedo." : "Mueve la luz despacio: las huellas solo brillan cuando el centro del haz pasa justo encima."}</p>
      <p>${left ? `Faltan ${left} evidencias.` : "Encontraste todas las evidencias."}</p>
      ${left ? "" : `<button class="btn gold" type="button" id="toFinal">Cerrar el expediente</button>`}`;
  }
  guide.className = "card guide" + (mode ? " " + mode : "");
  guide.innerHTML = `<button class="x" type="button" id="closeGuide" aria-label="Ocultar guía">×</button>` + html;
  $("closeGuide").onclick = () => { guideOpen = false; guide.hidden = true; placeCard(); };
  const tf = $("toFinal"); if (tf) tf.onclick = showFinal;
  const ab = $("aroundBtn"); if (ab) ab.onclick = openAround;
  guide.hidden = !guideOpen;
  placeGuide();
}
function placeGuide(){}
$("helpBtn").onclick = () => {
  guideOpen = guide.hidden || !card.hidden;
  if (guideOpen) closeCard();
  renderGuide();
};

/* Alrededores: lo que se ve antes de entrar (no es un espacio del plano ni cuenta en el recorrido). */
const AROUND = CONTENIDO.alrededores || {imgs:[]};
function openAround(){
  setActive(null);
  openCard(`<div class="head"><span class="big">✦</span><div class="head-txt"><span class="kicker">Antes de entrar</span><span class="room-name">Fuera del plano</span></div></div>
    <h2>${esc(AROUND.titulo || "Los alrededores de la Quinta")}</h2>
    ${gallery(AROUND.imgs, "Alrededores de la Quinta")}
    ${AROUND.descripcion ? `<p>${esc(AROUND.descripcion)}</p>` : ""}`, "", ENTRY);
}

function openHidden(key){
  const h = HIDDEN[key]; const r = HIDDEN_ROOMS.find(x => x.hidden === key);
  if (!S.found.includes(key)) { S.found.push(key); revealSound(); }
  syncMarks(); updateHUD(); renderGuide();
  const done = S.found.length === HIDDEN_ROOMS.length;
  openCard(`<div class="head"><span class="big">${pad(h.n)}</span><div class="head-txt"><span class="kicker">Hallazgo · Espacio ${pad(r.id)} · ${esc(r.name)}</span><span class="room-name">Fecha: ${esc(h.date)}</span></div></div>
    <h2>${esc(h.title)}</h2>
    ${h.quote ? `<p class="quote">«${esc(h.quote)}»</p>` : ""}
    <p>${esc(h.text)}</p>
    ${gallery(h.imgs, "Imagen de la capa oculta")}
    <div class="fuente"><b>FUENTE</b> — ${esc(h.src)}</div>
    ${done ? `<button class="btn gold" type="button" id="toFinal">Cerrar el expediente</button>` : `<p class="meta">${S.found.length} de 10 evidencias.</p>`}`, "secret", r.c);
  const tf = $("toFinal"); if (tf) tf.onclick = showFinal;
}

/* Precarga en segundo plano: cuando la página ya cargó, se piden una a una las fotos del carrusel
   (primero la portada de cada espacio, luego las demás), para que al abrir un espacio ya estén en
   caché. Se omite si el visitante pidió ahorrar datos. */
function preloadImages(){
  if (navigator.connection && navigator.connection.saveData) return;
  const src = im => typeof im === "string" ? im : (im.med || im.src);
  const groups = ROOMS.map(r => r.imgs).concat([AROUND.imgs], Object.values(HIDDEN).map(h => h.imgs));
  const queue = [...new Set([...groups.map(g => g[0]), ...groups.flatMap(g => g.slice(1))].filter(Boolean).map(src))];
  const idle = window.requestIdleCallback || (f => setTimeout(f, 200));
  const next = () => {
    const url = queue.shift(); if (!url) return;
    const im = new Image(); im.decoding = "async";
    im.onload = im.onerror = () => idle(next);
    im.src = url;
  };
  idle(next);
}
if (document.readyState === "complete") preloadImages(); else addEventListener("load", preloadImages);
