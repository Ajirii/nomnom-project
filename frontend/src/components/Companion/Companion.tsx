import { useState } from "react";

const Companion = ({ hunger }: { hunger: number }) => {
  const [activeTab, setActiveTab] = useState(0);

  const tabTitles = ["Head", "Eyes", "Accessories", "Background"]; // Customize these
  

  return (
    <div className="row">
      <div className="main">
        {/* Cosmetics Section */}
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

          <h2 className="cosmetics-header">Cosmetics</h2>

          <div className="cosmetics-grid">
            {[...Array(10)].map((_, index) => (
              <div key={index} className="cosmetic-slot"></div>
            ))}
          </div>
        </div>

        {/* Mood Box */}
        <div className="mood-container">
          <div className="hp-bar">
            <div
              className="hp-fill"
              style={{
                width: `${hunger}%`,
                backgroundColor: hunger <= 20 ? "red" : "#4CAF50",
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Companion;
