# Contenido

De aquí salen los textos y las imágenes de la vista. Hay una carpeta por cada espacio numerado del plano (con el mismo número que aparece en la vista) y, dentro de [uv/](uv/), una por cada evidencia que se descubre con la linterna UV. Cada carpeta tiene `imagenes/`, `sonido/` y `texto/`, y un `README.md` que dice qué archivo es cada cosa.

## Sincronizar

La vista no lee estas carpetas directamente. Después de cambiar un texto o agregar una imagen hay que correr, desde la raíz del proyecto:

```
node scripts/sincronizar.js
```

Eso reescribe `js/contenido.js`, que es lo que carga la vista, y avisa si falta algún texto.

## Archivos que lee la vista

| Archivo | Qué es | Dónde |
|---|---|---|
| `texto/descripcion*.txt` | Párrafo principal (vale `descripcion.txt`, `descripcion4.txt`…) | Todas |
| `texto/titulo.txt` | Nombre de la pieza o título del hallazgo | Espacios con pieza y `uv/` |
| `texto/ficha.txt` | Línea bajo el título: autor · fecha · técnica | Espacios con pieza |
| `texto/fecha.txt` | Fecha del hecho | `uv/` |
| `texto/fuente.txt` | Documento que lo respalda | `uv/` |
| `texto/cita.txt` | Cita destacada (opcional) | `uv/` |
| `imagenes/*` | Carrusel, en orden alfabético | Todas |
| `imagenes/<nombre>.txt` | Pie de foto de la imagen con ese mismo nombre | Todas |

Cada texto va en un solo párrafo, sin formato. Los demás archivos (créditos, borradores) se guardan pero no salen en la vista.

## Carpetas

| N.º | Espacio | Pieza del museo | Evidencia oculta |
|---|---|---|---|
| 01 | [Jardín](01-jardin/) | — | — |
| 02 | [Salón de la estufa](02-salon-de-la-estufa/) | La estufa | [5. Libros prohibidos](uv/05-bentham/) |
| 03 | [Salón de Manuelita](03-salon-de-manuelita/) | Salón de Manuelita | [3. La que salvó al Libertador](uv/03-manuela/) |
| 04 | [Gran salón](04-gran-salon/) | Bolívar con la alegoría de América | [1. La América que pagaba tributo](uv/01-tributo/) |
| 05 | [Comedor](05-comedor/) | Mesa del comedor | [7. El almirante fusilado](uv/07-padilla/) |
| 06 | [Salón de juegos](06-salon-de-juegos/) | Mesa de juego | [8. La entrega de Miranda](uv/08-miranda/) |
| 07 | [Alcoba del Libertador](07-alcoba-del-libertador/) | Cama del Libertador | [2. El Libertador dictador](uv/02-dictadura/) |
| 08 | [Alcoba de José Palacios](08-alcoba-de-jose-palacios/) | Alcoba del mayordomo | [6. La casa que otros mantenían](uv/06-esclavitud/) |
| 09 | [Despensa](09-despensa/) | — | — |
| 10 | [Cocina](10-cocina/) | Fogón de leña | — |
| 11 | [Graneros y caballerizas](11-graneros-y-caballerizas/) | — | [10. Guerra a muerte](uv/10-guerramuerte/) |
| 12 | [Huerta](12-huerta/) | — | — |
| 13 | [Mirador y baño de asiento](13-mirador-y-bano-de-asiento/) | Baño de asiento | [9. Los prisioneros de La Guaira](uv/09-laguaira/) |
| 14 | [Alberca](14-alberca/) | La alberca | — |
| 15 | [Mirador oriental](15-mirador-oriental/) | — | [4. El fusilamiento de Piar](uv/04-piar/) |
| 16 | [Oficinas](16-oficinas/) | — | — |
| 17 | [Auditorio](17-auditorio/) | — | — |

[general/](general/) guarda lo que no es de un espacio concreto.

## Cómo nombrar los archivos

- Minúsculas, sin espacios ni tildes: `estufa-frente.jpg`, `narracion-pieza.mp3`, `guion-oculto.md`.
- Imágenes: `.jpg`, `.png` o `.webp`, preferiblemente de menos de 2 MB.
- Sonido: `.mp3` u `.ogg`, preferiblemente de menos de 5 MB.
- Texto: `.md` o `.txt`.
