# V1.3 - Reporte demo institucional y modo interno comercial

## Estado

Definida para implementacion.

## Objetivo

Convertir el diagnostico V1.2 en una experiencia demostrable para colegios privados, usando datos ficticios institucionales y una capa interna que ayude al equipo comercial a leer oportunidad, preparar conversacion y empujar el siguiente paso hacia piloto.

La V1.3 no busca crear una plataforma persistente. Busca que el producto se pueda presentar con mas fuerza ante rectoria, coordinacion academica y posibles aliados, mostrando como se veria el valor institucional cuando un colegio aplica el diagnostico.

## Tesis de V1.3

```text
V1.2 demuestra que la prueba funciona.
V1.3 debe demostrar que el diagnostico ayuda a decidir.
```

## Audiencias

### Colegio

Debe ver una experiencia institucional clara:

- resultados de un colegio simulado;
- lectura por grados o grupos;
- brechas prioritarias;
- implicaciones pedagogicas;
- recomendacion de piloto;
- ruta de accion.

### Equipo interno

Debe contar con una lectura comercial simple:

- que oportunidad abre este resultado;
- que objeciones podrian aparecer;
- que mensaje debe usar Leonardo;
- que debe validar Camilo;
- que debe preparar Juan Carlos;
- cual es la siguiente accion.

## Lo que incluye V1.3

### 1. Reporte demo institucional

Una vista demo con datos ficticios de un colegio privado.

Debe incluir:

- nombre ficticio del colegio;
- grados evaluados;
- numero de estudiantes simulados;
- resultado general;
- lectura por dimension;
- brechas principales;
- recomendacion de piloto;
- resumen ejecutivo;
- ruta de decision.

### 2. Comparacion por grados o grupos

El reporte debe mostrar que el diagnostico puede leer diferencias internas.

Ejemplo:

| Grupo | Resultado | Lectura |
| --- | --- | --- |
| 8A | Bajo | Necesita fundamentos |
| 9A | Medio | Comprende, pero falla en riesgo digital |
| 10A | Medio alto | Puede entrar a piloto aplicado |
| 11A | Alto | Requiere profundizacion en proyecto de vida |

No necesita datos reales ni base de datos. Puede usar escenarios simulados.

### 3. Resumen para rectoria

Bloque corto, ejecutivo y accionable.

Debe responder:

- cual es la conclusion principal;
- que riesgo educativo aparece;
- que oportunidad tiene el colegio;
- que piloto se recomienda;
- que decision se propone.

### 4. Lectura pedagogica

Bloque para coordinacion academica o equipo docente.

Debe responder:

- que competencias requieren refuerzo;
- que situaciones revelan brecha;
- que tipo de intervencion formativa se sugiere;
- como se podria medir avance.

### 5. Modo interno comercial

Una vista o panel no pensado para el colegio, sino para el equipo.

Debe incluir:

- oportunidad comercial;
- nivel de urgencia;
- objeciones probables;
- mensaje sugerido para Leonardo;
- validaciones pendientes para Camilo;
- activos que debe preparar Juan Carlos;
- siguiente accion recomendada.

### 6. Guion de reunion de resultados

Debe ayudar a estructurar una reunion de 30 a 45 minutos.

Secuencia sugerida:

```text
1. Contexto del diagnostico.
2. Resultado general.
3. Brechas principales.
4. Implicacion pedagogica.
5. Piloto recomendado.
6. Medicion de avance.
7. Siguiente decision.
```

### 7. Exportabilidad basica

No es necesario exportar PDF en V1.3, pero la pantalla debe estar organizada para poder presentarse o compartirse.

Debe permitir:

- mostrar reporte en reunion;
- copiar resumen ejecutivo;
- copiar mensaje comercial;
- usar la URL como demo.

## Lo que no incluye V1.3

- login;
- base de datos;
- cuentas por colegio;
- resultados reales persistentes;
- IA contextual real;
- integracion CodeIgniter;
- panel administrativo completo;
- exportacion PDF formal;
- firma institucional final;
- pricing final.

## Datos demo necesarios

La V1.3 necesita un escenario institucional ficticio con:

- nombre del colegio;
- ciudad;
- grados evaluados;
- numero de estudiantes esperados;
- numero de estudiantes que terminaron;
- resultado general;
- resultados por dimension;
- resultados por grado;
- brechas principales;
- piloto recomendado;
- notas de lectura institucional;
- oportunidad comercial.

## Modelo de lectura comercial

El modo interno debe traducir resultados a accion comercial.

### Si el resultado es bajo

Lectura:

> El colegio tiene evidencia de brecha amplia. La conversacion debe enfocarse en fundamentos y urgencia pedagogica.

Accion:

> Proponer piloto de fundamentos con medicion antes/despues.

### Si el resultado es medio

Lectura:

> El colegio tiene bases, pero existen brechas que justifican intervencion focalizada.

Accion:

> Proponer piloto por dimension prioritaria.

### Si el resultado es alto

Lectura:

> El colegio puede estar listo para un piloto de profundizacion, emprendimiento o proyecto de vida financiera.

Accion:

> Proponer piloto avanzado o implementacion por grados superiores.

## Criterios de exito

La V1.3 sera exitosa si:

- el reporte se puede presentar a un colegio sin explicar demasiado el prototipo;
- la lectura institucional se entiende en menos de cinco minutos;
- la ruta a piloto se siente natural;
- Leonardo puede usar el modo interno para preparar una conversacion;
- Camilo puede validar que la lectura pedagogica es realista;
- Juan Carlos puede usar la estructura para definir proximas piezas de producto;
- no se promete IA ni persistencia que aun no existen;
- el QA del diagnostico sigue pasando.

## Criterio de diseno

La V1.3 debe sentirse como demo institucional seria, no como dashboard generico.

Debe usar:

- lenguaje ejecutivo;
- visualizacion clara;
- jerarquia de decision;
- bloques accionables;
- datos demo verosimiles;
- tono colombiano profesional.

Debe evitar:

- exceso de graficas decorativas;
- lenguaje de startup generico;
- conclusiones que no salgan del scoring;
- presion comercial agresiva;
- apariencia de plantilla vacia.

## Resultado esperado

Al final de V1.3, el equipo debe poder abrir la app y decir:

> Asi se veria el diagnostico aplicado a un colegio. Este seria el reporte que recibe la institucion. Esta es la lectura interna que usamos para preparar la conversacion comercial. Y este es el piloto que recomendamos con base en evidencia.
