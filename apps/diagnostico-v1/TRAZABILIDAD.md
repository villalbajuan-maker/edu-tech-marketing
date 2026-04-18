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
- resumen ejecutivo para rectoria;
- comparacion por grupos;
- lectura pedagogica;
- modo interno comercial;
- guion de reunion de resultados;
- copiado de resumen ejecutivo y mensaje comercial.

No agrega login, base de datos, IA contextual real ni integracion con la plataforma CodeIgniter.

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

## Que debe revisar Juan Carlos

Juan Carlos debe revisar:

- coherencia entre workbench, documentos V1 y app;
- experiencia de usuario;
- claridad del reporte;
- reglas de decision;
- trazabilidad entre estrategia, prueba y codigo;
- preparacion para futura integracion con plataforma PHP/CodeIgniter.

## Que debe revisar Leonardo

Leonardo debe revisar:

- si el demo se entiende para un colegio privado;
- si el reporte ayuda a vender el piloto;
- si la URL publicada sirve como activo comercial;
- que objeciones podria generar;
- que mensaje comercial debe usarse para presentar la prueba.

## Pendientes conocidos

- Redistribuir respuestas correctas para evitar patron de opcion B.
- Revisar si el escenario `foundations` debe recomendar bases antes que credito/riesgo.
- Crear reporte demo con colegio ficticio para presentacion comercial.
- Definir si la aplicacion real permite resultados individuales o solo agregados.
- Definir precio o modalidad del diagnostico.
- Definir si la primera aplicacion real sera dentro de la plataforma o como piloto independiente.
- Definir politica de datos antes de aplicar con estudiantes reales.
