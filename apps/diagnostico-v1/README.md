# App Diagnostico V1.3

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
- Modo interno comercial con oportunidad, objeciones, mensaje sugerido y siguiente accion.
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
- muestra resumen ejecutivo para rectoria;
- compara resultados por grupos;
- incorpora lectura pedagogica institucional;
- agrega modo interno comercial para preparar conversaciones;
- permite copiar resumen ejecutivo y mensaje comercial.

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
