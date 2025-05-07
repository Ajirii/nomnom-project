import { useEffect, useState } from "react";
import orange from "/assets/cosmetics/orange.png";
import {
  fetchUserQuests,
  completeQuest,
  acceptQuest,
} from "../../utils/fetchQuests";

interface Quest {
  questId: string;
  title: string;
  description: string;
  rewardCurrency: number;
  rewardHunger: number;
  status: "available" | "accepted" | "completed";
}

export const Quests = ({
  coins,
  setCoins,
}: {
  coins: number;
  setCoins: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [completedCount, setCompletedCount] = useState<number>(0);

  useEffect(() => {
    const loadQuests = async () => {
      try {
        const questsFromApi = await fetchUserQuests();
        const normalized = questsFromApi.quests.map((q: any) => ({
          ...q,
          status: q.status.toLowerCase(),
        }));
        setQuests(normalized);
        setCompletedCount(questsFromApi.completedCount);
        setCoins(questsFromApi.coins);
      } catch (err) {
        console.error("Error loading quests:", err);
      }
    };

    loadQuests();
  }, []);

  const handleAccept = async (questId: string) => {
    try {
      await acceptQuest(questId);
      setQuests((prev) =>
        prev.map((q) =>
          q.questId === questId ? { ...q, status: "accepted" } : q
        )
      );
    } catch (err) {
      console.error("Error accepting quest:", err);
    }
  };

  const handleComplete = async (questId: string) => {
    try {
      const newCoins = await completeQuest(questId);
      setCoins(newCoins);
      setQuests((prev) =>
        prev.map((q) =>
          q.questId === questId ? { ...q, status: "completed" } : q
        )
      );
      setCompletedCount((prev) => prev + 1);
    } catch (err) {
      console.error("Error completing quest:", err);
    }
  };

  const groupedQuests = {
    available: quests.filter((q) => q.status === "available"),
    accepted: quests.filter((q) => q.status === "accepted"),
    completed: quests.filter((q) => q.status === "completed"),
  };

  const achievements = [
    {
      threshold: 1,
      label: "🏅",
      title: "Novice Chef",
      desc: "Completed your first quest",
    },
    {
      threshold: 3,
      label: "💪",
      title: "Committed Cook",
      desc: "Completed 3 quests",
    },
    {
      threshold: 5,
      label: "🔥",
      title: "Culinary Challenger",
      desc: "Completed 5 quests",
    },
    {
      threshold: 10,
      label: "⭐",
      title: "Kitchen Pro",
      desc: "Completed 10 quests",
    },
    {
      threshold: 15,
      label: "🏆",
      title: "Master of Meals",
      desc: "Completed 15 quests",
    },
    {
      threshold: 20,
      label: "🍽️",
      title: "Dining Dynamo",
      desc: "Completed 20 quests",
    },
    {
      threshold: 25,
      label: "🥘",
      title: "Feast Commander",
      desc: "Completed 25 quests",
    },
    {
      threshold: 30,
      label: "👨‍🍳",
      title: "Legendary Chef",
      desc: "Completed 30 quests",
    },
  ];

  const getQuestItemClass = (quest: Quest) => {
    let base = "quest-item";
    if (selectedQuest?.questId === quest.questId) base += " active";
    if (quest.status === "accepted") base += " accepted";
    if (quest.status === "completed") base += " completed";
    return base;
  };

  return (
    <div className="recipes-section">
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className="modal-content achievements-grid"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="achievement-heading">Achievements</h2>
            <div className="achievement-boxes">
              {achievements.map((a, index) => (
                <div
                  key={index}
                  className={`achievement-tile ${
                    completedCount >= a.threshold ? "unlocked" : "locked"
                  }`}
                >
                  <div className="achievement-icon">{a.label}</div>
                  <div className="achievement-title">{a.title}</div>
                  <div className="achievement-desc">{a.desc}</div>
                </div>
              ))}
            </div>
            <button
              className="close-button"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="row">
        <div className="main">
          <button
            className="achievements-btn"
            onClick={() => setShowModal(true)}
          >
            View Achievements 🏆
          </button>

          <div className="quest-container">
            <div className="master">
              <h2>
                Quest Log
                <img src={orange} alt="orange" className="quest-icon" />
              </h2>
              <p>
                <strong>Total Coins:</strong> {coins} 🪙
              </p>
              {Object.entries(groupedQuests).map(([status, quests]) => (
                <div key={status}>
                  <h3 className="quest-section-heading">
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </h3>
                  <ul>
                    {quests.map((quest) => (
                      <li
                        key={quest.questId}
                        onClick={() => setSelectedQuest(quest)}
                        className={getQuestItemClass(quest)}
                      >
                        {quest.title}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="detail">
              {selectedQuest ? (
                <div>
                  <h2>{selectedQuest.title}</h2>
                  <p>
                    <strong>Description:</strong> {selectedQuest.description}
                  </p>
                  <p>
                    <strong>Hunger Reward:</strong> {selectedQuest.rewardHunger}
                  </p>
                  <p>
                    <strong>Coins:</strong> {selectedQuest.rewardCurrency} 🪙
                  </p>
                  {selectedQuest.status !== "completed" && (
                    <div className="button-wrapper">
                      {selectedQuest.status !== "accepted" && (
                        <button
                          className="quest-btn quest-btn-accept"
                          onClick={() => handleAccept(selectedQuest.questId)}
                        >
                          Accept
                        </button>
                      )}
                      {selectedQuest.status === "accepted" && (
                        <button
                          className="quest-btn quest-btn-complete"
                          onClick={() => handleComplete(selectedQuest.questId)}
                        >
                          Complete
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <p className="placeholder">Select a quest to view details</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quests;
