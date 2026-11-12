# Evidencia UV 04 · El fusilamiento de Piar

Aparece con la linterna UV en el espacio 15, [Mirador oriental](../../15-mirador-oriental/). La vista toma de esta carpeta lo que muestra en la ficha del hallazgo. Después de cambiar algo hay que correr `node scripts/sincronizar.js` (ver [contenido/README.md](../../README.md)).

## texto/

- `titulo.txt` — título del hallazgo.
- `fecha.txt` — fecha o fechas del hecho.
- `descripcion.txt` — párrafo que cuenta lo que el museo no muestra.
- `fuente.txt` — documento o fuente que lo respalda.
- `cita.txt` — opcional: una cita textual que se destaca sobre el párrafo.

Cualquier otro archivo de `texto/` (créditos, borradores) se guarda pero no sale en la vista.

## imagenes/

Todas las imágenes de esta carpeta salen en el carrusel, en orden alfabético (`01-frente.jpg`, `02-detalle.jpg`…). Para ponerle pie de foto a una imagen, crea un `.txt` con el mismo nombre: `01-frente.jpg` → `01-frente.txt`.

## sonido/

Narraciones, ambientes o efectos. Todavía no se conectan a la vista.

Anota el origen y la licencia de cada archivo en `texto/creditos.md`.
