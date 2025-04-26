import { useState, useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import { fetchCosmetics } from "../../utils/fetchCosmetics";

interface Cosmetic {
  cosmeticId: string;
  name: string;
  description: string;
  iconUrl: string;
  price: number;
}

interface CompanionProps {
  hunger: number;
  coins: number;
  setCoins: (value: number) => void;
  unlockedCosmetics: { [key: string]: boolean };
  setUnlockedCosmetics: Dispatch<SetStateAction<{ [key: string]: boolean }>>;
  onCosmeticChange: (newCosmetic: string) => void;
}

const Companion = ({
  hunger,
  coins,
  setCoins,
  unlockedCosmetics,
  setUnlockedCosmetics,
  onCosmeticChange,
}: CompanionProps) => {
  const [cosmetics, setCosmetics] = useState<Cosmetic[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCosmeticsData = async () => {
      try {
        const data = await fetchCosmetics();
        setCosmetics(data);
      } catch (error) {
        setFetchError("Failed to load cosmetics. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCosmeticsData();
  }, []);

  const handleCosmeticClick = (
    cosmeticId: string,
    price: number,
    iconUrl: string
  ) => {
    const isAlreadyUnlocked = unlockedCosmetics[cosmeticId];

    if (isAlreadyUnlocked) {
      onCosmeticChange(iconUrl);
      return;
    }

    if (coins >= price) {
      setUnlockedCosmetics((prev) => ({ ...prev, [cosmeticId]: true }));
      setCoins(coins - price);
      setMessage(`Unlocked ${cosmeticId} for ${price} coins!`);
      onCosmeticChange(iconUrl);
    } else {
      setMessage("Not enough coins to unlock this cosmetic.");
    }
  };

  if (isLoading) {
    return <p>Loading cosmetics...</p>;
  }

  return (
    <div className="companion-section">
      {/* HP Info Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>HP Bar</h2>
            <p>
              The more quests you complete, the more NomNom's HP bar fills. Make
              sure to keep him well-fed and happy!
            </p>
            <button
              className="close-button"
              onClick={() => setShowModal(false)}
              aria-label="Close modal"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* General Message Modal */}
      {message && (
        <div className="modal-overlay" onClick={() => setMessage(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <p>{message}</p>
            <button
              className="close-button"
              onClick={() => setMessage(null)}
              aria-label="Close message"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* HP Bar Section */}
      <div className="hp-layout">
        <button
          className="info-button"
          onClick={() => setShowModal(true)}
          aria-label="Info about HP bar"
        >
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
        </div>
      </div>

      {/* Cosmetics Section */}
      <div className="cosmetics-container">
        <div className="cosmetics-header-row">
          <h2 className="cosmetics-header">Cosmetics</h2>
          <p className="coins">
            <strong>Coins:</strong> {coins}
          </p>
        </div>
        <hr className="cosmetics-divider" />

        {fetchError && (
          <div className="costume-error-message">
            <p>{fetchError}</p>
          </div>
        )}

        <div className="cosmetics-grid">
          {cosmetics.map(({ cosmeticId, name, iconUrl, price }) => {
            const isUnlocked = unlockedCosmetics[cosmeticId];

            return (
              <div
                key={cosmeticId}
                className={`cosmetic-slot ${isUnlocked ? "" : "locked"}`}
                onClick={() => handleCosmeticClick(cosmeticId, price, iconUrl)}
                role="button"
                tabIndex={0}
                aria-label={`Select ${name} cosmetic`}
              >
                <img
                  src={iconUrl}
                  alt={name}
                  className="cosmetic-img"
                  aria-hidden="true"
                />
                {!isUnlocked && (
                  <div className="locked-overlay">🔒 {price}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Companion;
