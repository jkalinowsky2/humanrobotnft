"use client";

//NEW CODE///
import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";


const mintUrl = process.env.NEXT_PUBLIC_NFTS2ME_MINT_URL;
const whitelistedProjects = ["moonbirds", "nightglyders", "trenchers", "@humanrobotnft to request access"];
const botlistItems = ["MOONBIRDS", "MYTHICS", "ODDITIES", "NIGHTGLYDERS", "TRENCHERS", "GOBS", "MINTOTAURS", "MOONBIRDS", "MYTHICS", "ODDITIES", "NIGHTGLYDERS", "TRENCHERS","GOBS", "MINTOTAURS",
                    "MOONBIRDS", "MYTHICS", "ODDITIES", "NIGHTGLYDERS", "TRENCHERS","GOBS", "MINTOTAURS", "MOONBIRDS", "MYTHICS", "ODDITIES", "NIGHTGLYDERS", "TRENCHERS", "GOBS", "MINTOTAURS",
                    "MOONBIRDS", "MYTHICS", "ODDITIES", "NIGHTGLYDERS", "TRENCHERS", "GOBS", "MINTOTAURS","MOONBIRDS", "MYTHICS", "ODDITIES", "NIGHTGLYDERS", "TRENCHERS","GOBS", "MINTOTAURS",
                    "MOONBIRDS", "MYTHICS", "ODDITIES", "NIGHTGLYDERS", "TRENCHERS", "GOBS", "MINTOTAURS","MOONBIRDS", "MYTHICS", "ODDITIES", "NIGHTGLYDERS", "TRENCHERS","GOBS", "MINTOTAURS",
                    "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "" , "ACCESS DENIED"];
const botlistStepSeconds = .05;
const terminalBaseDelaySeconds = 0.2;
const terminalLineStepSeconds = 0.9;
const botlistLineIndex = 2;

export default function Home() {
  const mintPanelRef = useRef<HTMLElement | null>(null);
  const botlistPanelRef = useRef<HTMLElement | null>(null);
  const [mintVisible, setMintVisible] = useState(false);
  const [botlistPanelVisible, setBotlistPanelVisible] = useState(false);
  const [botlistIndex, setBotlistIndex] = useState(0);
  const delay2Seconds = Math.max(
    0,
    botlistItems.length * botlistStepSeconds - terminalLineStepSeconds
  );

  useEffect(() => {
    if (mintUrl) return;
    const panel = mintPanelRef.current;
    if (!panel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setMintVisible(true);
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
    if (mintUrl || !mintVisible) return;
    setBotlistIndex(0);

    const startDelayMs =
      (terminalBaseDelaySeconds + botlistLineIndex * terminalLineStepSeconds) *
      1000;
    let current = 0;
    let cycle = 0;

    const startTimer = window.setTimeout(() => {
      cycle = window.setInterval(() => {
        current += 1;
        if (current >= botlistItems.length) {
          window.clearInterval(cycle);
          return;
        }
        setBotlistIndex(current);
      }, botlistStepSeconds * 1000);
    }, startDelayMs);

    return () => {
      window.clearTimeout(startTimer);
      window.clearInterval(cycle);
    };
  }, [mintVisible, mintUrl]);

  return (
    <main className="hr-page">
      <div className="hr-grid" aria-hidden />
      <div className="hr-noise" aria-hidden />

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
          <p className="hr-image-banner">: coming soon to ApeChain</p>
          <Image
            src="/images/teaser4.png"
            alt="HumanRobot teaser art"
            width={1200}
            height={1200}
            className="hr-image"
            priority
          />
        </section>

        <section
          ref={mintPanelRef}
          className={`hr-panel hr-mint-panel${mintVisible ? " is-visible" : ""}`}
          style={{ "--post-botlist-delay": `${delay2Seconds}s` } as CSSProperties}
        >
          <h2 className="hr-panel-title hr-panel-accent">Mint humanRobot</h2>
          {mintUrl ? (
            <iframe
              src={mintUrl}
              title="HumanRobot mint"
              className="hr-mint-frame"
              allow="clipboard-write; encrypted-media; fullscreen; payment"
            />
          ) : (
            <div className="hr-mint-placeholder">
              <div className="hr-terminal">
                <p className="hr-terminal-line" style={{ "--i": 0 } as CSSProperties}>
                  <span className="hr-terminal-prompt">&gt;</span> INITIALIZING CONNECTION
                </p>
                <p className="hr-terminal-line" style={{ "--i": 1 } as CSSProperties}>
                  <span className="hr-terminal-prompt">&gt;</span> AUTHENTICATING...
                </p>
                <p className="hr-terminal-line" style={{ "--i": 2 } as CSSProperties}>
                  <span className="hr-terminal-prompt">&gt;</span> BOTLIST:
                  <span className="hr-whitelist-item"> {botlistItems[botlistIndex]}</span>
                </p>
                {/* <p className="hr-terminal-line hr-terminal-line-delay-2" style={{ "--i": 3 } as CSSProperties}>
                  <span className="hr-terminal-prompt">&gt;</span>{" "}
                  <span className="hr-terminal-red">BOTLIST ACCESS: DENIED</span>
                </p> */}
                <p className="hr-terminal-line hr-terminal-line-delay-2" style={{ "--i": 4 } as CSSProperties}>
                  <span className="hr-terminal-prompt">&gt;</span> REBOOT REQUIRED...
                </p>
                <p className="hr-terminal-line hr-terminal-line-delay-2 hr-terminal-line-final hr-terminal-last" style={{ "--i": 5 } as CSSProperties}>
                  <span className="hr-terminal-prompt">&gt;</span>{" "}
                  <span className="hr-terminal-accent">TERMINATING</span>
                  <span className="hr-cursor">_</span>
                </p>
              </div>
            </div>
          )}
        </section>

        <section
          ref={botlistPanelRef}
          className={`hr-panel hr-botlist-panel${botlistPanelVisible ? " is-visible" : ""}`}
        >
          <h3 className="hr-panel-title hr-panel-accent">BOTLIST STATUS: ACTIVE</h3>
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

        <footer className="hr-footer">
          &copy; {new Date().getFullYear()} HumanRobot. All signals reserved.
        </footer>
      </div>
    </main>
  );
}



//ORIGINAL CODE////
// import Image from "next/image";

// const mintUrl = process.env.NEXT_PUBLIC_NFTS2ME_MINT_URL;

// export default function Home() {
//   return (
//     <main className="hr-page">
//       <div className="hr-grid" aria-hidden />

//       <header className="hr-hero">
//         <Image
//           src="/images/headerimagetrans.png"
//           alt="HumanRobot"
//           width={6250}
//           height={2084}
//           className="hr-hero-image"
//           priority
//         />
//       </header>

//       <div className="hr-content">
//         <div className="hr-taglines">
//           <p className="hr-subtitle">: wake up and choose violence</p>
//         </div>

//         <section className="hr-panel hr-image-panel">
//           <p className="hr-image-banner">: coming soon to ApeChain</p>
//           <Image
//             src="/images/teaser4.png"
//             alt="HumanRobot teaser art"
//             width={1200}
//             height={1200}
//             className="hr-image"
//             priority
//           />
//         </section>

//         <section className="hr-panel hr-mint-panel">
//           <h2 className="hr-panel-title hr-panel-accent">Mint humanRobot</h2>
//           {mintUrl ? (
//             <iframe
//               src={mintUrl}
//               title="HumanRobot mint"
//               className="hr-mint-frame"
//               allow="clipboard-write; encrypted-media; fullscreen; payment"
//             />
//           ) : (
//             <div className="hr-mint-placeholder">
//               <p className="hr-mint-status">ACCESS DENIED: Transmission locked</p>
//               <p className="hr-mint-status">...</p>
//               <p className="hr-mint-status">: REBOOT REQUIRED</p>
//               <p className="hr-mint-status">...</p>
//               <p className="hr-mint-status">: TERMINATING</p>
//               {/* <p>
//                 Mint URL pending. Add{" "}
//                 <code>NEXT_PUBLIC_NFTS2ME_MINT_URL</code> to unlock this module.
//               </p> */}
//             </div>
//           )}
//         </section>

//         <footer className="hr-footer">
//           &copy; {new Date().getFullYear()} HumanRobot. All signals reserved.
//         </footer>
//       </div>
//     </main>
//   );
// }
