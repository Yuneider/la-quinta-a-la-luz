/* Estado del recorrido y funciones de ayuda que usan los demás archivos. */

/* ============ Estado ============ */
/* El recorrido NO se guarda: cada vez que se recarga la página empieza de cero, en el Jardín.
   `imgs` son las fotos que el visitante ya vio. */
const nuevoEstado = () => ({seen:[], visited:[], found:[], imgs:[], lanternRoom:null, lanternTaken:false, uv:false});
let S = nuevoEstado();
/* Por qué un espacio no se puede abrir todavía: "start" (falta empezar por el Jardín),
   "inv" (en investigación: faltan evidencias UV por encontrar) o "" si está abierto. */
function lockReason(id){
  if (id !== START_ROOM && !S.visited.includes(START_ROOM)) return "start";
  if (LOCKED_ROOMS.includes(id) && !investigacionCerrada()) return "inv";
  return "";
}
const investigacionCerrada = () => S.found.length >= HIDDEN_ROOMS.length;
const $ = id => document.getElementById(id);
const NS = "http://www.w3.org/2000/svg";
const el = (tag, attrs = {}, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; };
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const pad = n => String(n).padStart(2, "0");
const txt = (parent, x, y, s, cls, extra = {}) => { const t = el("text", Object.assign({x, y, class:cls}, extra), parent); t.textContent = s; return t; };
const plan = $("plan"), card = $("card");
let light = {x:470, y:470}, lmc, tint, ring;
