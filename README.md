# La Quinta a la luz

Recorrido interactivo por la Casa Museo Quinta de Bolívar: un plano con 17 espacios, las piezas que muestra el museo y una capa oculta que aparece con la linterna UV.

## Verlo

Abre `index.html` en el navegador. No necesita instalación ni servidor.

## Estructura

- `index.html` — toda la vista (plano, textos provisionales y sonido generado).
- `assets/` — archivos que la vista ya usa (el plano oficial del museo).
- `contenido/` — material que aporta el equipo: una carpeta por espacio, cada una con `imagenes/`, `sonido/` y `texto/`. Ver [contenido/README.md](contenido/README.md).

## Cómo colaborar

1. Busca en [contenido/](contenido/) la carpeta del espacio (lleva el mismo número que en el plano).
2. Lee su `README.md`: muestra lo que hoy dice la vista para ese espacio.
3. Sube tus archivos a `imagenes/`, `sonido/` o `texto/`. En GitHub: entra a la carpeta → **Add file** → **Upload files**.
4. Anota de dónde viene cada archivo y su licencia en `texto/creditos.md` de esa carpeta.

Lo que se sube a `contenido/` no aparece solo en la vista: después hay que conectarlo en `index.html`.
