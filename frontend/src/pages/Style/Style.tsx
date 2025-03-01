const characterSkins = [
    { id: 100, name: "Pepper", preview: "<preview img>", description: "A spicy character!", unlock: "Cook with a Hot Pepper" },
    { id: 101, name: "Tomato", preview: "<preview img>", description: "Juicy and fresh!", unlock: "Tomato Dish" },
    { id: 102, name: "Knife", preview: "<preview img>", description: "Sharp and precise!", unlock: "Fillet a Protein" },
];

interface StyleProps {
    skinId: number;
    onBack: () => void;
}

const Style = ({ skinId, onBack }: StyleProps) => {
    const skin = characterSkins.find(s => s.id === skinId);

    if (!skin) {
        return <h2>Style not found</h2>;
    }

    return (
        <>
            <div className="style-details">
                <p>{skin.preview}</p>
                <h1>{skin.name}</h1>
                <p>{skin.description}</p>
                <p>Quest to Unlock: {skin.unlock}</p>
            </div>
        </>
    );
};

export default Style;