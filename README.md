# La Quinta a la luz

Recorrido interactivo por la Casa Museo Quinta de Bolívar: un plano con 17 espacios, las piezas que muestra el museo y una capa oculta que aparece con la linterna UV.

## Verlo

Abre `index.html` en el navegador. No necesita instalación ni servidor.

## Estructura

- `index.html` — solo la estructura de la página; carga los archivos de `css/` y `js/`.
- `css/` — el aspecto, un archivo por parte:
  - `base.css` — colores y tipografías (museo y luz UV), fondo y estructura.
  - `plano.css` — el plano y lo que aparece bajo la luz UV.
  - `panel.css` — cartela, guía, contadores y botones.
  - `final.css` — pantalla final.
  - `responsive.css` — ajustes para celular (se carga de último).
- `js/` — el comportamiento, un archivo por parte:
  - `datos.js` — **los textos**: espacios, piezas y evidencias. Para corregir un texto, una fecha o una fuente basta con editar este archivo.
  - `estado.js` — estado del recorrido y funciones de ayuda.
  - `plano.js` — dibuja el plano, la linterna, las cintas y las huellas.
  - `panel.js` — cartela de cada espacio, guía y ficha de cada hallazgo.
  - `linterna.js` — la luz UV.
  - `final.js` — pantalla final y respuesta del visitante.
  - `atajos.js` — atajos del prototipo y reinicio.
  - `sonido.js` — música y efectos generados.
  - `app.js` — arranque (se carga de último).
- `assets/` — archivos que la vista ya usa (el plano oficial del museo).
- `contenido/` — material que aporta el equipo: una carpeta por espacio, cada una con `imagenes/`, `sonido/` y `texto/`. Ver [contenido/README.md](contenido/README.md).

## Cómo colaborar

1. Busca en [contenido/](contenido/) la carpeta del espacio (lleva el mismo número que en el plano).
2. Lee su `README.md`: muestra lo que hoy dice la vista para ese espacio.
3. Sube tus archivos a `imagenes/`, `sonido/` o `texto/`. En GitHub: entra a la carpeta → **Add file** → **Upload files**.
4. Anota de dónde viene cada archivo y su licencia en `texto/creditos.md` de esa carpeta.

Lo que se sube a `contenido/` no aparece solo en la vista: después hay que conectarlo en `js/datos.js` y `js/panel.js`.
