/* Pantalla final y respuesta del visitante. */

/* ============ Expediente final ============ */
function showFinal(){
  $("listMuseo").innerHTML = ROOMS.filter(r => r.piece).map(r => `<li><i>${r.id}</i><span>${esc(r.piece.title)}</span></li>`).join("");
  $("listOculta").innerHTML = Object.values(HIDDEN).sort((a,b) => a.n - b.n).map(h => `<li><i>${pad(h.n)}</i><span>${esc(h.title)} · ${esc(h.date)}</span></li>`).join("");
  try { $("respuesta").value = localStorage.getItem("quinta-respuesta") || ""; } catch(e) {}
  $("final").hidden = false; $("final").scrollTop = 0;
  closeCard();
}
$("respuesta").addEventListener("input", e => {
  try { localStorage.setItem("quinta-respuesta", e.target.value); $("saved").textContent = "Guardado en este navegador."; }
  catch(err) { $("saved").textContent = ""; }
});
$("backBtn").onclick = () => { $("final").hidden = true; };
$("restartBtn").onclick = () => { $("final").hidden = true; reset(); };
