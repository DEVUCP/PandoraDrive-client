import { Typography } from "@mui/material";
import { useEffect, useState } from "react";

const TypingText = ({
  text,
  onFinish,
}: {
  text: string;
  onFinish: () => void;
}) => {
  const [displayed, setDisplayed] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!text) {
      onFinish();
      return;
    }

    let currentIndex = 0; // Start from 0
    const characters = Array.from(text);
    setDisplayed([text[0]]); // Start with empty array
    setDone(false);

    const interval = setInterval(() => {
      setDisplayed((prev) => [...prev, characters[currentIndex]]);
      currentIndex++;
      if (currentIndex >= characters.length) {
        clearInterval(interval);
        setDone(true);
        onFinish();
      }
    }, 20);

    return () => clearInterval(interval);
  }, [text, onFinish]);

  return (
    <Typography sx={{ whiteSpace: "pre-wrap" }}>
      {displayed.join("")}
      {!done && <span className="blinking-cursor">|</span>}
    </Typography>
  );
};

export default TypingText;
