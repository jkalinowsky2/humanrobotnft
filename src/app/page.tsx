import Image from "next/image";

const mintUrl = process.env.NEXT_PUBLIC_NFTS2ME_MINT_URL;

export default function Home() {
  return (
    <main className="hr-page">
      <div className="hr-grid" aria-hidden />

      <header className="hr-header">
        <p className="hr-kicker">ApeChain Drop</p>
        <h1 className="hr-title">HumanRobot</h1>
        <p className="hr-subtitle hr-accent">
          :  wake up and choose violence
        </p>
      </header>

      <section className="hr-panel hr-image-panel">
        <Image
          src="/images/teaser.png"
          alt="HumanRobot teaser art"
          width={1200}
          height={1200}
          className="hr-image"
          priority
        />
      </section>

      <section className="hr-panel hr-mint-panel">
        <h2 className="hr-panel-title">Mint Interface</h2>
        {mintUrl ? (
          <iframe
            src={mintUrl}
            title="HumanRobot mint"
            className="hr-mint-frame"
            allow="clipboard-write; encrypted-media; fullscreen; payment"
          />
        ) : (
          <div className="hr-mint-placeholder">
            <p className="hr-mint-status">Transmission locked.</p>
            <p>
              Mint URL pending. Add{" "}
              <code>NEXT_PUBLIC_NFTS2ME_MINT_URL</code> to unlock this module.
            </p>
          </div>
        )}
      </section>

      <footer className="hr-footer">
        &copy; {new Date().getFullYear()} HumanRobot. All signals reserved.
      </footer>
    </main>
  );
}
