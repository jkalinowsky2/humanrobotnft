import Image from "next/image";

const mintUrl = process.env.NEXT_PUBLIC_NFTS2ME_MINT_URL;

export default function Home() {
  return (
    <main className="hr-page">
      <div className="hr-grid" aria-hidden />

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
          <p className="hr-subtitle">: wake up and choose violence</p>
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

        <section className="hr-panel hr-mint-panel">
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
              <p className="hr-mint-status">ACCESS DENIED: Transmission locked</p>
              <p className="hr-mint-status">...</p>
              <p className="hr-mint-status">: REBOOT REQUIRED</p>
              <p className="hr-mint-status">...</p>
              <p className="hr-mint-status">: TERMINATING</p>
              {/* <p>
                Mint URL pending. Add{" "}
                <code>NEXT_PUBLIC_NFTS2ME_MINT_URL</code> to unlock this module.
              </p> */}
            </div>
          )}
        </section>

        <footer className="hr-footer">
          &copy; {new Date().getFullYear()} HumanRobot. All signals reserved.
        </footer>
      </div>
    </main>
  );
}
