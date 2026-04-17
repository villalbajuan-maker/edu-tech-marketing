# App Diagnostico V1

UI funcional del **Diagnostico Escolar de Competencias Financieras**.

## Que incluye

- Aplicacion de la prueba de 30 preguntas.
- Scoring sobre 28 preguntas calificables.
- Lectura por dimension.
- Reporte vivo interactivo.
- Companion basico del reporte.
- Simulacion QA de 300 estudiantes.
- Script de QA por consola.

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
