// app/Faces/NormalFace.tsx
"use client";

import { useEffect, useRef, forwardRef, useImperativeHandle, useState } from "react";

export type NormalFaceHandle = {
  setEyesToHappy: () => void;
  setEyesToDefault: () => void;
  triggerEyeSwap: () => void;
};

const NormalFace = forwardRef<NormalFaceHandle>((_, ref) => {
  const faceRef = useRef<HTMLDivElement>(null);
  const eyeLRef = useRef<HTMLImageElement>(null);
  const eyeRRef = useRef<HTMLImageElement>(null);
  const mouthRef = useRef<HTMLImageElement>(null);
  const blushRef = useRef<HTMLImageElement>(null);

  const [leftEyeSrc, setLeftEyeSrc] = useState("/assets/white_face_assets/L-default.svg");
  const [rightEyeSrc, setRightEyeSrc] = useState("/assets/white_face_assets/R-default.svg");
  
  useImperativeHandle(ref, () => ({
    setEyesToHappy: () => {
      setLeftEyeSrc("/assets/white_face_assets/l-happy.svg");
      setRightEyeSrc("/assets/white_face_assets/r-happy.svg");
    },
    setEyesToDefault: () => {
      setLeftEyeSrc("/assets/white_face_assets/L-default.svg");
      setRightEyeSrc("/assets/white_face_assets/R-default.svg");
    },
    triggerEyeSwap: () => {
      setLeftEyeSrc("/assets/white_face_assets/empty.svg");
      setRightEyeSrc("/assets/white_face_assets/empty.svg");

      setTimeout(() => {
        setLeftEyeSrc("/assets/white_face_assets/l-happy.svg");
        setRightEyeSrc("/assets/white_face_assets/r-happy.svg");
    }, 50);
    },
  }));

  useEffect(() => {
    if (
      !faceRef.current ||
      !eyeLRef.current ||
      !eyeRRef.current ||
      !mouthRef.current ||
      !blushRef.current
    ) {
      console.error("Face or facial features not found!");
      return;
    }

    const face = faceRef.current;
    const eyes = [eyeLRef.current, eyeRRef.current];
    const mouth = mouthRef.current;
    const blush = blushRef.current;

    let mouseX = 0,
      mouseY = 0;
    let currentX = 0,
      currentY = 0;
    const easeFactor = 0.1;
    const maxMove = 20;

    const moveFeatures = (event: MouseEvent) => {
      if (!face) return;
      const rect = face.getBoundingClientRect();
      const faceX = rect.left + rect.width / 2;
      const faceY = rect.top + rect.height / 2;

      mouseX = (event.clientX - faceX) * 0.1;
      mouseY = (event.clientY - faceY) * 0.1;

      mouseX = Math.min(Math.max(mouseX, -maxMove), maxMove);
      mouseY = Math.min(Math.max(mouseY, -maxMove), maxMove);
    };

    const animate = () => {
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

      if (blush)
        blush.style.transform = `translate(${currentX}px, ${currentY}px)`;

      requestAnimationFrame(animate);
    };

    document.body.addEventListener("mousemove", moveFeatures);
    animate();

    return () => {
      document.body.removeEventListener("mousemove", moveFeatures);
    };
  }, []);

  return (
    <div className="container">
      <div className="face-container">
        <div className="nomnom-face" ref={faceRef}>
          <img
          
            src={leftEyeSrc}
            className="eye eye-l"
            alt="left eye"
            ref={eyeLRef}
          />
          <img
            src={rightEyeSrc}
            className="eye eye-r"
            alt="right eye"
            ref={eyeRRef}
          />
          <img
            src="/assets/white_face_assets/open-smile.svg"
            className="mouth"
            alt="mouth"
            ref={mouthRef}
          />
          <img
            src="/assets/white_face_assets/blush.svg"
            className="blush"
            alt="blush"
            ref={blushRef}
          />
        </div>
      </div>
    </div>
  );
});

export default NormalFace;
