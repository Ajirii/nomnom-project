import React, { useEffect, useRef } from "react";

const NormalFace: React.FC = () => {
  const faceRef = useRef<HTMLDivElement | null>(null);
  const eyeLRef = useRef<HTMLImageElement | null>(null);
  const eyeRRef = useRef<HTMLImageElement | null>(null);
  const mouthRef = useRef<HTMLImageElement | null>(null);
  const blushRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const face = faceRef.current;
    const eyes = [eyeLRef.current, eyeRRef.current];
    const mouth = mouthRef.current;
    const blush = blushRef.current;

    if (!face || eyes.some((e) => !e) || !mouth || !blush) {
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

      if (blush)
        blush.style.transform = `translate(${currentX}px, ${currentY}px)`;

      requestAnimationFrame(animate);
    }

    animate();
    document.body.addEventListener("mousemove", moveFeatures);

    return () => {
      document.body.removeEventListener("mousemove", moveFeatures);
    };
  }, []);

  return (
    <div className="container">
      <div className="face-container">
        <div className="nomnom-face" ref={faceRef}>
          <img
            src="/assets/white_face_assets/L-default.svg"
            className="eye eye-l"
            alt="left eye"
            ref={eyeLRef}
          />
          <img
            src="/assets/white_face_assets/R-default.svg"
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
};

export default NormalFace;
