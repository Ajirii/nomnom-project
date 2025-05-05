import { useState, useEffect } from "react";
import orange from "/assets/cosmetics/orange.png";

interface Quest {
  questId: string;
  title: string;
  description: string;
  rewardCurrency: number;
  rewardHunger: number;
  status: "available" | "seen" | "accepted" | "completed";
}

const initialQuests: Quest[] = [
  {
    questId: "1",
    title: "Recipe Adventure",
    description:
      "Cook a dish from a cuisine you've never heard of. Bonus points if you can pronounce it!",
    rewardCurrency: 30,
    rewardHunger: 40,
    status: "available",
  },
  {
    questId: "2",
    title: "Master the Frying Pan",
    description:
      "Perfectly fry an egg. It's a simple task… unless you're still trying to figure out how not to turn it into scrambled eggs.",
    rewardCurrency: 15,
    rewardHunger: 20,
    status: "available",
  },
  {
    questId: "3",
    title: "Cake Perfection",
    description: "Create a delicious cake without burning it!",
    rewardCurrency: 20,
    rewardHunger: 30,
    status: "available",
  },
  {
    questId: "4",
    title: "Spice Challenge!",
    description: "Make a spicy dish. Not too spicy... Or else...",
    rewardCurrency: 25,
    rewardHunger: 25,
    status: "available",
  },
];

const Quests = () => {
  function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  const [quests, setQuests] = useState<Quest[]>(() =>
    shuffleArray(initialQuests)
  );
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [coinsEarned, setCoinsEarned] = useState<number>(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchQuests = async () => {
      try {
        const res = await fetch("/api/quests");
        if (!res.ok) throw new Error("Failed to fetch quests");
        const data = await res.json();

        const questsWithStatus = data.map((q: Quest) => ({
          ...q,
          status: "available",
        }));

        setQuests(questsWithStatus);
      } catch (err) {
        console.error("Error fetching quests:", err);
      }
    };

    fetchQuests();
  }, []);

  const handleAccept = (id: string) => {
    setQuests((prev) =>
      prev.map((q) => (q.questId === id ? { ...q, status: "accepted" } : q))
    );
  };

  const handleComplete = (id: string) => {
    const quest = quests.find((q) => q.questId === id);
    if (quest && quest.status === "accepted") {
      setCoinsEarned((prev) => prev + quest.rewardCurrency);
    }
    setQuests((prev) =>
      prev.map((q) => (q.questId === id ? { ...q, status: "completed" } : q))
    );
  };

  const groupedQuests = {
    available: quests.filter((q) => q.status === "available"),
    accepted: quests.filter((q) => q.status === "accepted"),
    completed: quests.filter((q) => q.status === "completed"),
  };

  const completedCount = groupedQuests.completed.length;

  const achievements = [
    { threshold: 1, label: "🏅", title: "Novice Chef", desc: "Completed your first quest" },
    { threshold: 3, label: "💪", title: "Committed Cook", desc: "Completed 3 quests" },
    { threshold: 5, label: "🔥", title: "Culinary Challenger", desc: "Completed 5 quests" },
    { threshold: 10, label: "⭐", title: "Kitchen Pro", desc: "Completed 10 quests" },
    { threshold: 15, label: "🏆", title: "Master of Meals", desc: "Completed 15 quests" },
    { threshold: 20, label: "🍽️", title: "Dining Dynamo", desc: "Completed 20 quests" },
    { threshold: 25, label: "🥘", title: "Feast Commander", desc: "Completed 25 quests" },
    { threshold: 30, label: "👨‍🍳", title: "Legendary Chef", desc: "Completed 30 quests" },
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
          <div className="modal-content achievements-grid" onClick={(e) => e.stopPropagation()}>
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
            <button className="close-button" onClick={() => setShowModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      <div className="main">
        <button className="achievements-btn" onClick={() => setShowModal(true)}>
          View Achievements 🏆
        </button>

        <div className={`quest-container ${selectedQuest ? "expanded" : ""}`}>
          <div className="master">
            <h2>
              Quest Log
              <img src={orange} alt="orange" className="quest-icon" />
            </h2>
            <p>
              <strong>Total Coins:</strong> {coinsEarned} 🪙
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
  );
};

export default Quests;
