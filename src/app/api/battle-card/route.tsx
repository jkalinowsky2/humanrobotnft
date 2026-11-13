import { ImageResponse } from "next/og";
import battleStats from "../../../../battle-stats.json";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams;
  const token = query.get("token") ?? "";
  const social = query.get("format") === "social";
  if (!Object.prototype.hasOwnProperty.call(battleStats.tokens, token)) {
    return new Response("Unknown token", { status: 404 });
  }
  const profile = battleStats.tokens[token as keyof typeof battleStats.tokens];
  try {
    const artwork = await fetch(
      `https://pub-4d9eea27c62a4697bbafb2d2395cbca3.r2.dev/illustrated_light/${token}.png`,
      { signal: AbortSignal.timeout(15000) }
    );
    if (!artwork.ok) throw new Error("Artwork unavailable");
    const src = `data:image/png;base64,${Buffer.from(await artwork.arrayBuffer()).toString("base64")}`;
    return new ImageResponse(
      <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", padding: social ? 32 : 48, background: "#0b1016", color: "#d8e7f5", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: social ? 20 : 42, fontSize: 36, fontWeight: 700 }}>
          <span style={{ color: "#cff147" }}>humanRobot</span><span>Token #{token}</span>
        </div>
        <div style={{ display: "flex", gap: 48 }}>
          <div style={{ display: "flex", flexDirection: "column", width: social ? 628 : 408 }}>
            <div style={{ fontSize: 30, fontWeight: 700, marginBottom: social ? 14 : 30 }}>BATTLE STATS</div>
            {Object.entries(profile.stats).map(([name, value]) => (
              <div key={name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #29343f", height: social ? 72 : 90 }}>
                <span style={{ fontSize: 22, color: "#8594a2" }}>{name.toUpperCase()}</span>
                <span style={{ fontSize: 32, color: "#cff147" }}>{value.toLocaleString("en-US")}</span>
              </div>
            ))}
          </div>
          <img src={src} width={social ? 460 : 648} height={social ? 460 : 648} style={{ borderRadius: 22 }} />
        </div>
        <div style={{ display: "flex", marginTop: social ? 20 : 32, color: "#8594a2", fontSize: 19 }}>Battle stats are preliminary, algorithm is still in development.</div>
      </div>,
      { width: 1200, height: social ? 630 : 880, headers: { "Content-Disposition": `inline; filename="humanrobot-${token}-battle-card.png"` } }
    );
  } catch {
    return new Response("Could not generate the battle card. Please try again.", { status: 502 });
  }
}
