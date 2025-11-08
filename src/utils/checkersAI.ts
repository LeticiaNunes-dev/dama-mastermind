import { Piece, Move, PieceColor, Difficulty } from "@/types/checkers";
import { getValidMoves, applyMove, BOARD_SIZE, checkWinner } from "./checkersLogic";

function evaluateBoard(board: (Piece | null)[][], aiColor: PieceColor): number {
  let score = 0;

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const piece = board[row][col];
      if (piece) {
        const pieceValue = piece.type === "king" ? 5 : 3;
        const positionBonus = piece.type === "king" ? 0 : Math.abs(row - (piece.color === "white" ? 0 : 7)) * 0.5;

        if (piece.color === aiColor) {
          score += pieceValue + positionBonus;
        } else {
          score -= pieceValue + positionBonus;
        }
      }
    }
  }

  return score;
}

function minimax(
  board: (Piece | null)[][],
  depth: number,
  alpha: number,
  beta: number,
  maximizing: boolean,
  aiColor: PieceColor
): number {
  const winner = checkWinner(board, maximizing ? aiColor : aiColor === "white" ? "black" : "white");
  
  if (winner === aiColor) return 10000;
  if (winner !== null) return -10000;
  if (depth === 0) return evaluateBoard(board, aiColor);

  const currentColor: PieceColor = maximizing ? aiColor : aiColor === "white" ? "black" : "white";

  if (maximizing) {
    let maxEval = -Infinity;
    const allMoves = getAllPossibleMoves(board, currentColor);

    for (const move of allMoves) {
      const newBoard = applyMove(board, move);
      const evaluation = minimax(newBoard, depth - 1, alpha, beta, false, aiColor);
      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) break;
    }

    return maxEval;
  } else {
    let minEval = Infinity;
    const allMoves = getAllPossibleMoves(board, currentColor);

    for (const move of allMoves) {
      const newBoard = applyMove(board, move);
      const evaluation = minimax(newBoard, depth - 1, alpha, beta, true, aiColor);
      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) break;
    }

    return minEval;
  }
}

function getAllPossibleMoves(board: (Piece | null)[][], color: PieceColor): Move[] {
  const moves: Move[] = [];

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const piece = board[row][col];
      if (piece && piece.color === color) {
        const pieceMoves = getValidMoves(board, piece);
        moves.push(...pieceMoves);
      }
    }
  }

  return moves;
}

export function getAIMove(board: (Piece | null)[][], difficulty: Difficulty, aiColor: PieceColor): Move | null {
  const allMoves = getAllPossibleMoves(board, aiColor);

  if (allMoves.length === 0) return null;

  // Easy: Random move
  if (difficulty === "easy") {
    return allMoves[Math.floor(Math.random() * allMoves.length)];
  }

  // Medium: Minimax with depth 2
  if (difficulty === "medium") {
    let bestMove = allMoves[0];
    let bestScore = -Infinity;

    for (const move of allMoves) {
      const newBoard = applyMove(board, move);
      const score = minimax(newBoard, 2, -Infinity, Infinity, false, aiColor);

      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    return bestMove;
  }

  // Hard: Minimax with depth 4
  let bestMove = allMoves[0];
  let bestScore = -Infinity;

  for (const move of allMoves) {
    const newBoard = applyMove(board, move);
    const score = minimax(newBoard, 4, -Infinity, Infinity, false, aiColor);

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}
