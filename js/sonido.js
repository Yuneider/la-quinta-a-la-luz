/* Música y efectos generados con WebAudio (sin archivos de sonido). */

/* ============ Sonido (WebAudio, sin archivos) ============ */
let ctx = null, master, busPeriod, busTense, nextT = 0, step = 0, soundOn = false;
const hz = m => 440 * Math.pow(2, (m - 69) / 12);
const BARS = [[50,62,65,69],[43,55,58,62],[45,57,61,64],[50,62,65,69],[46,58,62,65],[43,55,58,62],[45,57,61,64],[50,57,62,65]];
const PATTERN = [0,1,2,3,2,1];
function initAudio(){
  ctx = new (window.AudioContext || window.webkitAudioContext)();
  master = ctx.createGain(); master.gain.value = .55; master.connect(ctx.destination);
  busPeriod = ctx.createGain(); busTense = ctx.createGain();
  busPeriod.gain.value = S.uv ? 0 : 1; busTense.gain.value = S.uv ? 1 : 0;
  busPeriod.connect(master); busTense.connect(master);
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
    const bar = BARS[Math.floor(step / 6) % BARS.length], idx = PATTERN[step % 6];
    pluck(hz(bar[idx]), nextT, idx === 0 ? 1.6 : 1.0, idx === 0 ? .2 : .11, busPeriod);
    if (step % 18 === 9) { pluck(hz(85), nextT, 3.2, .06, busTense, "sine"); pluck(hz(86), nextT + .02, 3.0, .04, busTense, "sine"); }
    nextT += .3; step++;
  }
}
function audioMode(){ if (!ctx) return; const t = ctx.currentTime; busPeriod.gain.setTargetAtTime(S.uv ? 0 : 1, t, .5); busTense.gain.setTargetAtTime(S.uv ? 1 : 0, t, .5); }
function sfx(fn){ if (ctx && soundOn) fn(ctx.currentTime); }
function chime(){ sfx(t => { pluck(hz(81), t, .8, .12, master, "sine"); pluck(hz(86), t + .09, 1.1, .1, master, "sine"); }); }
function lanternSound(){ sfx(t => { [69,74,78,81].forEach((m,i) => pluck(hz(m), t + i*.08, 1.2, .09, master, "sine")); }); }
function revealSound(){ sfx(t => { pluck(hz(61), t, 1.8, .14, master, "sine"); pluck(hz(67), t + .04, 1.8, .1, master, "sine"); }); }
$("soundToggle").onclick = async () => {
  soundOn = !soundOn;
  try { if (soundOn) { if (!ctx) initAudio(); else await ctx.resume(); audioMode(); } else if (ctx) await ctx.suspend(); }
  catch(e) { soundOn = false; }
  $("soundToggle").setAttribute("aria-pressed", soundOn);
};
