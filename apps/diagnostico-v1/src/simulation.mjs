import { QUESTIONS } from "./data.mjs";
import { scoreSubmission, summarizeCohort } from "./scoring.mjs";

const SCENARIOS = {
  baseline: {
    name: "Colegio Horizonte - linea base mixta",
    ability: 0.62,
    variance: 0.22,
    weakness: {
      "credito-deuda": -0.18,
      "riesgo-digital": -0.15,
      "presupuesto-planificacion": -0.08,
    },
  },
  risk: {
    name: "Colegio Nueva Ruta - riesgo digital alto",
    ability: 0.58,
    variance: 0.2,
    weakness: {
      "credito-deuda": -0.2,
      "riesgo-digital": -0.28,
    },
  },
  advanced: {
    name: "Colegio Alto Desempeno - grupo avanzado",
    ability: 0.78,
    variance: 0.14,
    weakness: {
      "credito-deuda": -0.08,
    },
  },
  foundations: {
    name: "Colegio Punto de Partida - bases por fortalecer",
    ability: 0.43,
    variance: 0.18,
    weakness: {
      "dinero-transacciones": -0.12,
      "presupuesto-planificacion": -0.12,
      "credito-deuda": -0.18,
      "riesgo-digital": -0.18,
    },
  },
};

export function listScenarios() {
  return Object.entries(SCENARIOS).map(([id, scenario]) => ({ id, name: scenario.name }));
}

export function simulateCohort(size = 300, scenarioId = "baseline", seed = 20260417) {
  const scenario = SCENARIOS[scenarioId] || SCENARIOS.baseline;
  const random = mulberry32(seed);
  const reports = [];

  for (let index = 0; index < size; index += 1) {
    const grade = pickGrade(index);
    const studentAbility = clamp(scenario.ability + (random() - 0.5) * scenario.variance + gradeBonus(grade), 0.12, 0.96);
    const answers = {};

    for (const question of QUESTIONS) {
      if (question.attitude) {
        const positiveChance = clamp(studentAbility + (question.dimension === "riesgo-digital" ? -0.08 : 0.03), 0.12, 0.92);
        answers[question.id] = random() < positiveChance ? question.positive : pickWrongOption(question, random);
        continue;
      }

      const difficultyPenalty = getDifficultyPenalty(question.difficulty);
      const weaknessPenalty = scenario.weakness[question.dimension] || 0;
      const probability = clamp(studentAbility + weaknessPenalty - difficultyPenalty, 0.08, 0.95);
      answers[question.id] = random() < probability ? question.answer : pickWrongOption(question, random);
    }

    reports.push(
      scoreSubmission(answers, {
        studentId: `EST-${String(index + 1).padStart(3, "0")}`,
        grade,
        group: `${grade}A`,
      }),
    );
  }

  return {
    scenarioId,
    scenarioName: scenario.name,
    students: reports,
    report: summarizeCohort(reports, {
      school: scenario.name,
      grades: "8 a 11",
      students: size,
      mode: "Simulacion QA",
    }),
  };
}

export function runQaSuite() {
  return Object.keys(SCENARIOS).map((scenarioId) => {
    const result = simulateCohort(300, scenarioId, 20260417);
    return {
      scenarioId,
      scenarioName: result.scenarioName,
      students: result.students.length,
      percent: result.report.percent,
      level: result.report.level.name,
      pilot: result.report.pilotRecommendation.name,
      checks: validateSimulation(result),
    };
  });
}

export function validateSimulation(result) {
  const checks = [];
  checks.push(check("300 estudiantes simulados", result.students.length === 300));
  checks.push(check("Puntaje general entre 0 y 100", between(result.report.percent, 0, 100)));
  checks.push(check("Todas las dimensiones tienen porcentaje valido", result.report.dimensions.every((dimension) => between(dimension.percent, 0, 100))));
  checks.push(check("Existe piloto recomendado", Boolean(result.report.pilotRecommendation?.name)));
  checks.push(check("Cada estudiante tiene maximo 28 puntos", result.students.every((student) => student.correct <= 28 && student.maxScore === 28)));
  checks.push(check("Clave de respuestas sin opcion dominante", hasBalancedAnswerKey()));
  checks.push(check("Clave de respuestas sin rachas evidentes", getLongestAnswerKeyRun() <= 2));
  return checks;
}

function getAnswerKeyIndexes() {
  return QUESTIONS.map((question) => question.answer ?? question.positive);
}

function hasBalancedAnswerKey() {
  const counts = [0, 0, 0, 0];
  getAnswerKeyIndexes().forEach((index) => {
    counts[index] += 1;
  });
  return Math.max(...counts) - Math.min(...counts) <= 1;
}

function getLongestAnswerKeyRun() {
  return getAnswerKeyIndexes().reduce(
    (state, index) => {
      const current = index === state.last ? state.current + 1 : 1;
      return {
        last: index,
        current,
        longest: Math.max(state.longest, current),
      };
    },
    { last: null, current: 0, longest: 0 },
  ).longest;
}

function pickGrade(index) {
  return [8, 9, 10, 11][index % 4];
}

function gradeBonus(grade) {
  return { 8: -0.05, 9: -0.02, 10: 0.02, 11: 0.05 }[grade] || 0;
}

function getDifficultyPenalty(difficulty) {
  if (difficulty === "Basica") return -0.04;
  if (difficulty === "Alta" || difficulty === "Media-alta") return 0.12;
  return 0.02;
}

function pickWrongOption(question, random) {
  const options = question.options.map((_, index) => index).filter((index) => index !== question.answer && index !== question.positive);
  return options[Math.floor(random() * options.length)] ?? 0;
}

function check(name, passed) {
  return { name, passed };
}

function between(value, min, max) {
  return value >= min && value <= max;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function mulberry32(seed) {
  let value = seed;
  return function random() {
    value |= 0;
    value = (value + 0x6d2b79f5) | 0;
    let t = Math.imul(value ^ (value >>> 15), 1 | value);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
