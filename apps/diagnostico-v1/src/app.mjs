import { DIMENSIONS, QUESTIONS } from "./data.mjs";
import { buildDecisionCompanion, buildPilotPath, scoreSubmission, summarizeCohort } from "./scoring.mjs";
import { listScenarios, runQaSuite, simulateCohort } from "./simulation.mjs";

const app = document.querySelector("#app");
const defaultMeta = {
  school: "Colegio Demo",
  student: "Estudiante prueba",
  grade: "9",
  group: "9A",
};

let companionMediaRecorder = null;
let companionAudioChunks = [];
let companionAudioStream = null;
let companionDiscardRecording = false;

const state = {
  view: "inicio",
  internalSection: "qa",
  quizStage: "welcome",
  currentIndex: 0,
  revealedIndex: 0,
  questionTransition: false,
  meta: { ...defaultMeta },
  answers: {},
  studentReport: null,
  cohortResult: simulateCohort(300, "baseline"),
  institutionalDemo: buildInstitutionalDemo(),
  demoAudience: "school",
  companionOpen: false,
  companionLoading: false,
  companionRecording: false,
  companionTranscribing: false,
  companionVoiceError: "",
  companionDraft: "",
  companionMessages: [],
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
              <p class="brand-subtitle">V1.5 · modo conversacional guiado</p>
            </div>
          </div>
          <nav class="tabs">
            ${tab("inicio", "Inicio")}
            ${tab("prueba", "Aplicar diagnostico")}
            ${tab("demo", "Demo institucional")}
            ${tab("interno", "Interno")}
          </nav>
        </div>
      </header>
      <main class="main">${renderView()}</main>
      ${renderFloatingCompanionButton()}
      ${renderCompanionModal()}
    </div>
  `;
  bindEvents();
  scrollConversationThread();
}

function renderView() {
  if (state.view === "prueba") return renderQuizExperience();
  if (state.view === "demo") return renderInstitutionalDemo();
  if (state.view === "interno") return renderInternalWorkbench();
  return renderHome();
}

function renderHome() {
  return `
    <section class="intro-grid">
      <div class="panel soft">
        <p class="kicker">Producto V1.4.1</p>
        <h2 class="headline">Un instrumento diagnostico institucional con experiencia clara por audiencia.</h2>
        <p class="lead">La navegacion separa aplicacion del estudiante, demo institucional y herramientas internas para que el diagnostico se pueda probar, presentar y revisar sin mezclar audiencias.</p>
        <div class="actions">
          <button class="button" data-view="prueba">Iniciar diagnostico</button>
          <button class="button secondary" data-view="demo">Ver demo institucional</button>
          <button class="button secondary" data-view="interno">Abrir interno</button>
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
        <p class="lead">Vas a ver situaciones de la vida diaria sobre compras, ahorro, riesgo digital, trabajo, hogar y decisiones con dinero. La prueba se presenta en modo conversacional guiado: lee cada situacion, revisa el artefacto visual y elige la opcion que consideres mas adecuada.</p>
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
  const answered = getAnsweredCount();
  const progress = Math.round(((state.revealedIndex + 1) / QUESTIONS.length) * 100);
  const isLatestQuestion = state.currentIndex === state.revealedIndex;
  return `
    <section class="quiz-shell">
      <div class="progress-panel">
        <div class="progress-meta">
          <span>Situacion ${state.revealedIndex + 1} de ${QUESTIONS.length}</span>
          <span>${answered} respuestas registradas</span>
          <span>${progress}%</span>
        </div>
        <div class="progress-track"><div class="progress-fill" style="width:${progress}%"></div></div>
      </div>
      ${renderConversationDiagnostic()}
      <div class="question-nav">
        <button class="button secondary" id="saveDemoAnswers" ${state.questionTransition ? "disabled" : ""}>Responder demo</button>
        ${
          isLatestQuestion
            ? ""
            : `<button class="button" id="nextQuestion" ${state.questionTransition ? "disabled" : ""}>Volver al final</button>`
        }
      </div>
    </section>
  `;
}

function renderConversationDiagnostic() {
  const activeQuestion = QUESTIONS[state.currentIndex];
  const dimension = DIMENSIONS.find((item) => item.id === activeQuestion.dimension);
  const exchanges = QUESTIONS.slice(0, state.revealedIndex + 1).map(renderConversationExchange).join("");
  return `
    <article class="question question-focus conversational-question">
      <div class="student-chat-shell">
        <div class="chat-shell-header">
          <div>
            <span class="chat-shell-label">Sesion diagnostica</span>
            <h2>Conversacion guiada</h2>
          </div>
          <div class="conversational-header">
            <span class="badge">${dimension?.shortName || activeQuestion.dimension}</span>
            <span class="badge">Hilo continuo</span>
          </div>
        </div>
        <div class="guided-thread chat-thread" aria-live="polite">
          ${exchanges}
          ${state.questionTransition ? renderDiagnosticTypingIndicator() : ""}
        </div>
      </div>
    </article>
  `;
}

function renderConversationExchange(question, index) {
  if (index === state.currentIndex) {
    return renderActiveQuestionExchange(question, state.answers[question.id]);
  }
  return renderCompletedQuestionExchange(question);
}

function renderActiveQuestionExchange(question, selected) {
  const dimension = DIMENSIONS.find((item) => item.id === question.dimension);
  const conversation = buildQuestionConversation(question, dimension);
  return `
    <div class="active-exchange-marker" data-active-exchange></div>
    ${renderInlineContextSplash(question, dimension, "active")}
    <div class="diagnostic-message chat-message">
      <span>Diagnostico</span>
      <p>${escapeHtml(conversation.intro)}</p>
    </div>
    <div class="diagnostic-message chat-message">
      <span>Situacion ${question.id}</span>
      <p>${escapeHtml(conversation.caseText)}</p>
    </div>
    ${question.visual ? `<div class="artifact-message chat-message artifact-bubble">${renderQuestionVisual(question.visual)}</div>` : ""}
    <div class="diagnostic-message chat-message question-message">
      <span>Pregunta</span>
      <p>${escapeHtml(conversation.questionText)}</p>
    </div>
    ${renderStudentAnswerBubble(question, selected)}
    <div class="student-response-panel chat-response-panel">
      <p>Selecciona la respuesta que mejor representa tu decision.</p>
      <div class="options conversational-options" aria-label="Opciones de respuesta">
        ${question.options
          .map(
            (option, index) => `
              <button class="option answer-option ${Number(selected) === index ? "selected" : ""} ${state.questionTransition ? "disabled" : ""}" data-answer-option="${index}" ${state.questionTransition ? "disabled" : ""}>
                <b>${String.fromCharCode(65 + index)}</b>
                <span>${escapeHtml(option)}</span>
              </button>
            `,
          )
          .join("")}
      </div>
    </div>
  `;
}

function renderCompletedQuestionExchange(question) {
  const dimension = DIMENSIONS.find((item) => item.id === question.dimension);
  const conversation = buildQuestionConversation(question, dimension);
  const selected = state.answers[question.id];
  const answerText =
    selected === undefined || selected === null
      ? "Sin respuesta registrada"
      : `${String.fromCharCode(65 + Number(selected))}. ${question.options[Number(selected)]}`;
  return `
    ${renderInlineContextSplash(question, dimension, "compact")}
    <div class="diagnostic-message chat-message previous-question-message">
      <span>Situacion ${question.id} respondida</span>
      <p>${escapeHtml(conversation.questionText)}</p>
    </div>
    <div class="student-answer-message chat-message previous-answer-message">
      <span>Tu respuesta</span>
      <p>${escapeHtml(answerText)}</p>
      <button class="inline-edit-button" data-edit-question="${question.id}" ${state.questionTransition ? "disabled" : ""}>Editar respuesta</button>
    </div>
  `;
}

function renderInlineContextSplash(question, dimension, mode = "active") {
  const context = getInlineContext(question, dimension);
  const visualType = question.visual?.type || "decision";
  const compactClass = mode === "compact" ? "compact-context" : "";
  return `
    <div class="inline-context-splash chat-message ${compactClass}">
      <span class="inline-context-label">Contexto de la situacion</span>
      <div class="inline-thumbnail-row" aria-label="${escapeHtml(context.copy)}">
        ${context.thumbnails.map((thumbnail) => renderInlineThumbnail(thumbnail, visualType)).join("")}
      </div>
    </div>
  `;
}

function getInlineContext(question, dimension) {
  const contexts = {
    "dinero-transacciones": {
      title: "Compra cotidiana con informacion verificable",
      copy: "Observa valores, pagos, descuentos o comprobantes antes de decidir.",
      tags: ["precio", "total", "comprobante"],
      thumbnails: [
        { label: "Precio", type: "receipt" },
        { label: "Total", type: "receipt" },
        { label: "Cambio", type: "decision" },
      ],
    },
    "presupuesto-planificacion": {
      title: "Decision con dinero limitado",
      copy: "Identifica prioridades, compromisos y metas antes de elegir.",
      tags: ["prioridad", "ahorro", "plan"],
      thumbnails: [
        { label: "Prioridad", type: "budget" },
        { label: "Ahorro", type: "budget" },
        { label: "Opcion", type: "decision" },
      ],
    },
    "credito-deuda": {
      title: "Compromiso financiero hacia adelante",
      copy: "Compara cuotas, costo total y consecuencias futuras.",
      tags: ["cuotas", "costo total", "deuda"],
      thumbnails: [
        { label: "Cuotas", type: "installments" },
        { label: "Total", type: "receipt" },
        { label: "Futuro", type: "decision" },
      ],
    },
    "riesgo-digital": {
      title: "Entorno digital con senales de riesgo",
      copy: "Verifica fuente, seguridad y datos antes de actuar.",
      tags: ["verificacion", "datos", "seguridad"],
      thumbnails: [
        { label: "Mensaje", type: "chat" },
        { label: "Datos", type: "receipt" },
        { label: "Verificar", type: "decision" },
      ],
    },
    "trabajo-empresa": {
      title: "Ingreso, costo y resultado",
      copy: "Relaciona ventas, gastos, utilidad y manejo de caja.",
      tags: ["ingresos", "costos", "utilidad"],
      thumbnails: [
        { label: "Ingreso", type: "budget" },
        { label: "Costo", type: "receipt" },
        { label: "Utilidad", type: "installments" },
      ],
    },
    "hogar-ciudadania": {
      title: "Decision economica compartida",
      copy: "Piensa en necesidades, responsabilidades y efectos para otros.",
      tags: ["hogar", "prioridades", "responsabilidad"],
      thumbnails: [
        { label: "Hogar", type: "decision" },
        { label: "Necesidad", type: "budget" },
        { label: "Acuerdo", type: "chat" },
      ],
    },
  };
  return (
    contexts[dimension?.id] || {
      title: question.type || "Situacion financiera",
      copy: "Lee el contexto y reconoce la informacion clave para decidir.",
      tags: [question.competence || "criterio", question.difficulty || "lectura"],
      thumbnails: [
        { label: "Contexto", type: question.visual?.type || "decision" },
        { label: "Decision", type: "decision" },
      ],
    }
  );
}

function renderInlineThumbnail(thumbnail, fallbackType) {
  const type = thumbnail.type || fallbackType || "decision";
  return `
    <span class="inline-thumbnail ${type}-thumbnail">
      ${renderThumbnailGlyph(type)}
      <b>${escapeHtml(thumbnail.label)}</b>
    </span>
  `;
}

function renderThumbnailGlyph(type) {
  if (type === "chat") {
    return `
      <i class="mini-bubble wide"></i>
      <i class="mini-bubble short"></i>
    `;
  }
  if (type === "installments") {
    return `
      <i class="mini-bar tall"></i>
      <i class="mini-bar"></i>
      <i class="mini-bar low"></i>
    `;
  }
  if (type === "budget" || type === "cashbook") {
    return `
      <i class="mini-pie"></i>
      <i class="mini-line"></i>
    `;
  }
  if (type === "receipt") {
    return `
      <i class="mini-row"></i>
      <i class="mini-row short"></i>
      <i class="mini-total"></i>
    `;
  }
  return `
    <i class="mini-node"></i>
    <i class="mini-path"></i>
    <i class="mini-node strong"></i>
  `;
}

function renderStudentAnswerBubble(question, selected) {
  if (selected === undefined || selected === null) return "";
  const option = question.options[Number(selected)];
  if (!option) return "";
  return `
    <div class="student-answer-message chat-message">
      <span>Tu respuesta</span>
      <p>${String.fromCharCode(65 + Number(selected))}. ${escapeHtml(option)}</p>
    </div>
  `;
}

function renderDiagnosticTypingIndicator() {
  return `
    <div class="diagnostic-message chat-message chat-typing-message">
      <span>Preparando siguiente situacion</span>
      <div class="typing-dots" aria-label="El diagnostico esta preparando la siguiente pregunta">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
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
          <button class="button" data-internal-section="report">Ver reporte tecnico</button>
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
        <button class="button" data-internal-section="report">Ver reporte tecnico</button>
        <button class="button secondary" data-internal-section="qa">Cambiar escenario QA</button>
      </div>
    </section>
  `;
}

function renderInternalWorkbench() {
  const activeSection = state.internalSection || "qa";
  return `
    <section class="panel soft">
      <p class="kicker">Workbench interno</p>
      <h2 class="headline">Herramientas para revisar, simular y operar la demo.</h2>
      <p class="lead">Esta zona no es la vista principal para colegios. Reune QA, sesion simulada y reporte tecnico para el equipo de producto, pedagogia y comercial.</p>
      <div class="subtabs">
        ${subtab("qa", "QA 300 estudiantes", activeSection)}
        ${subtab("session", "Sesion colegio", activeSection)}
        ${subtab("report", "Reporte tecnico", activeSection)}
      </div>
    </section>
    ${activeSection === "session" ? renderSessionDashboard() : ""}
    ${activeSection === "report" ? renderTechnicalReport() : ""}
    ${activeSection === "qa" ? renderQa() : ""}
  `;
}

function renderTechnicalReport() {
  return `
    <section class="report-section">
      <p class="kicker">Reporte tecnico</p>
      <h3>Lectura cruda para validacion interna</h3>
      <p class="lead">Usa esta vista para revisar scoring, dimensiones, brechas, piloto recomendado y lectura decisional sin presentarla como demo comercial principal.</p>
    </section>
    ${renderReport(state.studentReport || state.cohortResult.report, state.studentReport ? "individual" : "cohort")}
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
        <p class="kicker">Lectura decisional</p>
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

function renderInstitutionalDemo() {
  const demo = state.institutionalDemo;
  const report = demo.report;
  const companion = buildDecisionCompanion(report);
  const pilotPath = buildPilotPath(report);
  const isInternal = state.demoAudience === "internal";
  return `
    <section class="institutional-hero">
      <div>
        <p class="kicker">Demo institucional V1.3</p>
        <h2 class="headline">${demo.school}</h2>
        <p class="lead">${demo.summary}</p>
        <div class="demo-meta">
          <span>${demo.city}</span>
          <span>${demo.grades}</span>
          <span>${demo.completed}/${demo.expected} estudiantes finalizaron</span>
        </div>
        <div class="view-toggle" role="group" aria-label="Cambiar audiencia de la demo">
          <button class="${!isInternal ? "active" : ""}" data-demo-audience="school">Vista colegio</button>
          <button class="${isInternal ? "active" : ""}" data-demo-audience="internal">Vista interna</button>
        </div>
      </div>
      <aside class="decision-card">
        ${
          isInternal
            ? `
              <p class="kicker">Uso interno</p>
              <h3>${demo.internal.title}</h3>
              <p>${demo.internal.opportunity}</p>
              <button class="button" data-copy-id="commercial">Copiar mensaje comercial</button>
            `
            : `
              <p class="kicker">Decision sugerida</p>
              <h3>${report.pilotRecommendation.name}</h3>
              <p>${report.pilotRecommendation.reason}</p>
              <button class="button" data-copy-id="executive">Copiar resumen para rectoria</button>
            `
        }
      </aside>
    </section>

    ${isInternal ? renderInternalDemoView(demo, companion) : renderSchoolDemoView(demo, report, pilotPath)}
  `;
}

function renderSchoolDemoView(demo, report, pilotPath) {
  return `
    <section class="demo-grid">
      <article class="report-section">
        <p class="kicker">Resultado institucional</p>
        <div class="metrics">
          <div class="metric"><p class="metric-value">${report.percent}%</p><p class="metric-label">Resultado general</p></div>
          <div class="metric"><p class="metric-value">${report.level.name}</p><p class="metric-label">Nivel</p></div>
          <div class="metric"><p class="metric-value">${report.count}</p><p class="metric-label">Respuestas validas</p></div>
        </div>
        <p class="lead">${report.level.description}</p>
      </article>

      <article class="report-section">
        <p class="kicker">Resumen para rectoria</p>
        <h3>${demo.executive.title}</h3>
        <p>${demo.executive.body}</p>
        <div class="decision-strip">
          <span>Riesgo educativo: ${demo.executive.risk}</span>
          <span>Decision: ${demo.executive.decision}</span>
        </div>
      </article>
    </section>

    <section class="report-section">
      <div class="section-heading">
        <div>
          <p class="kicker">Comparacion por grupos</p>
          <h3>Lectura institucional simulada</h3>
        </div>
      </div>
      <div class="group-grid">
        ${demo.groups.map(renderGroupCard).join("")}
      </div>
    </section>

    <section class="report-grid school-view-grid">
      <div>
        <article class="report-section">
          <p class="kicker">Lectura pedagogica</p>
          <h3>${demo.pedagogical.title}</h3>
          <div class="bar-list">${report.dimensions.map(renderDimensionBar).join("")}</div>
          <div class="insight-grid">
            ${demo.pedagogical.insights.map((insight) => `<div class="insight-card"><strong>${insight.title}</strong><p>${insight.body}</p></div>`).join("")}
          </div>
        </article>
      </div>
      <aside class="report-section">
        <p class="kicker">Ruta de decision</p>
        <h3>De evidencia a piloto</h3>
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
      </aside>
    </section>
  `;
}

function renderInternalDemoView(demo, companion) {
  return `
    <section class="report-grid">
      <div>
        <article class="report-section">
          <p class="kicker">Lectura interna</p>
          <h3>Preparacion de conversacion comercial</h3>
          <div class="internal-summary-grid">
            <div class="commercial-score">
              <span>Nivel de urgencia</span>
              <strong>${demo.internal.urgency}</strong>
            </div>
            <div class="commercial-score">
              <span>Decision buscada</span>
              <strong>Piloto</strong>
            </div>
          </div>
          <div class="companion-list">
            <div class="companion-item"><strong>Oportunidad</strong><span>${demo.internal.opportunity}</span></div>
            <div class="companion-item"><strong>Objeciones probables</strong><span>${demo.internal.objections}</span></div>
            <div class="companion-item"><strong>Mensaje para Leonardo</strong><span>${demo.internal.message}</span></div>
            <div class="companion-item"><strong>Validacion de Camilo</strong><span>${demo.internal.camilo}</span></div>
            <div class="companion-item"><strong>Preparacion de Juan Carlos</strong><span>${demo.internal.juan}</span></div>
            <div class="companion-item"><strong>Siguiente accion</strong><span>${demo.internal.nextAction}</span></div>
          </div>
        </article>

        <article class="report-section">
          <p class="kicker">Guion de reunion</p>
          <h3>Lectura de resultados en 30 a 45 minutos</h3>
          <div class="meeting-flow">
            ${demo.meetingScript.map((item, index) => `<div><span>${index + 1}</span><strong>${item}</strong></div>`).join("")}
          </div>
        </article>
      </div>

      <aside class="internal-panel">
        <p class="kicker">Companion interno</p>
        <h3>Argumentos desde evidencia</h3>
        <ul class="list">
          <li>${companion.mainGap}</li>
          <li>${companion.whyItMatters}</li>
          <li>${companion.nextStep}</li>
        </ul>
        <div class="actions">
          <button class="button" data-copy-id="commercial">Copiar mensaje comercial</button>
        </div>
      </aside>
    </section>
  `;
}

function renderFloatingCompanionButton() {
  if (state.companionOpen || !shouldShowFloatingCompanion()) return "";
  return `
    <button class="floating-companion-button" data-open-companion aria-label="Abrir Companion IA">
      <span class="floating-ai-mark" aria-hidden="true"></span>
    </button>
  `;
}

function shouldShowFloatingCompanion() {
  if (state.view === "demo" || state.view === "interno") return true;
  return state.view === "prueba" && state.quizStage === "done";
}

function renderCompanionModal() {
  if (!state.companionOpen) return "";
  const suggestions = getCompanionSuggestions(state.demoAudience);
  const voiceStatus = state.companionRecording
    ? "Grabando pregunta. Cuando termines, presiona Enviar."
    : state.companionTranscribing
      ? "Transcribiendo y enviando pregunta..."
      : state.companionVoiceError;
  const sendLabel = state.companionRecording ? "Enviar audio" : "Enviar";
  return `
    <div class="modal-backdrop" data-close-companion>
      <section class="companion-modal" role="dialog" aria-modal="true" aria-label="Companion del diagnostico" data-modal-panel>
        <header class="companion-modal-header">
          <div>
            <p class="kicker">Companion institucional</p>
            <h2>Interpreta resultados, brechas y ruta a piloto</h2>
            <p>Vista activa: ${state.demoAudience === "internal" ? "interna" : "colegio"}. Responde con contexto del diagnostico, OECD/PISA y evidencia del reporte.</p>
          </div>
          <button class="icon-button close-button" data-close-companion aria-label="Cerrar Companion">×</button>
        </header>

        <div class="suggestion-pills">
          ${suggestions.map((question) => `<button data-companion-question="${escapeHtml(question)}">${escapeHtml(question)}</button>`).join("")}
        </div>

        <div class="companion-thread">
          ${
            state.companionMessages.length
              ? state.companionMessages.map(renderCompanionMessage).join("")
              : `<div class="companion-empty">Haz una pregunta sobre el reporte, la prueba, las brechas, el marco OECD/PISA o la ruta hacia piloto.</div>`
          }
          ${state.companionLoading ? renderTypingIndicator() : ""}
        </div>

        <form class="companion-form" id="companionForm">
          <div class="companion-input-wrap">
            <textarea id="companionInput" rows="3" placeholder="Pregunta al Companion...">${escapeHtml(state.companionDraft)}</textarea>
            <button class="voice-button ${state.companionRecording ? "recording" : ""}" type="button" id="companionVoiceButton" ${state.companionLoading || state.companionTranscribing || state.companionRecording ? "disabled" : ""} aria-label="${state.companionRecording ? "Grabacion en curso" : "Dictar pregunta por microfono"}">
              <span aria-hidden="true"></span>
            </button>
          </div>
          <button class="button" ${state.companionLoading || state.companionTranscribing ? "disabled" : ""}>${sendLabel}</button>
        </form>
        ${voiceStatus ? `<p class="voice-status ${state.companionVoiceError ? "error" : ""}">${escapeHtml(voiceStatus)}</p>` : ""}
        <p class="companion-scope">El Companion no reemplaza criterio pedagogico ni inventa resultados. Orienta decisiones con base en el diagnostico.</p>
      </section>
    </div>
  `;
}

function renderCompanionMessage(message) {
  const content = message.role === "assistant" ? renderCompanionMarkdown(message.content) : `<p>${escapeHtml(message.content)}</p>`;
  return `
    <div class="companion-message ${message.role}">
      <strong>${message.role === "assistant" ? "Companion" : "Usuario"}</strong>
      <div class="companion-message-content">${content}</div>
    </div>
  `;
}

function renderTypingIndicator() {
  return `
    <div class="companion-message assistant typing-message" aria-live="polite">
      <strong>Companion</strong>
      <div class="typing-dots" aria-label="El Companion esta escribiendo">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  `;
}

function renderGroupCard(group) {
  const tone = group.report.percent <= 45 ? "risk" : group.report.percent <= 60 ? "watch" : "strong";
  return `
    <div class="group-card ${tone}">
      <div class="group-card-top">
        <strong>${group.name}</strong>
        <span>${group.completed}/${group.expected}</span>
      </div>
      <p class="group-score">${group.report.percent}%</p>
      <p>${group.reading}</p>
      <div class="mini-bar"><span style="width:${group.report.percent}%"></span></div>
    </div>
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

function buildQuestionConversation(question, dimension) {
  const parts = splitPrompt(question.prompt);
  return {
    intro: getConversationIntro(question, dimension),
    caseText: parts.caseText,
    questionText: parts.questionText,
  };
}

function splitPrompt(prompt) {
  const normalized = String(prompt || "").trim();
  const questionStart = normalized.lastIndexOf("¿");
  if (questionStart > 0) {
    return {
      caseText: normalized.slice(0, questionStart).trim(),
      questionText: normalized.slice(questionStart).trim(),
    };
  }
  return {
    caseText: normalized,
    questionText: "Selecciona la opcion que responda mejor a esta situacion.",
  };
}

function getConversationIntro(question, dimension) {
  const dimensionIntro = {
    "dinero-transacciones": "Vas a revisar una situacion de compra, pago o comprobante.",
    "presupuesto-planificacion": "Vas a analizar una decision de presupuesto, ahorro o priorizacion.",
    "credito-deuda": "Vas a comparar una decision relacionada con cuotas, deuda o costo total.",
    "riesgo-digital": "Vas a evaluar una situacion digital donde conviene verificar antes de decidir.",
    "trabajo-empresa": "Vas a revisar una situacion de ingresos, costos o manejo de dinero en un emprendimiento.",
    "hogar-ciudadania": "Vas a analizar una decision financiera conectada con el hogar o la vida en comunidad.",
  };
  return `${dimensionIntro[question.dimension] || "Vas a resolver una situacion financiera."} Responde con calma; esta es una prueba diagnostica, no una conversacion libre.`;
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

  document.querySelectorAll("[data-internal-section]").forEach((button) => {
    button.addEventListener("click", () => {
      state.internalSection = button.dataset.internalSection;
      state.view = "interno";
      render();
    });
  });

  document.querySelectorAll("[data-quiz-stage]").forEach((button) => {
    button.addEventListener("click", () => {
      state.quizStage = button.dataset.quizStage;
      state.questionTransition = false;
      render();
    });
  });

  document.querySelectorAll("[data-scenario]").forEach((button) => {
    button.addEventListener("click", () => {
      state.cohortResult = simulateCohort(300, button.dataset.scenario);
      render();
    });
  });

  document.querySelectorAll("[data-demo-audience]").forEach((button) => {
    button.addEventListener("click", () => {
      state.demoAudience = button.dataset.demoAudience;
      render();
    });
  });

  document.querySelectorAll("[data-open-companion]").forEach((button) => {
    button.addEventListener("click", () => {
      state.companionVoiceError = "";
      state.companionOpen = true;
      render();
    });
  });

  document.querySelectorAll("[data-close-companion]").forEach((element) => {
    element.addEventListener("click", () => {
      cancelCompanionVoiceCapture();
      state.companionOpen = false;
      render();
    });
  });

  const modalPanel = document.querySelector("[data-modal-panel]");
  if (modalPanel) {
    modalPanel.addEventListener("click", (event) => event.stopPropagation());
  }

  document.querySelectorAll("[data-companion-question]").forEach((button) => {
    button.addEventListener("click", () => {
      askCompanion(button.dataset.companionQuestion);
    });
  });

  const companionForm = document.querySelector("#companionForm");
  if (companionForm) {
    companionForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (state.companionRecording) {
        stopCompanionVoiceRecording();
        return;
      }
      const input = document.querySelector("#companionInput");
      askCompanion(input?.value || "");
    });
  }

  const companionInput = document.querySelector("#companionInput");
  if (companionInput) {
    companionInput.addEventListener("input", () => {
      state.companionDraft = companionInput.value;
    });
  }

  const companionVoiceButton = document.querySelector("#companionVoiceButton");
  if (companionVoiceButton) {
    companionVoiceButton.addEventListener("click", () => {
      if (state.companionRecording) {
        return;
      }
      startCompanionVoiceRecording();
    });
  }

  document.querySelectorAll("[data-jump]").forEach((button) => {
    button.addEventListener("click", () => {
      const questionId = Number(button.dataset.jump);
      const index = QUESTIONS.findIndex((question) => question.id === questionId);
      if (index >= 0) {
        state.currentIndex = index;
        state.revealedIndex = Math.max(state.revealedIndex, index);
        state.questionTransition = false;
        state.quizStage = "question";
        render();
      }
    });
  });

  document.querySelectorAll("[data-answer-option]").forEach((button) => {
    button.addEventListener("click", () => {
      if (state.questionTransition) return;
      handleAnswerSelection(Number(button.dataset.answerOption));
    });
  });

  const saveMeta = document.querySelector("#saveMeta");
  if (saveMeta) {
    saveMeta.addEventListener("click", () => {
      state.meta = readMeta();
      state.quizStage = "question";
      state.currentIndex = 0;
      state.revealedIndex = 0;
      state.questionTransition = false;
      render();
    });
  }

  const prevQuestion = document.querySelector("#prevQuestion");
  if (prevQuestion) {
    prevQuestion.addEventListener("click", () => {
      if (state.questionTransition) return;
      state.currentIndex = Math.max(0, state.currentIndex - 1);
      state.questionTransition = false;
      render();
    });
  }

  const nextQuestion = document.querySelector("#nextQuestion");
  if (nextQuestion) {
    nextQuestion.addEventListener("click", () => {
      if (state.questionTransition) return;
      if (state.currentIndex < state.revealedIndex) {
        state.currentIndex = state.revealedIndex;
        render();
      }
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
      state.revealedIndex = 0;
      state.questionTransition = false;
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
      state.currentIndex = QUESTIONS.length - 1;
      state.revealedIndex = QUESTIONS.length - 1;
      state.questionTransition = false;
      state.quizStage = "review";
      render();
    });
  }

  document.querySelectorAll("[data-edit-question]").forEach((button) => {
    button.addEventListener("click", () => {
      if (state.questionTransition) return;
      const questionId = Number(button.dataset.editQuestion);
      const index = QUESTIONS.findIndex((question) => question.id === questionId);
      if (index >= 0) {
        state.currentIndex = index;
        state.quizStage = "question";
        render();
      }
    });
  });

  document.querySelectorAll("[data-copy-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const text = getDemoCopyText(button.dataset.copyId);
      copyText(text);
      button.textContent = "Copiado";
      window.setTimeout(() => render(), 900);
    });
  });
}

function handleAnswerSelection(answerIndex) {
  const question = QUESTIONS[state.currentIndex];
  state.answers[question.id] = answerIndex;

  if (state.currentIndex < state.revealedIndex) {
    render();
    return;
  }

  state.questionTransition = true;
  render();
  window.setTimeout(() => {
    if (state.currentIndex === QUESTIONS.length - 1) {
      state.questionTransition = false;
      state.quizStage = "review";
      render();
      return;
    }

    const nextIndex = state.currentIndex + 1;
    state.currentIndex = nextIndex;
    state.revealedIndex = Math.max(state.revealedIndex, nextIndex);
    state.questionTransition = false;
    render();
  }, 720);
}

function scrollConversationThread() {
  const thread = document.querySelector(".chat-thread");
  if (!thread) return;
  window.requestAnimationFrame(() => {
    const activeExchange = thread.querySelector("[data-active-exchange]");
    if (state.questionTransition) {
      thread.scrollTop = thread.scrollHeight;
      return;
    }
    if (activeExchange) {
      thread.scrollTop = Math.max(0, activeExchange.offsetTop - thread.offsetTop - 8);
      return;
    }
    thread.scrollTop = thread.scrollHeight;
  });
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

function subtab(section, label, activeSection) {
  return `<button class="subtab ${activeSection === section ? "active" : ""}" data-internal-section="${section}">${label}</button>`;
}

async function askCompanion(rawQuestion) {
  const question = String(rawQuestion || "").trim();
  if (!question || state.companionLoading) return;

  state.companionMessages = [...state.companionMessages, { role: "user", content: question }];
  state.companionLoading = true;
  state.companionDraft = "";
  render();

  try {
    const response = await fetch("/api/companion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        audience: state.demoAudience,
        question,
        messages: state.companionMessages.slice(-6),
        reportContext: buildCompanionContext(),
      }),
    });
    const data = await response.json();
    const answer = response.ok ? data.answer : data.fallback || data.error || buildLocalCompanionReply(question);
    state.companionMessages = [...state.companionMessages, { role: "assistant", content: answer }];
  } catch (error) {
    state.companionMessages = [...state.companionMessages, { role: "assistant", content: buildLocalCompanionReply(question) }];
  } finally {
    state.companionLoading = false;
    render();
  }
}

async function startCompanionVoiceRecording() {
  if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
    state.companionVoiceError = "Este navegador no permite grabacion de audio desde la pagina.";
    render();
    return;
  }

  try {
    state.companionVoiceError = "";
    companionAudioChunks = [];
    companionDiscardRecording = false;
    companionAudioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mimeType = getSupportedAudioMimeType();
    companionMediaRecorder = mimeType
      ? new MediaRecorder(companionAudioStream, { mimeType })
      : new MediaRecorder(companionAudioStream);

    companionMediaRecorder.addEventListener("dataavailable", (event) => {
      if (event.data?.size) companionAudioChunks.push(event.data);
    });

    companionMediaRecorder.addEventListener("stop", () => {
      if (companionDiscardRecording) {
        cleanupCompanionAudioStream();
        companionAudioChunks = [];
        companionDiscardRecording = false;
        return;
      }
      const mimeType = companionMediaRecorder?.mimeType || "audio/webm";
      const audioBlob = new Blob(companionAudioChunks, { type: mimeType });
      cleanupCompanionAudioStream();
      transcribeCompanionAudio(audioBlob);
    });

    companionMediaRecorder.start();
    state.companionRecording = true;
    render();
  } catch (error) {
    cleanupCompanionAudioStream();
    state.companionRecording = false;
    state.companionVoiceError = "No fue posible activar el microfono. Revisa permisos del navegador.";
    render();
  }
}

function stopCompanionVoiceRecording() {
  if (!companionMediaRecorder || companionMediaRecorder.state === "inactive") return;
  state.companionRecording = false;
  state.companionTranscribing = true;
  state.companionVoiceError = "";
  companionMediaRecorder.stop();
  render();
}

async function transcribeCompanionAudio(audioBlob) {
  if (!audioBlob.size) {
    state.companionTranscribing = false;
    state.companionVoiceError = "No se detecto audio para transcribir.";
    render();
    return;
  }

  try {
    const audio = await blobToBase64(audioBlob);
    const response = await fetch("/api/transcribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        audio,
        mimeType: audioBlob.type || "audio/webm",
      }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || data.detail || "No fue posible transcribir el audio.");

    const transcript = String(data.text || "").trim();
    state.companionTranscribing = false;
    state.companionVoiceError = "";
    if (!transcript) {
      state.companionVoiceError = "No se detecto una pregunta clara para enviar.";
      render();
      return;
    }
    askCompanion(transcript);
  } catch (error) {
    state.companionTranscribing = false;
    state.companionVoiceError = error.message || "No fue posible transcribir el audio.";
    render();
  }
}

function getSupportedAudioMimeType() {
  const candidates = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"];
  return candidates.find((type) => MediaRecorder.isTypeSupported(type)) || "";
}

function cleanupCompanionAudioStream() {
  companionAudioStream?.getTracks().forEach((track) => track.stop());
  companionAudioStream = null;
  companionMediaRecorder = null;
}

function cancelCompanionVoiceCapture() {
  if (companionMediaRecorder && companionMediaRecorder.state !== "inactive") {
    companionDiscardRecording = true;
    try {
      companionMediaRecorder.stop();
    } catch (error) {
      // The recorder may already be stopping; cleanup below is still safe.
      companionDiscardRecording = false;
    }
  }
  cleanupCompanionAudioStream();
  companionAudioChunks = [];
  state.companionRecording = false;
  state.companionTranscribing = false;
  state.companionVoiceError = "";
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = String(reader.result || "");
      resolve(result.includes(",") ? result.split(",")[1] : result);
    };
    reader.onerror = () => reject(new Error("No fue posible leer el audio grabado."));
    reader.readAsDataURL(blob);
  });
}

function getCompanionSuggestions(audience) {
  if (audience === "internal") {
    return [
      "¿Cuál es la oportunidad comercial más clara?",
      "¿Qué objeciones puede tener el colegio?",
      "¿Qué debería decir Leonardo en la reunión?",
      "¿Qué piloto conviene proponer y por qué?",
    ];
  }
  return [
    "¿Qué significa este resultado para el colegio?",
    "¿Cuál es la brecha principal?",
    "¿Cómo se relaciona esto con OECD/PISA?",
    "¿Qué piloto recomienda el diagnóstico?",
  ];
}

function buildCompanionContext() {
  const demo = state.institutionalDemo;
  const report = demo.report;
  return {
    product: "Diagnostico Escolar de Competencias Financieras",
    audience: state.demoAudience,
    school: demo.school,
    city: demo.city,
    grades: demo.grades,
    result: {
      percent: report.percent,
      level: report.level,
      count: report.count,
      dimensions: report.dimensions.map((dimension) => ({
        id: dimension.id,
        name: dimension.name,
        percent: dimension.percent,
        status: dimension.status.name,
      })),
      gaps: report.gaps.map((gap) => ({
        id: gap.id,
        name: gap.name,
        percent: gap.percent,
        status: gap.status.name,
      })),
      strengths: report.strengths.map((item) => ({
        id: item.id,
        name: item.name,
        percent: item.percent,
      })),
      pilot: report.pilotRecommendation,
    },
    groupComparison: demo.groups.map((group) => ({
      group: group.name,
      percent: group.report.percent,
      level: group.report.level.name,
      reading: group.reading,
    })),
    executive: demo.executive,
    internal: demo.internal,
    contextNotes: [
      "El diagnostico se inspira en alfabetizacion financiera juvenil y en evaluacion por situaciones reales.",
      "Puede mencionar OECD/PISA como marco de referencia conceptual, no como certificacion oficial.",
      "La escalera de valor es diagnostico, reporte, piloto e implementacion.",
    ],
  };
}

function buildLocalCompanionReply(question) {
  const demo = state.institutionalDemo;
  const report = demo.report;
  const mainGap = report.gaps[0];
  const pilot = report.pilotRecommendation;
  const prefix =
    state.demoAudience === "internal"
      ? "Lectura interna: "
      : "Lectura institucional: ";

  if (/pisa|oecd|ocde/i.test(question)) {
    return `${prefix}el diagnostico usa OECD/PISA como referencia conceptual para evaluar competencias financieras en situaciones reales. No debe presentarse como prueba PISA oficial ni certificada por OECD. Sirve para convertir evidencia escolar en una ruta pedagogica hacia piloto.`;
  }
  if (/brecha|debil/i.test(question)) {
    return `${prefix}la brecha principal es ${mainGap?.name || "la dimension con menor desempeno"}, con ${mainGap?.percent ?? report.percent}%. Esta lectura debe conectarse con una intervencion focalizada y medible.`;
  }
  if (/piloto|siguiente/i.test(question)) {
    return `${prefix}el piloto recomendado es ${pilot.name}. ${pilot.reason} El siguiente paso razonable es una reunion de lectura para definir grupo, calendario y medicion antes/despues.`;
  }
  return `${prefix}el grupo esta en nivel ${report.level.name} con ${report.percent}%. El Companion debe ayudar a interpretar este resultado, explicar brechas y orientar la decision hacia un piloto proporcional a la evidencia.`;
}

function buildInstitutionalDemo() {
  const simulated = simulateCohort(300, "baseline", 20260418);
  const school = "Colegio San Gabriel de la Sabana";
  const city = "Bogota";
  const report = summarizeCohort(simulated.students, {
    school,
    city,
    grades: "8 a 11",
    mode: "Demo institucional V1.3",
  });
  const groupConfig = [
    { grade: 8, expected: 80, reading: "Necesita fortalecer fundamentos, presupuesto y lectura de comprobantes." },
    { grade: 9, expected: 80, reading: "Comprende situaciones basicas, pero requiere trabajo en riesgo digital." },
    { grade: 10, expected: 80, reading: "Tiene bases para piloto focalizado en credito, deuda y decisiones." },
    { grade: 11, expected: 80, reading: "Puede avanzar hacia profundizacion aplicada y proyecto de vida financiera." },
  ];
  const groups = groupConfig.map((item) => {
    const students = simulated.students.filter((student) => Number(student.meta.grade) === item.grade);
    return {
      name: `${item.grade}A`,
      expected: item.expected,
      completed: students.length,
      reading: item.reading,
      report: summarizeCohort(students, {
        school,
        group: `${item.grade}A`,
      }),
    };
  });

  const mainGap = report.gaps[0] || report.dimensions[0];
  return {
    school,
    city,
    grades: "Grados 8, 9, 10 y 11",
    expected: 320,
    completed: simulated.students.length,
    report,
    groups,
    summary:
      "Escenario ficticio para mostrar como el diagnostico convierte respuestas de estudiantes en una lectura institucional accionable.",
    executive: {
      title: "El colegio tiene una base inicial, pero la evidencia justifica un piloto focalizado.",
      body: `El resultado general ubica al grupo en nivel ${report.level.name}. La principal brecha aparece en ${mainGap.name}, lo que sugiere iniciar una intervencion corta, medible y orientada a decisiones financieras reales.`,
      risk: "Los estudiantes pueden comprender situaciones simples, pero fallar al comparar alternativas, anticipar consecuencias o detectar riesgos.",
      decision: "Avanzar a piloto con medicion antes/despues.",
    },
    pedagogical: {
      title: "La necesidad no es solo conceptual: es de criterio aplicado.",
      insights: [
        {
          title: "Brecha prioritaria",
          body: `${mainGap.name} aparece como el foco que mas puede afectar decisiones cotidianas de los estudiantes.`,
        },
        {
          title: "Intervencion sugerida",
          body: "Trabajar con casos situacionales, visuales de decision y ejercicios cortos de comparacion antes/despues.",
        },
        {
          title: "Medicion de avance",
          body: "Aplicar una medicion corta posterior al piloto para comparar brecha inicial y avance por grupo.",
        },
      ],
    },
    internal: {
      title: "Lectura para preparar conversacion",
      urgency: "Media alta",
      opportunity:
        "El colegio puede reconocer la necesidad sin sentirse obligado a comprar todo el curso desde la primera reunion.",
      objections:
        "Tiempo de aplicacion, carga para docentes, privacidad de datos y claridad sobre beneficios para padres.",
      message:
        "La propuesta no es empezar por una implementacion grande, sino validar una ruta corta con evidencia: diagnostico, piloto y medicion de avance.",
      camilo:
        "Validar que la lectura pedagogica y el piloto recomendado representan correctamente la historia y capacidad actual del curso.",
      juan:
        "Preparar demo, resumen ejecutivo, guion de resultados y version visual del reporte para reunion institucional.",
      nextAction:
        "Agendar reunion de lectura y proponer piloto focalizado con un grado o muestra controlada.",
    },
    meetingScript: [
      "Contexto del diagnostico y alcance de la muestra.",
      "Resultado general y nivel institucional.",
      "Brechas principales por dimension.",
      "Comparacion por grupos.",
      "Implicacion pedagogica.",
      "Piloto recomendado y medicion de avance.",
      "Decision de siguiente paso.",
    ],
  };
}

function getDemoCopyText(id) {
  const demo = state.institutionalDemo;
  if (id === "commercial") {
    return `Mensaje comercial sugerido: ${demo.internal.message} Siguiente accion: ${demo.internal.nextAction}`;
  }
  return `${demo.school}. ${demo.executive.title} ${demo.executive.body} Decision sugerida: ${demo.executive.decision}`;
}

function copyText(text) {
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text);
    return;
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

function renderCompanionMarkdown(value) {
  const lines = String(value || "").split(/\r?\n/);
  const blocks = [];
  let paragraph = [];
  let list = [];

  const flushParagraph = () => {
    if (!paragraph.length) return;
    blocks.push(`<p>${formatInlineMarkdown(paragraph.join(" "))}</p>`);
    paragraph = [];
  };

  const flushList = () => {
    if (!list.length) return;
    blocks.push(`<ul>${list.map((item) => `<li>${formatInlineMarkdown(item)}</li>`).join("")}</ul>`);
    list = [];
  };

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) {
      flushParagraph();
      flushList();
      return;
    }

    const bullet = trimmed.match(/^[-*]\s+(.+)$/);
    if (bullet) {
      flushParagraph();
      list.push(bullet[1]);
      return;
    }

    flushList();
    paragraph.push(trimmed);
  });

  flushParagraph();
  flushList();

  return blocks.join("") || "<p></p>";
}

function formatInlineMarkdown(value) {
  return escapeHtml(value).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
