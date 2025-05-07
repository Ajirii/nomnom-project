import { useState, useEffect, useRef } from "react";
import NormalFace from "./Normalface";

type FaceState =
  | "default"
  | "happy"
  | "arrow"
  | "meh"
  | "hungry"
  | "click"
  | "more_click"
  | "pout";

type ClickableNomNomProps = {
  baseFaceState: "default" | "happy" | "arrow" | "meh" | "hungry";
  cosmeticSrc?: string;
};

const ClickableNomNom: React.FC<ClickableNomNomProps> = ({
  baseFaceState,
  cosmeticSrc,
}) => {
  const [faceState, setFaceState] = useState<FaceState>(baseFaceState);
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState<number>(0);

  const resetDelay = 5000;
  const clickWindow = 3000;
  const displayTime = 1000;

  const transientStates = new Set(["click", "more_click", "pout"]);

  const clickResetTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const clickDisplayTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleClick = () => {
    const currentTime = Date.now();
    const timeDiff = currentTime - lastClickTime;

    if (timeDiff > clickWindow) {
      setClickCount(1);
      setFaceState("click");
    } else {
      setClickCount((prev) => prev + 1);
      if (clickCount >= 7) {
        setFaceState("pout");
      } else if (clickCount >= 3) {
        setFaceState("more_click");
      } else {
        setFaceState("click");
      }
    }

    setLastClickTime(currentTime);

    if (clickDisplayTimeoutRef.current)
      clearTimeout(clickDisplayTimeoutRef.current);

    clickDisplayTimeoutRef.current = setTimeout(() => {
      setFaceState(baseFaceState);
    }, displayTime);

    if (clickResetTimeoutRef.current)
      clearTimeout(clickResetTimeoutRef.current);

    clickResetTimeoutRef.current = setTimeout(() => {
      setClickCount(0);
      setFaceState(baseFaceState);
    }, resetDelay);
  };

  useEffect(() => {
    return () => {
      if (clickResetTimeoutRef.current)
        clearTimeout(clickResetTimeoutRef.current);
      if (clickDisplayTimeoutRef.current)
        clearTimeout(clickDisplayTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (!transientStates.has(faceState)) {
      setFaceState(baseFaceState);
    }
  }, [baseFaceState]);

  return (
    <div className="nomnom-wrapper">
      <NormalFace
        faceState={faceState}
        cosmeticSrc={cosmeticSrc}
        onClick={handleClick}
      />
    </div>
  );
};

export default ClickableNomNom;
