/* Panel izquierdo: cartela de cada espacio, guía y ficha de cada hallazgo. */

/* ============ Cartela anclada al plano ============ */
let anchor = null, activeRoom = null, closedAt = 0, guideOpen = true;
const guide = $("guide");
function svgToScreen([x,y]){ const p = plan.createSVGPoint(); p.x = x; p.y = y; const s = p.matrixTransform(plan.getScreenCTM()); return {x:s.x, y:s.y}; }
function mapRect(){ const a = svgToScreen([164,192]), b = svgToScreen([646,720]); return {l:a.x, t:a.y, r:b.x, b:b.y}; }
function openCard(html, mode, pt){
  card.className = "card" + (mode ? " " + mode : "");
  card.innerHTML = `<button class="x" type="button" id="closeCard" aria-label="Cerrar">×</button>` + html;
  card.hidden = false; card.scrollTop = 0; anchor = pt;
  void card.offsetWidth; card.classList.add("pop");
  $("closeCard").onclick = closeCard;
  placeCard();
}
function closeCard(){ if (!card.hidden) closedAt = Date.now(); card.hidden = true; anchor = null; activeRoom = null; setActive(null); }
function placeCard(){}

function openRoom(id){
  const r = ROOMS.find(x => x.id === id);
  setActive(id);
  if (!S.visited.includes(id)) S.visited.push(id);
  const before = S.seen.length;
  let newPiece = false;
  if (r.piece && !S.seen.includes(id)) { S.seen.push(id); newPiece = true; chime(); }
  if (newPiece && S.seen.length === UNLOCK_AT && !S.lanternRoom) { S.lanternRoom = id; drawLantern(id); lanternSound(); }
  let notice = "";
  if (S.lanternRoom && !S.lanternTaken) {
    const lr = ROOMS.find(x => x.id === S.lanternRoom);
    notice = `<div class="notice"><p><b>Apareció una linterna UV</b> en ${esc(lr.name)}. Con ella verás lo que el museo no muestra.</p><button class="btn gold" type="button" id="takeBtn">Tomar la linterna</button></div>`;
  }
  const tags = `<div class="tags"><span class="tag">Texto provisional</span>${r.piece ? '<span class="tag">Foto pendiente</span>' : ''}</div>`;
  let html;
  if (r.piece) {
    const p = r.piece;
    html = `<div class="head"><span class="big">${pad(r.id)}</span><div class="head-txt"><span class="kicker">Espacio · ${p.code}</span><span class="room-name">${esc(r.name)}</span></div></div>
      <h2>${esc(p.title)}</h2><p class="meta">${esc(p.meta)}</p>
      <div class="foto">Fotografía de la pieza</div>
      <p>${esc(p.text)}</p>${notice}${tags}`;
  } else {
    html = `<div class="head"><span class="big">${pad(r.id)}</span><div class="head-txt"><span class="kicker">Espacio</span><span class="room-name">Sin pieza en exhibición</span></div></div>
      <h2>${esc(r.name)}</h2><p>${esc(r.space)}</p>${notice}${tags}`;
  }
  openCard(html, "", r.c);
  activeRoom = id;
  const tb = $("takeBtn"); if (tb) tb.onclick = takeLantern;
  syncRoomClasses(); updateHUD();
  if (S.seen.length !== before) renderGuide();
}

/* Guía de qué hacer y cómo: acoplada al costado izquierdo (hoja inferior en celular) */
function renderGuide(){
  const touch = matchMedia("(pointer:coarse)").matches;
  let html, mode;
  if (!S.uv) {
    mode = "";
    html = `<div class="kicker row"><span>Cómo se recorre</span><span>${S.seen.length}/${PIECE_ROOMS.length} piezas</span></div>
      <h2>Bienvenido a la Quinta</h2>
      <p>La casa donde vivió Simón Bolívar en Bogotá. Cada número del plano es un espacio del museo; el punto rojo marca la entrada.</p>
      <ol class="steps">
        <li>${touch ? "Toca" : "Pasa el cursor sobre"} un número para ver la pieza que se exhibe allí. El jardín se abre con clic.</li>
        <li>Al descubrir ${UNLOCK_AT} piezas aparecerá una linterna UV.</li>
        <li>Con la linterna, la sala se apaga y la casa se examina como una escena del crimen.</li>
      </ol>
      ${S.lanternTaken ? `<p class="meta">Ya tienes la linterna: enciéndela con el botón violeta.</p>` : S.lanternRoom ? `<p class="meta">La linterna ya apareció en el plano. Tómala.</p>` : ""}`;
  } else {
    mode = "uvnote";
    const left = HIDDEN_ROOMS.length - S.found.length;
    html = `<div class="kicker row"><span>Examen UV</span><span>${S.found.length}/10</span></div>
      <h2>Lo que no se cuenta</h2>
      <p>La casa quedó a oscuras. Mueve la luz ultravioleta${touch ? " arrastrando el dedo" : ""} y busca las huellas que brillan dentro del haz, cerca de las cintas amarillas.</p>
      <p>${left ? `Faltan ${left} evidencias.` : "Encontraste todas las evidencias."}</p>
      ${left ? "" : `<button class="btn gold" type="button" id="toFinal">Cerrar el expediente</button>`}`;
  }
  guide.className = "card guide" + (mode ? " " + mode : "");
  guide.innerHTML = `<button class="x" type="button" id="closeGuide" aria-label="Ocultar guía">×</button>` + html;
  $("closeGuide").onclick = () => { guideOpen = false; guide.hidden = true; placeCard(); };
  const tf = $("toFinal"); if (tf) tf.onclick = showFinal;
  guide.hidden = !guideOpen;
  placeGuide();
}
function placeGuide(){}
$("helpBtn").onclick = () => {
  guideOpen = guide.hidden || !card.hidden;
  if (guideOpen) closeCard();
  renderGuide();
};

function openHidden(key){
  const h = HIDDEN[key]; const r = HIDDEN_ROOMS.find(x => x.hidden === key);
  if (!S.found.includes(key)) { S.found.push(key); revealSound(); }
  syncMarks(); updateHUD(); renderGuide();
  const done = S.found.length === HIDDEN_ROOMS.length;
  openCard(`<div class="head"><span class="big">${pad(h.n)}</span><div class="head-txt"><span class="kicker">Hallazgo · Espacio ${pad(r.id)} · ${esc(r.name)}</span><span class="room-name">Fecha: ${esc(h.date)}</span></div></div>
    <h2>${esc(h.title)}</h2>
    ${h.quote ? `<p class="quote">«${esc(h.quote)}»</p>` : ""}
    <p>${esc(h.text)}</p>
    <div class="foto">Imagen de la capa oculta</div>
    <div class="fuente"><b>FUENTE</b> — ${esc(h.src)}</div>
    <div class="tags"><span class="tag">Por verificar</span></div>
    ${done ? `<button class="btn gold" type="button" id="toFinal">Cerrar el expediente</button>` : `<p class="meta">${S.found.length} de 10 evidencias.</p>`}`, "secret", r.c);
  const tf = $("toFinal"); if (tf) tf.onclick = showFinal;
}
