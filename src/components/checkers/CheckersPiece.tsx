import { Piece } from "@/types/checkers";
import { Crown } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckersPieceProps {
  piece: Piece;
}

export const CheckersPiece = ({ piece }: CheckersPieceProps) => {
  return (
    <div
      className={cn(
        "w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-lg border-4 transition-transform hover:scale-110 cursor-pointer",
        piece.color === "white"
          ? "bg-piece-white border-piece-white-border"
          : "bg-piece-black border-piece-black-border"
      )}
      style={{
        boxShadow: "0 4px 8px rgba(0,0,0,0.3), inset 0 -2px 4px rgba(0,0,0,0.2)",
      }}
    >
      {piece.type === "king" && (
        <Crown
          className={cn(
            "w-6 h-6 sm:w-8 sm:h-8",
            piece.color === "white" ? "text-primary" : "text-accent"
          )}
          strokeWidth={2.5}
        />
      )}
    </div>
  );
};
