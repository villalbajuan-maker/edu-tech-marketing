import { DIMENSIONS, QUESTIONS } from "./data.mjs";
import { buildDecisionCompanion, buildPilotPath, scoreSubmission } from "./scoring.mjs";
import { listScenarios, runQaSuite, simulateCohort } from "./simulation.mjs";

const app = document.querySelector("#app");
const defaultMeta = {
  school: "Colegio Demo",
  student: "Estudiante prueba",
  grade: "9",
  group: "9A",
};

const state = {
  view: "inicio",
  quizStage: "welcome",
  currentIndex: 0,
  meta: { ...defaultMeta },
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
              <p class="brand-subtitle">V1.1 · aplicacion real, reporte vivo y QA</p>
            </div>
          </div>
          <nav class="tabs">
            ${tab("inicio", "Inicio")}
            ${tab("prueba", "Aplicar prueba")}
            ${tab("sesion", "Sesion colegio")}
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
  if (state.view === "prueba") return renderQuizExperience();
  if (state.view === "sesion") return renderSessionDashboard();
  if (state.view === "reporte") return renderReport(state.studentReport || state.cohortResult.report, state.studentReport ? "individual" : "cohort");
  if (state.view === "qa") return renderQa();
  return renderHome();
}

function renderHome() {
  return `
    <section class="intro-grid">
      <div class="panel soft">
        <p class="kicker">Producto V1.1</p>
        <h2 class="headline">Una experiencia diagnostica lista para probar con estudiantes.</h2>
        <p class="lead">La V1.1 transforma la prueba en un flujo real: bienvenida, datos minimos, una pregunta por pantalla, revision antes de enviar, cierre, reporte vivo, companion y QA de 300 estudiantes.</p>
        <div class="actions">
          <button class="button" data-view="prueba">Iniciar diagnostico</button>
          <button class="button secondary" data-view="sesion">Ver sesion colegio</button>
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

function renderQuizExperience() {
  if (state.quizStage === "meta") return renderMetaStep();
  if (state.quizStage === "question") return renderQuestionStep();
  if (state.quizStage === "review") return renderReviewStep();
  if (state.quizStage === "done") return renderDoneStep();
  return renderWelcomeStep();
}

function renderWelcomeStep() {
  return `
    <section class="wizard-layout">
      <article class="panel soft">
        <p class="kicker">Antes de comenzar</p>
        <h2 class="headline">Este diagnostico no es una nota academica.</h2>
        <p class="lead">Vas a ver situaciones de la vida diaria sobre compras, ahorro, riesgo digital, trabajo, hogar y decisiones con dinero. Responde con calma y elige la opcion que consideres mas adecuada.</p>
        <div class="metrics compact">
          <div class="metric"><p class="metric-value">30</p><p class="metric-label">Preguntas</p></div>
          <div class="metric"><p class="metric-value">30</p><p class="metric-label">Minutos aprox.</p></div>
          <div class="metric"><p class="metric-value">6</p><p class="metric-label">Dimensiones</p></div>
        </div>
        <div class="actions">
          <button class="button" data-quiz-stage="meta">Comenzar</button>
        </div>
      </article>
      <aside class="panel">
        <p class="kicker">Para estudiantes</p>
        <ul class="list">
          <li>No necesitas conocimientos bancarios avanzados.</li>
          <li>Lee cada situacion antes de responder.</li>
          <li>Puedes volver a preguntas anteriores antes de enviar.</li>
          <li>El colegio recibira una lectura agregada para orientar una ruta de formacion.</li>
        </ul>
      </aside>
    </section>
  `;
}

function renderMetaStep() {
  return `
    <section class="panel">
      <p class="kicker">Datos minimos</p>
      <h2>Identificacion de aplicacion</h2>
      <p class="lead">Estos datos ayudan a organizar la sesion. Para una aplicacion real, el colegio puede usar codigos internos en lugar de nombres completos.</p>
      <div class="form-grid">
        <label class="field"><span>Colegio</span><input id="school" value="${escapeHtml(state.meta.school)}" /></label>
        <label class="field"><span>Codigo o nombre</span><input id="student" value="${escapeHtml(state.meta.student)}" /></label>
        <label class="field"><span>Grado</span><select id="grade">${[8, 9, 10, 11].map((grade) => `<option ${String(grade) === state.meta.grade ? "selected" : ""}>${grade}</option>`).join("")}</select></label>
        <label class="field"><span>Grupo</span><input id="group" value="${escapeHtml(state.meta.group)}" /></label>
      </div>
      <div class="actions">
        <button class="button secondary" data-quiz-stage="welcome">Volver</button>
        <button class="button" id="saveMeta">Continuar</button>
      </div>
    </section>
  `;
}

function renderQuestionStep() {
  const question = QUESTIONS[state.currentIndex];
  const selected = state.answers[question.id];
  const progress = Math.round(((state.currentIndex + 1) / QUESTIONS.length) * 100);
  return `
    <section class="quiz-shell">
      <div class="progress-panel">
        <div class="progress-meta">
          <span>Pregunta ${state.currentIndex + 1} de ${QUESTIONS.length}</span>
          <span>${progress}%</span>
        </div>
        <div class="progress-track"><div class="progress-fill" style="width:${progress}%"></div></div>
      </div>
      ${renderSingleQuestion(question, selected)}
      <div class="question-nav">
        <button class="button secondary" id="prevQuestion" ${state.currentIndex === 0 ? "disabled" : ""}>Anterior</button>
        <button class="button secondary" id="saveDemoAnswers">Responder demo</button>
        ${
          state.currentIndex === QUESTIONS.length - 1
            ? `<button class="button" id="goReview">Revisar y enviar</button>`
            : `<button class="button" id="nextQuestion">Siguiente</button>`
        }
      </div>
    </section>
  `;
}

function renderSingleQuestion(question, selected) {
  const dimension = DIMENSIONS.find((item) => item.id === question.dimension);
  return `
    <article class="question question-focus">
      <div class="question-header">
        <span class="badge">Situacion ${question.id}</span>
        <span class="badge">${dimension?.shortName || question.dimension}</span>
      </div>
      <p class="question-context">${escapeHtml(question.prompt)}</p>
      <div class="options">
        ${question.options
          .map(
            (option, index) => `
              <label class="option ${Number(selected) === index ? "selected" : ""}">
                <input type="radio" name="current-question" value="${index}" ${Number(selected) === index ? "checked" : ""} />
                <span>${String.fromCharCode(65 + index)}. ${escapeHtml(option)}</span>
              </label>
            `,
          )
          .join("")}
      </div>
      ${renderQuestionVisual(question.visual)}
    </article>
  `;
}

function renderReviewStep() {
  const answered = getAnsweredCount();
  const missing = QUESTIONS.filter((question) => state.answers[question.id] === undefined || state.answers[question.id] === null);
  return `
    <section class="panel">
      <p class="kicker">Revision final</p>
      <h2>Has respondido ${answered} de ${QUESTIONS.length} preguntas</h2>
      <p class="lead">${missing.length ? "Puedes enviar el diagnostico o volver a completar las preguntas pendientes." : "Todo esta respondido. Ya puedes enviar el diagnostico."}</p>
      ${
        missing.length
          ? `<div class="review-grid">${missing.map((question) => `<button class="review-pill" data-jump="${question.id}">Pregunta ${question.id}</button>`).join("")}</div>`
          : `<div class="empty">No hay preguntas pendientes.</div>`
      }
      <div class="actions">
        <button class="button secondary" data-quiz-stage="question">Volver a la prueba</button>
        <button class="button" id="submitDiagnostic">Enviar diagnostico</button>
      </div>
    </section>
  `;
}

function renderDoneStep() {
  return `
    <section class="intro-grid">
      <article class="panel soft">
        <p class="kicker">Diagnostico enviado</p>
        <h2 class="headline">Gracias. Tus respuestas fueron registradas.</h2>
        <p class="lead">El colegio recibira una lectura agregada para orientar una ruta de educacion financiera. En esta version de prueba tambien puedes ver el reporte generado.</p>
        <div class="actions">
          <button class="button" data-view="reporte">Ver reporte</button>
          <button class="button secondary" id="restartQuiz">Nueva aplicacion</button>
        </div>
      </article>
      <aside class="panel">
        <p class="kicker">Siguiente paso institucional</p>
        <ul class="list">
          <li>Procesar resultados.</li>
          <li>Generar reporte vivo.</li>
          <li>Agendar reunion de lectura.</li>
          <li>Recomendar piloto.</li>
        </ul>
      </aside>
    </section>
  `;
}

function renderSessionDashboard() {
  const students = state.cohortResult.students;
  const completed = students.length;
  const invited = 320;
  const inProgress = 14;
  const pending = invited - completed - inProgress;
  return `
    <section class="panel">
      <p class="kicker">Vista coordinador</p>
      <h2>Sesion diagnostica simulada</h2>
      <p class="lead">Esta vista muestra como podria monitorear el colegio una aplicacion real sin ver respuestas individuales en vivo.</p>
      <div class="metrics">
        <div class="metric"><p class="metric-value">${invited}</p><p class="metric-label">Estudiantes esperados</p></div>
        <div class="metric"><p class="metric-value">${completed}</p><p class="metric-label">Finalizaron</p></div>
        <div class="metric"><p class="metric-value">${inProgress}</p><p class="metric-label">En progreso</p></div>
      </div>
    </section>
    <section class="report-section">
      <h3>Estado por grupo</h3>
      <div class="session-table">
        ${[8, 9, 10, 11]
          .map((grade, index) => {
            const expected = 80;
            const done = [73, 76, 75, 76][index];
            const active = [5, 3, 4, 2][index];
            return `
              <div class="session-row">
                <strong>Grado ${grade}A</strong>
                <span>${done}/${expected} finalizaron</span>
                <span>${active} en progreso</span>
              </div>
            `;
          })
          .join("")}
      </div>
      <div class="actions">
        <button class="button" data-view="reporte">Ver reporte institucional simulado</button>
        <button class="button secondary" data-view="qa">Cambiar escenario QA</button>
      </div>
    </section>
  `;
}

function renderReport(report, mode) {
  if (!report) return `<div class="empty">Todavia no hay reporte. Aplica la prueba o ejecuta una simulacion.</div>`;
  const companion = buildDecisionCompanion(report);
  const pilotPath = buildPilotPath(report);
  return `
    <section class="report-grid">
      <div>
        <article class="report-section">
          <p class="kicker">${mode === "cohort" ? "Reporte institucional simulado" : "Reporte individual de prueba"}</p>
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

        <article class="report-section">
          <h3>Ruta recomendada hacia piloto</h3>
          <div class="pilot-path">
            ${pilotPath
              .map(
                (step, index) => `
                  <div class="path-step">
                    <span class="path-index">${index + 1}</span>
                    <div>
                      <strong>${step.label}</strong>
                      <p>${step.value}</p>
                    </div>
                  </div>
                `,
              )
              .join("")}
          </div>
        </article>
      </div>
      <aside class="companion">
        <p class="kicker">Companion decisional</p>
        <h3>Lectura para decidir</h3>
        <div class="companion-list">
          <div class="companion-item"><strong>Lectura rapida</strong><span>${companion.summary}</span></div>
          <div class="companion-item"><strong>Brecha principal</strong><span>${companion.mainGap}</span></div>
          <div class="companion-item"><strong>Por que importa</strong><span>${companion.whyItMatters}</span></div>
          <div class="companion-item"><strong>Piloto recomendado</strong><span>${companion.pilot}</span></div>
          <div class="companion-item"><strong>Siguiente paso</strong><span>${companion.nextStep}</span></div>
        </div>
        <h3 class="companion-subtitle">Preguntas utiles</h3>
        <ul class="list">${companion.questions.map((question) => `<li>${question}</li>`).join("")}</ul>
      </aside>
    </section>
  `;
}

function renderQuestionVisual(visual) {
  if (!visual) return "";
  const meta = getVisualMeta(visual.type);
  if (visual.type === "chat") {
    return `
      <div class="question-visual ${meta.className}">
        ${renderVisualHeader(visual.title, meta.label)}
        <div class="phone-frame">
          <div class="phone-bar"><span></span><span></span><span></span></div>
          <div class="chat-screen">
            ${visual.messages.map((message) => `<div class="chat-bubble">${escapeHtml(message)}</div>`).join("")}
          </div>
        </div>
      </div>
    `;
  }
  if (visual.type === "installments") {
    return `
      <div class="question-visual ${meta.className}">
        ${renderVisualHeader(visual.title, meta.label)}
        <div class="comparison-grid">
          ${visual.options
            .map(
              (item) => `
                <div class="comparison-card">
                  <span>${escapeHtml(item.label)}</span>
                  <b>${escapeHtml(item.value)}</b>
                </div>
              `,
            )
            .join("")}
        </div>
      </div>
    `;
  }
  if (visual.type === "cashbook" || visual.type === "receipt" || visual.type === "budget") {
    return `
      <div class="question-visual ${meta.className}">
        ${renderVisualHeader(visual.title, meta.label)}
        <div class="visual-ledger">
          ${visual.rows.map(([label, value]) => renderVisualRow(label, value, visual.type)).join("")}
        </div>
      </div>
    `;
  }
  if (visual.type === "decision") {
    return `
      <div class="question-visual ${meta.className}">
        ${renderVisualHeader(visual.title, meta.label)}
        <div class="decision-board">
          ${visual.items.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}
        </div>
      </div>
    `;
  }
  return "";
}

function renderVisualHeader(title, label) {
  return `
    <div class="visual-header">
      <span class="visual-mark" aria-hidden="true"></span>
      <div>
        <span class="visual-label">${label}</span>
        <strong>${escapeHtml(title)}</strong>
      </div>
    </div>
  `;
}

function renderVisualRow(label, value, type) {
  const normalizedLabel = label.toLowerCase();
  const isKeyRow = ["total", "pago", "cambio", "disponible", "saldo", "utilidad"].some((term) =>
    normalizedLabel.includes(term),
  );
  const rowClass = isKeyRow ? "visual-row key-row" : "visual-row";
  const safeValue = value === "?" ? '<b class="unknown-value">?</b>' : `<b>${escapeHtml(value)}</b>`;
  return `<div class="${rowClass}" data-type="${type}"><span>${escapeHtml(label)}</span>${safeValue}</div>`;
}

function getVisualMeta(type) {
  const meta = {
    receipt: { label: "Comprobante", className: "receipt-visual" },
    budget: { label: "Presupuesto", className: "budget-visual" },
    installments: { label: "Comparador", className: "installment-visual" },
    chat: { label: "Conversacion", className: "chat-visual" },
    cashbook: { label: "Registro de caja", className: "cashbook-visual" },
    decision: { label: "Decision", className: "decision-visual" },
  };
  return meta[type] || { label: "Instrumento", className: "generic-visual" };
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

  document.querySelectorAll("[data-quiz-stage]").forEach((button) => {
    button.addEventListener("click", () => {
      state.quizStage = button.dataset.quizStage;
      render();
    });
  });

  document.querySelectorAll("[data-scenario]").forEach((button) => {
    button.addEventListener("click", () => {
      state.cohortResult = simulateCohort(300, button.dataset.scenario);
      render();
    });
  });

  document.querySelectorAll("[data-jump]").forEach((button) => {
    button.addEventListener("click", () => {
      const questionId = Number(button.dataset.jump);
      const index = QUESTIONS.findIndex((question) => question.id === questionId);
      if (index >= 0) {
        state.currentIndex = index;
        state.quizStage = "question";
        render();
      }
    });
  });

  document.querySelectorAll('input[name="current-question"]').forEach((input) => {
    input.addEventListener("change", () => {
      const question = QUESTIONS[state.currentIndex];
      state.answers[question.id] = Number(input.value);
      render();
    });
  });

  const saveMeta = document.querySelector("#saveMeta");
  if (saveMeta) {
    saveMeta.addEventListener("click", () => {
      state.meta = readMeta();
      state.quizStage = "question";
      render();
    });
  }

  const prevQuestion = document.querySelector("#prevQuestion");
  if (prevQuestion) {
    prevQuestion.addEventListener("click", () => {
      state.currentIndex = Math.max(0, state.currentIndex - 1);
      render();
    });
  }

  const nextQuestion = document.querySelector("#nextQuestion");
  if (nextQuestion) {
    nextQuestion.addEventListener("click", () => {
      state.currentIndex = Math.min(QUESTIONS.length - 1, state.currentIndex + 1);
      render();
    });
  }

  const goReview = document.querySelector("#goReview");
  if (goReview) {
    goReview.addEventListener("click", () => {
      state.quizStage = "review";
      render();
    });
  }

  const submitDiagnostic = document.querySelector("#submitDiagnostic");
  if (submitDiagnostic) {
    submitDiagnostic.addEventListener("click", () => {
      state.studentReport = scoreSubmission(state.answers, state.meta);
      state.quizStage = "done";
      render();
    });
  }

  const restartQuiz = document.querySelector("#restartQuiz");
  if (restartQuiz) {
    restartQuiz.addEventListener("click", () => {
      state.answers = {};
      state.studentReport = null;
      state.currentIndex = 0;
      state.quizStage = "welcome";
      state.view = "prueba";
      render();
    });
  }

  const saveDemoAnswers = document.querySelector("#saveDemoAnswers");
  if (saveDemoAnswers) {
    saveDemoAnswers.addEventListener("click", () => {
      QUESTIONS.forEach((question) => {
        state.answers[question.id] = question.attitude ? question.positive : question.answer;
      });
      state.quizStage = "review";
      render();
    });
  }
}

function readMeta() {
  return {
    school: document.querySelector("#school")?.value || defaultMeta.school,
    student: document.querySelector("#student")?.value || defaultMeta.student,
    grade: document.querySelector("#grade")?.value || defaultMeta.grade,
    group: document.querySelector("#group")?.value || defaultMeta.group,
  };
}

function getAnsweredCount() {
  return QUESTIONS.filter((question) => state.answers[question.id] !== undefined && state.answers[question.id] !== null).length;
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
