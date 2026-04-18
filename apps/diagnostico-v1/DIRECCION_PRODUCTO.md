# Direccion de producto

## North Star

El Diagnostico Escolar de Competencias Financieras sera un instrumento diagnostico institucional donde diseno grafico, experiencia de usuario, pedagogia, scoring y venta trabajan juntos.

Debe medir competencias financieras mediante situaciones reales, acompanar la aplicacion institucional, generar un reporte vivo con interpretacion asistida y guiar al colegio hacia un piloto formativo basado en evidencia.

Documento rector:

[../../ofertas/diagnostico-escolar-educacion-financiera/norte-producto.md](../../ofertas/diagnostico-escolar-educacion-financiera/norte-producto.md)

## Principio central

```text
Diagnostico = evidencia de necesidad
Reporte vivo = evidencia convertida en decision
Piloto = evidencia de solucion
Implementacion = contrato institucional
```

La prueba mide, pero el reporte vende. El companion ayuda a interpretar y decidir. La ruta a piloto convierte evidencia en siguiente paso.

## Secuencia de producto

### V1.0

Prueba funcional + scoring + reporte + QA.

Estado: implementada.

Incluyo:

- prueba de 30 preguntas;
- scoring sobre 28 preguntas calificables;
- reporte vivo basico;
- companion basico;
- simulacion QA de 300 estudiantes.

### V1.1

Experiencia end-to-end de aplicacion.

Estado: implementada.

Incluyo:

- bienvenida;
- datos minimos;
- una pregunta por pantalla;
- barra de progreso;
- navegacion anterior/siguiente;
- revision de preguntas pendientes;
- envio;
- pantalla de cierre;
- vista simulada de sesion colegio.

### V1.2

Visuales pedagogicos + companion decisional + ruta a piloto mas explicita.

Estado: implementada.

Objetivo:

> Hacer que el diagnostico se sienta menos como prototipo y mas como instrumento educativo-comercial serio.

### V1.3

Reporte demo institucional + modo interno comercial.

Estado: implementada.

Objetivo:

> Crear una experiencia de venta y revision con datos ficticios institucionales, y apoyar al equipo comercial con lectura interna de oportunidad, objeciones y siguiente accion.

Documento de alcance:

[../../ofertas/diagnostico-escolar-educacion-financiera/v1-3-reporte-demo-institucional.md](../../ofertas/diagnostico-escolar-educacion-financiera/v1-3-reporte-demo-institucional.md)

Incluye:

- vista demo institucional con colegio ficticio;
- resumen ejecutivo para rectoria;
- comparacion por grupos;
- lectura pedagogica institucional;
- modo interno comercial;
- guion de reunion de resultados;
- copiado de resumen ejecutivo y mensaje comercial.

### V1.4

Companion Institucional con LLM contextual inicial.

Estado: implementacion inicial.

Objetivo:

> Incorporar un Companion modal que usa contexto del reporte, base de conocimiento del diagnostico, referencia conceptual a OECD/PISA y guardrails para orientar decisiones pedagogicas e institucionales.

Documento de alcance:

[../../ofertas/diagnostico-escolar-educacion-financiera/companion-institucional.md](../../ofertas/diagnostico-escolar-educacion-financiera/companion-institucional.md)

Incluye:

- modal Companion;
- preguntas sugeridas;
- contexto estructurado del reporte;
- vista colegio y vista interna;
- endpoint serverless `/api/companion`;
- integracion con OpenAI Responses API;
- fallback local si no hay llave configurada.

### V1.4.1

Arquitectura UI y jerarquia de vistas.

Estado: implementada.

Objetivo:

> Reducir ruido de navegacion y separar claramente la aplicacion del estudiante, la demo institucional y las herramientas internas.

Incluye:

- navegacion principal reducida;
- vista Interno para QA, sesion colegio y reporte tecnico;
- Demo institucional como vista comercial principal;
- Companion reservado para el modal con IA;
- panel fijo renombrado como Lectura decisional.

### V1.5

Modo conversacional guiado para estudiante.

Estado: implementada.

Objetivo:

> Presentar las preguntas como una secuencia conversacional guiada, mas cercana a la psicologia digital del estudiante, sin convertir la prueba en chat libre ni reducir su caracter diagnostico.

Decision de implementacion:

- la prueba usa un shell tipo conversacion institucional;
- cada situacion entra como mensajes del diagnostico;
- antes de cada situacion aparece una tira breve de thumbnails contextuales inline, sin enlaces;
- la respuesta seleccionada aparece como burbuja del estudiante;
- cada opcion actua como boton de respuesta y dispara el avance conversacional;
- las respuestas anteriores quedan en un historial acumulado para reforzar la sensacion de avance conversacional;
- al avanzar, aparece una senal de escritura antes de cargar la siguiente pregunta;
- no existe boton global de anterior; las correcciones se hacen desde el historial de la conversacion;
- la conversacion no es libre, no usa emojis y no introduce IA durante la aplicacion del estudiante.

Documento de alcance:

[../../ofertas/diagnostico-escolar-educacion-financiera/modo-conversacional-guiado.md](../../ofertas/diagnostico-escolar-educacion-financiera/modo-conversacional-guiado.md)

Incluye:

- contexto en mensajes;
- artefactos visuales dentro de la secuencia;
- opciones estructuradas;
- progreso;
- navegacion;
- revision de pendientes;
- scoring igual.

### V2.0

IA contextual real + datos persistentes + integracion a plataforma.

Estado: futura.

Objetivo:

> Convertir el diagnostico en un sistema persistente, contextualizado y conectado a la plataforma educativa propia.

## Alcance de V1.2

La V1.2 no cambia el corazon del diagnostico. Mantiene preguntas, scoring, dimensiones y simulacion QA como base.

La V1.2 agrega tres mejoras:

1. Visuales pedagogicos.
2. Companion orientado a decision.
3. Ruta a piloto mas explicita.

## Visuales pedagogicos

Los visuales no son decoracion. Deben ayudar a comprender situaciones financieras.

Tipos de visuales esperados:

- recibo o comprobante;
- comparacion contado vs cuotas;
- chat de riesgo digital;
- registro de caja;
- presupuesto familiar;
- tarjeta de decision.

Uso esperado:

- reducir carga lectora;
- acercar la pregunta a situaciones reales;
- mejorar comprension en tablet y mobile;
- hacer que el instrumento se sienta mas profesional.

Evitar:

- ilustraciones infantiles;
- decoracion sin funcion;
- gamificacion excesiva;
- emojis como lenguaje principal;
- visuales que distraigan de la decision.

## Companion decisional

El companion debe evolucionar de preguntas sugeridas a asistente de interpretacion y decision.

En V1.2 no sera IA contextual libre. Sera un companion guiado que usa los datos del reporte y reglas de decision.

Debe ayudar a responder:

- que significa este resultado;
- cual es la brecha principal;
- por que importa;
- que piloto se recomienda;
- que deberia hacer el colegio ahora;
- como se puede presentar esto a directivos o padres;
- cual es el siguiente paso razonable.

Regla:

> Toda recomendacion debe estar justificada por resultados del diagnostico.

## Ruta a piloto

El reporte debe mostrar de forma explicita:

```text
Brecha detectada
Implicacion educativa
Piloto recomendado
Que se trabajaria
Como se mediria avance
Siguiente paso
```

El objetivo no es presionar una venta, sino mostrar que el piloto es la decision natural despues de la evidencia.

## Que no entra en V1.2

- IA contextual libre.
- Login.
- Base de datos.
- Persistencia real.
- Reportes por colegio reales.
- Modo interno comercial completo.
- Integracion CodeIgniter.
- Precios.
- Prueba adaptativa.
- Reporte individual avanzado.

## Criterios de exito de V1.2

La V1.2 sera exitosa si:

- la prueba se entiende mejor por visuales;
- la experiencia se siente mas cercana a estudiantes de bachillerato;
- el reporte explica mejor brechas y consecuencias;
- el companion ayuda a interpretar sin inventar datos;
- la ruta a piloto queda clara para un directivo;
- la app sigue funcionando en desktop, iPad y mobile;
- el QA de 300 estudiantes sigue pasando;
- el equipo puede usar el prototipo como activo de revision comercial y pedagogica.

## Pendientes antes de V1.2

- Revisar visuales con Camilo y ajustar lenguaje si alguna situacion no representa bien el curso.
- Validar con Leonardo si la ruta a piloto ayuda a explicar la oferta comercial.
- Validar que el lenguaje siga siendo colombiano, claro y no infantil.
