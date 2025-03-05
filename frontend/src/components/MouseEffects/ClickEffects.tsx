import { useState, useEffect } from "react";
import "./ClickEffects.css";

interface Spark {
  id: number;
  x: number;
  y: number;
  hue: number;
}

const ClickEffects = () => {
  const [sparks, setSparks] = useState<Spark[]>([]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const newSpark: Spark = {
        id: Date.now(),
        x: event.clientX,
        y: event.clientY,
        hue: Math.random() * 360,
      };

      setSparks((prev) => [...prev, newSpark]);

      setTimeout(() => {
        setSparks((prev) => prev.filter((spark) => spark.id !== newSpark.id));
      }, 1500);
    };

    document.body.addEventListener("click", handleClick);
    return () => document.body.removeEventListener("click", handleClick);
  }, []);

  return (
    <div className="click-container">
      {sparks.map((spark) => (
        <div
          key={spark.id}
          className="spark"
          style={{
            top: spark.y + "px",
            left: spark.x + "px",
            filter: `hue-rotate(${spark.hue}deg)`,
          }}
        >
          {[...Array(8)].map((_, i) => (
            <span key={i} style={{ transform: `rotate(${i * 45}deg)` }}></span>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ClickEffects;
