import Image from "next/image";

const mintUrl = process.env.NEXT_PUBLIC_NFTS2ME_MINT_URL;

export default function Home() {
  return (
    <main className="hr-page">
      <div className="hr-grid" aria-hidden />

      <header className="hr-header">
        {/* <p className="hr-kicker">ApeChain Drop</p> */}
        <Image
          src="/images/headerimage.png"
          alt="HumanRobot"
          width={6250}
          height={2084}
          className="hr-title-image"
          priority
        />
        <p className="hr-subtitle">
          :  wake up and choose violence
        </p>
       <p className="hr-subtitle">
          :  coming soon to ApeChain
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
        <h2 className="hr-panel-title">Mint humanRobot</h2>
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
