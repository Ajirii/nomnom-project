import { useEffect, useRef, useState } from "react";

type FaceState =
  | "default"
  | "happy"
  | "arrow"
  | "meh"
  | "hungry"
  | "click"
  | "more_click"
  | "pout";

interface NormalFaceProps {
  faceState: FaceState;
  cosmeticSrc?: string;
  onClick?: () => void;
}

const NormalFace: React.FC<NormalFaceProps> = ({
  faceState,
  cosmeticSrc,
  onClick,
}) => {
  const faceRef = useRef<HTMLDivElement | null>(null);
  const eyeLRef = useRef<HTMLImageElement | null>(null);
  const eyeRRef = useRef<HTMLImageElement | null>(null);
  const mouthRef = useRef<HTMLImageElement | null>(null);
  const cosmeticRef = useRef<HTMLImageElement | null>(null);
  const eyebrowLRef = useRef<HTMLImageElement | null>(null);
  const eyebrowRRef = useRef<HTMLImageElement | null>(null);
  const isCosmeticVisible =
    typeof cosmeticSrc === "string" && cosmeticSrc.trim().startsWith("/assets");

  const animateRef = useRef<() => void>(() => {});

  const [bounce, setBounce] = useState(false);
  const [cosmeticVisible, setCosmeticVisible] = useState(true);
  const prevFaceState = useRef<FaceState>("default");

  useEffect(() => {
    if (prevFaceState.current !== "happy" && faceState === "happy") {
      setBounce(false);

      requestAnimationFrame(() => {
        setBounce(true);
      });

      const timeout = setTimeout(() => {
        setBounce(false);
      }, 600);

      prevFaceState.current = faceState;

      return () => clearTimeout(timeout);
    }

    prevFaceState.current = faceState;
  }, [faceState]);

  useEffect(() => {
    const face = faceRef.current;
    const eyes = [eyeLRef.current, eyeRRef.current];
    const mouth = mouthRef.current;
    const cosmetic = cosmeticRef.current;

    if (!face || eyes.some((e) => !e) || !mouth) {
      console.error("Face or facial features not found!");
      return;
    }

    let mouseX = 0,
      mouseY = 0;
    let currentX = 0,
      currentY = 0;
    const easeFactor = 0.1;
    const maxMove = 20;

    function moveFeatures(event: MouseEvent) {
      const rect = face!.getBoundingClientRect();
      const faceX = rect.left + rect.width / 2;
      const faceY = rect.top + rect.height / 2;

      mouseX = (event.clientX - faceX) * 0.1;
      mouseY = (event.clientY - faceY) * 0.1;

      mouseX = Math.min(Math.max(mouseX, -maxMove), maxMove);
      mouseY = Math.min(Math.max(mouseY, -maxMove), maxMove);
    }

    function animate() {
      currentX += (mouseX - currentX) * easeFactor;
      currentY += (mouseY - currentY) * easeFactor;
      const eyebrowL = eyebrowLRef.current;
      const eyebrowR = eyebrowRRef.current;

      if (eyebrowL)
        eyebrowL.style.transform = `translate(${currentX}px, ${currentY}px)`;
      if (eyebrowR)
        eyebrowR.style.transform = `translate(${currentX}px, ${currentY}px)`;

      eyes.forEach((eye) => {
        if (eye)
          eye.style.transform = `translate(${currentX}px, ${currentY}px)`;
      });

      if (mouth)
        mouth.style.transform = `translate(${currentX / 1.1}px, ${
          currentY / 1.1
        }px)`;

      if (cosmeticSrc && cosmetic) {
        cosmetic.style.transform = `translate(${currentX}px, ${currentY}px)`;
      }

      if (animateRef.current) {
        requestAnimationFrame(() => animateRef.current!());
      }
    }

    animateRef.current = animate;
    requestAnimationFrame(animate);

    document.body.addEventListener("mousemove", moveFeatures);

    return () => {
      document.body.removeEventListener("mousemove", moveFeatures);
    };
  }, [faceState, cosmeticSrc]);

  useEffect(() => {
    if (faceState === "pout" && animateRef.current) {
      requestAnimationFrame(() => animateRef.current!());
    }
  }, [faceState]);

  const faceAssets = {
    default: {
      eyeL: "/assets/white_face_assets/L-default.svg",
      eyeR: "/assets/white_face_assets/R-default.svg",
      mouth: "/assets/white_face_assets/open-smile.svg",
    },
    happy: {
      eyeL: "/assets/white_face_assets/l-happy.svg",
      eyeR: "/assets/white_face_assets/r-happy.svg",
      mouth: "/assets/white_face_assets/open-smile.svg",
    },
    arrow: {
      eyeL: "/assets/white_face_assets/L-default.svg",
      eyeR: "/assets/white_face_assets/R-default.svg",
      mouth: "/assets/white_face_assets/uparrow-mouth.svg",
    },
    meh: {
      eyeL: "/assets/white_face_assets/L-default.svg",
      eyeR: "/assets/white_face_assets/R-default.svg",
      mouth: "/assets/white_face_assets/slant-mouth.svg",
    },
    hungry: {
      eyeL: "/assets/white_face_assets/L-sadslant.svg",
      eyeR: "/assets/white_face_assets/R-sadslant.svg",
      mouth: "/assets/white_face_assets/upside-down-w-mouth.svg",
    },
    click: {
      eyeL: "/assets/white_face_assets/L-wink.svg",
      eyeR: "/assets/white_face_assets/R-wink.svg",
      mouth: "/assets/white_face_assets/cat-mouth.svg",
    },
    more_click: {
      eyeL: "/assets/white_face_assets/L-wink.svg",
      eyeR: "/assets/white_face_assets/R-wink.svg",
      mouth: "/assets/white_face_assets/smile-mouth.svg",
    },
    pout: {
      eyeL: "/assets/white_face_assets/L-default.svg",
      eyeR: "/assets/white_face_assets/R-default.svg",
      mouth: "/assets/white_face_assets/pout-mouth.svg",
    },
  };

  const currentAssets = faceAssets[faceState];

  return (
    <div className="container">
      <div className="face-container">
        <div
          className={`nomnom-face ${bounce ? "bounce" : ""}`}
          ref={faceRef}
          onClick={onClick}
        >
          <img
            src={currentAssets.eyeL}
            className="eye eye-l"
            alt="left eye"
            ref={eyeLRef}
          />
          <img
            src={currentAssets.eyeR}
            className="eye eye-r"
            alt="right eye"
            ref={eyeRRef}
          />
          <img
            src={currentAssets.mouth}
            className="mouth"
            alt="mouth"
            ref={mouthRef}
          />
          {faceState === "pout" && (
            <>
              <img
                src="/assets/white_face_assets/L-angry-eyebrow.svg"
                className="eyebrow eyebrow-l"
                alt="left eyebrow"
                ref={eyebrowLRef}
              />
              <img
                src="/assets/white_face_assets/R-angry-eyebrow.svg"
                className="eyebrow eyebrow-r"
                alt="right eyebrow"
                ref={eyebrowRRef}
              />
            </>
          )}
          {isCosmeticVisible && cosmeticVisible && (
            <img
              src={cosmeticSrc}
              className="cosmetic"
              alt=""
              ref={cosmeticRef}
              onError={() => setCosmeticVisible(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default NormalFace;
