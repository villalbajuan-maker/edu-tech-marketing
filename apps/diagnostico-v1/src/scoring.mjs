import { DIMENSIONS, PILOTS, QUESTIONS } from "./data.mjs";

const dimensionById = new Map(DIMENSIONS.map((dimension) => [dimension.id, dimension]));

export function getGeneralLevel(percent) {
  if (percent <= 35) return level("Reconoce", "Identifica datos, pero tiene dificultad para usarlos en situaciones reales.");
  if (percent <= 60) return level("Comprende", "Interpreta situaciones basicas, pero le cuesta comparar alternativas, priorizar o anticipar consecuencias.");
  if (percent <= 80) return level("Decide", "Toma buenas decisiones en varias situaciones financieras y aplica criterios basicos con consistencia.");
  return level("Proyecta", "Anticipa consecuencias, reconoce riesgos y decide con criterio en diferentes contextos.");
}

export function getDimensionStatus(percent) {
  if (percent <= 40) return { name: "Brecha critica", severity: 4 };
  if (percent <= 60) return { name: "Brecha relevante", severity: 3 };
  if (percent <= 80) return { name: "Desempeno funcional", severity: 2 };
  return { name: "Fortaleza", severity: 1 };
}

export function scoreSubmission(answers, meta = {}) {
  const dimensions = initializeDimensionScores();
  const attitude = {};
  let correct = 0;
  let answered = 0;

  for (const question of QUESTIONS) {
    const selected = answers[question.id];
    const hasAnswer = selected !== undefined && selected !== null && selected !== "";
    if (hasAnswer) answered += 1;

    if (question.attitude) {
      attitude[question.id] = {
        selected: hasAnswer ? Number(selected) : null,
        positive: question.positive,
        positiveSelected: hasAnswer ? Number(selected) === question.positive : false,
        dimension: question.dimension,
      };
      continue;
    }

    const dimensionScore = dimensions[question.dimension];
    dimensionScore.total += 1;
    const isCorrect = hasAnswer && Number(selected) === question.answer;
    if (isCorrect) {
      correct += 1;
      dimensionScore.correct += 1;
    }
  }

  const maxScore = QUESTIONS.filter((question) => !question.attitude).length;
  const percent = roundPercent(correct, maxScore);
  const dimensionResults = Object.values(dimensions).map((dimension) => {
    const dimensionPercent = roundPercent(dimension.correct, dimension.total);
    return {
      ...dimension,
      percent: dimensionPercent,
      status: getDimensionStatus(dimensionPercent),
    };
  });

  const level = getGeneralLevel(percent);
  const strengths = dimensionResults
    .filter((dimension) => dimension.percent >= 80)
    .sort((a, b) => b.percent - a.percent)
    .slice(0, 2);
  const gaps = dimensionResults
    .filter((dimension) => dimension.percent <= 60)
    .sort((a, b) => a.percent - b.percent)
    .slice(0, 3);
  const pilotRecommendation = recommendPilot(dimensionResults, level.name);

  return {
    meta,
    correct,
    maxScore,
    percent,
    answered,
    totalQuestions: QUESTIONS.length,
    level,
    dimensions: dimensionResults,
    strengths,
    gaps,
    attitude,
    pilotRecommendation,
    generatedAt: new Date().toISOString(),
  };
}

export function summarizeCohort(studentReports, meta = {}) {
  const count = studentReports.length;
  const correct = sum(studentReports.map((report) => report.correct));
  const maxScore = sum(studentReports.map((report) => report.maxScore));
  const percent = roundPercent(correct, maxScore);
  const dimensionAggregates = initializeDimensionScores();
  const attitudeCounts = {};

  for (const report of studentReports) {
    for (const dimension of report.dimensions) {
      dimensionAggregates[dimension.id].correct += dimension.correct;
      dimensionAggregates[dimension.id].total += dimension.total;
    }
    for (const [questionId, response] of Object.entries(report.attitude)) {
      attitudeCounts[questionId] ||= { total: 0, positive: 0, options: {} };
      if (response.selected !== null) {
        attitudeCounts[questionId].total += 1;
        attitudeCounts[questionId].options[response.selected] = (attitudeCounts[questionId].options[response.selected] || 0) + 1;
        if (response.positiveSelected) attitudeCounts[questionId].positive += 1;
      }
    }
  }

  const dimensions = Object.values(dimensionAggregates).map((dimension) => {
    const dimensionPercent = roundPercent(dimension.correct, dimension.total);
    return {
      ...dimension,
      percent: dimensionPercent,
      status: getDimensionStatus(dimensionPercent),
    };
  });

  const level = getGeneralLevel(percent);
  const gaps = dimensions
    .filter((dimension) => dimension.percent <= 60)
    .sort((a, b) => a.percent - b.percent)
    .slice(0, 3);
  const strengths = dimensions
    .filter((dimension) => dimension.percent >= 80)
    .sort((a, b) => b.percent - a.percent)
    .slice(0, 2);

  return {
    meta,
    count,
    correct,
    maxScore,
    percent,
    level,
    dimensions,
    strengths,
    gaps,
    attitudeSummary: summarizeAttitudes(attitudeCounts),
    pilotRecommendation: recommendPilot(dimensions, level.name),
    generatedAt: new Date().toISOString(),
  };
}

export function recommendPilot(dimensions, levelName) {
  const byId = new Map(dimensions.map((dimension) => [dimension.id, dimension]));
  const credito = byId.get("credito-deuda")?.percent ?? 100;
  const riesgo = byId.get("riesgo-digital")?.percent ?? 100;
  const presupuesto = byId.get("presupuesto-planificacion")?.percent ?? 100;
  const dinero = byId.get("dinero-transacciones")?.percent ?? 100;
  const empresa = byId.get("trabajo-empresa")?.percent ?? 100;
  const hogar = byId.get("hogar-ciudadania")?.percent ?? 100;

  if (credito <= 60 || riesgo <= 60 || (credito <= 70 && riesgo <= 70)) {
    return pilot(PILOTS.creditoRiesgo, "Las brechas mas sensibles estan en costo total, deuda, riesgo digital o verificacion antes de decidir.");
  }
  if (presupuesto <= 60 || (presupuesto <= 70 && credito <= 70)) {
    return pilot(PILOTS.planificacion, "El grupo necesita fortalecer priorizacion, ahorro y decisiones de consumo.");
  }
  if (empresa <= 60) {
    return pilot(PILOTS.empresa, "El grupo necesita diferenciar ingresos, costos, utilidad y manejo basico de caja.");
  }
  if (dinero <= 60) {
    return pilot(PILOTS.bases, "Antes de temas complejos conviene fortalecer transacciones, comprobantes y costo total.");
  }
  if (hogar <= 60) {
    return pilot(PILOTS.hogar, "La principal oportunidad esta en prioridades familiares, consumo responsable y decisiones compartidas.");
  }

  if (levelName === "Reconoce") return pilot(PILOTS.bases, "El nivel general sugiere iniciar por bases financieras y planificacion.");
  if (levelName === "Comprende") return pilot(PILOTS.creditoRiesgo, "El nivel general sugiere pasar de comprension a decisiones en credito, riesgo y planificacion.");
  if (levelName === "Decide") return pilot(PILOTS.empresa, "El grupo puede abordar aplicaciones de emprendimiento, ingresos y decisiones financieras.");
  return pilot(PILOTS.planificacion, "El grupo tiene buen punto de partida y puede profundizar con una ruta aplicada.");
}

export function buildCompanionAnswers(report) {
  const mainGap = report.gaps[0];
  const pilotRecommendation = report.pilotRecommendation;
  return [
    {
      question: "¿Que significa este nivel?",
      answer: `El nivel ${report.level.name} indica que ${report.level.description}`,
    },
    {
      question: "¿Cual es la brecha mas importante?",
      answer: mainGap
        ? `La brecha prioritaria es ${mainGap.name}, con ${mainGap.percent}%. Esto se clasifica como ${mainGap.status.name}.`
        : "No aparece una brecha critica en esta simulacion. Conviene revisar fortalezas y una ruta de profundizacion.",
    },
    {
      question: "¿Por que se recomienda este piloto?",
      answer: `${pilotRecommendation.name}. ${pilotRecommendation.reason} El objetivo es intervenir en pequeno y medir avance antes de escalar.`,
    },
    {
      question: "¿Que deberia hacer el colegio ahora?",
      answer: "Agendar una reunion de lectura de 30 a 45 minutos y definir si el piloto se aplicara con un grupo, un grado o una muestra controlada.",
    },
  ];
}

export function buildDecisionCompanion(report) {
  const mainGap = report.gaps[0];
  const secondGap = report.gaps[1];
  const gapText = mainGap
    ? `${mainGap.name} aparece como brecha principal con ${mainGap.percent}% (${mainGap.status.name}).`
    : "No aparece una brecha critica dominante; conviene usar el diagnostico para profundizar fortalezas y definir foco.";
  const implication = mainGap
    ? getGapImplication(mainGap.id)
    : "El colegio puede avanzar hacia una ruta de profundizacion o piloto aplicado.";

  return {
    summary: `El grupo esta en nivel ${report.level.name}. ${report.level.description}`,
    mainGap: gapText,
    secondarySignal: secondGap ? `Tambien conviene revisar ${secondGap.name}, con ${secondGap.percent}%.` : "No hay una segunda brecha prioritaria clara.",
    whyItMatters: implication,
    pilot: `${report.pilotRecommendation.name}. ${report.pilotRecommendation.reason}`,
    nextStep: "Agendar una reunion de lectura de 30 a 45 minutos para definir grupo piloto, alcance y medicion de avance.",
    questions: [
      "¿Que grado deberia iniciar el piloto?",
      "¿Que brecha es mas sensible para familias y directivos?",
      "¿Como se mediria avance despues del piloto?",
      "¿Que mensaje se podria presentar a rectoria o padres?",
    ],
  };
}

export function buildPilotPath(report) {
  const mainGap = report.gaps[0] || [...report.dimensions].sort((a, b) => a.percent - b.percent)[0];
  return [
    {
      label: "Brecha detectada",
      value: mainGap ? `${mainGap.name}: ${mainGap.percent}%` : "Resultados revisados",
    },
    {
      label: "Implicacion educativa",
      value: mainGap ? getGapImplication(mainGap.id) : "Hay oportunidad de profundizacion y medicion formativa.",
    },
    {
      label: "Piloto recomendado",
      value: report.pilotRecommendation.name,
    },
    {
      label: "Que se trabajaria",
      value: report.pilotRecommendation.focus,
    },
    {
      label: "Como se mediria",
      value: "Comparacion antes/despues con evaluacion corta y reporte de avance.",
    },
    {
      label: "Siguiente paso",
      value: "Reunion de implementacion para definir grupo, calendario y responsables.",
    },
  ];
}

function initializeDimensionScores() {
  return Object.fromEntries(
    DIMENSIONS.map((dimension) => [
      dimension.id,
      {
        id: dimension.id,
        name: dimension.name,
        shortName: dimension.shortName,
        correct: 0,
        total: 0,
        percent: 0,
      },
    ]),
  );
}

function summarizeAttitudes(attitudeCounts) {
  return Object.fromEntries(
    Object.entries(attitudeCounts).map(([questionId, data]) => [
      questionId,
      {
        total: data.total,
        positive: data.positive,
        positivePercent: roundPercent(data.positive, data.total),
        options: data.options,
      },
    ]),
  );
}

function level(name, description) {
  return { name, description };
}

function pilot(pilotData, reason) {
  return { ...pilotData, reason };
}

function roundPercent(value, total) {
  if (!total) return 0;
  return Math.round((value / total) * 100);
}

function sum(values) {
  return values.reduce((total, value) => total + value, 0);
}

function getGapImplication(dimensionId) {
  const implications = {
    "dinero-transacciones": "Los estudiantes pueden tener dificultades para verificar pagos, costos totales y comprobantes en compras cotidianas.",
    "presupuesto-planificacion": "El grupo necesita fortalecer priorizacion, ahorro y manejo de dinero limitado antes de decisiones de consumo.",
    "credito-deuda": "Los estudiantes pueden fijarse en cuotas bajas sin calcular costo total o compromisos futuros.",
    "riesgo-digital": "El grupo puede ser vulnerable a promesas de dinero rapido, presion social o solicitudes inseguras de datos.",
    "trabajo-empresa": "Los estudiantes pueden confundir recibir dinero con ganar dinero, sin considerar costos, utilidad y caja.",
    "hogar-ciudadania": "La oportunidad esta en conectar decisiones individuales con prioridades familiares, consumo responsable y bienestar compartido.",
  };
  return implications[dimensionId] || "La dimension requiere lectura pedagogica para definir intervencion.";
}
