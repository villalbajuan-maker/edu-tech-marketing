import { runQaSuite, simulateCohort } from "../src/simulation.mjs";

const scenario = process.argv[2] || "baseline";
const result = simulateCohort(300, scenario);
const suite = runQaSuite();

console.log(JSON.stringify(
  {
    scenario: result.scenarioName,
    students: result.students.length,
    report: {
      percent: result.report.percent,
      level: result.report.level.name,
      pilot: result.report.pilotRecommendation.name,
      dimensions: result.report.dimensions.map((dimension) => ({
        id: dimension.id,
        percent: dimension.percent,
        status: dimension.status.name,
      })),
    },
    qaSuite: suite,
  },
  null,
  2,
));

