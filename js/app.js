/* Arranque. Debe cargarse de último. */

/* ============ Arranque ============ */
/* Cada carga empieza el recorrido de cero (solo la recarga en caliente del editor conserva el estado). */
function start(data){
  if (data && Array.isArray(data.seen)) S = Object.assign(nuevoEstado(), data);
  drawPlan();
  setUV(S.uv);
  startIntro();
}
window.claude?.hot?.snapshot?.(() => S);
window.claude?.hot?.ready ? window.claude.hot.ready(start) : start(window.claude?.hot?.data ?? {});
