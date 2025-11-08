import { Piece, Position } from "@/types/checkers";
import { CheckersSquare } from "./CheckersSquare";
import { CheckersPiece } from "./CheckersPiece";

interface CheckersBoardProps {
  board: (Piece | null)[][];
  selectedPiece: Piece | null;
  validMoves: Position[];
  onSquareClick: (row: number, col: number) => void;
}

export const CheckersBoard = ({
  board,
  selectedPiece,
  validMoves,
  onSquareClick,
}: CheckersBoardProps) => {
  const isValidMove = (row: number, col: number) => {
    return validMoves.some((move) => move.row === row && move.col === col);
  };

  const isSelected = (row: number, col: number) => {
    return selectedPiece?.position.row === row && selectedPiece?.position.col === col;
  };

  return (
    <div className="relative inline-block">
      <div
        className="grid gap-0 border-8 rounded-lg shadow-2xl overflow-hidden"
        style={{
          gridTemplateColumns: "repeat(8, minmax(0, 1fr))",
          borderColor: "hsl(var(--board-border))",
        }}
      >
        {board.map((row, rowIndex) =>
          row.map((piece, colIndex) => (
            <CheckersSquare
              key={`${rowIndex}-${colIndex}`}
              row={rowIndex}
              col={colIndex}
              isSelected={isSelected(rowIndex, colIndex)}
              isValidMove={isValidMove(rowIndex, colIndex)}
              onClick={() => onSquareClick(rowIndex, colIndex)}
            >
              {piece && <CheckersPiece piece={piece} />}
            </CheckersSquare>
          ))
        )}
      </div>
    </div>
  );
};
