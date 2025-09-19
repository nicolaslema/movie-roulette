"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const TARGET_TEXT = "Movie Roulette";
const CHARACTERS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+<>?/|";

export default function ScrambledTitle() {
  const [displayText, setDisplayText] = useState<string[]>([]);
  const [resolved, setResolved] = useState<boolean[]>([]);
  const [glitchingIndexes, setGlitchingIndexes] = useState<number[]>([]);
  const [hoveringIndex, setHoveringIndex] = useState<number | null>(null);

  // 🔑 intervalos de hover persistentes
  const hoverIntervals = useRef<{ [key: number]: NodeJS.Timeout }>({});

  useEffect(() => {
    const initial = Array.from(TARGET_TEXT).map((c) =>
      c === " " ? " " : CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)]
    );
    setDisplayText(initial);
    setResolved(Array(TARGET_TEXT.length).fill(false));

    const scramblesPerLetter = 6;
    let currentIndex = 0;
    let scrambleCount = 0;

    const interval = setInterval(() => {
      // fase de revelado letra por letra
      setDisplayText((prev) =>
        prev.map((char, i) => {
          if (i < currentIndex) return TARGET_TEXT[i];
          if (TARGET_TEXT[i] === " ") return " ";
          return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
        })
      );

      scrambleCount += 1;

      if (scrambleCount >= scramblesPerLetter) {
        setResolved((prev) => {
          const updated = [...prev];
          updated[currentIndex] = true;
          return updated;
        });

        setDisplayText((prev) => {
          const updated = [...prev];
          updated[currentIndex] = TARGET_TEXT[currentIndex];
          return updated;
        });

        currentIndex += 1;
        scrambleCount = 0;

        // ✅ Fix: cuando termina, fuerza la palabra final completa
        if (currentIndex >= TARGET_TEXT.length) {
          clearInterval(interval);
          setDisplayText(Array.from(TARGET_TEXT));
          setResolved(Array(TARGET_TEXT.length).fill(true));

          // arranca glitches aleatorios
          startRandomGlitching();
        }
      }
    }, 60);

    const startRandomGlitching = () => {
      setInterval(() => {
        const glitchCount = Math.floor(Math.random() * 3) + 1; // 1 a 3 letras
        const glitchIndexes: number[] = [];

        while (glitchIndexes.length < glitchCount) {
          const randIndex = Math.floor(Math.random() * TARGET_TEXT.length);
          if (
            TARGET_TEXT[randIndex] !== " " &&
            !glitchIndexes.includes(randIndex)
          ) {
            glitchIndexes.push(randIndex);
          }
        }

        setGlitchingIndexes(glitchIndexes);

        const glitchInterval = setInterval(() => {
          setDisplayText((prev) => {
            const updated = [...prev];
            glitchIndexes.forEach((i) => {
              updated[i] =
                CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
            });
            return updated;
          });
        }, 30);

        setTimeout(() => {
          clearInterval(glitchInterval);
          setDisplayText((prev) => {
            const updated = [...prev];
            glitchIndexes.forEach((i) => {
              updated[i] = TARGET_TEXT[i];
            });
            return updated;
          });
          setGlitchingIndexes([]);
        }, 300);
      }, 1200 + Math.random() * 2000);
    };

    return () => clearInterval(interval);
  }, []);

  // 🔥 Hover glitch violento
  const handleMouseEnter = (index: number) => {
    setHoveringIndex(index);

    if (hoverIntervals.current[index]) return;

    hoverIntervals.current[index] = setInterval(() => {
      setDisplayText((prev) => {
        const updated = [...prev];
        updated[index] =
          CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
        return updated;
      });
    }, 30);
  };

  const handleMouseLeave = (index: number) => {
    clearInterval(hoverIntervals.current[index]);
    delete hoverIntervals.current[index];
    setHoveringIndex(null);

    // volver a la letra correcta
    setDisplayText((prev) => {
      const updated = [...prev];
      updated[index] = TARGET_TEXT[index];
      return updated;
    });
  };

  return (
    <h1 className="text-4xl sm:text-5xl md:text-8xl font-bold tracking-wide text-white font-mono flex gap-[2px] major-mono-display-regular">
      {displayText.map((char, i) => {
        const isGlitching = glitchingIndexes.includes(i);
        const isHovering = hoveringIndex === i;
        return (
          <motion.span
            key={i}
            onMouseEnter={() => handleMouseEnter(i)}
            onMouseLeave={() => handleMouseLeave(i)}
            initial={{ opacity: 0.3, scale: 0.8 }}
            animate={
              isHovering || isGlitching
                ? {
                    opacity: [1, 0.1, 0.9, 0.2, 1],
                    scale: [1, 1.6, 0.6, 1.4, 0.8, 1],
                    transition: {
                      duration: 0.3,
                      repeat: isHovering ? Infinity : 0,
                    },
                  }
                : resolved[i]
                ? { opacity: 1, scale: 1, transition: { duration: 0.3 } }
                : { opacity: 0.5, scale: 0.9 }
            }
          >
            {char}
          </motion.span>
        );
      })}
    </h1>
  );
}
