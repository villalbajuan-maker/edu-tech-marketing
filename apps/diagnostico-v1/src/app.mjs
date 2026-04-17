import { DIMENSIONS, QUESTIONS } from "./data.mjs";
import { buildCompanionAnswers, scoreSubmission } from "./scoring.mjs";
import { listScenarios, runQaSuite, simulateCohort } from "./simulation.mjs";

const app = document.querySelector("#app");
const state = {
  view: "inicio",
  answers: {},
  studentReport: null,
  cohortResult: simulateCohort(300, "baseline"),
  qaResults: runQaSuite(),
};

render();

function render() {
  app.innerHTML = `
    <div class="shell">
      <header class="topbar">
        <div class="topbar-inner">
          <div class="brand">
            <div class="brand-mark">FDE</div>
            <div>
              <h1 class="brand-title">Diagnostico Escolar de Competencias Financieras</h1>
              <p class="brand-subtitle">V1 funcional · prueba, reporte vivo y QA</p>
            </div>
          </div>
          <nav class="tabs">
            ${tab("inicio", "Inicio")}
            ${tab("prueba", "Aplicar prueba")}
            ${tab("reporte", "Reporte vivo")}
            ${tab("qa", "QA 300 estudiantes")}
          </nav>
        </div>
      </header>
      <main class="main">${renderView()}</main>
    </div>
  `;
  bindEvents();
}

function renderView() {
  if (state.view === "prueba") return renderQuiz();
  if (state.view === "reporte") return renderReport(state.studentReport || state.cohortResult.report, state.studentReport ? "individual" : "cohort");
  if (state.view === "qa") return renderQa();
  return renderHome();
}

function renderHome() {
  return `
    <section class="intro-grid">
      <div class="panel soft">
        <p class="kicker">Producto V1</p>
        <h2 class="headline">Medimos necesidad, generamos reporte vivo y recomendamos piloto.</h2>
        <p class="lead">Esta UI permite aplicar la prueba de 30 preguntas, calcular resultados, generar un reporte interactivo y simular cohortes de 300 estudiantes para validar scoring, brechas y recomendacion de piloto.</p>
        <div class="actions">
          <button class="button" data-view="prueba">Aplicar prueba</button>
          <button class="button secondary" data-view="qa">Ejecutar QA</button>
        </div>
      </div>
      <aside class="panel">
        <p class="kicker">Escalera</p>
        <ul class="list">
          <li>Diagnostico: evidencia de necesidad.</li>
          <li>Reporte vivo: evidencia convertida en decision.</li>
          <li>Piloto: evidencia de solucion.</li>
          <li>Implementacion: contrato institucional.</li>
        </ul>
      </aside>
    </section>
  `;
}

function renderQuiz() {
  return `
    <section class="panel">
      <p class="kicker">Aplicacion estudiante</p>
      <h2>Prueba funcional V1</h2>
      <p class="lead">Completa la prueba como estudiante. Al enviar, se calcula puntaje sobre 28, niveles, brechas y piloto recomendado.</p>
      <div class="form-grid">
        <label class="field"><span>Colegio</span><input id="school" value="Colegio Demo" /></label>
        <label class="field"><span>Estudiante</span><input id="student" value="Estudiante prueba" /></label>
        <label class="field"><span>Grado</span><select id="grade">${[8, 9, 10, 11].map((grade) => `<option>${grade}</option>`).join("")}</select></label>
        <label class="field"><span>Grupo</span><input id="group" value="9A" /></label>
      </div>
    </section>
    <form id="quizForm" class="quiz-grid">
      ${QUESTIONS.map(renderQuestion).join("")}
      <div class="actions">
        <button class="button" type="submit">Generar reporte individual</button>
        <button class="button secondary" type="button" id="fillDemo">Responder demo</button>
      </div>
    </form>
  `;
}

function renderQuestion(question) {
  const dimension = DIMENSIONS.find((item) => item.id === question.dimension);
  return `
    <article class="question">
      <div class="question-header">
        <span class="badge">Pregunta ${question.id}</span>
        <span class="badge">${dimension?.shortName || question.dimension}</span>
      </div>
      <p>${escapeHtml(question.prompt)}</p>
      <div class="options">
        ${question.options
          .map(
            (option, index) => `
              <label class="option">
                <input type="radio" name="q-${question.id}" value="${index}" />
                <span>${String.fromCharCode(65 + index)}. ${escapeHtml(option)}</span>
              </label>
            `,
          )
          .join("")}
      </div>
    </article>
  `;
}

function renderReport(report, mode) {
  if (!report) return `<div class="empty">Todavia no hay reporte. Aplica la prueba o ejecuta una simulacion.</div>`;
  const companion = buildCompanionAnswers(report);
  return `
    <section class="report-grid">
      <div>
        <article class="report-section">
          <p class="kicker">${mode === "cohort" ? "Reporte institucional simulado" : "Reporte individual"}</p>
          <h2>${report.meta?.school || "Colegio Demo"}</h2>
          <div class="metrics">
            <div class="metric"><p class="metric-value">${report.percent}%</p><p class="metric-label">Resultado general</p></div>
            <div class="metric"><p class="metric-value">${report.level.name}</p><p class="metric-label">Nivel</p></div>
            <div class="metric"><p class="metric-value">${report.count || 1}</p><p class="metric-label">Estudiantes</p></div>
          </div>
          <p class="lead">${report.level.description}</p>
        </article>

        <article class="report-section">
          <h3>Resultados por dimension</h3>
          <div class="bar-list">
            ${report.dimensions.map(renderDimensionBar).join("")}
          </div>
        </article>

        <article class="report-section">
          <h3>Brechas y fortalezas</h3>
          <div class="metrics">
            <div>
              <p class="kicker">Brechas prioritarias</p>
              <ul class="list">${(report.gaps.length ? report.gaps : report.dimensions.slice(0, 2)).map((gap) => `<li>${gap.name}: ${gap.percent}% (${gap.status.name})</li>`).join("")}</ul>
            </div>
            <div>
              <p class="kicker">Fortalezas</p>
              <ul class="list">${(report.strengths.length ? report.strengths : report.dimensions.slice(-2)).map((item) => `<li>${item.name}: ${item.percent}%</li>`).join("")}</ul>
            </div>
            <div>
              <p class="kicker">Actitudinal</p>
              ${renderAttitudes(report)}
            </div>
          </div>
        </article>

        <article class="report-section">
          <h3>Piloto recomendado</h3>
          <p><strong>${report.pilotRecommendation.name}</strong></p>
          <p>${report.pilotRecommendation.reason}</p>
          <p><strong>Duracion sugerida:</strong> ${report.pilotRecommendation.duration}</p>
          <p><strong>Foco:</strong> ${report.pilotRecommendation.focus}</p>
          <div class="actions">
            <button class="button">Revisar ruta de piloto</button>
            <button class="button secondary">Agendar reunion de lectura</button>
          </div>
        </article>
      </div>
      <aside class="companion">
        <p class="kicker">Companion del reporte</p>
        <h3>Preguntas sugeridas</h3>
        <div class="companion-list">
          ${companion
            .map(
              (item) => `
                <div class="companion-item">
                  <strong>${item.question}</strong>
                  <span>${item.answer}</span>
                </div>
              `,
            )
            .join("")}
        </div>
      </aside>
    </section>
  `;
}

function renderDimensionBar(dimension) {
  const tone = dimension.percent <= 60 ? "low" : dimension.percent <= 80 ? "mid" : "good";
  return `
    <div class="bar-row">
      <div class="bar-meta">
        <strong>${dimension.name}</strong>
        <span>${dimension.percent}% · ${dimension.status.name}</span>
      </div>
      <div class="bar"><div class="bar-fill ${tone}" style="width:${dimension.percent}%"></div></div>
    </div>
  `;
}

function renderAttitudes(report) {
  const summary = report.attitudeSummary;
  if (!summary) return `<p class="metric-label">Disponible en reporte de cohorte.</p>`;
  return `
    <ul class="list">
      ${Object.entries(summary)
        .map(([questionId, item]) => `<li>P${questionId}: ${item.positivePercent}% respuesta responsable</li>`)
        .join("")}
    </ul>
  `;
}

function renderQa() {
  return `
    <section class="panel">
      <p class="kicker">Sistema QA</p>
      <h2>Simulacion de 300 estudiantes</h2>
      <p class="lead">Ejecuta escenarios determinísticos para validar scoring, niveles, dimensiones, companion y recomendacion de piloto.</p>
      <div class="actions">
        ${listScenarios().map((scenario) => `<button class="button secondary" data-scenario="${scenario.id}">${scenario.name}</button>`).join("")}
      </div>
    </section>
    <section class="report-section">
      <h3>Escenario activo: ${state.cohortResult.scenarioName}</h3>
      ${renderReport(state.cohortResult.report, "cohort")}
    </section>
    <section class="report-section">
      <h3>Checks automatizados</h3>
      <div class="qa-grid">
        ${state.qaResults
          .map(
            (result) => `
              <div class="qa-card">
                <p class="kicker">${result.scenarioId}</p>
                <h3>${result.percent}% · ${result.level}</h3>
                <p>${result.pilot}</p>
                ${result.checks.map((check) => `<div class="check ${check.passed ? "pass" : ""}">${check.name}</div>`).join("")}
              </div>
            `,
          )
          .join("")}
      </div>
    </section>
  `;
}

function bindEvents() {
  document.querySelectorAll("[data-view]").forEach((button) => {
    button.addEventListener("click", () => {
      state.view = button.dataset.view;
      render();
    });
  });

  document.querySelectorAll("[data-scenario]").forEach((button) => {
    button.addEventListener("click", () => {
      state.cohortResult = simulateCohort(300, button.dataset.scenario);
      render();
    });
  });

  const quizForm = document.querySelector("#quizForm");
  if (quizForm) {
    quizForm.addEventListener("submit", (event) => {
      event.preventDefault();
      state.studentReport = scoreSubmission(readAnswers(), readMeta());
      state.view = "reporte";
      render();
    });
  }

  const fillDemo = document.querySelector("#fillDemo");
  if (fillDemo) {
    fillDemo.addEventListener("click", () => {
      QUESTIONS.forEach((question) => {
        const value = question.attitude ? question.positive : question.answer;
        const input = document.querySelector(`input[name="q-${question.id}"][value="${value}"]`);
        if (input) input.checked = true;
      });
    });
  }
}

function readMeta() {
  return {
    school: document.querySelector("#school")?.value || "Colegio Demo",
    student: document.querySelector("#student")?.value || "Estudiante prueba",
    grade: document.querySelector("#grade")?.value || "9",
    group: document.querySelector("#group")?.value || "9A",
  };
}

function readAnswers() {
  return Object.fromEntries(
    QUESTIONS.map((question) => {
      const checked = document.querySelector(`input[name="q-${question.id}"]:checked`);
      return [question.id, checked ? Number(checked.value) : null];
    }),
  );
}

function tab(view, label) {
  return `<button class="tab ${state.view === view ? "active" : ""}" data-view="${view}">${label}</button>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

