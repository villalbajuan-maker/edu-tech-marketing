# Roadmap de producto del diagnostico

## North Star

El Diagnostico Escolar de Competencias Financieras sera un instrumento diagnostico institucional donde diseno grafico, experiencia de usuario, pedagogia, scoring y venta trabajan juntos.

Debe medir competencias financieras mediante situaciones reales, acompanar la aplicacion institucional, generar un reporte vivo con interpretacion asistida y guiar al colegio hacia un piloto formativo basado en evidencia.

Documento rector:

[norte-producto.md](norte-producto.md)

## Escalera de valor

```text
Diagnostico = evidencia de necesidad
Reporte vivo = evidencia convertida en decision
Piloto = evidencia de solucion
Implementacion = contrato institucional
```

## Versiones

| Version | Foco | Estado |
| --- | --- | --- |
| V1.0 | Prueba funcional + scoring + reporte + QA | Implementada |
| V1.1 | Experiencia end-to-end de aplicacion | Implementada |
| V1.2 | Visuales pedagogicos + companion decisional + ruta a piloto | Implementada |
| V1.3 | Reporte demo institucional + modo interno comercial | Implementada |
| V1.4 | Companion Institucional con LLM contextual inicial | Implementada inicial |
| V1.5 | Modo conversacional guiado para estudiante | Definida |
| V2.0 | IA contextual real + datos persistentes + integracion a plataforma | Futura |

## V1.0

Objetivo:

> Probar que la prueba puede aplicarse, calcular resultados, generar reporte y simular cohortes.

Incluye:

- 30 preguntas;
- scoring;
- reporte vivo basico;
- companion basico;
- QA de 300 estudiantes.

## V1.1

Objetivo:

> Hacer que la prueba se sienta como una experiencia real de aplicacion para estudiantes.

Incluye:

- bienvenida;
- datos minimos;
- una pregunta por pantalla;
- progreso;
- navegacion;
- revision antes de envio;
- cierre;
- vista sesion colegio.

## V1.2

Objetivo:

> Hacer que el diagnostico se sienta menos como prototipo y mas como instrumento educativo-comercial serio.

Alcance:

- visuales pedagogicos;
- companion orientado a decision;
- ruta a piloto mas explicita.

### Visuales pedagogicos

Se incorporaron visuales funcionales en preguntas seleccionadas:

- recibo o comprobante;
- comparacion contado/cuotas;
- chat de riesgo digital;
- registro de caja;
- presupuesto familiar;
- tarjeta de decision.

### Companion decisional

El companion debe ayudar a interpretar resultados y avanzar a decision:

- explicar nivel;
- explicar brecha;
- justificar piloto;
- sugerir siguiente paso;
- preparar conversacion institucional.

### Ruta a piloto

El reporte debe conectar:

```text
Brecha -> Implicacion -> Piloto -> Medicion -> Siguiente paso
```

Estado: implementado como bloque de ruta recomendada dentro del reporte vivo.

## Que no entra en V1.2

- IA contextual libre.
- Login.
- Base de datos.
- Persistencia real.
- Reportes reales por colegio.
- Modo interno comercial completo.
- Integracion con CodeIgniter.
- Precios.
- Prueba adaptativa.

## Criterios de exito de V1.2

- La prueba es mas visual sin infantilizar.
- Los estudiantes entienden mejor las situaciones.
- El reporte comunica brechas con mas claridad.
- El companion ayuda a interpretar y decidir.
- La recomendacion de piloto se siente natural y basada en evidencia.
- Desktop, iPad y mobile siguen funcionando.
- El QA sigue pasando.

## Criterio estrategico

La V1.2 debe mejorar claridad y valor percibido, no aumentar complejidad innecesaria.

## V1.3

Documento de alcance:

[v1-3-reporte-demo-institucional.md](v1-3-reporte-demo-institucional.md)

Objetivo:

> Convertir el diagnostico en una demo institucional vendible, usando datos ficticios y una capa interna comercial que ayude a preparar conversaciones con colegios.

Alcance:

- reporte demo institucional;
- comparacion por grados o grupos;
- resumen para rectoria;
- lectura pedagogica;
- modo interno comercial;
- guion de reunion de resultados;
- exportabilidad basica por pantalla y copiado de mensajes.

No incluye:

- login;
- base de datos;
- resultados reales persistentes;
- IA contextual real;
- integracion con plataforma CodeIgniter;
- exportacion PDF formal.

Criterio estrategico:

> La V1.3 debe permitir vender y validar mejor sin simular capacidades tecnicas que todavia no existen.

Estado:

> Implementada en la app como vista "Demo institucional".

## V1.4

Documento de alcance:

[companion-institucional.md](companion-institucional.md)

Objetivo:

> Incorporar un Companion modal con LLM, preguntas sugeridas, contexto del reporte, referencia conceptual a OECD/PISA y separacion entre vista colegio y vista interna.

Estado:

> Implementacion inicial disponible con endpoint `/api/companion`, OpenAI Responses API y fallback local cuando no hay llave configurada.

## V1.5

Documento de alcance:

[modo-conversacional-guiado.md](modo-conversacional-guiado.md)

Objetivo:

> Transformar la aplicacion de preguntas en una interfaz conversacional guiada para estudiantes, manteniendo el caracter diagnostico, el scoring, el progreso y la seriedad institucional.

Alcance:

- contexto presentado como mensajes;
- artefactos visuales dentro de la secuencia;
- opciones estructuradas;
- progreso y navegacion;
- revision de pendientes;
- sin IA durante la prueba;
- sin respuestas abiertas.

Estado:

> Definida para implementacion.
