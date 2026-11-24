/* Experiencia: introducción con luz UV, el «LUZ» interactivo del título, los destellos que
   sobresaltan en la pantalla normal y los avisos breves (toast). */

const REDUCIR = matchMedia("(prefers-reduced-motion: reduce)").matches;
const huellaSVG = (rot = 0) => `<svg viewBox="-24 -24 48 48"><g transform="rotate(${rot})">${[[5,7],[9,12],[13,17],[17,22]].map(([rx,ry],i) => `<ellipse rx="${rx}" ry="${ry}" stroke-dasharray="${i%2 ? "9 4" : "14 5"}"/>`).join("")}</g></svg>`;

/* ============ Avisos breves ============ */
let toastId;
function toast(msg, kind = ""){
  const t = $("toast");
  t.textContent = msg; t.className = "toast show" + (kind ? " " + kind : "");
  clearTimeout(toastId); toastId = setTimeout(() => t.classList.remove("show"), 3600);
}

/* ============ Introducción ============ */
let introDone = false;
function startIntro(){
  const intro = $("intro"), beam = $("introBeam"), glow = $("introGlow"), prints = $("introPrints");
  // Huellas repartidas por la pantalla: solo brillan cuando pasa la luz encima.
  prints.innerHTML = Array.from({length:11}, (_, i) => {
    const x = 6 + ((i * 37) % 88), y = 8 + ((i * 53) % 84);
    return `<span class="ip" style="left:${x}%;top:${y}%;--r:${(i*41)%70-35}deg;--k:${.7 + (i%4)*.22}">${huellaSVG((i*41)%70-35)}</span>`;
  }).join("");
  const spots = [...prints.children];
  let bx = -200, by = innerHeight / 2, follow = false;
  const R = Math.max(110, Math.min(innerWidth, innerHeight) * .2);
  function paintBeam(){
    beam.style.transform = `translate(${bx - R}px,${by - R}px)`;
    beam.style.width = beam.style.height = R * 2 + "px";
    const g = glow.getBoundingClientRect();
    const m = `radial-gradient(circle ${R}px at ${bx - g.left}px ${by - g.top}px, #000 35%, transparent 75%)`;
    if (!glow.classList.contains("full")) { glow.style.maskImage = m; glow.style.webkitMaskImage = m; }
    spots.forEach(s => {
      const r = s.getBoundingClientRect(), d = Math.hypot(r.left + r.width/2 - bx, r.top + r.height/2 - by);
      s.style.opacity = Math.max(0, Math.min(1, 1.25 - d / R)).toFixed(2);
    });
  }
  // Texto de la cabecera escrito letra a letra, como un informe de laboratorio.
  const eye = "Casa Museo Quinta de Bolívar · Bogotá";
  let k = 0; const typer = setInterval(() => { $("introEye").textContent = eye.slice(0, ++k); if (k >= eye.length) clearInterval(typer); }, REDUCIR ? 0 : 38);

  function revelar(){
    glow.classList.add("full"); glow.style.maskImage = glow.style.webkitMaskImage = "none";
    intro.classList.add("lit"); follow = true;
  }
  if (REDUCIR) { bx = innerWidth / 2; by = innerHeight / 2; paintBeam(); revelar(); }
  else {
    // Barrido: la linterna entra por la izquierda, recorre la pantalla y se detiene en el título.
    const T = 3000, t0 = performance.now();
    const step = now => {
      if (follow) return;
      const t = Math.min(1, (now - t0) / T), W = innerWidth, H = innerHeight;
      const tit = glow.getBoundingClientRect(), cx = tit.left + tit.width * .72, cy = tit.top + tit.height * .72;
      const sx = W * (-.1 + 1.05 * t) + Math.sin(t * Math.PI * 3) * W * .06;
      const sy = H * (.5 + .3 * Math.sin(t * Math.PI * 2.4));
      const e = t < .75 ? 0 : (t - .75) / .25; // al final se acerca al «LUZ»
      bx = sx + (cx - sx) * e * e; by = sy + (cy - sy) * e * e;
      paintBeam();
      if (t < 1) requestAnimationFrame(step); else { revelar(); buzzSound(); }
    };
    requestAnimationFrame(step);
    setTimeout(() => intro.classList.add("ready"), 1600);
  }
  // Después del barrido, la luz sigue al cursor o al dedo.
  intro.addEventListener("pointermove", e => { if (!follow) return; bx = e.clientX; by = e.clientY - (e.pointerType === "touch" ? 50 : 0); paintBeam(); });
  addEventListener("resize", () => { if (!introDone) paintBeam(); });

  $("introGo").onclick = () => {
    if (introDone) return;
    introDone = true; follow = true;
    ensureAudio(); buzzSound();
    intro.classList.add("out");
    setTimeout(() => {
      intro.hidden = true;
      openRoom(START_ROOM); // el recorrido empieza siempre en el Jardín
      flashLuz();
      scheduleScare(14000 + Math.random() * 8000);
    }, REDUCIR ? 0 : 900);
  };
  setTimeout(() => $("introGo").focus({preventScroll:true}), REDUCIR ? 0 : 1700);
}

/* ============ «LUZ» interactivo del título ============ */
const luz = $("luz");
function moverLuz(e){
  const r = luz.getBoundingClientRect();
  luz.style.setProperty("--mx", (e.clientX - r.left) + "px");
  luz.style.setProperty("--my", (e.clientY - r.top) + "px");
}
luz.addEventListener("pointermove", moverLuz);
luz.addEventListener("pointerenter", e => { moverLuz(e); luz.classList.add("aim"); });
luz.addEventListener("pointerleave", () => luz.classList.remove("aim"));
luz.addEventListener("click", () => uvSweep());
luz.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); uvSweep(); } });
function flashLuz(){ luz.classList.remove("flash"); void luz.offsetWidth; luz.classList.add("flash"); }

/* Al tocar «LUZ», un haz ultravioleta recorre la página y deja leer una pista escondida. */
function pista(){
  if (!S.visited.includes(START_ROOM)) return "Todo empieza en el Jardín (1).";
  if (S.uv) { const f = HIDDEN_ROOMS.length - S.found.length; return f ? `Faltan ${f} huellas. Mueve la luz despacio.` : "Ya lo viste todo. Cierra el expediente."; }
  if (S.lanternTaken) return "La linterna está en tus manos: enciéndela.";
  if (S.lanternRoom) return "La linterna te espera en el Comedor (5).";
  return "Algo se encenderá en el Comedor (5).";
}
let sweepId;
function uvSweep(){
  const r = luz.getBoundingClientRect(), sw = $("uvsweep");
  sw.style.setProperty("--ox", (r.left + r.width / 2) + "px");
  sw.style.setProperty("--oy", (r.top + r.height / 2) + "px");
  $("uvsweepMsg").textContent = pista();
  sw.classList.remove("on"); void sw.offsetWidth; sw.classList.add("on");
  flashLuz(); buzzSound();
  clearTimeout(sweepId); sweepId = setTimeout(() => sw.classList.remove("on"), 2600);
}

/* ============ Destellos en la pantalla normal ============ */
/* Cada cierto tiempo la luz «falla»: la pantalla se apaga y un destello ultravioleta deja ver una
   huella y una frase. Dos destellos por evento (por debajo del umbral de 3 por segundo), nunca en
   la vista UV, y con movimiento reducido se cambia por un aviso suave sin parpadeo. */
const FRASES = ["NO TODO ESTÁ EN LAS VITRINAS", "ALGUIEN BORRÓ ESTO", "¿QUIÉN DECIDE QUÉ SE MUESTRA?",
  "MIRA OTRA VEZ", "ESTA CASA GUARDA SECRETOS", "SIGUE LAS HUELLAS", "LO QUE NO SE CUENTA", "AQUÍ PASÓ ALGO"];
let scareTimer, fraseAt = Math.floor(Math.random() * FRASES.length);
function scheduleScare(ms){ clearTimeout(scareTimer); scareTimer = setTimeout(scare, ms); }
function scare(){
  const ocupado = S.uv || document.hidden || !$("final").hidden || lightbox.open || !introDone;
  if (ocupado) return scheduleScare(8000);
  const sc = $("scare");
  $("scareMsg").textContent = FRASES[fraseAt++ % FRASES.length];
  $("scarePrint").innerHTML = huellaSVG(Math.random() * 60 - 30);
  sc.style.setProperty("--px", (12 + Math.random() * 64) + "%");
  sc.style.setProperty("--py", (28 + Math.random() * 30) + "%");
  scareSound();
  if (REDUCIR) {
    sc.className = "scare soft on";
    setTimeout(() => sc.className = "scare", 1600);
  } else {
    const fases = [[0, "dark"], [90, "on"], [330, "dark"], [430, "on"], [760, ""]];
    fases.forEach(([t, c]) => setTimeout(() => sc.className = "scare" + (c ? " " + c : ""), t));
    $("scene").classList.add("jolt"); setTimeout(() => $("scene").classList.remove("jolt"), 520);
    // Queda un rastro: una huella tenue en el plano que se apaga sola.
    setTimeout(rastro, 780);
  }
  scheduleScare(26000 + Math.random() * 24000);
}
function rastro(){
  const r = ROOMS[Math.floor(Math.random() * ROOMS.length)];
  const g = el("g", {class:"rastro", transform:`translate(${r.c[0]},${r.c[1]}) scale(.5)`, "aria-hidden":"true"}, plan);
  const p = el("g", {transform:`rotate(${Math.random()*60-30})`}, g);
  [[5,7],[9,12],[13,17],[17,22]].forEach(([rx,ry],i) => el("ellipse", {rx, ry, "stroke-dasharray": i%2 ? "9 4" : "14 5"}, p));
  setTimeout(() => g.remove(), 4200);
}
