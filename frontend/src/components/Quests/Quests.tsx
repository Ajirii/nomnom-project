import { useState } from "react";
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
    rewardCurrency: 1000,
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

export const Quests = ({
  coins,
  setCoins,
}: {
  coins: number;
  setCoins: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [quests, setQuests] = useState<Quest[]>(initialQuests);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);

  const handleAccept = (id: string) => {
    setQuests((prev) =>
      prev.map((q) => (q.questId === id ? { ...q, status: "accepted" } : q))
    );
  };

  const handleComplete = (id: string) => {
    const quest = quests.find((q) => q.questId === id);
    if (quest && quest.status === "accepted") {
      setCoins((prev) => prev + quest.rewardCurrency);
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

  const getQuestItemClass = (quest: Quest) => {
    let base = "quest-item";
    if (selectedQuest?.questId === quest.questId) base += " active";
    if (quest.status === "accepted") base += " accepted";
    if (quest.status === "completed") base += " completed";
    return base;
  };

  return (
    <div className="quest-row">
      <div className="quest-main">
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
  );
};

export default Quests;
