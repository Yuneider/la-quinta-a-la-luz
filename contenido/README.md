# Contenido

De aquí salen los textos y las imágenes de la vista. Hay una carpeta por cada espacio numerado del plano (con el mismo número que aparece en la vista) y, dentro de [uv/](uv/), una por cada evidencia que se descubre con la linterna UV. [alrededores/](alrededores/) guarda lo que se ve antes de entrar y [pies-de-foto/](pies-de-foto/) los pies de todas las fotos. Cada carpeta tiene `imagenes/`, `sonido/` y `texto/`, y un `README.md` que dice qué archivo es cada cosa.

## Sincronizar

La vista no lee estas carpetas directamente: carga `js/contenido.js`, que se genera a partir de ellas. Cuando un cambio de `contenido/` llega a `main`, una acción de GitHub lo regenera y lo sube sola; la vista publicada cambia uno o dos minutos después.

Para verlo en tu computador antes de subirlo, corre desde la raíz del proyecto:

```
npm install                 (solo la primera vez: instala el optimizador de imágenes)
node scripts/sincronizar.js
```

Las fotos se pueden subir tal como salen de la cámara: la sincronización crea en `optimizadas/` una copia `.webp` de máximo 1600 px, ya girada, y esa copia es la que carga la vista. Los originales quedan intactos en `contenido/`. El orden del carrusel es alfabético: la foto de portada lleva el prefijo `01_` (para ordenar las demás, usa `02_`, `03_`…).

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
| `pies-de-foto/<carpeta>.txt` | Pies de foto: una línea `ARCHIVO.jpg \| pie` por imagen (ver [pies-de-foto/](pies-de-foto/README.md)) | Todas |

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
| 14 | [Alberca](14-alberca/) | La alberca | [4. El fusilamiento de Piar](uv/04-piar/) |
| — | [Alrededores](alrededores/) | Fuera del plano: se abre desde la guía | — |

El mirador oriental, las oficinas y el auditorio no forman parte del recorrido (no se pudieron fotografiar): se ven en el plano como construcciones punteadas, sin número.

[general/](general/) guarda lo que no es de un espacio concreto.

Las fotos descartadas no se guardan en el repositorio (pesaban ~450 MB); están fuera de él, en la carpeta `quinta-descartadas`. Si alguien las copia aquí, en `contenido/descartadas/`, git las ignora.

## Cómo nombrar los archivos

- Imágenes: MAYÚSCULAS con guion bajo, sin espacios ni tildes, y que digan qué muestran: `COMEDOR_1.jpg`, `RETRATO_MANUELA_SAENZ.jpg`. La portada lleva `01_` delante. Formatos `.jpg`, `.png` o `.webp`.
- Sin pie de foto, el texto alternativo sale del nombre del archivo (sin tildes): mejor añadir su línea en `pies-de-foto/`.
- Textos y sonidos: minúsculas, sin espacios ni tildes: `narracion-pieza.mp3`, `guion-oculto.md`.
- Sonido: `.mp3` u `.ogg`, preferiblemente de menos de 5 MB.
- Texto: `.md` o `.txt`.
