import { useState } from "react";

// Import cosmetics
import headband from "../../assets/cosmetics/headband.png";
import witchHat from "../../assets/cosmetics/witchhat.png";
import halo from "../../assets/cosmetics/halo.png";
import glasses from "../../assets/cosmetics/glasses.png";
import bowtie from "../../assets/cosmetics/bowtie.png";
import chair from "../../assets/cosmetics/chair.png";
import plant1 from "../../assets/cosmetics/plant1.png";
import plant2 from "../../assets/cosmetics/plant2.png";
import crown from "../../assets/cosmetics/crown.png";
import monocle from "../../assets/cosmetics/monocle.png";
import mustache from "../../assets/cosmetics/mustache.png";
import egg from "../../assets/cosmetics/egg.png";

const Companion = ({ hunger }: { hunger: number }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const tabTitles = ["Head", "Eyes", "Accessories", "Background"];

  const cosmeticsByTab = [
    [headband, witchHat, halo, crown],     // Headz
    [glasses, monocle],                // Eyes
    [bowtie, mustache, egg],                 // Accessories
    [chair, plant1, plant2],                   // Background
  ];

  const handleSaveToggle = () => {
    setIsSaved((prev) => !prev);
    if (!isSaved) {
      console.log("Cosmetics saved!");
      // Future improvement: localStorage.setItem("cosmetics", JSON.stringify(...))
    }
  };

  return (
    <div className="row">
      <div className="main">
        {/* Info Button */}
        <button className="info-button" onClick={() => setShowModal(true)}>
          ?
        </button>

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>HP Bar</h2>
              <p>
                The more quests you complete, the more NomNom's HP bar fills.
                Make sure to keep him well-fed and happy!
              </p>
              <button
                className="close-button"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Cosmetics Section */}
        <div className="cosmetics-container">
          {/* Save Checkbox */}
          <div className="save-selection-wrapper">
            <input
              type="checkbox"
              id="saveCheckbox"
              className="styled-checkbox"
              checked={isSaved}
              onChange={handleSaveToggle}
            />
            <label htmlFor="saveCheckbox" className="styled-label">
              Save
            </label>
          </div>

          {/* Tabs */}
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

          <h2 className="cosmetics-header">Cosmetics</h2>

          {/* Cosmetic Slots */}
          <div className="cosmetics-grid">
            {[...Array(10)].map((_, index) => (
              <div key={index} className="cosmetic-slot">
                {cosmeticsByTab[activeTab][index] && (
                  <img
                    src={cosmeticsByTab[activeTab][index]}
                    alt={`Cosmetic ${index}`}
                    className="cosmetic-img"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Mood Section */}
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
        </div>
      </div>
    </div>
  );
};

export default Companion;
