"use client";

//NEW CODE///
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";

const whitelistedProjects = ["moonbirds", "the coffee collection", "bored ape yacht club","@humanrobotnft to request access"];
const botlistItems = ["MOONBIRDS", "MYTHICS", "ODDITIES", "NIGHTGLYDERS", "TRENCHERS", "GOBS", "BAYC", "THE COFFEE COLLECITON", 
  "MOONBIRDS", "MYTHICS", "ODDITIES", "NIGHTGLYDERS", "TRENCHERS", "GOBS", "BAYC", "THE COFFEE COLLECITON", 
  "MOONBIRDS", "MYTHICS", "ODDITIES", "NIGHTGLYDERS", "TRENCHERS", "GOBS", "BAYC", "THE COFFEE COLLECITON", 
  "MOONBIRDS", "MYTHICS", "ODDITIES", "NIGHTGLYDERS", "TRENCHERS", "GOBS", "BAYC", "THE COFFEE COLLECITON", 
  "MOONBIRDS", "MYTHICS", "ODDITIES", "NIGHTGLYDERS", "TRENCHERS", "GOBS", "BAYC", "THE COFFEE COLLECITON", 
  "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "" , "ACCESS DENIED"];
const terminalBaseDelaySeconds = 0.2;
const terminalLineStepSeconds = 0.9;
const botlistStepSeconds = 0.07;

export default function Home() {
  const imageTerminalRef = useRef<HTMLDivElement | null>(null);
  const botlistPanelRef = useRef<HTMLElement | null>(null);
  const [imageTerminalVisible, setImageTerminalVisible] = useState(false);
  const [visibleLineCount, setVisibleLineCount] = useState(0);
  const [botlistIndex, setBotlistIndex] = useState(0);
  const [botlistPanelVisible, setBotlistPanelVisible] = useState(false);

  useEffect(() => {
    const terminal = imageTerminalRef.current;
    if (!terminal) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setImageTerminalVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.65,
        rootMargin: "0px",
      }
    );

    observer.observe(terminal);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const panel = botlistPanelRef.current;
    if (!panel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setBotlistPanelVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.35,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    observer.observe(panel);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!imageTerminalVisible) return;
    setVisibleLineCount(0);
    setBotlistIndex(0);

    const timers: number[] = [];
    const base = terminalBaseDelaySeconds * 1000;
    const step = terminalLineStepSeconds * 1000;
    const botStep = botlistStepSeconds * 1000;

    timers.push(window.setTimeout(() => setVisibleLineCount(1), base));
    timers.push(window.setTimeout(() => setVisibleLineCount(2), base + step));
    timers.push(window.setTimeout(() => setVisibleLineCount(3), base + step * 2));

    let idx = 0;
    const botlistStart = window.setTimeout(() => {
      const cycle = window.setInterval(() => {
        idx += 1;
        if (idx >= botlistItems.length) {
          window.clearInterval(cycle);
          setVisibleLineCount(4);
          timers.push(window.setTimeout(() => setVisibleLineCount(5), step));
          return;
        }
        setBotlistIndex(idx);
      }, botStep);
      timers.push(cycle);
    }, base + step * 2);

    timers.push(botlistStart);

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [imageTerminalVisible]);

  return (
    <main className="hr-page">
      <div className="hr-grid" aria-hidden />
      <div className="hr-noise" aria-hidden />

      <nav className="hr-site-nav" aria-label="Primary">
        <Link href="/" className="hr-site-nav-link is-active">
          Home
        </Link>
      </nav>

      <header className="hr-hero">
        <Image
          src="/images/headerimagetrans.png"
          alt="HumanRobot"
          width={6250}
          height={2084}
          className="hr-hero-image"
          priority
        />
      </header>

      <div className="hr-content">
        <div className="hr-taglines">
          <p className="hr-subtitle hr-glitch" data-text=": wake up and choose violence">
            : wake up and choose violence
          </p>
        </div>

        <section className="hr-panel hr-image-panel">
          {/* <p className="hr-image-banner">: coming soon to ApeChain</p> */}
          <Image
            src="/images/teaser5.png"
            alt="HumanRobot teaser art"
            width={1200}
            height={1200}
            className="hr-image"
            priority
          />
          <div
            ref={imageTerminalRef}
            className={`hr-image-terminal${imageTerminalVisible ? " is-visible" : ""}`}
          >
            <div className="hr-image-terminal-lines">
              {visibleLineCount >= 1 ? (
                <p className="hr-image-terminal-line">
                  <span className="hr-terminal-prompt">&gt;</span> INITIALIZING CONNECTION
                </p>
              ) : null}
              {visibleLineCount >= 2 ? (
                <p className="hr-image-terminal-line">
                  <span className="hr-terminal-prompt">&gt;</span> AUTHENTICATING...
                </p>
              ) : null}
              {visibleLineCount >= 3 ? (
                <p className="hr-image-terminal-line">
                  <span className="hr-terminal-prompt">&gt;</span> BOTLIST:{" "}
                  <span className="hr-whitelist-item">{botlistItems[botlistIndex]}</span>
                </p>
              ) : null}
              {visibleLineCount >= 4 ? (
                <p className="hr-image-terminal-line">
                  <span className="hr-terminal-prompt">&gt;</span> REBOOT REQUIRED...
                </p>
              ) : null}
              {visibleLineCount >= 5 ? (
                <p className="hr-image-terminal-line">
                  <span className="hr-terminal-prompt">&gt;</span>{" "}
                  <span className="hr-terminal-accent">
                    TERMINATING<span className="hr-image-cursor">_</span>
                  </span>
                </p>
              ) : null}
            </div>
          </div>
        </section>

        <section
          ref={botlistPanelRef}
          className={`hr-panel hr-botlist-panel${botlistPanelVisible ? " is-visible" : ""}`}
        >
          <h3 className="hr-panel-title hr-panel-accent">BOTLIST STATUS: CONFIRMED</h3>
          <div className="hr-botlist-frame">
            <ul className="hr-botlist-list">
              {whitelistedProjects.map((project, index) => (
                <li
                  key={project}
                  className="hr-botlist-item"
                  style={{ "--i": index } as CSSProperties}
                >
                  <span className="hr-botlist-prompt">&gt;</span>
                  <span className="hr-botlist-name">{project}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <a
          href="https://opensea.io"
          className="hr-cta-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          View on OpenSea
        </a>
        <p className="hr-mint-note">mint site coming soon</p>

        <footer className="hr-footer">
          &copy; {new Date().getFullYear()} HumanRobot. All signals reserved.
        </footer>
      </div>
    </main>
  );
}

