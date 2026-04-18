const UNSPLASH_API_URL = "https://api.unsplash.com/search/photos";
const DEFAULT_QUERY = "financial education students";

const QUERY_BY_TYPE = {
  receipt: "receipt payment shopping",
  budget: "budget planning notebook",
  installments: "calculator payment plan",
  chat: "student phone online security",
  cashbook: "small business cash register",
  decision: "student decision planning",
};

module.exports = async function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "GET") {
    res.status(405).json({ error: "Metodo no permitido." });
    return;
  }

  if (!process.env.UNSPLASH_ACCESS_KEY) {
    res.status(204).end();
    return;
  }

  try {
    const type = cleanText(req.query?.type || "");
    const explicitQuery = cleanText(req.query?.query || "");
    const query = explicitQuery || QUERY_BY_TYPE[type] || DEFAULT_QUERY;
    const url = new URL(UNSPLASH_API_URL);
    url.searchParams.set("query", query);
    url.searchParams.set("orientation", "landscape");
    url.searchParams.set("per_page", "1");
    url.searchParams.set("content_filter", "high");

    const response = await fetch(url, {
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
        "Accept-Version": "v1",
      },
    });

    const data = await response.json();
    const photo = Array.isArray(data.results) ? data.results[0] : null;

    if (!response.ok || !photo?.urls?.small) {
      res.status(response.status || 404).json({ error: "No fue posible obtener imagen diagnostica." });
      return;
    }

    res.status(200).json({
      imageUrl: photo.urls.small,
      thumbUrl: photo.urls.thumb || photo.urls.small,
      credit: `Foto: ${photo.user?.name || "Unsplash"}`,
      source: "Unsplash",
      sourceUrl: addUtm(photo.links?.html || "https://unsplash.com/"),
    });
  } catch (error) {
    res.status(500).json({
      error: "Error consultando imagen diagnostica.",
      detail: error.message,
    });
  }
};

function setCorsHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function cleanText(value) {
  return String(value || "")
    .replace(/[^\w\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
}

function addUtm(url) {
  const parsed = new URL(url);
  parsed.searchParams.set("utm_source", "edu_tech_marketing");
  parsed.searchParams.set("utm_medium", "referral");
  return parsed.toString();
}
