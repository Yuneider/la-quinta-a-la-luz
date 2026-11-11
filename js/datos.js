/* CONTENIDO: los 17 espacios, las piezas del museo y las 10 evidencias ocultas.
   Para cambiar un texto, una fecha o una fuente, este es el único archivo que hay que tocar. */

/* ============ Contenido provisional (roles Guion e Imágenes) ============
   Geometría trazada sobre el plano oficial del museo (assets/Mapa.jpeg). */

/* IMÁGENES (carrusel): cada espacio y cada evidencia tiene una lista `imgs`.
   Sube el archivo a contenido/<espacio>/imagenes/ y agrega aquí su ruta. Puedes poner varias:
     imgs:["contenido/04-gran-salon/imagenes/retrato.jpg",
           {src:"contenido/04-gran-salon/imagenes/detalle.jpg", pie:"Detalle de la alegoría"}],
   Con la lista vacía se muestra el recuadro de «foto pendiente». */
const ROOMS = [
  {id:1, name:"Jardín", imgs:[], garden:true, poly:"190,333 561,316 632,505 632,700 170,700", badges:[[325,425],[282,583],[443,588],[507,652]], c:[325,425],
    space:"Los jardines rodean la casa con senderos, fuentes y árboles centenarios. Es el primer espacio que recorre el visitante al entrar."},
  {id:2, name:"Salón de la estufa", imgs:[], rects:[[428,518,47,22]],
    piece:{title:"La estufa", meta:"Hogar de leña · siglo XIX", text:"En una ciudad fría como Santafé, el salón con estufa era el lugar de reunión de la casa en las noches. Aquí se conversaba, se leía y se recibía a los amigos.", code:"QB-02"}, hidden:"bentham"},
  {id:3, name:"Salón de Manuelita", imgs:[], rects:[[482,518,46,22]],
    piece:{title:"Salón de Manuelita", meta:"Mobiliario de época · retrato de Manuela Sáenz", text:"El museo dedica este salón a Manuela Sáenz, compañera de Bolívar, que vivió temporadas en la Quinta y organizó aquí reuniones y celebraciones.", code:"QB-03"}, hidden:"manuela"},
  {id:4, name:"Gran salón", imgs:[], rects:[[450,497,20,21],[482,497,23,21]], badges:[[460,507.5],[493.5,507.5]],
    piece:{title:"Bolívar con la alegoría de América", meta:"Pedro José Figueroa · 1819 · óleo sobre tela", text:"Bolívar aparece junto a una mujer indígena que representa a América. Es uno de los retratos más tempranos del Libertador pintados en la Nueva Granada.", code:"QB-04"}, hidden:"tributo"},
  {id:5, name:"Comedor", imgs:[], rects:[[465,437,25,50]],
    piece:{title:"Mesa del comedor", meta:"Madera y vajilla de época", text:"En este comedor Bolívar recibía a sus oficiales y a la sociedad santafereña. La mesa se presenta servida como para un banquete.", code:"QB-05"}, hidden:"padilla"},
  {id:6, name:"Salón de juegos", imgs:[], rects:[[505,497,23,21]],
    piece:{title:"Mesa de juego", meta:"Naipes, dados y tablero · siglo XIX", text:"Los juegos de mesa eran parte de la vida social de la élite. En las tertulias se jugaba a las cartas mientras se discutía de política.", code:"QB-06"}, hidden:"miranda"},
  {id:7, name:"Alcoba del Libertador", imgs:[], rects:[[428,497,22,21]],
    piece:{title:"Cama del Libertador", meta:"Cama de madera con dosel", text:"La alcoba de Bolívar conserva su mobiliario de descanso. Es una de las salas más visitadas del museo.", code:"QB-07"}, hidden:"dictadura"},
  {id:8, name:"Alcoba de José Palacios", imgs:[], rects:[[435,393,16,25]],
    piece:{title:"Alcoba del mayordomo", meta:"Catre y baúl de viaje", text:"José Palacios acompañó a Bolívar casi toda su vida como mayordomo y estuvo con él hasta su muerte en Santa Marta, en 1830.", code:"QB-08"}, hidden:"esclavitud"},
  {id:9, name:"Despensa", imgs:[], rects:[[451,393,27,25]],
    space:"Depósito de víveres, granos y bebidas para la casa y sus visitantes."},
  {id:10, name:"Cocina", imgs:[], rects:[[478,393,28,25]],
    piece:{title:"Fogón de leña", meta:"Utensilios de cobre y barro", text:"La cocina estaba separada de la casa principal por el humo y el riesgo de incendio. De aquí salían los banquetes del comedor.", code:"QB-10"}},
  {id:11, name:"Graneros y caballerizas", imgs:[], rects:[[527,318,17,118]], badges:[[535.5,405]], c:[535.5,380],
    space:"Aquí se guardaban los granos y los caballos de la Quinta. Los caballos fueron decisivos en las campañas libertadoras.", hidden:"guerramuerte"},
  {id:12, name:"Huerta", imgs:[], poly:"433,356 470,330 520,323 520,356", badges:[[503,341]], c:[490,342],
    space:"La huerta abastecía la cocina con hortalizas y hierbas."},
  {id:13, name:"Mirador y baño de asiento", imgs:[], diamond:[203,466,15], badges:[[223,483]],
    piece:{title:"Baño de asiento", meta:"Piedra · jardín", text:"Un pequeño baño en el jardín, junto a un mirador hacia la sabana. Bañarse con agua fría de la montaña era parte de la rutina de la casa.", code:"QB-13"}, hidden:"laguaira"},
  {id:14, name:"Alberca", imgs:[], oct:[258,351,16],
    piece:{title:"La alberca", meta:"Estanque de piedra", text:"Un estanque alimentado por agua que bajaba de los cerros. Se cuenta que Bolívar se bañaba aquí en las mañanas.", code:"QB-14"}},
  {id:15, name:"Mirador oriental", imgs:[], rects:[[240,271,83,51]],
    space:"Terraza alta con vista sobre los jardines y los cerros orientales.", hidden:"piar"},
  {id:16, name:"Oficinas", imgs:[], rects:[[212,274,28,48]],
    space:"Hoy son las oficinas del museo: aquí se decide qué se exhibe y cómo se cuenta."},
  {id:17, name:"Auditorio", imgs:[], rects:[[576,455,24,85]],
    space:"Espacio del museo para charlas, talleres y actividades con el público."}
];

const HIDDEN = {
  tributo:{n:1, imgs:[], title:"La América que pagaba tributo", date:"1821 · 1828",
    text:"El retrato pone a una mujer indígena al lado del héroe. En 1821 el Congreso de Cúcuta abolió el tributo que pagaban los indígenas. En 1828, ya con poderes de dictador, Bolívar lo restableció como «contribución personal de indígenas» para financiar al Estado.",
    src:"Decreto de 15 de octubre de 1828 sobre la contribución de indígenas; Ley del Congreso de Cúcuta de 1821."},
  dictadura:{n:2, imgs:[], title:"El Libertador dictador", date:"27 de agosto de 1828",
    text:"Tras el fracaso de la Convención de Ocaña, Bolívar asumió el «poder supremo» con el Decreto Orgánico. Eliminó la vicepresidencia que ocupaba Santander y gobernó por decreto hasta 1830.",
    src:"Decreto Orgánico de la Dictadura, Bogotá, 27 de agosto de 1828."},
  manuela:{n:3, imgs:[], title:"La que salvó al Libertador", date:"25 de septiembre de 1828",
    text:"La noche de la conspiración septembrina, en el Palacio de San Carlos, Manuela Sáenz enfrentó a los conjurados mientras Bolívar escapaba por una ventana. Tras la muerte de él fue expulsada de Colombia (1834) y murió pobre en Paita, Perú, en 1856. Buena parte de sus cartas se quemaron.",
    src:"Relatos de la conspiración del 25 de septiembre; correspondencia de Manuela Sáenz."},
  piar:{n:4, imgs:[], title:"El fusilamiento de Piar", date:"16 de octubre de 1817",
    text:"El general Manuel Piar, pardo nacido en Curazao y vencedor en San Félix, fue juzgado por insubordinación y por promover una guerra de razas. Bolívar confirmó la sentencia y Piar fue fusilado en Angostura.",
    src:"Proceso y sentencia del consejo de guerra contra Manuel Piar, Angostura, 1817."},
  bentham:{n:5, imgs:[], title:"Libros prohibidos", date:"12 de marzo de 1828",
    text:"Por decreto, Bolívar prohibió enseñar en las universidades los Tratados de legislación de Jeremy Bentham, que Santander había incluido en el plan de estudios. La disputa era sobre qué ideas debían formar a los futuros abogados.",
    src:"Decreto de 12 de marzo de 1828 sobre el plan de estudios."},
  esclavitud:{n:6, imgs:[], title:"La casa que otros mantenían", date:"1816 · 1821 · 1851",
    text:"José Palacios nació esclavizado en la casa de los Bolívar en Caracas. La familia tuvo haciendas trabajadas por personas esclavizadas. En 1816 Bolívar ofreció la libertad a quienes se unieran al ejército; la libertad de vientres llegó en 1821 y la abolición total en Colombia en 1851, veinte años después de su muerte.",
    src:"Decreto de Carúpano, 2 de junio de 1816; Ley de 21 de julio de 1821; Ley de 21 de mayo de 1851."},
  padilla:{n:7, imgs:[], title:"El almirante fusilado", date:"2 de octubre de 1828",
    text:"José Prudencio Padilla, almirante pardo de Riohacha y héroe de la batalla del lago de Maracaibo, fue fusilado en Bogotá acusado de participar en la conspiración septembrina. Santander, también condenado a muerte, recibió el destierro.",
    src:"Sentencias de los juicios por la conspiración de septiembre de 1828; cartas de Bolívar sobre la «pardocracia»."},
  miranda:{n:8, imgs:[], title:"La entrega de Miranda", date:"31 de julio de 1812",
    text:"Tras la caída de la Primera República de Venezuela, un grupo de oficiales, entre ellos Bolívar, arrestó en La Guaira a Francisco de Miranda. Miranda quedó en manos españolas y murió preso en Cádiz en 1816. Bolívar obtuvo un pasaporte para salir del país.",
    src:"Documentos de la capitulación de 1812 y del arresto de Miranda en La Guaira."},
  laguaira:{n:9, imgs:[], title:"Los prisioneros de La Guaira", date:"Febrero de 1814",
    text:"En plena Guerra a Muerte, Bolívar ordenó ejecutar a los prisioneros españoles y canarios recluidos en Caracas y La Guaira. Murieron más de ochocientas personas, muchas de ellas civiles.",
    src:"Órdenes de Bolívar al comandante de La Guaira, febrero de 1814."},
  guerramuerte:{n:10, imgs:[], title:"Guerra a muerte", date:"15 de junio de 1813",
    quote:"Españoles y canarios, contad con la muerte, aun siendo indiferentes. Americanos, contad con la vida, aun cuando seáis culpables.",
    text:"Durante la Campaña Admirable, Bolívar firmó en Trujillo el decreto que convirtió la guerra de independencia en una guerra sin cuartel contra los civiles peninsulares.",
    src:"Decreto de Guerra a Muerte, Trujillo, 15 de junio de 1813."}
};

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
