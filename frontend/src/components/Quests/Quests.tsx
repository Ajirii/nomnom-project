import { useState } from "react";

interface Quest {
  id: number;
  name: string;
  description: string;
  reward: string;
}

const questDetails = [
  {
    id: 1,
    name: "Gather Ingredients",
    description: "Find fresh ingredients for NomNom's next dish. Not poison.",
    reward: "50 Hunger",
  },
  {
    id: 2,
    name: "Master the Frying Pan",
    description:
      "Learn to perfectly fry an egg. It'll make you look cool. I promise.",
    reward: "100 Hunger",
  },
  {
    id: 3,
    name: "Bake the Perfect Cake",
    description: "Create a delicious cake without burning it!",
    reward: "150 Hunger",
  },
  {
    id: 4,
    name: "Spice Challenge!",
    description: "Make a spicy dish. Not too spicy... Or else...",
    reward: "200 Hunger",
  },
];

const Quests = () => {
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);

  return (
    <div className="row">
      <div className="main">
        <div className="quest-container">
          <div className="master">
            <h2>Quest Log</h2>
            <ul>
              {questDetails.map((quest) => (
                <li
                  key={quest.id}
                  onClick={() => setSelectedQuest(quest)}
                  className={selectedQuest?.id === quest.id ? "active" : ""}
                >
                  {quest.name}
                </li>
              ))}
            </ul>
          </div>

          <div className="detail">
            {selectedQuest ? (
              <div>
                <h2>{selectedQuest.name}</h2>
                <p>
                  <strong>Description:</strong> {selectedQuest.description}
                </p>
                <p>
                  <strong>Reward:</strong> {selectedQuest.reward}
                </p>
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
