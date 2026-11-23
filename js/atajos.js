/* Atajos del prototipo (menú de tres puntos), reinicio y botón de la luz UV. */

/* ============ Atajos ============ */
const closeMenu = () => document.querySelector(".proto").removeAttribute("open");
$("skipSix").onclick = () => {
  closeMenu(); if (S.lanternTaken) return;
  while (S.imgs.length < IMGS_TO_UNLOCK) S.imgs.push("atajo-" + S.imgs.length);
  const missing = ROOMS.map(r => r.id).filter(id => !S.visited.includes(id));
  while (S.visited.length < UNLOCK_AT - 1 && missing.length) { const id = missing.shift(); S.visited.push(id); if (PIECE_ROOMS.includes(id) && !S.seen.includes(id)) S.seen.push(id); }
  if (missing.length) openRoom(missing.shift());
};
$("skipAll").onclick = () => {
  closeMenu();
  while (S.imgs.length < IMGS_TO_UNLOCK) S.imgs.push("atajo-" + S.imgs.length);
  if (!S.lanternTaken) { PIECE_ROOMS.forEach(id => { if (!S.seen.includes(id)) S.seen.push(id); }); ROOMS.forEach(r => { if (!S.visited.includes(r.id)) S.visited.push(r.id); }); S.lanternRoom = LANTERN_ROOM; takeLantern(); }
  else if (!S.uv) setUV(true);
  S.found = HIDDEN_ROOMS.map(r => r.hidden);
  syncMarks(); syncRoomClasses(); updateHUD(); renderGuide();
};
$("resetBtn").onclick = () => { closeMenu(); reset(); };
function reset(){
  S = nuevoEstado();
  guideOpen = true;
  drawPlan(); setUV(false); updateHUD();
  openRoom(START_ROOM);
}
$("uvToggle").onclick = () => setUV(!S.uv);
