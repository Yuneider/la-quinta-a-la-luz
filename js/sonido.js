/* Sonido: de fondo suena un instrumental de contenido/general/sonido, uno para la versión
   normal y otro para la luz UV. Los efectos se generan con WebAudio. */

/* ============ Música de fondo ============ */
const MUSICA_VOL = .5;
function pista(src){
  const a = new Audio(src);
  a.loop = true; a.preload = "none"; a.volume = 0; a.fadeId = null;
  return a;
}
const musicaNormal = pista("contenido/general/sonido/Instrumental1.mp3");
const musicaUV = pista("contenido/general/sonido/InstrumentalUV.mp3");
function fade(a, to){
  clearInterval(a.fadeId);
  if (to > 0 && a.paused) a.play().catch(() => {});
  const from = a.volume, PASOS = 15; let n = 0;
  /* Por pasos contados: en iOS el volumen no se puede cambiar y aun así hay que pausar al final. */
  a.fadeId = setInterval(() => {
    n++; a.volume = from + (to - from) * n / PASOS;
    if (n >= PASOS) { clearInterval(a.fadeId); if (to === 0) a.pause(); }
  }, 60);
}
/* Suena la pista del modo actual; la otra se apaga. */
function fadeMusica(){
  fade(musicaNormal, soundOn && !S.uv ? MUSICA_VOL : 0);
  fade(musicaUV, soundOn && S.uv ? MUSICA_VOL : 0);
}

/* ============ Efectos (WebAudio, sin archivos) ============ */
let ctx = null, master, soundOn = false;
const hz = m => 440 * Math.pow(2, (m - 69) / 12);
function initAudio(){
  ctx = new (window.AudioContext || window.webkitAudioContext)();
  master = ctx.createGain(); master.gain.value = .55; master.connect(ctx.destination);
}
function pluck(f, t, dur, vol, bus, type = "triangle"){
  const o = ctx.createOscillator(), g = ctx.createGain(), fl = ctx.createBiquadFilter();
  o.type = type; o.frequency.value = f; fl.type = "lowpass"; fl.frequency.value = 2400;
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .006); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
  o.connect(fl); fl.connect(g); g.connect(bus); o.start(t); o.stop(t + dur + .05);
}
function audioMode(){ fadeMusica(); }
function sfx(fn){ if (ctx && soundOn) fn(ctx.currentTime); }
function chime(){ sfx(t => { pluck(hz(81), t, .8, .12, master, "sine"); pluck(hz(86), t + .09, 1.1, .1, master, "sine"); }); }
function lanternSound(){ sfx(t => { [69,74,78,81].forEach((m,i) => pluck(hz(m), t + i*.08, 1.2, .09, master, "sine")); }); }
function revealSound(){ sfx(t => { pluck(hz(61), t, 1.8, .14, master, "sine"); pluck(hz(67), t + .04, 1.8, .1, master, "sine"); }); }
$("soundToggle").onclick = async () => {
  soundOn = !soundOn;
  /* La música arranca dentro del clic: algunos navegadores bloquean play() después de un await. */
  fadeMusica();
  try { if (soundOn) { if (!ctx) initAudio(); else await ctx.resume(); } else if (ctx) await ctx.suspend(); }
  catch(e) { soundOn = false; fadeMusica(); }
  $("soundToggle").setAttribute("aria-pressed", soundOn);
  $("soundToggle").textContent = soundOn ? "Sonido: sí" : "Sonido: no";
};
/* Con la pestaña oculta o el celular bloqueado no suena nada; al volver sigue donde iba. */
document.addEventListener("visibilitychange", () => {
  if (!soundOn) return;
  const actual = S.uv ? musicaUV : musicaNormal;
  if (document.hidden) {
    [musicaNormal, musicaUV].forEach(a => { clearInterval(a.fadeId); a.pause(); });
    if (ctx) ctx.suspend();
  } else {
    if (ctx) ctx.resume();
    actual.volume = MUSICA_VOL; actual.play().catch(() => {});
  }
});
