const OPENAI_API_URL = "https://api.openai.com/v1/responses";
const DEFAULT_MODEL = "gpt-4.1-mini";
const MAX_MESSAGES = 8;
const MAX_MESSAGE_LENGTH = 1200;

const KNOWLEDGE_BASE = `
Producto: Diagnostico Escolar de Competencias Financieras de Finanzas Desde La Escuela.
Norte: instrumento diagnostico institucional donde diseno grafico, UX, pedagogia, scoring y venta trabajan juntos.
Escalera: Diagnostico = evidencia de necesidad. Reporte vivo = evidencia convertida en decision. Piloto = evidencia de solucion. Implementacion = contrato institucional.
Audiencias: colegios privados en Colombia, rectores, coordinadores, docentes, pedagogos y equipo interno de Finanzas Desde La Escuela.
Poblacion evaluada: estudiantes de bachillerato, especialmente grados 8 a 11.
Base pedagogica: el instrumento se inspira en alfabetizacion financiera juvenil, competencias financieras, situaciones reales, toma de decisiones, uso responsable de informacion financiera, riesgo digital, presupuesto, credito, emprendimiento y hogar.
Marco internacional: PISA/OECD evalua alfabetizacion financiera como capacidad de aplicar conocimiento, habilidades y actitudes para tomar decisiones financieras en contextos reales. El diagnostico usa esta logica de situaciones y evidencias, pero no afirma ser una prueba PISA oficial.
Marco local: el diagnostico se alinea con la necesidad colombiana de educacion economica y financiera desde la escuela y con una lectura institucional util para colegios.
Dimensiones: dinero y transacciones; presupuesto y planificacion; credito, deuda y costo del dinero; riesgo, fraude y decisiones digitales; trabajo, empresa e ingresos; hogar, ciudadania y responsabilidad economica.
El reporte debe ayudar a entender resultado general, brechas, fortalezas, recomendacion de piloto, ruta de decision y siguiente paso.
El companion no vende agresivamente. Orienta a piloto cuando la evidencia lo justifica.
Limites: no diagnostica psicologicamente, no da asesoria financiera personal, no inventa datos, no promete resultados garantizados, no reemplaza criterio pedagogico, no expone datos personales.
`;

module.exports = async function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Metodo no permitido." });
    return;
  }

  if (!process.env.OPENAI_API_KEY) {
    res.status(503).json({
      error: "Companion IA no configurado.",
      fallback:
        "La interfaz esta lista, pero falta configurar OPENAI_API_KEY en Vercel para activar respuestas con LLM.",
    });
    return;
  }

  try {
    const body = await readJson(req);
    const payload = sanitizePayload(body);
    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || DEFAULT_MODEL,
        instructions: buildInstructions(payload),
        input: buildInput(payload),
        max_output_tokens: 700,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      res.status(response.status).json({
        error: "No fue posible generar respuesta del Companion.",
        detail: data?.error?.message || "Error desconocido de OpenAI.",
      });
      return;
    }

    res.status(200).json({
      answer: extractOutputText(data),
      model: data.model || process.env.OPENAI_MODEL || DEFAULT_MODEL,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error interno del Companion.",
      detail: error.message,
    });
  }
};

function setCorsHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 80_000) {
        reject(new Error("Solicitud demasiado grande."));
      }
    });
    req.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch (error) {
        reject(new Error("JSON invalido."));
      }
    });
    req.on("error", reject);
  });
}

function sanitizePayload(body) {
  const messages = Array.isArray(body.messages) ? body.messages.slice(-MAX_MESSAGES) : [];
  return {
    audience: body.audience === "internal" ? "internal" : "school",
    question: cleanText(body.question || "", MAX_MESSAGE_LENGTH),
    reportContext: body.reportContext || {},
    messages: messages.map((message) => ({
      role: message.role === "assistant" ? "assistant" : "user",
      content: cleanText(message.content || "", MAX_MESSAGE_LENGTH),
    })),
  };
}

function cleanText(value, maxLength) {
  return String(value).replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function buildInstructions(payload) {
  const audienceRule =
    payload.audience === "internal"
      ? "Estas en Vista interna. Ayudas al equipo de Finanzas Desde La Escuela a preparar conversacion comercial, detectar objeciones, orientar a Leonardo, Camilo y Juan Carlos, y convertir evidencia en siguiente accion."
      : "Estas en Vista colegio. Respondes para rectores, coordinadores, docentes o pedagogos. No uses lenguaje comercial interno ni presiones una venta.";

  return `
Eres el Companion Institucional del Diagnostico Escolar de Competencias Financieras.

${audienceRule}

Tu funcion es interpretar resultados, explicar brechas, contextualizar el diagnostico con referentes de educacion financiera como PISA/OECD, orientar decisiones pedagogicas y proponer rutas hacia piloto cuando la evidencia lo justifique.

Reglas obligatorias:
- Responde en espanol colombiano profesional, claro y sobrio.
- No inventes resultados, porcentajes, normas, citas ni datos que no esten en el contexto.
- Si falta informacion, dilo y ofrece una forma prudente de leer el reporte.
- No afirmes que la prueba es PISA oficial ni que esta certificada por OECD.
- No hagas diagnosticos individuales sensibles.
- No des asesoria financiera personal.
- No prometas mejoras garantizadas.
- Conecta la respuesta con la escalera: diagnostico, reporte, piloto, implementacion.
- El piloto debe aparecer como decision razonable basada en evidencia, no como presion comercial.
- Usa parrafos cortos y, cuando ayude, bullets breves.

Base de conocimiento:
${KNOWLEDGE_BASE}
`;
}

function buildInput(payload) {
  return [
    {
      role: "user",
      content: [
        {
          type: "input_text",
          text: JSON.stringify(
            {
              question: payload.question,
              audience: payload.audience,
              reportContext: payload.reportContext,
              recentConversation: payload.messages,
            },
            null,
            2,
          ),
        },
      ],
    },
  ];
}

function extractOutputText(data) {
  if (data.output_text) return data.output_text;
  const parts = [];
  for (const item of data.output || []) {
    for (const content of item.content || []) {
      if (content.type === "output_text" && content.text) parts.push(content.text);
    }
  }
  return parts.join("\n\n") || "No fue posible generar una respuesta en este momento.";
}
