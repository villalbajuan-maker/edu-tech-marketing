# App Diagnostico V1.5

UI funcional del **Diagnostico Escolar de Competencias Financieras**.

## URL publicada

https://edu-tech-marketing-e5s4f3i8z-villalbajuan-makers-projects.vercel.app/

## Que incluye

- Flujo de aplicacion real: bienvenida, datos minimos, pregunta por pantalla, revision, envio y cierre.
- Visuales pedagogicos en preguntas clave: recibos, cuotas, chat, caja, presupuesto y decision.
- Aplicacion de la prueba de 30 preguntas.
- Scoring sobre 28 preguntas calificables.
- Lectura por dimension.
- Reporte vivo interactivo.
- Companion decisional del reporte.
- Ruta explicita hacia piloto.
- Dashboard simulado de sesion para colegio.
- Demo institucional con colegio ficticio, resumen para rectoria y comparacion por grupos.
- Toggle de audiencia: vista colegio y vista interna.
- Modo interno comercial con oportunidad, objeciones, mensaje sugerido y siguiente accion.
- Companion Institucional en modal con preguntas sugeridas y conexion LLM via `/api/companion`.
- Pills sugeridos del Companion con guia progresiva: lectura inicial, evidencia, ruta a piloto y decision.
- Referencias inline variables del Companion con tarjetas externas a fuentes OECD/PISA, MEN y estrategia nacional EEF.
- Thumbnails contextuales opcionales via Unsplash API cuando existe `UNSPLASH_ACCESS_KEY`.
- Shell de herramientas del Companion: adjunto, Web, Agente y selector de modelo.
- Boton flotante de IA para abrir el Companion durante la revision institucional.
- Microfono en el Companion para dictar preguntas y transcribirlas con OpenAI via `/api/transcribe`.
- Navegacion principal reorganizada por audiencia: aplicacion, demo institucional e interno.
- Vista interna para QA, sesion colegio y reporte tecnico.
- Modo conversacional guiado para la aplicacion de preguntas a estudiantes.
- Simulacion QA de 300 estudiantes.
- Script de QA por consola.

## Trazabilidad

Ver [TRAZABILIDAD.md](TRAZABILIDAD.md) para entender de donde surgieron las preguntas, que documentos soportan la V1 y que debe revisar el equipo.

## V1.1

La V1.1 acerca la prueba a una aplicacion real en colegio:

- no muestra las 30 preguntas como formulario largo;
- presenta una pregunta por pantalla;
- muestra progreso;
- permite volver a preguntas anteriores;
- permite revisar preguntas pendientes antes de enviar;
- muestra pantalla final de registro exitoso;
- agrega una vista simulada para coordinador/colegio.

## V1.2

La V1.2 mejora claridad y valor percibido:

- agrega visuales pedagogicos funcionales;
- convierte el companion en panel decisional;
- incorpora una ruta explicita de brecha a piloto dentro del reporte.

## V1.3

La V1.3 convierte el diagnostico en una demo institucional vendible:

- agrega una vista de colegio ficticio;
- separa vista colegio y vista interna;
- muestra resumen ejecutivo para rectoria;
- compara resultados por grupos;
- incorpora lectura pedagogica institucional;
- agrega modo interno comercial para preparar conversaciones;
- permite copiar resumen ejecutivo y mensaje comercial.

## Companion con LLM

La app incluye un modal **Companion Institucional**. En local puede responder con fallback controlado si no existe backend disponible. En Vercel usa el endpoint serverless `/api/companion` cuando se configura:

```text
OPENAI_API_KEY
OPENAI_MODEL
```

`OPENAI_MODEL` es opcional. Por defecto se usa `gpt-4.1-mini`.

## Companion con voz

El Companion tambien permite dictar preguntas por microfono.

Flujo:

```text
Microfono del navegador
-> MediaRecorder graba audio
-> /api/transcribe
-> OpenAI audio/transcriptions
-> texto transcrito
-> envio automatico al Companion
```

Decision de UX: el microfono inicia la grabacion y el boton `Enviar` la cierra, transcribe y envia la pregunta al Companion. No hay doble confirmacion despues de transcribir.

Configuracion esperada en Vercel:

```text
OPENAI_API_KEY
OPENAI_TRANSCRIPTION_MODEL
UNSPLASH_ACCESS_KEY
```

`OPENAI_TRANSCRIPTION_MODEL` es opcional. Por defecto se usa `gpt-4o-mini-transcribe`.

`UNSPLASH_ACCESS_KEY` es opcional. Si existe, las tarjetas de referencia del Companion pueden hidratar thumbnails contextuales desde Unsplash con atribucion visible. Si no existe, las tarjetas quedan como referencias sobrias sin imagen externa.

Decision actual: mantener `gpt-4o-mini-transcribe` por estabilidad, costo y suficiencia para preguntas cortas. Si las pruebas reales muestran baja calidad en espanol colombiano o ambientes con ruido, evaluar `gpt-4o-transcribe`.

Documento rector:

[../../ofertas/diagnostico-escolar-educacion-financiera/companion-institucional.md](../../ofertas/diagnostico-escolar-educacion-financiera/companion-institucional.md)

## Shell de herramientas del Companion

La interfaz del Companion ya incluye una barra de herramientas para preparar capacidades avanzadas:

- `+`: selecciona archivo o imagen y lo deja visible como adjunto de sesion.
- `Web`: marca que la consulta deberia usar busqueda web cuando el backend lo active.
- `Agente`: cambia la intencion del Companion de pregunta simple a tarea estructurada.
- `Modelo`: permite escoger entre `Rapido`, `Profundo` y `Experto`.

Estado actual: la UI y los estados ya existen. La busqueda web real, el analisis multimodal de adjuntos y el cambio efectivo de modelo quedan para la siguiente fase de backend.

## V1.4.1

La V1.4.1 reorganiza la UI para reducir ruido:

- la navegacion principal queda en Inicio, Aplicar diagnostico, Demo institucional e Interno;
- QA, sesion colegio y reporte tecnico pasan a Interno;
- Demo institucional queda como vista principal para colegios;
- Companion queda reservado para el modal IA;
- el panel fijo de reglas pasa a llamarse Lectura decisional.

## V1.5

La V1.5 implementa el modo conversacional guiado para estudiantes:

- presenta contexto como mensajes;
- separa situacion, artefacto visual, pregunta y opciones;
- usa un shell tipo conversacion institucional, con respuesta del estudiante como burbuja propia;
- conserva las interacciones anteriores en el hilo para que la conversacion avance hacia arriba;
- incorpora thumbnails contextuales inline, pequenos y sin enlaces, antes de cada situacion;
- muestra una senal de tres puntos antes de cargar la siguiente situacion;
- convierte cada opcion en boton de respuesta: clic o tap guarda y avanza;
- elimina la navegacion global de anterior y permite corregir desde el historial de la conversacion;
- mantiene una pregunta por pantalla;
- conserva progreso, navegacion, revision y envio;
- no introduce IA durante la prueba;
- no cambia scoring ni QA.

## Como probar localmente

Desde la raiz del repo:

```bash
python3 -m http.server 5180
```

Abrir:

```text
http://localhost:5180/apps/diagnostico-v1/
```

## QA por consola

```bash
node apps/diagnostico-v1/qa/simulate-300.mjs baseline
node apps/diagnostico-v1/qa/simulate-300.mjs risk
node apps/diagnostico-v1/qa/simulate-300.mjs advanced
node apps/diagnostico-v1/qa/simulate-300.mjs foundations
```

## Despliegue

La app es estatica. Puede desplegarse en GitHub Pages, Netlify, Vercel o servirse desde la plataforma actual.

## Vercel

El repo ya incluye `vercel.json` en la raiz.

Configuracion esperada:

```text
Build command: npm run build
Output directory: dist
Install command: npm install --ignore-scripts
```

El build copia esta app a `dist/`, para que Vercel sirva el diagnostico desde la raiz del dominio.

Si en Vercel se configura `Root Directory` como `apps/diagnostico-v1`, esta carpeta tambien incluye su propio `package.json` y `vercel.json`. En ese modo la configuracion esperada es la misma:

```text
Build command: npm run build
Output directory: dist
Install command: npm install --ignore-scripts
```
