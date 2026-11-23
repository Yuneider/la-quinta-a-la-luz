/* Sonido: de fondo suena un instrumental de contenido/general/sonido, uno para la versión
   normal y otro para la luz UV. scripts/sincronizar.js deja en CONTENIDO.musica la copia liviana
   de cada uno y su ganancia («gan») para que las dos suenen igual de fuerte. Los efectos se
   generan con WebAudio. Nada se descarga hasta que se activa el sonido, y la pista UV solo
   cuando se enciende la luz UV. */

/* ============ Música de fondo ============ */
const MUSICA_VOL = .5;
const MUSICA = CONTENIDO.musica || {};
function pista(p, respaldo){
  const a = new Audio((p && p.src) || respaldo);
  a.loop = true; a.preload = "none"; a.volume = 0; a.fadeId = null;
  a.vol = MUSICA_VOL * ((p && p.gan) || 1);
  return a;
}
const musicaNormal = pista(MUSICA.normal, "contenido/general/sonido/Instrumental1.mp3");
const musicaUV = pista(MUSICA.uv, "contenido/general/sonido/InstrumentalUV.mp3");
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
  fade(musicaNormal, soundOn && !S.uv ? musicaNormal.vol : 0);
  fade(musicaUV, soundOn && S.uv ? musicaUV.vol : 0);
}

/* ============ Efectos (WebAudio, sin archivos) ============ */
/* El sonido viene activado: los navegadores no dejan sonar nada antes del primer gesto, así que
   arranca con el botón de la introducción (o con el primer clic o tecla, lo que llegue antes). */
let ctx = null, master, soundOn = true;
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
function noise(t, dur, vol, freq, q = .8){
  const b = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * dur), ctx.sampleRate), d = b.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
  s.buffer = b; f.type = "bandpass"; f.frequency.value = freq; f.Q.value = q;
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
  s.connect(f); f.connect(g); g.connect(master); s.start(t);
}
function thump(t, from, to, dur, vol){
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.frequency.setValueAtTime(from, t); o.frequency.exponentialRampToValueAtTime(to, t + dur);
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
  o.connect(g); g.connect(master); o.start(t); o.stop(t + dur + .05);
}
/* Golpe grave + chasquido eléctrico + disonancia: acompaña los destellos de la pantalla normal. */
function scareSound(){ sfx(t => { thump(t, 120, 38, .7, .5); noise(t, .35, .35, 2600, 1.4); pluck(hz(77), t + .02, .9, .07, master, "sawtooth"); pluck(hz(78), t + .02, .9, .07, master, "sawtooth"); noise(t + .26, .2, .25, 4200, 2); }); }
/* Zumbido de tubo UV al encenderse. */
function buzzSound(){ sfx(t => { [0, .09, .2].forEach((d, i) => noise(t + d, .12, .12 + i * .04, 180, 3)); pluck(hz(45), t + .2, 1.4, .1, master, "sawtooth"); pluck(hz(93), t + .25, 1.6, .05, master, "sine"); }); }
function lockSound(){ sfx(t => { pluck(hz(50), t, .25, .14, master, "square"); pluck(hz(49), t + .09, .3, .12, master, "square"); }); }
function unlockSound(){ sfx(t => { [72,76,79,84].forEach((m,i) => pluck(hz(m), t + i*.07, 1, .09, master, "sine")); }); }
/* Arranca el audio dentro de un gesto del visitante (lo exigen los navegadores). */
function ensureAudio(){
  if (!soundOn) return;
  try { if (!ctx) initAudio(); else if (ctx.state !== "running") ctx.resume(); } catch(e) {}
  fadeMusica();
}
const primerGesto = () => { ensureAudio(); removeEventListener("pointerup", primerGesto, true); removeEventListener("keydown", primerGesto, true); };
addEventListener("pointerup", primerGesto, true);
addEventListener("keydown", primerGesto, true);
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
    actual.volume = actual.vol; actual.play().catch(() => {});
  }
});
