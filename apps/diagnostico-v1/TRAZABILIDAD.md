# Trazabilidad del Diagnostico V1

Este documento explica de donde surge la prueba funcional desplegada, que documentos la soportan y que debe revisar el equipo.

## URL publicada

La version funcional esta publicada en Vercel:

https://edu-tech-marketing-e5s4f3i8z-villalbajuan-makers-projects.vercel.app/

## Direccion congelada

La direccion de producto congelada esta documentada en:

- `apps/diagnostico-v1/DIRECCION_PRODUCTO.md`
- `ofertas/diagnostico-escolar-educacion-financiera/product-roadmap.md`

## Origen conceptual

El diagnostico surge de la escalera comercial definida para Finanzas Desde La Escuela:

```text
Diagnostico = evidencia de necesidad
Reporte vivo = evidencia convertida en decision
Piloto = evidencia de solucion
Implementacion = contrato institucional
```

El objetivo de la prueba no es calificar estudiantes como en un examen tradicional. El objetivo es identificar brechas de competencias financieras para recomendar un piloto formativo concreto.

## Origen pedagogico de las preguntas

Las preguntas se disenan para estudiantes de bachillerato en Colombia, grados 8 a 11.

El lenguaje busca ser:

- claro;
- colombiano;
- cercano a situaciones reales;
- no infantil;
- no universitario;
- orientado a decisiones, no a definiciones.

Las preguntas se apoyan en seis dimensiones:

1. Dinero y transacciones.
2. Presupuesto y planificacion.
3. Credito, deuda y costo del dinero.
4. Riesgo, fraude y decisiones digitales.
5. Trabajo, empresa e ingresos.
6. Hogar, ciudadania y responsabilidad economica.

Cada dimension conecta con el curso Finanzas Desde La Escuela y con los contextos de vida, hogar, trabajo, individuo, sociedad y empresa.

## Documentos fuente

La version congelada del diagnostico esta documentada en:

- `ofertas/diagnostico-escolar-educacion-financiera/v1/diagnostico-v1.md`
- `ofertas/diagnostico-escolar-educacion-financiera/v1/banco-preguntas-v1.md`
- `ofertas/diagnostico-escolar-educacion-financiera/v1/matriz-evaluacion-v1.md`
- `ofertas/diagnostico-escolar-educacion-financiera/v1/sistema-puntaje-v1.md`
- `ofertas/diagnostico-escolar-educacion-financiera/v1/reglas-recomendacion-piloto.md`
- `ofertas/diagnostico-escolar-educacion-financiera/v1/modelo-reporte-vivo-v1.md`
- `ofertas/diagnostico-escolar-educacion-financiera/v1/companion-reporte-v1.md`
- `ofertas/diagnostico-escolar-educacion-financiera/v1/operacion-en-colegio-v1.md`
- `ofertas/diagnostico-escolar-educacion-financiera/v1/seguimiento-comercial-v1.md`
- `ofertas/diagnostico-escolar-educacion-financiera/v1/checklist-lanzamiento-v1.md`

## Implementacion en codigo

La UI funcional vive en:

- `apps/diagnostico-v1/index.html`
- `apps/diagnostico-v1/styles.css`
- `apps/diagnostico-v1/src/app.mjs`
- `apps/diagnostico-v1/src/data.mjs`
- `apps/diagnostico-v1/src/scoring.mjs`
- `apps/diagnostico-v1/src/simulation.mjs`

Relacion entre documentos y codigo:

| Funcion | Documento fuente | Codigo |
| --- | --- | --- |
| Preguntas | `banco-preguntas-v1.md` | `src/data.mjs` |
| Matriz de evaluacion | `matriz-evaluacion-v1.md` | `src/data.mjs` |
| Puntaje y niveles | `sistema-puntaje-v1.md` | `src/scoring.mjs` |
| Recomendacion de piloto | `reglas-recomendacion-piloto.md` | `src/scoring.mjs` |
| Reporte vivo | `modelo-reporte-vivo-v1.md` | `src/app.mjs` |
| Companion | `companion-reporte-v1.md` | `src/app.mjs` y `src/scoring.mjs` |
| QA 300 estudiantes | `checklist-lanzamiento-v1.md` | `src/simulation.mjs` y `qa/simulate-300.mjs` |

## Que hace la app publicada

La app permite:

- aplicar el diagnostico como flujo de estudiante V1.1;
- mostrar bienvenida;
- capturar datos minimos;
- presentar una pregunta por pantalla;
- revisar preguntas pendientes antes de enviar;
- cerrar la aplicacion con confirmacion;
- aplicar la prueba de 30 preguntas;
- capturar respuestas;
- calcular puntaje sobre 28 preguntas calificables;
- separar 2 preguntas actitudinales;
- calcular nivel general;
- calcular resultados por dimension;
- identificar brechas;
- identificar fortalezas;
- recomendar piloto;
- mostrar reporte vivo;
- mostrar companion basico;
- mostrar dashboard simulado de sesion para colegio;
- mostrar demo institucional V1.3;
- mostrar modo interno comercial;
- abrir Companion Institucional en modal;
- consultar endpoint LLM `/api/companion` cuando esta configurado;
- simular cohortes de 300 estudiantes para QA.

## Evolucion V1.1

La V1 original permitia probar el instrumento como formulario funcional. La V1.1 ajusta la experiencia hacia una aplicacion real end to end:

```text
Bienvenida -> Datos minimos -> Pregunta por pantalla -> Revision -> Envio -> Cierre -> Reporte
```

Tambien agrega una vista de sesion para colegio, pensada para que un coordinador pueda ver estado de aplicacion sin acceder a respuestas individuales.

## Siguiente version: V1.2

La V1.2 queda definida e implementada como:

```text
Visuales pedagogicos + companion decisional + ruta a piloto mas explicita
```

No cambia el corazon de scoring. Mejora experiencia, interpretacion y decision.

Incluye:

- visuales pedagogicos en preguntas seleccionadas;
- companion decisional;
- ruta explicita de brecha a piloto dentro del reporte.

## Evolucion V1.3

La V1.3 queda implementada como:

```text
Reporte demo institucional + modo interno comercial
```

Incluye:

- vista demo institucional con colegio ficticio;
- toggle de audiencia entre vista colegio y vista interna;
- resumen ejecutivo para rectoria;
- comparacion por grupos;
- lectura pedagogica;
- modo interno comercial;
- guion de reunion de resultados;
- copiado de resumen ejecutivo y mensaje comercial.

No agrega login, base de datos, IA contextual real ni integracion con la plataforma CodeIgniter.

## Evolucion V1.4

La V1.4 queda implementada inicialmente como:

```text
Companion Institucional con LLM contextual inicial
```

Incluye:

- modal profesional encima del reporte/demo;
- preguntas sugeridas en pills;
- historial por sesion de navegador;
- contexto del reporte demo;
- separacion vista colegio y vista interna;
- referencia conceptual a OECD/PISA;
- endpoint serverless `/api/companion`;
- uso de OpenAI Responses API si existe `OPENAI_API_KEY`;
- fallback local si la llave o el endpoint no estan disponibles.

No agrega persistencia real, historial por colegio, cuentas, auditoria ni integracion con plataforma.

## Evolucion V1.4.1

La V1.4.1 reorganiza la arquitectura de UI:

- reduce la navegacion principal;
- separa Aplicar diagnostico, Demo institucional e Interno;
- mueve QA, sesion colegio y reporte tecnico a Interno;
- conserva Demo institucional como vista para colegios;
- reserva Companion para el modal IA;
- renombra el panel fijo como Lectura decisional.

## Evolucion V1.5

La V1.5 implementa el modo conversacional guiado:

- transforma la pantalla de pregunta en una secuencia conversacional estructurada;
- presenta contexto, situacion, artefacto visual, pregunta y opciones;
- incorpora shell visual tipo conversacion, historial acumulado, burbuja de respuesta del estudiante y transicion con tres puntos entre preguntas;
- suma thumbnails contextuales inline, pequenos y sin enlaces, para preparar el marco mental de cada situacion;
- convierte las opciones en botones de respuesta que guardan y avanzan sin boton Continuar;
- reemplaza el boton global de anterior por edicion contextual de respuestas ya registradas;
- mantiene scoring, progreso, navegacion, revision y QA;
- no agrega IA durante la prueba del estudiante;
- conserva el caracter institucional del diagnostico.

## Version congelada actual

La version actual queda congelada como base de revision pedagogica, comercial y tecnica del equipo.

Decisiones congeladas:

- la prueba funciona como hilo conversacional continuo;
- las respuestas anteriores quedan visibles en historial;
- las opciones son botones de respuesta: clic o tap guarda y avanza;
- al avanzar aparecen tres puntos antes de cargar la siguiente situacion;
- el boton `Continuar` no existe en el flujo normal de preguntas;
- si se edita una pregunta anterior, la prueba muestra `Volver al final`;
- los thumbnails contextuales son pequenos, inline y sin enlaces;
- el Companion IA no participa en la aplicacion del estudiante; queda para lectura institucional del reporte.

Esta base debe revisarse con criterio pedagogico de Camilo y Leonardo, criterio comercial de Leonardo y estrategia/implementacion tecnica de Juan Carlos.

## Evolucion Companion institucional

El Companion queda reforzado como herramienta visible de lectura institucional:

- se abre desde un boton flotante de IA durante el scroll de la demo institucional, vista interna y reporte;
- deja de depender de botones secundarios de texto como `Abrir Companion`;
- mantiene sugerencias de preguntas y contexto de vista colegio/vista interna;
- cambia los pills sugeridos segun avance la conversacion para guiar lectura inicial, evidencia, ruta a piloto y decision;
- consolida shell de herramientas del Companion con adjunto, Web, Agente y selector de modelo como base de futuras capacidades;
- incorpora dictado por microfono: el usuario inicia grabacion, presiona `Enviar`, OpenAI transcribe y la pregunta se envia automaticamente al Companion;
- la transcripcion usa el endpoint `/api/transcribe` con `gpt-4o-mini-transcribe`;
- se mantiene `gpt-4o-mini-transcribe` como modelo recomendado actual; `gpt-4o-transcribe` queda como opcion si se requiere mayor calidad;
- el Companion sigue sin reemplazar criterio pedagogico ni inventar resultados.

## QA disponible

La app incluye cuatro escenarios de simulacion:

- `baseline`: linea base mixta.
- `risk`: riesgo digital alto.
- `advanced`: grupo avanzado.
- `foundations`: bases por fortalecer.

Comandos:

```bash
npm run qa:diagnostico
node apps/diagnostico-v1/qa/simulate-300.mjs baseline
node apps/diagnostico-v1/qa/simulate-300.mjs risk
node apps/diagnostico-v1/qa/simulate-300.mjs advanced
node apps/diagnostico-v1/qa/simulate-300.mjs foundations
```

El QA valida:

- 300 estudiantes simulados;
- puntaje general entre 0 y 100;
- porcentajes validos por dimension;
- existencia de piloto recomendado;
- maximo de 28 puntos por estudiante.

## Que debe revisar Camilo

Camilo debe validar:

- si las preguntas representan correctamente la pedagogia del curso;
- si las dimensiones corresponden con el contenido real;
- si las respuestas correctas reflejan el criterio que se quiere formar;
- si alguna pregunta debe ajustarse por edad, lenguaje o contexto;
- si las recomendaciones de piloto son coherentes con lo que la plataforma puede entregar;
- si el reporte y companion prometen solo lo que el producto puede sostener.

## Que debe revisar Leonardo

Leonardo debe validar:

- si la experiencia conversacional se siente adecuada para estudiantes de bachillerato;
- si las preguntas, thumbnails y flujo tienen sentido pedagogico;
- si el demo se entiende para un colegio privado;
- si el reporte ayuda a vender el piloto;
- si la URL publicada sirve como activo comercial;
- que objeciones pedagogicas o comerciales podria generar;
- que mensaje comercial debe usarse para presentar la prueba.

## Que debe revisar Juan Carlos

Juan Carlos debe revisar:

- coherencia entre workbench, documentos V1 y app;
- experiencia de usuario;
- claridad del reporte;
- reglas de decision;
- trazabilidad entre estrategia, prueba y codigo;
- coherencia de la implementacion con la estrategia de marketing;
- preparacion para futura integracion con plataforma PHP/CodeIgniter.

## Pendientes conocidos

- Redistribuir respuestas correctas para evitar patron de opcion B.
- Revisar si el escenario `foundations` debe recomendar bases antes que credito/riesgo.
- Crear reporte demo con colegio ficticio para presentacion comercial.
- Definir si la aplicacion real permite resultados individuales o solo agregados.
- Definir precio o modalidad del diagnostico.
- Definir si la primera aplicacion real sera dentro de la plataforma o como piloto independiente.
- Definir politica de datos antes de aplicar con estudiantes reales.
