import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import Link from "next/link";
import battleStats from "../../../../battle-stats.json";

type Props = { params: Promise<{ token: string }> };

async function getToken(params: Props["params"]) {
  const { token } = await params;
  if (!Object.prototype.hasOwnProperty.call(battleStats.tokens, token)) notFound();
  return token;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const token = await getToken(params);
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "localhost:3000";
  const protocol = host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https";
  const origin = process.env.NEXT_PUBLIC_SITE_URL || `${protocol}://${host}`;
  const url = new URL(`/robots/${token}`, origin).toString();
  const image = new URL(`/api/battle-card?token=${token}&format=social`, origin).toString();
  const title = `humanRobot #${token} — Battle Card`;
  const description = `Explore humanRobot #${token}'s artwork and battle stats. Battle stats are preliminary.`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: "website", url, title, description, images: [{ url: image, width: 1200, height: 630, alt: title }] },
    twitter: { card: "summary_large_image", title, description, images: [{ url: image, alt: title }] },
  };
}

export default async function RobotSharePage({ params }: Props) {
  const token = await getToken(params);
  return (
    <main className="hr-page">
      <div className="hr-content" style={{ paddingTop: "3rem" }}>
        <h1 className="hr-panel-title hr-panel-accent">humanRobot #{token}</h1>
        <img src={`/api/battle-card?token=${token}`} alt={`humanRobot #${token} artwork and battle stats`} width={1200} height={880} style={{ width: "100%", height: "auto", borderRadius: 18 }} />
        <Link className="hr-cta-link" href={`/?token=${token}#robot-viewer`}>Explore this robot</Link>
      </div>
    </main>
  );
}
