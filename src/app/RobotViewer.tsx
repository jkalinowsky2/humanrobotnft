"use client";

import Image from "next/image";
import { useEffect, useState, type FormEvent } from "react";
import battleStats from "../../battle-stats.json";

type BattleProfile = {
  card_type: string;
  traits_used: Record<string, string>;
  stats: Record<string, number>;
};
const profiles: Record<string, BattleProfile> = battleStats.tokens;

// Final HumanRobot artwork hosted in the public R2 bucket.
const TOKEN_IMAGE_BASE_URL =
  "https://pub-4d9eea27c62a4697bbafb2d2395cbca3.r2.dev/illustrated_light";

export default function RobotViewer() {
  const [input, setInput] = useState("1");
  const [tokenId, setTokenId] = useState("1");
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState("loading");
  const [validation, setValidation] = useState("");

  const profile = profiles[tokenId];

  useEffect(() => {
    const sharedToken = new URLSearchParams(window.location.search).get("token");
    if (!sharedToken || !/^\d+$/.test(sharedToken)) return;
    const id = sharedToken.replace(/^0+(?=\d)/, "");
    if (Object.prototype.hasOwnProperty.call(profiles, id)) {
      setInput(id);
      setTokenId(id);
      setStatus("loading");
    }
  }, []);

  const [shareStatus, setShareStatus] = useState("");
  const cardUrl = `/api/battle-card?token=${tokenId}`;

  function shareOnX() {
    const origin = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
    const url = new URL(`/robots/${tokenId}`, origin);
    if (["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)) {
      setShareStatus("Image previews on X will work once this site is published. You can still download the card below.");
      return;
    }
    setShareStatus("");
    const params = new URLSearchParams({
      text: `Meet humanRobot #${tokenId} #humanRobot`,
      url: url.toString(),
    });
    window.open(`https://x.com/intent/tweet?${params}`, "_blank", "noopener,noreferrer");
  }

  function loadToken(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = input.trim();
    if (!/^\d+$/.test(value)) {
      setValidation("Enter a whole token ID of 0 or higher.");
      return;
    }
    const normalizedId = value.replace(/^0+(?=\d)/, "");
    if (!Object.prototype.hasOwnProperty.call(profiles, normalizedId)) {
      setValidation("No battle stats found for that token. Choose a token from 1 to 1111.");
      return;
    }
    setShareStatus("");
    setValidation("");
    setTokenId(normalizedId);
    setAttempt((previous) => previous + 1);
    setStatus("loading");
  }

  return (
    <section id="robot-viewer" className="hr-panel hr-robot-viewer" aria-labelledby="robot-viewer-title">
      <div className="hr-robot-details">
      <h2 id="robot-viewer-title" className="hr-panel-title hr-panel-accent">ROBOT VIEWER</h2>
      <form onSubmit={loadToken} className="hr-robot-form">
        <label htmlFor="robot-token-id">Token ID</label>
        <div className="hr-robot-controls">
          <input
            id="robot-token-id"
            className="hr-card-form-input"
            type="text"
            inputMode="numeric"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            aria-invalid={!!validation}
            aria-describedby="robot-validation"
          />
          <button type="submit" className="hr-cta-link">Load Robot</button>
        </div>
        <p id="robot-validation" role="alert" className="hr-robot-validation">{validation}</p>
      </form>
      </div>
      <section className="hr-robot-stats" aria-labelledby="robot-stats-title" aria-live="polite">
        <h3 id="robot-stats-title" className="hr-panel-title">Battle stats</h3>
        <dl className="hr-card-meta">
          {Object.entries(profile.stats).map(([name, value]) => (
            <div className="hr-card-meta-row" key={name}>
              <dt>{name}</dt><dd>{value.toLocaleString("en-US")}</dd>
            </div>
          ))}
        </dl>
      </section>
      <div className="hr-robot-artwork">
      <div className="hr-robot-image" aria-busy={status === "loading"}>
        <Image
          key={`${tokenId}-${attempt}`}
          src={`${TOKEN_IMAGE_BASE_URL}/${tokenId}.png`}
          alt={`Robot artwork for token #${tokenId}`}
          width={640}
          height={640}
          unoptimized
          onLoad={() => setStatus("ready")}
          onError={() => setStatus("error")}
          style={{ visibility: status === "ready" ? "visible" : "hidden" }}
        />
        {status !== "ready" && (
          <p className="hr-robot-image-message" role="status">
            {status === "loading"
              ? `Loading token #${tokenId}…`
              : `Could not load token #${tokenId}. Try another ID or load again.`}
          </p>
        )}
      </div>
      <p className="hr-robot-caption" aria-live="polite">Token #{tokenId}</p>
      </div>
      <div className="hr-robot-share">
        <button type="button" className="hr-cta-link" onClick={shareOnX}>
          Share card on X
        </button>
        <p className="hr-share-status" role="status">{shareStatus}</p>
        <div className="hr-share-actions">
          <a href={cardUrl} download={`humanrobot-${tokenId}-battle-card.png`}>Download card image</a>
        </div>
      </div>
      <p className="hr-robot-disclaimer">Battle stats are preliminary, algorythm is still in development.</p>
    </section>
  );
}
