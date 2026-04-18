# Estado actual del proyecto

Fecha de referencia: abril de 2026.

Este documento resume donde esta hoy el proyecto, que ya se construyo, que esta congelado para revision y que debe validar el equipo.

## Estado general

El proyecto ya tiene un Workbench operativo y una primera aplicacion funcional del **Diagnostico Escolar de Competencias Financieras**.

La direccion actual es usar el diagnostico como primer activo de entrada al mercado:

```text
Diagnostico -> Reporte vivo -> Piloto -> Implementacion institucional
```

El foco comercial sigue siendo **colegios privados en Colombia**. Empresas, fundaciones o aliados de responsabilidad social quedan como segundo frente, especialmente para patrocinar implementaciones despues de tener mayor evidencia.

## Activo funcional actual

La app funcional vive en:

- [apps/diagnostico-v1](apps/diagnostico-v1)

URL publicada:

- [https://edu-tech-marketing-e5s4f3i8z-villalbajuan-makers-projects.vercel.app/](https://edu-tech-marketing-e5s4f3i8z-villalbajuan-makers-projects.vercel.app/)

La app incluye:

- aplicacion conversacional guiada de 30 preguntas;
- scoring sobre 28 preguntas calificables;
- lectura por dimensiones;
- reporte vivo;
- demo institucional con datos ficticios;
- vista colegio y vista interna;
- modo interno comercial;
- QA con simulacion de 300 estudiantes;
- Companion institucional con LLM;
- boton flotante de IA para abrir el Companion;
- microfono en el Companion para dictar preguntas, transcribirlas con OpenAI y enviarlas sin doble confirmacion.

## Version congelada

La base actual queda congelada para revision pedagogica, comercial y tecnica.

Decisiones congeladas:

- la prueba se comporta como hilo conversacional continuo;
- las opciones son botones de respuesta: clic o tap guarda y avanza;
- al avanzar aparecen tres puntos antes de cargar la siguiente situacion;
- las respuestas anteriores quedan visibles en historial;
- si se edita una pregunta anterior, aparece `Volver al final`;
- los thumbnails contextuales son pequenos, inline y sin enlaces;
- el Companion no entra en la prueba del estudiante;
- el Companion sirve para lectura institucional del reporte, brechas, pilotos y objeciones;
- el dictado por voz usa grabacion del navegador y transcripcion OpenAI mediante `/api/transcribe`; el boton `Enviar` cierra la grabacion y manda la pregunta al Companion.

La trazabilidad detallada esta en:

- [apps/diagnostico-v1/TRAZABILIDAD.md](apps/diagnostico-v1/TRAZABILIDAD.md)
- [apps/diagnostico-v1/DIRECCION_PRODUCTO.md](apps/diagnostico-v1/DIRECCION_PRODUCTO.md)

## Roles actuales

### Camilo

Camilo es el referente fundacional principal del proyecto.

Debe validar:

- historia real del proyecto;
- capacidades reales de la plataforma;
- coherencia pedagogica;
- diseno instruccional;
- contenido del curso;
- promesas comerciales;
- limites actuales de implementacion.

### Leonardo

Leonardo es colaborador fundacional, pedagogo y responsable de activacion comercial y relacionamiento.

Debe validar:

- pertinencia pedagogica del diagnostico;
- comprension para colegios privados;
- objeciones pedagogicas y comerciales;
- lenguaje de acercamiento;
- prospectos y contactos;
- oportunidades reales de piloto.

### Juan Carlos

Juan Carlos lidera implementacion tecnica, Workbench y estrategia de marketing.

Debe cuidar:

- codigo y prototipos;
- estructura del repositorio;
- trazabilidad entre estrategia, oferta y app;
- posicionamiento y narrativa comercial;
- preparacion de activos para validacion;
- coherencia entre lo construido y lo que se promete.

## Que se debe probar ahora

### En la app

- Aplicar la prueba conversacional desde inicio hasta envio.
- Confirmar que las opciones como botones se sienten naturales en desktop y mobile.
- Revisar que el historial y `Volver al final` funcionen bien al editar respuestas.
- Revisar la demo institucional en vista colegio.
- Revisar la vista interna.
- Abrir el Companion desde el boton flotante.
- Probar preguntas escritas al Companion.
- Probar dictado por microfono, cierre con `Enviar`, transcripcion y respuesta del Companion.

### En el mercado

- Validar si un colegio entiende el diagnostico como instrumento serio, no como quiz.
- Validar si el reporte genera conversacion de decision.
- Validar si la ruta a piloto se siente natural.
- Detectar objeciones de rectoria, coordinacion academica o equipos pedagogicos.
- Confirmar si el demo puede usarse como activo en primeras reuniones.

## Pendientes importantes

- Probar el microfono en Vercel con HTTPS y permisos reales del navegador.
- Confirmar calidad de transcripcion en espanol colombiano.
- Definir si se mantiene `gpt-4o-mini-transcribe` o se sube a `gpt-4o-transcribe` si se requiere mas calidad.
- Revisar patron de respuestas correctas para evitar sesgo por opcion.
- Definir politica de datos antes de aplicar con estudiantes reales.
- Definir si la primera aplicacion real sera independiente o dentro de la plataforma PHP/CodeIgniter.
- Definir precio, paquete o modalidad comercial del diagnostico.
- Preparar protocolo de aplicacion con colegio real.

## Proximo hito

El siguiente hito no es construir mas por inercia.

El siguiente hito es **revision guiada con Camilo y Leonardo**:

- Camilo valida realidad pedagogica y de plataforma.
- Leonardo valida lectura pedagogica/comercial y utilidad para colegios.
- Juan Carlos ajusta implementacion, narrativa y materiales segun esa revision.

Despues de esa revision, el equipo puede pasar a conversaciones reales con colegios privados.
