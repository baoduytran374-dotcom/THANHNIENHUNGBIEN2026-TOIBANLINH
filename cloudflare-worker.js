const PROJECT_ID = "thanhnienhungbien2026--copy";
const ADMIN_UID = "D004TN6x8CM3CryRpiY6kfPjQyG2";
const CLOUDINARY_CLOUD = "dutow0ng";
const CLOUDINARY_PRESET = "toi_ban_linh_2026";
const FOLDER = "toi-ban-linh-2026";
const ALLOWED_ORIGIN = "https://baoduytran374-dotcom.github.io";
const JWKS_URL = "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com";

function cors(origin) {
  return {
    "Access-Control-Allow-Origin": origin === ALLOWED_ORIGIN ? ALLOWED_ORIGIN : "null",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Authorization, Content-Type",
    "Vary": "Origin"
  };
}
function json(data, status, headers) {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json", ...headers } });
}
function decodePart(part) {
  const s = atob(part.replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(s, c => c.charCodeAt(0));
}
async function verifyFirebaseToken(token) {
  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("Invalid token");
  const header = JSON.parse(new TextDecoder().decode(decodePart(parts[0])));
  const claims = JSON.parse(new TextDecoder().decode(decodePart(parts[1])));
  if (header.alg !== "RS256" || !header.kid) throw new Error("Invalid token header");
  const jwksResponse = await fetch(JWKS_URL);
  if (!jwksResponse.ok) throw new Error("Unable to load Firebase signing keys");
  const jwks = await jwksResponse.json();
  const jwk = jwks.keys.find(k => k.kid === header.kid);
  if (!jwk) throw new Error("Unknown signing key");
  const key = await crypto.subtle.importKey("jwk", jwk, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
  const valid = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", key, decodePart(parts[2]), new TextEncoder().encode(parts[0] + "." + parts[1]));
  const now = Math.floor(Date.now() / 1000);
  if (!valid || claims.iss !== "https://securetoken.google.com/" + PROJECT_ID ||
      claims.aud !== PROJECT_ID || claims.sub !== ADMIN_UID ||
      !claims.exp || claims.exp <= now || !claims.iat || claims.iat > now + 60) {
    throw new Error("Not authorized");
  }
  return claims;
}
async function sha1Hex(value) {
  const digest = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, "0")).join("");
}
export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const headers = cors(origin);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
    if (origin !== ALLOWED_ORIGIN) return json({ error: "Origin not allowed" }, 403, headers);
    if (request.method !== "POST") return json({ error: "Method not allowed" }, 405, headers);
    try {
      const authorization = request.headers.get("Authorization") || "";
      const match = authorization.match(/^Bearer (.+)$/);
      if (!match) return json({ error: "Missing Firebase token" }, 401, headers);
      await verifyFirebaseToken(match[1]);
      if (!env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET) throw new Error("Cloudinary Worker secrets are not configured");
      const timestamp = Math.floor(Date.now() / 1000);
      const params = { folder: FOLDER, timestamp, upload_preset: CLOUDINARY_PRESET };
      const toSign = Object.keys(params).sort().map(k => k + "=" + params[k]).join("&") + env.CLOUDINARY_API_SECRET;
      const signature = await sha1Hex(toSign);
      return json({ apiKey: env.CLOUDINARY_API_KEY, timestamp, signature, folder: FOLDER, uploadPreset: CLOUDINARY_PRESET, cloudName: CLOUDINARY_CLOUD }, 200, headers);
    } catch (error) {
      return json({ error: error.message || "Signing failed" }, 401, headers);
    }
  }
};
