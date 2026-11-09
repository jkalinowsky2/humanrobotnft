"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export type CardType = "Base" | "Foil" | "Holographic" | "Edition";

export type ArenaFighter = {
  tokenId: number;
  id: string;
  name: string;
  className: string;
  status: string;
  cardType: CardType;
  attack: number;
  defense: number;
  magic: number;
  speed: number;
  special: number;
  specialMove: string;
  trait: string;
  art: string;
};

type Props = {
  arenaFighters: ArenaFighter[];
  mintedRoster: string[];
};

function getFallbackFighter(tokenId: number): ArenaFighter {
  return {
    tokenId,
    id: `HR-${String(tokenId).padStart(3, "0")}`,
    name: "Unregistered Unit",
    className: "Pending Mint",
    status: "Awaiting Data",
    cardType: "Base",
    attack: 0,
    defense: 0,
    magic: 0,
    speed: 0,
    special: 0,
    specialMove: "No battle profile loaded",
    trait: "Unknown",
    art: "/cards/0_card.png",
  };
}

export default function BattleArenaClient({ arenaFighters, mintedRoster }: Props) {
  const [inputTokenId, setInputTokenId] = useState("0");
  const [selectedTokenId, setSelectedTokenId] = useState(0);

  const fighterLookup = new Map(arenaFighters.map((fighter) => [fighter.tokenId, fighter]));
  const featuredFighter = fighterLookup.get(selectedTokenId) ?? getFallbackFighter(selectedTokenId);

  function handleLoadCard(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = Number.parseInt(inputTokenId, 10);

    if (Number.isNaN(parsed) || parsed < 0) {
      setSelectedTokenId(0);
      setInputTokenId("0");
      return;
    }

    setSelectedTokenId(parsed);
  }

  return (
    <main className="hr-page hr-arena-page">
      <div className="hr-grid" aria-hidden />
      <div className="hr-noise" aria-hidden />

      <nav className="hr-site-nav" aria-label="Primary">
        <Link href="/" className="hr-site-nav-link">
          Home
        </Link>
        <Link href="/battle-arena" className="hr-site-nav-link is-active">
          Battle Arena
        </Link>
      </nav>

      <div className="hr-content hr-arena-content">
        <section className="hr-panel hr-arena-hero-panel">
          <p className="hr-arena-kicker">Battle Arena // Minted Combat Registry</p>
          <h1 className="hr-arena-title">Load a token ID and project its battle card in 3D.</h1>
          <p className="hr-arena-copy">
            This prototype uses saved card art and battle-stat JSON files discovered locally. Add a
            matching `*_battlestats.json` file and `*_card.png` image to extend the viewer.
          </p>
          <div className="hr-hero-actions">
            <Link href="/" className="hr-cta-link hr-cta-link-secondary">
              Return Home
            </Link>
          </div>
        </section>

        <section className="hr-arena-layout">
          <section className="hr-panel hr-arena-roster-panel">
            <h2 className="hr-panel-title hr-panel-accent">Minted NFT Feed</h2>
            <div className="hr-terminal hr-arena-terminal">
              {mintedRoster.map((item, index) => (
                <p key={item} className="hr-arena-terminal-line" style={{ "--i": index } as CSSProperties}>
                  <span className="hr-terminal-prompt">&gt;</span>
                  {item}
                </p>
              ))}
            </div>
          </section>

          <section className="hr-panel hr-arena-overview-panel">
            <h2 className="hr-panel-title hr-panel-accent">Arena Protocol</h2>
            <div className="hr-arena-overview-grid">
              <article className="hr-arena-overview-card">
                <span className="hr-arena-overview-label">Viewer</span>
                <strong className="hr-arena-overview-value">Auto-Loaded Token Registry</strong>
              </article>
              <article className="hr-arena-overview-card">
                <span className="hr-arena-overview-label">Depth</span>
                <strong className="hr-arena-overview-value">CSS 3D + Type Effects</strong>
              </article>
              <article className="hr-arena-overview-card">
                <span className="hr-arena-overview-label">Source</span>
                <strong className="hr-arena-overview-value">{arenaFighters.length} Local Tokens Found</strong>
              </article>
            </div>
          </section>
        </section>

        <section className="hr-panel hr-card-viewer-panel">
          <div className="hr-card-viewer-copy">
            <h2 className="hr-panel-title hr-panel-accent">humanRobot Battle Stats</h2>
            <p className="hr-arena-copy">
              Enter a token ID to reveal your humanRobot's Battle Stats
            </p>

            <form className="hr-card-form" onSubmit={handleLoadCard}>
              <label className="hr-card-form-label" htmlFor="token-id">
                Token ID
              </label>
              <div className="hr-card-form-row">
                <input
                  id="token-id"
                  type="number"
                  min="0"
                  inputMode="numeric"
                  className="hr-card-form-input"
                  value={inputTokenId}
                  onChange={(event) => setInputTokenId(event.target.value)}
                  placeholder="0"
                />
                <button type="submit" className="hr-cta-link hr-card-form-button">
                  Load Card
                </button>
              </div>
            </form>

            <dl className="hr-card-meta">
              <div className="hr-card-meta-row">
                <dt>Loaded Unit</dt>
                <dd>{featuredFighter.name}</dd>
              </div>
              <div className="hr-card-meta-row">
                <dt>Registry ID</dt>
                <dd>{featuredFighter.id}</dd>
              </div>
              <div className="hr-card-meta-row">
                <dt>Status</dt>
                <dd>{featuredFighter.status}</dd>
              </div>
              <div className="hr-card-meta-row">
                <dt>Card Type</dt>
                <dd>{featuredFighter.cardType}</dd>
              </div>
              <div className="hr-card-meta-row">
                <dt>Special</dt>
                <dd>{featuredFighter.specialMove}</dd>
              </div>
            </dl>

            <div className="hr-viewer-stats">
              <article className="hr-viewer-stat-card">
                <span className="hr-viewer-stat-label">ATK</span>
                <strong className="hr-viewer-stat-value">{featuredFighter.attack}</strong>
              </article>
              <article className="hr-viewer-stat-card">
                <span className="hr-viewer-stat-label">DEF</span>
                <strong className="hr-viewer-stat-value">{featuredFighter.defense}</strong>
              </article>
              <article className="hr-viewer-stat-card">
                <span className="hr-viewer-stat-label">MAG</span>
                <strong className="hr-viewer-stat-value">{featuredFighter.magic}</strong>
              </article>
              <article className="hr-viewer-stat-card">
                <span className="hr-viewer-stat-label">SPD</span>
                <strong className="hr-viewer-stat-value">{featuredFighter.speed}</strong>
              </article>
              <article className="hr-viewer-stat-card">
                <span className="hr-viewer-stat-label">SPC</span>
                <strong className="hr-viewer-stat-value">{featuredFighter.special}</strong>
              </article>
            </div>
          </div>

          <div className="hr-card-stage">
            <div className="hr-card-stage-glow" aria-hidden />
            <article className="hr-float-card">
              <div className="hr-float-card-motion">
                <div
                  className={`hr-float-card-shell hr-float-card-shell-${featuredFighter.cardType.toLowerCase()}`}
                >
                  <Image
                    src={featuredFighter.art}
                    alt={`${featuredFighter.name} battle card art`}
                    width={900}
                    height={1260}
                    className="hr-float-card-image"
                    priority
                  />
                  <div className="hr-float-card-foil" aria-hidden />
                  <div className="hr-float-card-scan" aria-hidden />
                  <div className="hr-float-card-edge" aria-hidden />
                </div>
              </div>

              <div className="hr-float-card-caption">
                <p className="hr-float-card-token">Token #{featuredFighter.tokenId}</p>
                <h3 className="hr-float-card-name">{featuredFighter.name}</h3>
                <p className="hr-float-card-classname">{featuredFighter.className}</p>
              </div>
            </article>
          </div>
        </section>

        <section className="hr-panel hr-arena-cards-panel">
          <h2 className="hr-panel-title hr-panel-accent">Battle Cards</h2>
          <div className="hr-battle-grid">
            {arenaFighters.map((fighter) => (
              <article key={fighter.id} className="hr-battle-card">
                <div className="hr-battle-card-header">
                  <div>
                    <p className="hr-battle-card-id">
                      Token #{fighter.tokenId} // {fighter.id}
                    </p>
                    <h3 className="hr-battle-card-name">{fighter.name}</h3>
                  </div>
                  <span className="hr-battle-card-status">{fighter.status}</span>
                </div>

                <div className="hr-battle-card-frame">
                  <div className="hr-battle-card-art">
                    <span className="hr-battle-card-class">{fighter.className}</span>
                    <span className="hr-battle-card-trait">{fighter.trait}</span>
                  </div>

                  <dl className="hr-battle-stats">
                    <div className="hr-battle-stat">
                      <dt>ATK</dt>
                      <dd>{fighter.attack}</dd>
                    </div>
                    <div className="hr-battle-stat">
                      <dt>DEF</dt>
                      <dd>{fighter.defense}</dd>
                    </div>
                    <div className="hr-battle-stat">
                      <dt>MAG</dt>
                      <dd>{fighter.magic}</dd>
                    </div>
                    <div className="hr-battle-stat">
                      <dt>SPD</dt>
                      <dd>{fighter.speed}</dd>
                    </div>
                    <div className="hr-battle-stat">
                      <dt>SPC</dt>
                      <dd>{fighter.special}</dd>
                    </div>
                  </dl>
                </div>

                <div className="hr-battle-card-footer">
                  <span className="hr-battle-special-label">Special</span>
                  <strong className="hr-battle-special-value">{fighter.specialMove}</strong>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
