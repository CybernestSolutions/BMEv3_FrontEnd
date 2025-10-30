// -------------------------------------------------------------
// src/components/OnScreenKeyboard.tsx
// Elegant kiosk keyboard with .com, Shift, and smooth animation
// -------------------------------------------------------------
import React, { useState } from "react";

interface Props {
  value: string;
  onInput: (newValue: string) => void;
  onClose: () => void;
  mode?: "text" | "number";
}

export default function OnScreenKeyboard({
  value,
  onInput,
  onClose,
  mode = "text",
}: Props) {
  const [isShift, setIsShift] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // === Layout definitions ===
  const layout =
    mode === "number"
      ? [
          ["1", "2", "3"],
          ["4", "5", "6"],
          ["7", "8", "9"],
          ["0", "←", "Clear"],
        ]
      : [
          ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "@"],
          ["a", "s", "d", "f", "g", "h", "j", "k", "l", "."],
          ["Shift", "z", "x", "c", "v", "b", "n", "m", ".com"],
          ["Space", "←", "Clear"],
        ];

  // === Handle key press ===
  const handleKeyPress = (key: string) => {
    if (key === "←") onInput(value.slice(0, -1));
    else if (key === "Clear") onInput("");
    else if (key === "Space") onInput(value + " ");
    else if (key === "Shift") setIsShift(!isShift);
    else if (key === ".com") onInput(value + ".com");
    else onInput(value + (isShift ? key.toUpperCase() : key));
  };

  // === Handle closing animation ===
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 350); // match CSS animation duration
  };

  return (
    <div className="fixed inset-0  z-[9998] flex flex-col justify-end">
      {/* Clicking outside closes */}
      <div
        className="flex-1"
        onClick={handleClose}
        aria-label="Keyboard overlay"
      ></div>

      {/* === Keyboard Container === */}
      <div
        className={`inset-x-0 bottom-0 bg-white border-t border-[#C6E4EA] shadow-2xl px-4 py-5 md:px-8 rounded-t-[24px] 
        ${isClosing ? "animate-slideDownFade" : "animate-slideUpFade"}`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg md:text-xl font-extrabold text-[#1C7DA6] flex items-center gap-2">
            ⌨️ On-Screen Keyboard
          </h2>
          <button
            onClick={handleClose}
            className="px-5 py-2 bg-[#1C7DA6] text-white rounded-full font-semibold text-base md:text-lg hover:brightness-110 active:scale-95 shadow-md transition-all"
          >
            Done
          </button>
        </div>

        {/* Keys */}
        <div className="space-y-3">
          {layout.map((row, i) => (
            <div
              key={i}
              className="flex justify-center flex-wrap gap-2 md:gap-3"
            >
              {row.map((key) => {
                const isSpecial =
                  key === "Space" ||
                  key === "←" ||
                  key === "Clear" ||
                  key === "Shift" ||
                  key === ".com";
                return (
                  <button
                    key={key}
                    onClick={() => handleKeyPress(key)}
                    className={`flex items-center justify-center select-none text-[17px] md:text-[20px] font-semibold rounded-xl
                      ${
                        key === "Space"
                          ? "w-[60%] md:w-[45%]"
                          : key === "Shift" || key === ".com"
                          ? "w-[90px] md:w-[110px]"
                          : "w-[50px] md:w-[65px]"
                      }
                      h-[60px] md:h-[70px]
                      ${
                        isSpecial
                          ? "bg-[#1C7DA6] text-white hover:bg-[#1891c7]"
                          : "bg-[#EAF6FF] text-[#1C7DA6] hover:bg-[#D1F4F7]"
                      }
                      active:scale-95 shadow-sm border border-[#C6E4EA] transition-all
                    `}
                  >
                    {key === "Space"
                      ? "␣ Space"
                      : key === "←"
                      ? "⌫"
                      : key === "Shift"
                      ? isShift
                        ? "⇧ (On)"
                        : "⇧"
                      : key}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Current input preview */}
        <div className="mt-5 bg-[#F5F7FA] border border-[#D5E9ED] text-[#1C7DA6] rounded-xl text-center py-3 font-semibold text-[18px] truncate shadow-inner">
          {value || "Tap keys to type..."}
        </div>

        {/* Safe area padding */}
        <div className="h-[env(safe-area-inset-bottom)]"></div>
      </div>
    </div>
  );
}
