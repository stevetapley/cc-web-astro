import React, { useEffect, useState } from "react";

const RotatingText = ({
  phrases,
  interval = 3500,
}: {
  phrases: string[];
  interval?: number;
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!phrases?.length || phrases.length === 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % phrases.length);
    }, interval);

    return () => window.clearInterval(timer);
  }, [phrases, interval]);

  if (!phrases?.length) return null;

  return (
    <>
      {phrases.map((phrase, i) => (
        <span
          key={phrase}
          className={`rotating-text${i === activeIndex ? " rotating-text--active" : ""}`}
        >
          {phrase}
        </span>
      ))}
    </>
  );
};

export default RotatingText;
