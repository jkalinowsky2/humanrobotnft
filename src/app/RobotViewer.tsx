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
  "https://pub-4d9eea27c62a4697bbafb2d2395cbca3.r2.dev";

export default function RobotViewer() {
  const [artMode, setArtMode] = useState<"light" | "dark">("light");
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
  const [shareBusy, setShareBusy] = useState(false);
  const [cardImage, setCardImage] = useState<Blob | null>(null);
  const [copied, setCopied] = useState(false);
  const cardUrl = `/api/battle-card?v=2&token=${tokenId}&mode=${artMode}`;
  const xUrl = `https://x.com/intent/tweet?${new URLSearchParams({
    text: `Battle Stats for humanRobot #${tokenId} #humanRobot`,
  })}`;

  useEffect(() => {
    const controller = new AbortController();
    setCardImage(null);
    setCopied(false);
    setShareStatus("Preparing card image…");
    fetch(cardUrl, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Image unavailable");
        return response.blob();
      })
      .then((blob) => {
        if (controller.signal.aborted) return;
        setCardImage(blob);
        setShareStatus("");
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setShareStatus("Could not prepare the image. Load the robot again to retry, or use Download card image.");
        }
      });
    return () => controller.abort();
  }, [cardUrl, attempt]);

  async function shareOnX() {
    if (!cardImage || shareBusy) return;
    setShareBusy(true);
    setCopied(false);
    try {
      if (!navigator.clipboard?.write || typeof ClipboardItem === "undefined") {
        throw new Error("Image copying unavailable");
      }
      await navigator.clipboard.write([new ClipboardItem({ "image/png": cardImage })]);
      setCopied(true);
      setShareStatus("Card copied! Paste into your X post with ⌘V on Mac or Ctrl+V on Windows. If X didn’t open, use Open X below.");
      window.open(xUrl, "_blank", "noopener,noreferrer");
    } catch {
      setShareStatus("Your browser couldn’t copy the image. Download the card below, open X, and attach it using the photo button.");
    } finally {
      setShareBusy(false);
    }
  }

  function changeArtMode(mode: "light" | "dark") {
    if (mode === artMode || shareBusy) return;
    setArtMode(mode);
    setStatus("loading");
    setCardImage(null);
    setCopied(false);
    setShareStatus("");
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
    setCardImage(null);
    setCopied(false);
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
          <button type="submit" className="hr-cta-link" disabled={shareBusy}>Load Robot</button>
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
      <div className="hr-art-toggle" role="group" aria-label="Robot artwork mode">
        {(["light", "dark"] as const).map((mode) => (
          <button key={mode} type="button" aria-pressed={artMode === mode}
            disabled={shareBusy} onClick={() => changeArtMode(mode)}>
            {mode === "light" ? "Light" : "Dark"}
          </button>
        ))}
      </div>
      <div className="hr-robot-image" aria-busy={status === "loading"}>
        <Image
          key={`${tokenId}-${artMode}-${attempt}`}
          src={`${TOKEN_IMAGE_BASE_URL}/illustrated_${artMode}/${tokenId}.png`}
          alt={`${artMode === "light" ? "Light" : "Dark"} robot artwork for token #${tokenId}`}
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
              : `Could not load ${artMode} artwork for token #${tokenId}. Try another ID or load again.`}
          </p>
        )}
      </div>
      <p className="hr-robot-caption" aria-live="polite">Token #{tokenId}</p>
      </div>
      <div className="hr-robot-share">
        <button type="button" className="hr-cta-link" onClick={shareOnX} disabled={!cardImage || shareBusy}>
          {shareBusy ? "Copying…" : "Copy card & open X"}
        </button>
        <p className="hr-share-status" role="status">{shareStatus || "Copy the image, then paste it into X with ⌘V / Ctrl+V."}</p>
        <div className="hr-share-actions">
          {(copied || shareStatus.includes("couldn’t copy")) && <a className="hr-cta-link" href={xUrl} target="_blank" rel="noopener noreferrer">Open X</a>}
          <a href={cardUrl} download={`humanrobot-${tokenId}-battle-card.png`}>Download card image</a>
        </div>
      </div>
      <p className="hr-robot-disclaimer">Battle stats are preliminary, algorythm is still in development.</p>
    </section>
  );
}
