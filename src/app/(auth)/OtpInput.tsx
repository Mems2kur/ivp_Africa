"use client";

import { type ClipboardEvent, type KeyboardEvent, useRef } from "react";

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
}

export function OtpInput({ length = 6, value, onChange, error }: OtpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.padEnd(length, " ").split("").slice(0, length);

  function setDigit(index: number, char: string) {
    const next = digits.slice();
    next[index] = char;
    onChange(next.join("").trimEnd());
  }

  function handleChange(index: number, raw: string) {
    const char = raw.replace(/\D/g, "").slice(-1);
    if (!char) return;
    setDigit(index, char);
    if (index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      if (digits[index] && digits[index] !== " ") {
        setDigit(index, " ");
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
        setDigit(index - 1, " ");
      }
      e.preventDefault();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!pasted) return;
    onChange(pasted);
    const lastIndex = Math.min(pasted.length, length) - 1;
    inputRefs.current[lastIndex]?.focus();
  }

  return (
    <div className="flex justify-center gap-2">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            inputRefs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digits[i] === " " ? "" : digits[i]}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className={`h-12 w-11 rounded-lg border text-center text-lg font-semibold text-black transition focus:outline-none focus:ring-2 focus:ring-[#8A38F5] ${
            error ? "border-red-300" : "border-gray-200"
          }`}
        />
      ))}
    </div>
  );
}