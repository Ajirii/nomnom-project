import { useState } from "react";

// Import cosmetics
import headband from "/assets/cosmetics/headband.png";
import witchHat from "/assets/cosmetics/witchhat.png";
import halo from "/assets/cosmetics/halo.png";
import glasses from "/assets/cosmetics/glasses.png";
import bowtie from "/assets/cosmetics/bowtie.png";
import chair from "/assets/cosmetics/chair.png";
import plant1 from "/assets/cosmetics/plant1.png";
import plant2 from "/assets/cosmetics/plant2.png";
import crown from "/assets/cosmetics/crown.png";
import monocle from "/assets/cosmetics/monocle.png";
import mustache from "/assets/cosmetics/mustache.png";
import egg from "/assets/cosmetics/egg.png";

interface CompanionProps {
  hunger: number;
  coins: number;
  setCoins: (value: number) => void;
  onCosmeticChange: (newCosmetic: string) => void;
}

const Companion = ({ hunger, coins, setCoins, onCosmeticChange }: CompanionProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [unlocked, setUnlocked] = useState<{ [key: string]: boolean }>({});
  const [message, setMessage] = useState<string | null>(null);

  const tabTitles = ["Head", "Eyes", "Accessories", "Background"];

  const cosmeticsByTab = [
    [headband, witchHat, halo, crown],
    [glasses, monocle],
    [bowtie, mustache, egg],
    [chair, plant1, plant2],
  ];

  const getCost = (index: number) => (index + 1) * 10;

  const handleCosmeticClick = (cosmetic: string, index: number) => {
    const cost = getCost(index);
    const isAlreadyUnlocked = unlocked[cosmetic];

    if (!isAlreadyUnlocked) {
      if (coins >= cost) {
        setUnlocked((prev) => ({ ...prev, [cosmetic]: true }));
        setCoins(coins - cost); // Corrected coin subtraction
        setMessage(`Unlocked for ${cost} coins!`);
        onCosmeticChange(cosmetic);
      } else {
        setMessage("Not enough coins to unlock this cosmetic.");
      }
    } else {
      onCosmeticChange(cosmetic);
    }
  };

  const handleSaveToggle = () => {
    setIsSaved((prev) => !prev);
  };

  return (
    <div className="recipes-section">
      <div className="row">
        <div className="main">
          <div className="hp-layout">
            <button className="info-button" onClick={() => setShowModal(true)}>
              ?
            </button>
            <div className="mood-container">
              <div className="hp-bar">
                <div
                  className="hp-fill"
                  style={{
                    width: `${hunger}%`,
                    backgroundColor: hunger <= 20 ? "red" : "#4CAF50",
                  }}
                />
              </div>
              <p className="coin-display">
                <strong>Coins:</strong> {coins} 🪙
              </p>
            </div>
          </div>

          {showModal && (
            <div className="modal-overlay" onClick={() => setShowModal(false)}>
              <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h2>HP Bar</h2>
                <p>
                  The more quests you complete, the more NomNom's HP bar fills.
                  Make sure to keep him well-fed and happy!
                </p>
                <button className="close-button" onClick={() => setShowModal(false)}>
                  Close
                </button>
              </div>
            </div>
          )}

          {message && (
            <div className="modal-overlay" onClick={() => setMessage(null)}>
              <div className="modal" onClick={(e) => e.stopPropagation()}>
                <p>{message}</p>
                <button className="close-button" onClick={() => setMessage(null)}>
                  OK
                </button>
              </div>
            </div>
          )}

          <div className="cosmetics-container">
            <div className="cosmetics-tabs">
              {tabTitles.map((title, index) => (
                <button
                  key={index}
                  className={`cosmetics-tab ${activeTab === index ? "active" : ""}`}
                  onClick={() => setActiveTab(index)}
                >
                  {title}
                </button>
              ))}
            </div>
            <div className="cosmetics-header-row">
              <h2 className="cosmetics-header">Cosmetics</h2>
              <button className="save-button" onClick={handleSaveToggle}>
                Save
              </button>
            </div>
            <div className="cosmetics-grid">
              {cosmeticsByTab[activeTab].map((cosmetic, index) => {
                const isUnlocked = unlocked[cosmetic];
                return (
                  <div
                    key={index}
                    className={`cosmetic-slot ${isUnlocked ? "" : "locked"}`}
                    onClick={() => handleCosmeticClick(cosmetic, index)}
                  >
                    <img
                      src={cosmetic}
                      alt={`Cosmetic ${index}`}
                      className="cosmetic-img"
                    />
                    {!isUnlocked && (
                      <div className="locked-overlay">🔒 {getCost(index)} 🪙</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Companion;
