import { useState } from 'react';
import './StylesList.css';
import Style from '../Style/Style';

const StylesList = () => {
    const [activeComponent, setActiveComponent] = useState<string>("home");
    const [selectedSkin, setSelectedSkin] = useState<number | null>(null);

    const characterSkins = [
        { id: 100, name: 'Pepper', preview: 'preview img' },
        { id: 101, name: 'Tomato', preview: 'preview img' },
        { id: 102, name: 'Knife', preview: 'preview img' },
    ];

    const handleLinkClick = (component: string, skinId?: number) => {
        setActiveComponent(component);
        if (skinId !== undefined) {
            setSelectedSkin(skinId);
        }
    };

    return (
        <div className='style-container'>
            {activeComponent === "home" && (
                <>
                    <h1>NomNom Styles</h1>
                    <div className="style-list">
                        {characterSkins.map(skin => (
                            <div 
                                key={skin.id} 
                                className="style-card"
                                onClick={() => handleLinkClick("style", skin.id)}
                            >
                                <h2>{skin.name}</h2>
                                <p>{skin.preview}</p>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {activeComponent === "style" && selectedSkin !== null && (
                <Style skinId={selectedSkin} onBack={() => setActiveComponent("home")} />
            )}
        </div>
    );
};

export default StylesList;
