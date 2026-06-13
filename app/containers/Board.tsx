"use client";
import Square from "../components/Square";
import { useState, type CSSProperties } from "react";
import { boardStyles } from "./Board.styles";

export type GamePlayer = "X" | "O";

const LINES: number[][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// Pixel sizes must match Square.styles (w-16 = 64px) and Board.styles (gap-3 = 12px)
const CELL = 64;
const GAP = 12;
const GRID = CELL * 3 + GAP * 2;
const ROW_CENTER = [
  CELL / 2,
  CELL + GAP + CELL / 2,
  2 * (CELL + GAP) + CELL / 2,
];

// Inline positioning for the strike-through line drawn over the winning combination
const LINE_STYLES: Record<string, CSSProperties> = {
  "0,1,2": {
    top: ROW_CENTER[0],
    left: 0,
    width: GRID,
    transform: "translateY(-50%)",
  },
  "3,4,5": {
    top: ROW_CENTER[1],
    left: 0,
    width: GRID,
    transform: "translateY(-50%)",
  },
  "6,7,8": {
    top: ROW_CENTER[2],
    left: 0,
    width: GRID,
    transform: "translateY(-50%)",
  },
  "0,3,6": {
    top: 0,
    left: ROW_CENTER[0],
    height: GRID,
    transform: "translateX(-50%)",
  },
  "1,4,7": {
    top: 0,
    left: ROW_CENTER[1],
    height: GRID,
    transform: "translateX(-50%)",
  },
  "2,5,8": {
    top: 0,
    left: ROW_CENTER[2],
    height: GRID,
    transform: "translateX(-50%)",
  },
  "0,4,8": {
    top: GRID / 2,
    left: GRID / 2,
    width: Math.round(GRID * Math.SQRT2),
    transform: "translate(-50%, -50%) rotate(45deg)",
  },
  "2,4,6": {
    top: GRID / 2,
    left: GRID / 2,
    width: Math.round(GRID * Math.SQRT2),
    transform: "translate(-50%, -50%) rotate(-45deg)",
  },
};

export default function Board() {
  const FIELD_SIZE: number = 9;
  const [squares, setSquares] = useState<(GamePlayer | null)[]>(
    Array(FIELD_SIZE).fill(null),
  );
  const [currentPlayer, setCurrentPlayer] = useState<GamePlayer>(
    chooseCurrentPlayer(),
  );
  const [winner, setWinner] = useState<GamePlayer | null>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);

  function reset() {
    setSquares(Array(FIELD_SIZE).fill(null));
    setWinner(null);
    setWinningLine(null);
    setCurrentPlayer(chooseCurrentPlayer());
  }

  function chooseCurrentPlayer(): GamePlayer {
    return Math.round(Math.random() * 1) === 1 ? "X" : "O";
  }

  function calculateWinner(
    squares: (GamePlayer | null)[],
  ): { winner: GamePlayer; line: number[] } | null {
    for (const line of LINES) {
      const [a, b, c] = line;
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return { winner: squares[a], line };
      }
    }

    return null;
  }

  function setSquareValue(index: number) {
    // React requires immutable state updates to detect changes and re-render,
    // so we build a new array instead of mutating squares directly.
    const newData = squares.map((val, i) => {
      if (i === index) {
        return currentPlayer; // user clicked on [i] square -- mark this square
      }
      return val; // for other squares simply return prev value
    });
    setSquares(newData); // HERE we set new state for prev array --> create new Array with diff state

    const result = calculateWinner(newData);
    if (result) {
      setWinner(result.winner);
      setWinningLine(result.line);
    } else {
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X"); // here change player
    }
  }

  const isDraw = !winner && squares.every((cell) => cell !== null);
  const gameOver = Boolean(winner) || isDraw;

  return (
    <div className={boardStyles.container}>
      <p className={boardStyles.turnLabel} suppressHydrationWarning>
        {winner
          ? `${winner} wins!`
          : isDraw
            ? "X and O both win!"
            : `Hey ${currentPlayer}, it's your turn`}
      </p>

      <div className={boardStyles.grid}>
        {Array(FIELD_SIZE)
          .fill(null)
          .map((_, index) => {
            return (
              <Square
                winner={winner}
                key={index}
                onClick={() => setSquareValue(index)}
                value={squares[index]}
              />
            );
          })}

        {winningLine && (
          <div
            className={boardStyles.winningLine}
            style={LINE_STYLES[winningLine.join(",")]}
          />
        )}
      </div>

      <button
        onClick={reset}
        className={`${boardStyles.resetButton} ${gameOver ? boardStyles.resetButtonHighlight : ""}`}
      >
        <span className={boardStyles.resetButtonLabel}>RESET</span>
      </button>
    </div>
  );
}
