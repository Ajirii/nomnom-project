const Start = ({ onStartClick }: { onStartClick: () => void }) => {
  const iconUrls = {
    eyeL: "/assets/white_face_assets/L-sleep.svg",
    eyeR: "/assets/white_face_assets/R-sleep.svg",
    mouth: "/assets/white_face_assets/oval-mouth.svg",
  };
  return (
    <div className="s-main">
      <div className="s-container">
        <span className="z-1">Z</span>
        <span className="z-2">Z</span>
        <span className="z-3">Z</span>
        <div className="face-container">
          <div className="sleepy-nomnom-face">
            <img src={iconUrls.eyeL} alt="Left Eye" className="s-eye-l" />
            <img src={iconUrls.eyeR} alt="Right Eye" className="s-eye-r" />
            <img src={iconUrls.mouth} alt="Mouth" className="s-mouth" />
          </div>
        </div>
      </div>
      <button className="start-button" onClick={onStartClick}>
        Start
      </button>
    </div>
  );
};

export default Start;
