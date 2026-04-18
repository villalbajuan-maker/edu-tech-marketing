# Modo conversacional guiado

## Definicion

El modo conversacional guiado es una interfaz de aplicacion del diagnostico que presenta las preguntas como una secuencia conversacional estructurada, cercana a la forma en que los estudiantes interactuan con entornos digitales, sin convertir la prueba en un chat libre.

No reemplaza el instrumento diagnostico. Cambia la forma de presentar contexto, artefactos visuales, pregunta y opciones para mejorar comprension, ritmo y cercania psicologica con estudiantes de bachillerato.

## Tesis

```text
La prueba sigue siendo una prueba.
La interfaz puede ser conversacional.
La evaluacion sigue siendo estructurada.
```

El estudiante sabe que esta respondiendo un diagnostico solicitado por el colegio. Debe completar la prueba, dentro de un tiempo esperado, con trazabilidad de progreso y respuestas. El modo conversacional no reduce seriedad, no gamifica y no vuelve opcional la experiencia.

## Por que existe

El diagnostico trabaja con situaciones reales: compras, presupuesto, riesgo digital, credito, emprendimiento, hogar y decisiones. Una interfaz conversacional permite presentar esas situaciones por capas:

1. contexto;
2. evidencia o artefacto visual;
3. pregunta;
4. opciones de respuesta;
5. avance a la siguiente situacion.

Esto puede reducir carga cognitiva, mejorar lectura en mobile y hacer que el estudiante sienta que esta resolviendo una situacion, no llenando un formulario.

## Lo que no es

El modo conversacional guiado no es:

- chat libre con IA;
- conversacion emocional con el estudiante;
- tutor durante la prueba;
- juego;
- simulador social;
- encuesta informal;
- espacio para escribir respuestas abiertas;
- retroalimentacion inmediata de correcto/incorrecto.

## Principios de diseno

### 1. Instrumento primero

La experiencia debe recordar que se trata de un diagnostico institucional.

Debe mantener:

- progreso;
- tiempo de aplicacion;
- navegacion controlada;
- revision de preguntas pendientes;
- envio formal;
- scoring igual;
- matriz de evaluacion igual.

### 2. Conversacional, no casual

La interfaz puede usar burbujas, secuencia y ritmo conversacional, pero el tono debe ser sobrio, claro y profesional.

Evitar:

- emojis;
- frases excesivamente motivacionales;
- lenguaje de redes;
- "hola, soy tu amigo";
- celebraciones por respuesta;
- efectos visuales distractores.

### 3. Sin ayuda evaluativa indebida

Durante la prueba, el sistema no debe explicar la respuesta correcta ni orientar al estudiante hacia una opcion.

Puede:

- presentar el caso;
- mostrar el artefacto visual;
- hacer la pregunta;
- permitir seleccionar respuesta;
- permitir avanzar o volver.

No puede:

- resolver;
- dar pistas;
- evaluar en vivo;
- corregir antes del envio.

### 4. Ritmo y claridad

La conversacion debe dosificar informacion sin volver lenta la prueba.

Cada pregunta debe sentirse como una unidad breve:

```text
Contexto -> Artefacto -> Pregunta -> Opciones -> Siguiente
```

## Estructura de una pregunta

### 1. Mensaje de contexto

Presenta la situacion.

Ejemplo:

```text
Vas a revisar una compra en linea.
```

### 2. Mensaje de caso

Expone el problema.

Ejemplo:

```text
Daniel quiere comprar unos tenis de $150.000. Antes de pagar, la pagina muestra un envio de $12.000.
```

### 3. Artefacto visual

Puede ser:

- recibo;
- chat;
- presupuesto;
- comparador de cuotas;
- registro de caja;
- decision familiar;
- pantalla de compra.

### 4. Pregunta

Debe ser directa.

Ejemplo:

```text
¿Cual es el costo total de la compra?
```

### 5. Opciones estructuradas

El estudiante responde seleccionando una opcion.

No escribe libremente en esta version.

## Ejemplo de experiencia

```text
Diagnostico:
Vas a revisar una compra en linea.

Diagnostico:
Daniel quiere comprar unos tenis de $150.000. Antes de pagar, la pagina muestra un envio de $12.000.

[Artefacto visual: compra en linea]

Diagnostico:
¿Cual es el costo total de la compra?

[A] $138.000
[B] $150.000
[C] $152.000
[D] $162.000
```

## Relacion con estudiante

El modo conversacional guiado busca conectar mejor con la psicologia del estudiante porque:

- usa un patron digital familiar;
- reduce la sensacion de formulario largo;
- permite leer por partes;
- hace mas natural el contexto;
- funciona mejor en mobile;
- baja friccion sin bajar exigencia;
- conserva estructura de prueba.

## Relacion con colegio

Para el colegio, este modo debe comunicar:

- modernidad;
- cuidado pedagogico;
- aplicabilidad con estudiantes reales;
- seriedad institucional;
- trazabilidad del diagnostico.

Debe poder explicarse asi:

> La prueba usa una interfaz conversacional guiada para presentar situaciones financieras de forma clara y cercana, pero mantiene estructura diagnostica, tiempo de aplicacion, scoring y reporte institucional.

## Medicion interna

El modo conversacional guiado debe permitir medir:

- tiempo total de aplicacion;
- tiempo por pregunta;
- preguntas omitidas;
- cambios de respuesta;
- abandono o finalizacion;
- comportamiento por dispositivo;
- diferencias frente al modo estandar.

Estas metricas no necesariamente entran en la primera implementacion, pero son parte del norte del modo.

## Alcance de V1.5

La V1.5 debe implementar el modo conversacional guiado para estudiantes.

Incluye:

- redisenar pantalla de pregunta;
- presentar contexto en mensajes secuenciales;
- mantener artefactos visuales;
- mostrar opciones como respuestas estructuradas;
- conservar barra de progreso;
- conservar navegacion anterior/siguiente;
- conservar revision de pendientes;
- conservar scoring;
- conservar QA;
- mantener responsive para iPad y mobile.

No incluye:

- IA durante la prueba del estudiante;
- respuestas abiertas;
- retroalimentacion inmediata;
- tutor conversacional;
- persistencia real;
- analitica avanzada;
- adaptatividad.

## Criterios de exito

La V1.5 sera exitosa si:

- la prueba se siente mas cercana al estudiante;
- la interfaz mejora lectura y ritmo;
- no baja la percepcion de seriedad;
- no parece chat casual;
- los visuales pedagogicos siguen siendo utiles;
- la experiencia funciona mejor en mobile;
- el scoring no cambia;
- el QA sigue pasando;
- Camilo valida que conserva rigor pedagogico;
- Leonardo puede explicar el modo como valor diferencial ante colegios.

## Criterio final

El modo conversacional guiado debe acercarse a la psicologia digital del estudiante sin debilitar el caracter institucional del diagnostico.

```text
Conversacional en la interfaz.
Estructurado en la evaluacion.
Institucional en el proposito.
```
