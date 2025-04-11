const Start = ({ onStartClick }: { onStartClick: () => void }) => {
  return (
    <div className="s-main">
      <div className="s-container">
        <span className="z-1">Z</span>
        <span className="z-2">Z</span>
        <span className="z-3">Z</span>
        <div className="face-container">
          <div className="sleepy-nomnom-face">
            <div className="s-eye-l"></div>
            <div className="s-eye-r"></div>
            <div className="s-mouth"></div>
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
