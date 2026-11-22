/* Sonido: en la versión normal suena el instrumental de contenido/general/sonido;
   con la luz UV, un ambiente tenso generado con WebAudio. Los efectos también se generan. */

/* ============ Música de fondo (versión normal) ============ */
const MUSICA_VOL = .5;
const musica = new Audio("contenido/general/sonido/Instrumental1.mp3");
musica.loop = true; musica.preload = "none"; musica.volume = 0;
let fadeId = null;
function fadeMusica(to){
  clearInterval(fadeId);
  if (to > 0 && musica.paused) musica.play().catch(() => {});
  const from = musica.volume, PASOS = 15; let n = 0;
  /* Por pasos contados: en iOS el volumen no se puede cambiar y aun así hay que pausar al final. */
  fadeId = setInterval(() => {
    n++; musica.volume = from + (to - from) * n / PASOS;
    if (n >= PASOS) { clearInterval(fadeId); if (to === 0) musica.pause(); }
  }, 60);
}

/* ============ Ambiente UV y efectos (WebAudio, sin archivos) ============ */
let ctx = null, master, busTense, nextT = 0, step = 0, soundOn = false;
const hz = m => 440 * Math.pow(2, (m - 69) / 12);
function initAudio(){
  ctx = new (window.AudioContext || window.webkitAudioContext)();
  master = ctx.createGain(); master.gain.value = .55; master.connect(ctx.destination);
  busTense = ctx.createGain(); busTense.gain.value = S.uv ? 1 : 0; busTense.connect(master);
  const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 280; lp.Q.value = 5;
  const dg = ctx.createGain(); dg.gain.value = .16; lp.connect(dg); dg.connect(busTense);
  [73.42, 77.78, 36.71].forEach(f => { const o = ctx.createOscillator(); o.type = "sawtooth"; o.frequency.value = f; o.connect(lp); o.start(); });
  const lfo = ctx.createOscillator(); lfo.frequency.value = .07; const lg = ctx.createGain(); lg.gain.value = 160; lfo.connect(lg); lg.connect(lp.frequency); lfo.start();
  nextT = ctx.currentTime + .1;
  setInterval(schedule, 90);
}
function pluck(f, t, dur, vol, bus, type = "triangle"){
  const o = ctx.createOscillator(), g = ctx.createGain(), fl = ctx.createBiquadFilter();
  o.type = type; o.frequency.value = f; fl.type = "lowpass"; fl.frequency.value = 2400;
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .006); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
  o.connect(fl); fl.connect(g); g.connect(bus); o.start(t); o.stop(t + dur + .05);
}
function schedule(){
  while (nextT < ctx.currentTime + .35) {
    if (step % 18 === 9) { pluck(hz(85), nextT, 3.2, .06, busTense, "sine"); pluck(hz(86), nextT + .02, 3.0, .04, busTense, "sine"); }
    nextT += .3; step++;
  }
}
function audioMode(){ if (!ctx) return; fadeMusica(soundOn && !S.uv ? MUSICA_VOL : 0); const t = ctx.currentTime; busTense.gain.setTargetAtTime(S.uv ? 1 : 0, t, .5); }
function sfx(fn){ if (ctx && soundOn) fn(ctx.currentTime); }
function chime(){ sfx(t => { pluck(hz(81), t, .8, .12, master, "sine"); pluck(hz(86), t + .09, 1.1, .1, master, "sine"); }); }
function lanternSound(){ sfx(t => { [69,74,78,81].forEach((m,i) => pluck(hz(m), t + i*.08, 1.2, .09, master, "sine")); }); }
function revealSound(){ sfx(t => { pluck(hz(61), t, 1.8, .14, master, "sine"); pluck(hz(67), t + .04, 1.8, .1, master, "sine"); }); }
$("soundToggle").onclick = async () => {
  soundOn = !soundOn;
  /* La música arranca dentro del clic: algunos navegadores bloquean play() después de un await. */
  fadeMusica(soundOn && !S.uv ? MUSICA_VOL : 0);
  try { if (soundOn) { if (!ctx) initAudio(); else await ctx.resume(); audioMode(); } else if (ctx) await ctx.suspend(); }
  catch(e) { soundOn = false; fadeMusica(0); }
  $("soundToggle").setAttribute("aria-pressed", soundOn);
  $("soundToggle").textContent = soundOn ? "Sonido: sí" : "Sonido: no";
};
/* Con la pestaña oculta o el celular bloqueado no suena nada; al volver sigue donde iba. */
document.addEventListener("visibilitychange", () => {
  if (!soundOn) return;
  if (document.hidden) { clearInterval(fadeId); musica.pause(); if (ctx) ctx.suspend(); }
  else { if (ctx) ctx.resume(); if (!S.uv) { musica.volume = MUSICA_VOL; musica.play().catch(() => {}); } }
});
