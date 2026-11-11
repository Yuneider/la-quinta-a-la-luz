/* Dibuja el plano: terreno, espacios numerados, linterna, cintas y huellas. */

/* ============ Plano ============ */
function drawPlan(){
  plan.innerHTML = "";
  drawChips();
  const defs = el("defs", {}, plan);
  const rg = el("radialGradient", {id:"holeG"}, defs);
  el("stop", {offset:"0", "stop-color":"#000"}, rg); el("stop", {offset:".6", "stop-color":"#000"}, rg); el("stop", {offset:"1", "stop-color":"#fff"}, rg);
  const tg = el("radialGradient", {id:"tintG"}, defs);
  el("stop", {offset:"0", "stop-color":"#C9AEFF", "stop-opacity":".55"}, tg); el("stop", {offset:".55", "stop-color":"#7A4FE0", "stop-opacity":".32"}, tg); el("stop", {offset:"1", "stop-color":"#3A1E90", "stop-opacity":"0"}, tg);
  const mask = el("mask", {id:"lightMask", maskUnits:"userSpaceOnUse", x:"-800", y:"-800", width:"2400", height:"2400"}, defs);
  el("rect", {x:-800, y:-800, width:2400, height:2400, fill:"#fff"}, mask);
  lmc = el("circle", {r:R_LIGHT, fill:"url(#holeG)", cx:light.x, cy:light.y}, mask);
  const gf = el("filter", {id:"glow", x:"-60%", y:"-60%", width:"220%", height:"220%"}, defs);
  el("feGaussianBlur", {stdDeviation:"5"}, gf);
  const gs = el("filter", {id:"glowS", x:"-50%", y:"-50%", width:"200%", height:"200%"}, defs);
  el("feGaussianBlur", {stdDeviation:"1.4", result:"b"}, gs);
  const fm = el("feMerge", {}, gs); el("feMergeNode", {in:"b"}, fm); el("feMergeNode", {in:"SourceGraphic"}, fm);

  // Terreno: franja norte y jardín en terciopelo
  el("polygon", {points:"200,200 548,282 632,505 632,700 170,700 190,333", class:"estate"}, plan);
  // Rosa de los vientos
  const rose = el("g", {transform:"translate(590,228)"}, plan);
  el("circle", {r:20, class:"deco"}, rose);
  el("path", {d:"M0 -27 L5 -5 L27 0 L5 5 L0 27 L-5 5 L-27 0 L-5 -5 Z", class:"deco-fill", opacity:".85"}, rose);
  el("path", {d:"M-14 -14 L0 -3 L14 -14 L3 0 L14 14 L0 3 L-14 14 L-3 0 Z", class:"deco-fill", opacity:".4"}, rose);
  txt(rose, 0, -32, "N", "svg-label", {"text-anchor":"middle"});

  const roomsG = el("g", {}, plan);
  ROOMS.filter(r => r.garden).forEach(r => drawRoom(r, roomsG));
  // Parterres, fuentes y senderos
  const deco = el("g", {"pointer-events":"none"}, plan);
  el("rect", {x:206, y:230, width:88, height:28, class:"deco"}, deco);
  for (let i=0;i<6;i++) el("line", {x1:333+i*4, y1:278, x2:333+i*4, y2:296, class:"deco"}, deco);
  for (let i=0;i<6;i++) el("line", {x1:372, y1:282+i*4, x2:388, y2:282+i*4, class:"deco"}, deco);
  [["280,345 362,340 362,485 280,492"],["370,338 425,335 425,465 370,468"],["192,500 262,492 262,550 188,556"],["268,495 380,480 385,540 270,560"],["188,562 345,548 350,690 182,690"],["240,600 340,590 342,660 238,668"]]
    .forEach(([p]) => el("polygon", {points:p, class:"deco"}, deco));
  [[236,382,24,62],[264,382,16,62],[365,568,45,35],[365,606,45,35],[425,568,40,30],[425,640,40,45],[492,568,40,30],[548,568,25,30],[492,640,40,45],[548,640,25,45],[540,452,30,60],[395,480,18,70],[415,478,130,76],[590,540,38,158],[576,440,24,15],[180,684,150,5],[345,684,120,5]]
    .forEach(([x,y,w,h]) => el("rect", {x,y,width:w,height:h,class:"deco"}, deco));
  [[228,577,9],[214,640,9],[418,620,14],[532,620,14]].forEach(([x,y,r]) => { el("circle",{cx:x,cy:y,r,class:"deco"},deco); el("circle",{cx:x,cy:y,r:r*.45,class:"deco"},deco); });
  el("line", {x1:475, y1:555, x2:475, y2:700, class:"deco"}, deco); el("line", {x1:490, y1:555, x2:490, y2:700, class:"deco"}, deco);
  el("polygon", {points:"552,340 560,335 586,390 578,395", class:"deco"}, deco);
  // Muros
  el("polyline", {points:"470,700 170,700 190,333 200,200 548,282 632,505 632,700 590,700", class:"wall"}, plan);
  el("line", {x1:190, y1:333, x2:561, y2:316, class:"wall"}, plan);
  el("line", {x1:433, y1:436, x2:575, y2:436, class:"wall"}, plan);
  // Entrada
  el("circle", {cx:ENTRY[0], cy:ENTRY[1], r:4.5, class:"here"}, plan);
  txt(plan, 470, 712, "Entrada", "svg-label", {"text-anchor":"end"});
  txt(plan, 590, 712, "Salida", "svg-label");
  ROOMS.filter(r => !r.garden).forEach(r => drawRoom(r, plan));

  if (S.lanternRoom && !S.lanternTaken) drawLantern(S.lanternRoom);

  // Oscuridad con el agujero de la linterna
  const uv = el("g", {id:"uvLayer"}, plan);
  el("rect", {x:-800, y:-800, width:2400, height:2400, fill:"#0B0B0F", opacity:".97", mask:"url(#lightMask)"}, uv);
  // Contorno tenue para orientarse a oscuras (las cintas y las huellas solo se ven dentro del haz)
  el("polyline", {points:"470,700 170,700 190,333 200,200 548,282 632,505 632,700 590,700", class:"ghost"}, uv);
  el("line", {x1:190, y1:333, x2:561, y2:316, class:"ghost"}, uv);
  tint = el("circle", {id:"tint", r:R_LIGHT, fill:"url(#tintG)", cx:light.x, cy:light.y}, uv);
  ring = el("circle", {r:R_LIGHT*.98, class:"lens-ring", cx:light.x, cy:light.y}, uv);
  drawMarks();
  syncRoomClasses();
}

/* Fila de números para abrir los espacios en pantallas pequeñas */
function drawChips(){
  const box = $("chips"); box.innerHTML = "";
  ROOMS.forEach(r => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "chip"; b.dataset.id = r.id; b.textContent = r.id;
    b.setAttribute("aria-label", `Espacio ${r.id}: ${r.name}`);
    b.onclick = () => openRoom(r.id);
    box.appendChild(b);
  });
}

function drawRoom(r, parent){
  const g = el("g", {class:"room"+(r.garden?" garden":""), "data-id":r.id, tabindex:0, role:"button", "aria-label":`Espacio ${r.id}: ${r.name}`}, parent);
  if (r.poly) el("polygon", {points:r.poly, class:"shape"}, g);
  if (r.rects) r.rects.forEach(([x,y,w,h]) => el("rect", {x,y,width:w,height:h,class:"shape"}, g));
  if (r.oct) { const [cx,cy,R] = r.oct; const pts = []; for (let i=0;i<8;i++){ const a = Math.PI/8 + i*Math.PI/4; pts.push(`${cx+R*Math.cos(a)},${cy+R*Math.sin(a)}`);} el("polygon",{points:pts.join(" "),class:"shape"},g); }
  if (r.diamond) { const [cx,cy,s] = r.diamond; el("polygon",{points:`${cx},${cy-s} ${cx+s},${cy} ${cx},${cy+s} ${cx-s},${cy}`,class:"shape"},g); }
  r.badges.forEach(([x,y]) => {
    el("circle", {cx:x, cy:y, r: r.rects && r.rects[0][2] < 18 ? 6 : 7, class:"badge"}, g);
    txt(g, x, y + .5, r.id, "num");
  });
  const t = el("title", {}, g); t.textContent = `${r.id}. ${r.name}`;
  let timer;
  // El jardín (espacio 1) rodea todo: solo se abre con clic, para que el hover no reabra ventanas al mover el cursor.
  g.addEventListener("pointerenter", e => {
    if (e.pointerType !== "mouse" || S.uv || r.garden || activeRoom === r.id) return;
    clearTimeout(timer);
    timer = setTimeout(() => { if (Date.now() - closedAt > 500) openRoom(r.id); }, 220);
  });
  g.addEventListener("pointerleave", () => clearTimeout(timer));
  g.addEventListener("click", e => { e.stopPropagation(); if (!S.uv) openRoom(r.id); });
  g.addEventListener("keydown", e => { if ((e.key === "Enter" || e.key === " ") && !S.uv){ e.preventDefault(); openRoom(r.id); }});
}

function drawLantern(id){
  const old = $("lantern"); if (old) old.remove();
  const [x,y] = ROOMS.find(r => r.id === id).c;
  const g = el("g", {id:"lantern", tabindex:0, role:"button", "aria-label":"Tomar la linterna UV", transform:`translate(${x},${y - 4})`}, plan);
  el("circle", {r:22, class:"beam"}, g);
  const b = el("g", {transform:"rotate(-35) scale(.9)"}, g);
  el("rect", {x:-4, y:-4, width:22, height:8, rx:1.5, class:"body"}, b);
  el("path", {d:"M-4 -6 L-12 -9 L-12 9 L-4 6 Z", class:"body"}, b);
  el("rect", {x:-13.5, y:-8, width:2.5, height:16, class:"lens"}, b);
  const take = e => { e.stopPropagation(); takeLantern(); };
  g.addEventListener("click", take);
  g.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " "){ e.preventDefault(); take(e); } });
}

function drawMarks(){
  const mg = el("g", {id:"marks"}, plan);
  HIDDEN_ROOMS.forEach(r => {
    const h = HIDDEN[r.hidden]; const [x,y] = r.c;
    const g = el("g", {class:"mark", "data-h":r.hidden, transform:`translate(${x},${y}) scale(.42)`, role:"button", "aria-label":`Huella oculta en ${r.name}`}, mg);
    el("circle", {r:30, class:"halo", filter:"url(#glow)"}, g);
    el("circle", {r:31, class:"chalk"}, g); // la tiza solo aparece cuando la evidencia ya fue encontrada
    el("circle", {r:48, class:"hit"}, g);   // zona de toque más grande que la huella
    const p = el("g", {class:"print", transform:`rotate(${(h.n*37)%60-30})`}, g);
    [[5,7],[9,12],[13,17],[17,22]].forEach(([rx,ry],i) => el("ellipse", {rx, ry, "stroke-dasharray": i%2 ? "9 4" : "14 5"}, p));
    const tent = el("g", {class:"tent", transform:"translate(20,-30)"}, g);
    el("path", {d:"M-13 14 L-9 -10 L9 -10 L13 14 Z"}, tent);
    txt(tent, 0, 8, pad(h.n));
    g.addEventListener("click", e => { e.stopPropagation(); if (g.classList.contains("lit")) openHidden(r.hidden); });
    g.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " "){ e.preventDefault(); openHidden(r.hidden); } });
    g.addEventListener("focus", () => { light.x = x; light.y = y; requestFrame(); });
  });
  syncMarks();
}

function syncRoomClasses(){
  document.querySelectorAll(".room,.chip").forEach(g => { const id = +g.dataset.id; g.classList.toggle("seen", S.seen.includes(id) || S.visited.includes(id)); });
}
function syncMarks(){
  plan.querySelectorAll(".mark").forEach(g => { g.classList.toggle("found", S.found.includes(g.dataset.h)); g.setAttribute("tabindex", S.uv ? 0 : -1); });
  requestFrame();
}
function setActive(id){ document.querySelectorAll(".room,.chip").forEach(g => g.classList.toggle("active", +g.dataset.id === id)); }
