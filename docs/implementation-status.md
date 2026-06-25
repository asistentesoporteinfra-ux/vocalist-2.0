# Estado de implementacion

## Lo que habia en el repo

Solo un `README.md` de plantilla. No habia app real ni estructura util.

## Lo que ya quedo organizado

- Estructura de Next.js.
- Hero con CTA.
- Filtros por sector.
- Galeria de demos.
- Reproductor de audio custom.
- Formulario final de contacto.
- Documentacion tecnica.

## Lo que no aplica ahora

- Firebase.
- Login.
- Reglas de seguridad.

## Flujo operativo actual

1. Subir MP3 o WAV a `public/demos/<sector>/`.
2. Renombrar el archivo con una convencion clara.
3. Actualizar `src/data/demos.ts` con la ruta publica.
4. El sitio renderiza la demo sin backend.

## Prioridad siguiente

1. Cargar audios reales.
2. Ajustar textos y duraciones.
3. Revisar en navegador.
