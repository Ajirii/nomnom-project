import { useState } from "react";
import orange from "../../assets/cosmetics/orange.png";

interface Quest {
  id: number;
  name: string;
  description: string;
  reward: string;
  status: "available" | "seen" | "accepted" | "completed";
}

const initialQuests: Quest[] = [
  {
    id: 1,
    name: "Gather Ingredients",
    description: "Find fresh ingredients for NomNom's next dish. Not poison.",
    reward: "50 Hunger",
    status: "available",
  },
  {
    id: 2,
    name: "Master the Frying Pan",
    description: "Learn to perfectly fry an egg. It'll make you look cool. I promise.",
    reward: "100 Hunger",
    status: "available",
  },
  {
    id: 3,
    name: "Bake the Perfect Cake",
    description: "Create a delicious cake without burning it!",
    reward: "150 Hunger",
    status: "available",
  },
  {
    id: 4,
    name: "Spice Challenge!",
    description: "Make a spicy dish. Not too spicy... Or else...",
    reward: "200 Hunger",
    status: "available",
  },
];

const Quests = () => {
  const [quests, setQuests] = useState<Quest[]>(initialQuests);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);

  const handleAccept = (id: number) => {
    setQuests(prev => prev.map(q => q.id === id ? { ...q, status: "accepted" } : q));
  };

  const handleComplete = (id: number) => {
    setQuests(prev => prev.map(q => q.id === id ? { ...q, status: "completed" } : q));
  };

  const groupedQuests = {
    available : quests.filter(q => q.status === "available"),
    accepted: quests.filter(q => q.status === "accepted"),
    completed: quests.filter(q => q.status === "completed"),
  };

  const getQuestItemClass = (quest: Quest) => {
    let base = "quest-item";
    if (selectedQuest?.id === quest.id) base += " active";
    if (quest.status === "accepted") base += " accepted";
    if (quest.status === "completed") base += " completed";
    return base;
  };

  return (
    <div className="row">
      <div className="main">
        <div className="quest-container">
          <div className="master">
            <h2>Quest Log 
            <img src={orange} alt="orange" className="quest-icon" />
            </h2>
            {Object.entries(groupedQuests).map(([status, quests]) => (
              <div key={status}>
                <h3 className="quest-section-heading">
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </h3>
                <ul>
                  {quests.map((quest) => (
                    <li
                      key={quest.id}
                      onClick={() => setSelectedQuest(quest)}
                      className={getQuestItemClass(quest)}
                    >
                      {quest.name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="detail">
            {selectedQuest ? (
              <div>
                <h2>{selectedQuest.name}</h2>
                <p><strong>Description:</strong> {selectedQuest.description}</p>
                <p><strong>Reward:</strong> {selectedQuest.reward}</p>
                {selectedQuest.status !== "completed" && (
                  <div className="button-wrapper">
                    {selectedQuest.status !== "accepted" && (
                      <button
                        className="quest-btn quest-btn-accept"
                        onClick={() => handleAccept(selectedQuest.id)}
                      >
                        Accept
                      </button>
                    )}
                    {selectedQuest.status === "accepted" && (
                      <button
                        className="quest-btn quest-btn-complete"
                        onClick={() => handleComplete(selectedQuest.id)}
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
