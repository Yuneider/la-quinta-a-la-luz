/* Linterna UV: mover la luz, tomarla y encender o apagar el modo UV. */

/* ============ Linterna UV ============ */
function toSvg(cx, cy){ const p = plan.createSVGPoint(); p.x = cx; p.y = cy; return p.matrixTransform(plan.getScreenCTM().inverse()); }
let raf = 0;
function requestFrame(){ if (!raf) raf = requestAnimationFrame(paint); }
function paint(){
  raf = 0;
  [lmc, tint, ring].forEach(c => { if (c) { c.setAttribute("cx", light.x); c.setAttribute("cy", light.y); } });
  plan.querySelectorAll(".mark").forEach(g => {
    const r = HIDDEN_ROOMS.find(x => x.hidden === g.dataset.h);
    const d = Math.hypot(r.c[0] - light.x, r.c[1] - light.y);
    let o = Math.max(0, Math.min(1, 1 - (d - R_LIGHT*.15) / (R_LIGHT*.45)));
    if (S.found.includes(g.dataset.h)) o = Math.max(o, .75);
    g.style.opacity = S.uv ? o.toFixed(3) : 0;
    g.classList.toggle("lit", S.uv && o > .45);
  });
}
// En pantallas táctiles la luz va por encima del dedo para que no la tape.
const follow = e => { if (!S.uv) return; const p = toSvg(e.clientX, e.clientY - (e.pointerType === "touch" ? 56 : 0)); light.x = p.x; light.y = p.y; requestFrame(); };
// Al levantar el dedo se abre la huella sin descubrir que esté en el centro del haz.
plan.addEventListener("pointerup", e => {
  if (!S.uv || e.pointerType !== "touch") return;
  let best = null, bd = R_LIGHT * .4;
  HIDDEN_ROOMS.forEach(r => { if (S.found.includes(r.hidden)) return; const d = Math.hypot(r.c[0] - light.x, r.c[1] - light.y); if (d < bd) { bd = d; best = r; } });
  if (best) openHidden(best.hidden);
});
plan.addEventListener("pointermove", follow);
plan.addEventListener("pointerdown", follow);
plan.addEventListener("click", e => { if (!S.uv && !e.target.closest(".room,#lantern")) closeCard(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeCard(); });
window.addEventListener("resize", () => { placeGuide(); placeCard(); requestFrame(); });

function takeLantern(){
  S.lanternTaken = true;
  const l = $("lantern"); if (l) l.remove();
  light = {x:482, y:640};
  setUV(true);
}
function setUV(on){
  S.uv = on;
  document.body.classList.toggle("uv", on);
  $("uvToggle").hidden = !S.lanternTaken;
  $("uvToggle").setAttribute("aria-pressed", on);
  $("eyebrow").textContent = on ? "Examen con luz ultravioleta — Quinta de Bolívar" : "Casa Museo Quinta de Bolívar · Bogotá";
  $("rule").textContent = on ? "ESCENA ABIERTA · sigue las pisadas bajo la luz" : "Explora la casa. Algunas cosas no están a la vista.";
  $("hint").textContent = on ? "Mueve la luz ultravioleta sobre la casa" : "Pasa el cursor o toca un número";
  closeCard(); syncMarks(); updateHUD(); audioMode();
  if (on) guideOpen = true;
  renderGuide();
}

function updateHUD(){
  $("cPieces").textContent = `${S.visited.length}/${ROOMS.length}`;
  document.querySelector(".medal.ev").classList.toggle("locked", !S.lanternTaken);
  $("cHidden").textContent = S.lanternTaken ? `${S.found.length}/10` : "—";
  $("cHiddenLbl").textContent = S.uv ? "evidencias" : "hallazgos";
}
