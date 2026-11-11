/* Atajos del prototipo (menú de tres puntos), reinicio y botón de la luz UV. */

/* ============ Atajos ============ */
const closeMenu = () => document.querySelector(".proto").removeAttribute("open");
$("skipSix").onclick = () => {
  closeMenu(); if (S.lanternTaken) return;
  const missing = PIECE_ROOMS.filter(id => !S.seen.includes(id));
  while (S.seen.length < UNLOCK_AT - 1 && missing.length) S.seen.push(missing.shift());
  if (missing.length) openRoom(missing.shift());
};
$("skipAll").onclick = () => {
  closeMenu();
  if (!S.lanternTaken) { PIECE_ROOMS.forEach(id => { if (!S.seen.includes(id)) S.seen.push(id); }); S.lanternRoom = S.lanternRoom || PIECE_ROOMS[0]; takeLantern(); }
  else if (!S.uv) setUV(true);
  S.found = HIDDEN_ROOMS.map(r => r.hidden);
  syncMarks(); syncRoomClasses(); updateHUD(); renderGuide();
};
$("resetBtn").onclick = () => { closeMenu(); reset(); };
function reset(){
  S = {seen:[], visited:[], found:[], lanternRoom:null, lanternTaken:false, uv:false};
  guideOpen = true;
  drawPlan(); setUV(false);
}
$("uvToggle").onclick = () => setUV(!S.uv);
