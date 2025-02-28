import React, { useEffect } from "react";

const NormalFace: React.FC = () => {
  useEffect(() => {
    const face = document.querySelector(".nomnom-face");
    const eyes = document.querySelectorAll(".eye-l, .eye-r");
    const mouth = document.querySelectorAll(".mouth");
    const blush = document.querySelectorAll(".blush-l, .blush-r");

    if (
      !face ||
      eyes.length === 0 ||
      mouth.length === 0 ||
      blush.length === 0
    ) {
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
      if (face instanceof HTMLElement) {
        const rect = face.getBoundingClientRect();
        const faceX = rect.left + rect.width / 2;
        const faceY = rect.top + rect.height / 2;

        mouseX = (event.clientX - faceX) * 0.1;
        mouseY = (event.clientY - faceY) * 0.1;

        mouseX = Math.min(Math.max(mouseX, -maxMove), maxMove);
        mouseY = Math.min(Math.max(mouseY, -maxMove), maxMove);
      }
    }

    function animate() {
      currentX += (mouseX - currentX) * easeFactor;
      currentY += (mouseY - currentY) * easeFactor;

      eyes.forEach((eye) => {
        if (eye instanceof HTMLElement) {
          eye.style.transform = `translate(${currentX}px, ${currentY}px)`;
        }
      });

      mouth.forEach((m) => {
        if (m instanceof HTMLElement) {
          m.style.transform = `translate(${currentX / 1.1}px, ${
            currentY / 1.1
          }px)`;
        }
      });

      blush.forEach((b) => {
        if (b instanceof HTMLElement) {
          b.style.transform = `translate(${currentX}px, ${currentY}px)`;
        }
      });

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
        <div className="nomnom-face">
          <div className="blush blush-l"></div>
          <div className="blush blush-r"></div>
          <div className="eye-l"></div>
          <div className="eye-r"></div>
          <div className="mouth"></div>
        </div>
      </div>
    </div>
  );
};

export default NormalFace;
