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
  - `carrusel.css` — carrusel de imágenes y fila de números para celular.
  - `responsive.css` — ajustes para celular (se carga de último).
- `js/` — el comportamiento, un archivo por parte:
  - `contenido.js` — **los textos y las imágenes**, generado desde `contenido/` con `node scripts/sincronizar.js`. No se edita a mano.
  - `datos.js` — la estructura: geometría de los espacios sobre el plano, cuáles tienen pieza y cuál evidencia oculta guarda cada uno.
  - `estado.js` — estado del recorrido y funciones de ayuda.
  - `plano.js` — dibuja el plano, la linterna, las cintas y las huellas.
  - `panel.js` — cartela de cada espacio, guía y ficha de cada hallazgo.
  - `linterna.js` — la luz UV.
  - `final.js` — pantalla final y respuesta del visitante.
  - `atajos.js` — atajos del prototipo y reinicio.
  - `sonido.js` — música y efectos generados.
  - `app.js` — arranque (se carga de último).
- `assets/` — archivos que la vista ya usa (el plano oficial del museo).
- `contenido/` — **la fuente de los textos e imágenes**: una carpeta por espacio y, en `contenido/uv/`, una por evidencia de la capa oculta; cada una con `imagenes/`, `sonido/` y `texto/`. Ver [contenido/README.md](contenido/README.md).
- `scripts/sincronizar.js` — pasa lo que hay en `contenido/` a `js/contenido.js`.

## Cómo cambiar textos e imágenes

1. Busca en [contenido/](contenido/) la carpeta del espacio (lleva el mismo número que en el plano) o, para la capa oculta, la de la evidencia en [contenido/uv/](contenido/uv/).
2. Edita los archivos de `texto/` o sube imágenes a `imagenes/`. Su `README.md` dice qué archivo es cada cosa. En GitHub: entra a la carpeta → **Add file** → **Upload files**.
3. Anota de dónde viene cada archivo y su licencia en `texto/creditos.md` de esa carpeta.
4. Listo: al llegar el cambio a `main`, una acción de GitHub (`.github/workflows/sincronizar.yml`) corre `scripts/sincronizar.js`, reescribe `js/contenido.js` y lo sube sola. La vista publicada cambia uno o dos minutos después. Si falta algún texto, el aviso queda en el resumen de la acción (pestaña **Actions**).

Para ver el cambio en tu computador antes de subirlo, corre el mismo comando (necesita [Node.js](https://nodejs.org)):

```
node scripts/sincronizar.js
```

Todas las imágenes de una carpeta salen en su carrusel en orden alfabético; con la carpeta vacía aparece el recuadro de «foto pendiente». La meta es reunir unas 50 imágenes entre los 17 espacios y las 10 evidencias (dos o tres por cada uno).

Los sonidos de `contenido/` todavía no se conectan a la vista.

## Reglas del recorrido

- La linterna UV aparece al visitar más de la mitad de los espacios (9 de 17). Se cambia con `UNLOCK_AT` en `js/datos.js`.
- El tamaño del haz UV es `R_LIGHT` en `js/datos.js`: más pequeño, más difícil encontrar las huellas.
