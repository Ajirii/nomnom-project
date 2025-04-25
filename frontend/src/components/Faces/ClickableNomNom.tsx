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
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const resetDelay = 5000;
  const clickWindow = 3000;
  const displayTime = 1000;

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

    setTimeout(() => {
      setFaceState(baseFaceState);
    }, displayTime);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setClickCount(0);
      setFaceState(baseFaceState);
    }, resetDelay);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div onClick={handleClick} style={{ cursor: "pointer" }}>
      <NormalFace faceState={faceState} cosmeticSrc={cosmeticSrc} />
    </div>
  );
};

export default ClickableNomNom;
