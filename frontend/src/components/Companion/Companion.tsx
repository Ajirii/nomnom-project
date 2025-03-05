const Companion = ({ hunger }: { hunger: number }) => {
  return (
    <div className="row">
      <div className="main">
        {/* Cosmetics Section */}
        <div className="cosmetics-container">
          <h2 className="cosmetics-header">Cosmetics</h2>
          <div className="cosmetics-grid">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="cosmetic-slot"></div>
            ))}
          </div>
        </div>

        {/* Mood Box */}
        <div className="mood-container">
          {/* HP Bar */}
          <div className="hp-bar">
            <div
              className="hp-fill"
              style={{
                width: `${hunger}%`,
                backgroundColor: hunger <= 20 ? "red" : "#4CAF50",
              }}
            ></div>
          </div>

          {/* <div className="mood-status">
            <p className="status">
              {hunger > 50
                ? "NomNom is happy! 😊"
                : hunger > 20
                ? "NomNom is getting hungry! 😟"
                : "NomNom is starving! 😢"}
            </p>
          </div>

          <div className="mood-description">
            <p>Complete quests to fill NomNom's HP bar.</p>
            <p>Keep him well-fed to keep him happy! 🍜</p>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Companion;
