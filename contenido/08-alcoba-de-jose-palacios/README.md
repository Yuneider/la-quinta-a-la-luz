# 08 · Alcoba de José Palacios

La vista toma de esta carpeta lo que muestra para este espacio. Después de cambiar algo hay que correr `node scripts/sincronizar.js` (ver [contenido/README.md](../README.md)).

## texto/

- `titulo.txt` — nombre de la pieza del museo.
- `ficha.txt` — línea bajo el título (autor · fecha · técnica o material).
- `descripcion8.txt` — párrafo que describe la pieza y el espacio.

Cualquier otro archivo de `texto/` (créditos, borradores, fuentes) se guarda pero no sale en la vista.

## Capa oculta

Bajo la luz UV este espacio revela la evidencia 6, «La casa que otros mantenían». Su material va en [../uv/06-esclavitud/](../uv/06-esclavitud/).

## imagenes/

Todas las imágenes de esta carpeta salen en el carrusel, en orden alfabético (`01-frente.jpg`, `02-detalle.jpg`…). Para ponerle pie de foto a una imagen, crea un `.txt` con el mismo nombre: `01-frente.jpg` → `01-frente.txt`.

## sonido/

Narraciones, ambientes o efectos. Todavía no se conectan a la vista.

Anota el origen y la licencia de cada archivo en `texto/creditos.md`.
