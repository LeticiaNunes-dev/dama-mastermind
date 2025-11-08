import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface CheckersSquareProps {
  row: number;
  col: number;
  isSelected: boolean;
  isValidMove: boolean;
  onClick: () => void;
  children?: ReactNode;
}

export const CheckersSquare = ({
  row,
  col,
  isSelected,
  isValidMove,
  onClick,
  children,
}: CheckersSquareProps) => {
  const isDark = (row + col) % 2 === 1;

  return (
    <div
      className={cn(
        "relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center cursor-pointer transition-all duration-200",
        isDark ? "bg-board-dark" : "bg-board-light",
        isSelected && "ring-4 ring-highlight-selected ring-inset",
        isValidMove && !isSelected && "after:absolute after:w-4 after:h-4 after:rounded-full after:bg-highlight-valid after:opacity-60 hover:after:opacity-100",
        !isValidMove && !isSelected && "hover:brightness-95"
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
