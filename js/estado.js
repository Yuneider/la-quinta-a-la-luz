/* Estado del recorrido y funciones de ayuda que usan los demás archivos. */

/* ============ Estado ============ */
let S = {seen:[], visited:[], found:[], lanternRoom:null, lanternTaken:false, uv:false};
const $ = id => document.getElementById(id);
const NS = "http://www.w3.org/2000/svg";
const el = (tag, attrs = {}, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; };
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const pad = n => String(n).padStart(2, "0");
const txt = (parent, x, y, s, cls, extra = {}) => { const t = el("text", Object.assign({x, y, class:cls}, extra), parent); t.textContent = s; return t; };
const plan = $("plan"), card = $("card");
let light = {x:470, y:470}, lmc, tint, ring;
