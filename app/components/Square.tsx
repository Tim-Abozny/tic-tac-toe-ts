"use client";

import { useRef } from "react";
import { GamePlayer } from "../containers/Board";
import { squareStyles } from "./Square.styles";

type Player = GamePlayer | null;

type SquareProps = {
  value: Player;
  onClick: () => void;
  winner: Player;
};

export default function Square({ value, onClick, winner }: SquareProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  function handleClick() {
    const button = buttonRef.current;
    if (button) {
      button.classList.remove("tile-pulse");
      void button.offsetWidth;
      button.classList.add("tile-pulse");
    }
    onClick();
  }

  if (!value) {
    return (
      <button
        ref={buttonRef}
        onClick={handleClick}
        disabled={Boolean(winner)}
        className={squareStyles.cell}
        onAnimationEnd={() => buttonRef.current?.classList.remove("tile-pulse")}
      />
    );
  }
  return (
    <button ref={buttonRef} disabled className={squareStyles.cell}>
      {value}
    </button>
  );
}
