/* ESTRUCTURA: los 17 espacios (geometría sobre el plano oficial, assets/Mapa.jpeg), qué espacios
   tienen pieza y cuál evidencia oculta guarda cada uno.

   Los TEXTOS y las IMÁGENES no van aquí: salen de las carpetas de contenido/ y llegan por
   js/contenido.js, que se genera con «node scripts/sincronizar.js». Para cambiar un texto o
   agregar una imagen, edita contenido/ y vuelve a correr ese comando (ver contenido/README.md). */
const ROOMS = [
  {id:1, name:"Jardín", garden:true, poly:"190,333 561,316 632,505 632,700 170,700", badges:[[325,425],[282,583],[443,588],[507,652]], c:[325,425]},
  {id:2, name:"Salón de la estufa", rects:[[428,518,47,22]],
    piece:{code:"QB-02"}, hidden:"bentham"},
  {id:3, name:"Salón de Manuelita", rects:[[482,518,46,22]],
    piece:{code:"QB-03"}, hidden:"manuela"},
  {id:4, name:"Gran salón", rects:[[450,497,20,21],[482,497,23,21]], badges:[[460,507.5],[493.5,507.5]],
    piece:{code:"QB-04"}, hidden:"tributo"},
  {id:5, name:"Comedor", rects:[[465,437,25,50]],
    piece:{code:"QB-05"}, hidden:"padilla"},
  {id:6, name:"Salón de juegos", rects:[[505,497,23,21]],
    piece:{code:"QB-06"}, hidden:"miranda"},
  {id:7, name:"Alcoba del Libertador", rects:[[428,497,22,21]],
    piece:{code:"QB-07"}, hidden:"dictadura"},
  {id:8, name:"Alcoba de José Palacios", rects:[[435,393,16,25]],
    piece:{code:"QB-08"}, hidden:"esclavitud"},
  {id:9, name:"Despensa", rects:[[451,393,27,25]]},
  {id:10, name:"Cocina", rects:[[478,393,28,25]],
    piece:{code:"QB-10"}},
  {id:11, name:"Graneros y caballerizas", rects:[[527,318,17,118]], badges:[[535.5,405]], c:[535.5,380], hidden:"guerramuerte"},
  {id:12, name:"Huerta", poly:"433,356 470,330 520,323 520,356", badges:[[503,341]], c:[490,342]},
  {id:13, name:"Mirador y baño de asiento", diamond:[203,466,15], badges:[[223,483]],
    piece:{code:"QB-13"}, hidden:"laguaira"},
  {id:14, name:"Alberca", oct:[258,351,16],
    piece:{code:"QB-14"}},
  {id:15, name:"Mirador oriental", rects:[[240,271,83,51]], hidden:"piar"},
  {id:16, name:"Oficinas", rects:[[212,274,28,48]]},
  {id:17, name:"Auditorio", rects:[[576,455,24,85]]}
];

/* Evidencias de la capa oculta: su número es el de su carpeta en contenido/uv/. */
const HIDDEN = {
  tributo:{n:1}, dictadura:{n:2}, manuela:{n:3}, piar:{n:4}, bentham:{n:5},
  esclavitud:{n:6}, padilla:{n:7}, miranda:{n:8}, laguaira:{n:9}, guerramuerte:{n:10}
};

/* Une la estructura con el contenido generado desde las carpetas. */
const PENDIENTE = "Texto pendiente.";
ROOMS.forEach(r => {
  const c = CONTENIDO.espacios[r.id] || {};
  r.imgs = c.imgs || [];
  if (r.piece) Object.assign(r.piece, {title:c.titulo || r.name, meta:c.ficha || "", text:c.descripcion || PENDIENTE});
  else r.space = c.descripcion || PENDIENTE;
});
Object.values(HIDDEN).forEach(h => {
  const c = CONTENIDO.uv[h.n] || {};
  Object.assign(h, {imgs:c.imgs || [], title:c.titulo || "Evidencia " + h.n, date:c.fecha || "", quote:c.cita || "", text:c.descripcion || PENDIENTE, src:c.fuente || ""});
});

ROOMS.forEach(r => {
  if (!r.c) {
    if (r.rects) { const [x,y,w,h] = r.rects[0]; r.c = [x+w/2, y+h/2]; }
    else if (r.oct) r.c = [r.oct[0], r.oct[1]];
    else if (r.diamond) r.c = [r.diamond[0], r.diamond[1]];
  }
  if (!r.badges) r.badges = [r.c];
});
const PIECE_ROOMS = ROOMS.filter(r => r.piece).map(r => r.id);
const HIDDEN_ROOMS = ROOMS.filter(r => r.hidden);
const UNLOCK_AT = Math.floor(ROOMS.length / 2) + 1; // la linterna aparece al visitar más de la mitad de los espacios
const R_LIGHT = 34; // radio del haz UV: más pequeño = más difícil
const ENTRY = [484, 677];
