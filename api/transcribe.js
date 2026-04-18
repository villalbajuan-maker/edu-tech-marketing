const OPENAI_TRANSCRIPTION_URL = "https://api.openai.com/v1/audio/transcriptions";
const DEFAULT_TRANSCRIPTION_MODEL = "gpt-4o-mini-transcribe";
const MAX_AUDIO_BASE64_LENGTH = 9_000_000;

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
    res.status(503).json({ error: "Transcripcion IA no configurada." });
    return;
  }

  try {
    const body = await readJson(req);
    const audio = cleanBase64(body.audio || "");
    const mimeType = cleanMimeType(body.mimeType || "audio/webm");

    if (!audio) {
      res.status(400).json({ error: "No se recibio audio para transcribir." });
      return;
    }

    if (audio.length > MAX_AUDIO_BASE64_LENGTH) {
      res.status(413).json({ error: "Audio demasiado grande para esta version del Companion." });
      return;
    }

    const buffer = Buffer.from(audio, "base64");
    const form = new FormData();
    form.append("file", new Blob([buffer], { type: mimeType }), getAudioFilename(mimeType));
    form.append("model", process.env.OPENAI_TRANSCRIPTION_MODEL || DEFAULT_TRANSCRIPTION_MODEL);
    form.append("response_format", "json");
    form.append("language", "es");
    form.append("prompt", "Pregunta en espanol colombiano sobre un diagnostico escolar de competencias financieras.");

    const response = await fetch(OPENAI_TRANSCRIPTION_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: form,
    });

    const data = await response.json();
    if (!response.ok) {
      res.status(response.status).json({
        error: "No fue posible transcribir el audio.",
        detail: data?.error?.message || "Error desconocido de OpenAI.",
      });
      return;
    }

    res.status(200).json({ text: String(data.text || "").trim() });
  } catch (error) {
    res.status(500).json({
      error: "Error interno de transcripcion.",
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
      if (raw.length > MAX_AUDIO_BASE64_LENGTH + 20_000) {
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

function cleanBase64(value) {
  return String(value).replace(/^data:audio\/[a-z0-9.+-]+;base64,/i, "").replace(/\s+/g, "");
}

function cleanMimeType(value) {
  const mimeType = String(value).toLowerCase();
  if (mimeType.includes("mp4")) return "audio/mp4";
  if (mimeType.includes("mpeg")) return "audio/mpeg";
  if (mimeType.includes("mp3")) return "audio/mp3";
  if (mimeType.includes("m4a")) return "audio/m4a";
  if (mimeType.includes("wav")) return "audio/wav";
  return "audio/webm";
}

function getAudioFilename(mimeType) {
  if (mimeType.includes("mp4")) return "companion-question.mp4";
  if (mimeType.includes("mpeg") || mimeType.includes("mp3")) return "companion-question.mp3";
  if (mimeType.includes("m4a")) return "companion-question.m4a";
  if (mimeType.includes("wav")) return "companion-question.wav";
  return "companion-question.webm";
}
