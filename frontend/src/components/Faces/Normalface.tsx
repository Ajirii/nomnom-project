import { useEffect, useRef, useState } from "react";

type FaceState = "default" | "happy" | "arrow" | "meh" | "hungry";

interface NormalFaceProps {
  faceState: FaceState;
  cosmeticSrc: string;
}

const NormalFace: React.FC<NormalFaceProps> = ({ faceState, cosmeticSrc }) => {
  const faceRef = useRef<HTMLDivElement | null>(null);
  const eyeLRef = useRef<HTMLImageElement | null>(null);
  const eyeRRef = useRef<HTMLImageElement | null>(null);
  const mouthRef = useRef<HTMLImageElement | null>(null);
  const cosmeticRef = useRef<HTMLImageElement | null>(null);
  const [bounce, setBounce] = useState(false);

  useEffect(() => {
    if (faceState === "happy") {
      setBounce(true);
      const timeout = setTimeout(() => {
        setBounce(false);
      }, 300);
      return () => clearTimeout(timeout);
    } else {
      setBounce(false);
    }
  }, [faceState]);

  useEffect(() => {
    const face = faceRef.current;
    const eyes = [eyeLRef.current, eyeRRef.current];
    const mouth = mouthRef.current;
    const cosmetic = cosmeticRef.current;

    if (!face || eyes.some((e) => !e) || !mouth || !cosmetic) {
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

      eyes.forEach((eye) => {
        if (eye)
          eye.style.transform = `translate(${currentX}px, ${currentY}px)`;
      });

      if (mouth)
        mouth.style.transform = `translate(${currentX / 1.1}px, ${
          currentY / 1.1
        }px)`;

      if (cosmetic)
        cosmetic.style.transform = `translate(${currentX}px, ${currentY}px)`;

      requestAnimationFrame(animate);
    }

    animate();
    document.body.addEventListener("mousemove", moveFeatures);

    return () => {
      document.body.removeEventListener("mousemove", moveFeatures);
    };
  }, []);

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
      eyeL: "",
      eyeR: "",
      mouth: "",
    },
    meh: {
      eyeL: "",
      eyeR: "",
      mouth: "",
    },
    hungry: {
      eyeL: "",
      eyeR: "",
      mouth: "",
    },
  };

  const currentAssets = faceAssets[faceState];

  return (
    <div className="container">
      <div className="face-container">
        <div className={`nomnom-face ${bounce ? "bounce" : ""}`} ref={faceRef}>
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
          <img
            src={cosmeticSrc}
            className="cosmetic"
            alt="cosmetic"
            ref={cosmeticRef}
          />
        </div>
      </div>
    </div>
  );
};

export default NormalFace;
