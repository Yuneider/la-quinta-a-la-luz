/* Arranque. Debe cargarse de último. */

/* ============ Arranque ============ */
function start(data){
  if (data && Array.isArray(data.seen)) S = Object.assign(S, data);
  drawPlan();
  setUV(S.uv);
}
window.claude?.hot?.snapshot?.(() => S);
window.claude?.hot?.ready ? window.claude.hot.ready(start) : start(window.claude?.hot?.data ?? {});
