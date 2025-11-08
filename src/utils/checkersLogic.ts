import { Piece, Position, Move, PieceColor } from "@/types/checkers";

export const BOARD_SIZE = 8;

export function createInitialBoard(): (Piece | null)[][] {
  const board: (Piece | null)[][] = Array(BOARD_SIZE)
    .fill(null)
    .map(() => Array(BOARD_SIZE).fill(null));

  // Place black pieces (top 3 rows)
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if ((row + col) % 2 === 1) {
        board[row][col] = {
          color: "black",
          type: "normal",
          position: { row, col },
        };
      }
    }
  }

  // Place white pieces (bottom 3 rows)
  for (let row = 5; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if ((row + col) % 2 === 1) {
        board[row][col] = {
          color: "white",
          type: "normal",
          position: { row, col },
        };
      }
    }
  }

  return board;
}

export function isValidPosition(pos: Position): boolean {
  return pos.row >= 0 && pos.row < BOARD_SIZE && pos.col >= 0 && pos.col < BOARD_SIZE;
}

export function getValidMoves(
  board: (Piece | null)[][],
  piece: Piece,
  mustCapture: boolean = false
): Move[] {
  const moves: Move[] = [];
  const captureMoves = getCaptureMoves(board, piece);

  if (mustCapture && captureMoves.length > 0) {
    return captureMoves;
  }

  if (captureMoves.length > 0) {
    return captureMoves;
  }

  // Normal moves (non-capturing)
  const directions = getDirections(piece);

  for (const [dRow, dCol] of directions) {
    const newPos: Position = {
      row: piece.position.row + dRow,
      col: piece.position.col + dCol,
    };

    if (isValidPosition(newPos) && !board[newPos.row][newPos.col]) {
      moves.push({
        from: piece.position,
        to: newPos,
      });
    }
  }

  return moves;
}

function getDirections(piece: Piece): [number, number][] {
  if (piece.type === "king") {
    return [
      [-1, -1],
      [-1, 1],
      [1, -1],
      [1, 1],
    ];
  }

  if (piece.color === "white") {
    return [
      [-1, -1],
      [-1, 1],
    ];
  } else {
    return [
      [1, -1],
      [1, 1],
    ];
  }
}

function getCaptureMoves(board: (Piece | null)[][], piece: Piece): Move[] {
  const moves: Move[] = [];
  const directions: [number, number][] =
    piece.type === "king"
      ? [
          [-1, -1],
          [-1, 1],
          [1, -1],
          [1, 1],
        ]
      : piece.color === "white"
      ? [
          [-1, -1],
          [-1, 1],
          [1, -1],
          [1, 1],
        ]
      : [
          [1, -1],
          [1, 1],
          [-1, -1],
          [-1, 1],
        ];

  for (const [dRow, dCol] of directions) {
    const jumpedPos: Position = {
      row: piece.position.row + dRow,
      col: piece.position.col + dCol,
    };
    const landingPos: Position = {
      row: piece.position.row + dRow * 2,
      col: piece.position.col + dCol * 2,
    };

    if (
      isValidPosition(jumpedPos) &&
      isValidPosition(landingPos) &&
      board[jumpedPos.row][jumpedPos.col] &&
      board[jumpedPos.row][jumpedPos.col]!.color !== piece.color &&
      !board[landingPos.row][landingPos.col]
    ) {
      // Check for multiple jumps
      const move: Move = {
        from: piece.position,
        to: landingPos,
        capturedPieces: [jumpedPos],
      };

      // Create temporary board to check for additional captures
      const tempBoard = board.map((row) => [...row]);
      tempBoard[landingPos.row][landingPos.col] = { ...piece, position: landingPos };
      tempBoard[piece.position.row][piece.position.col] = null;
      tempBoard[jumpedPos.row][jumpedPos.col] = null;

      const additionalCaptures = getCaptureMoves(tempBoard, {
        ...piece,
        position: landingPos,
      });

      if (additionalCaptures.length > 0) {
        // Recursively add multi-jump possibilities
        for (const additionalMove of additionalCaptures) {
          moves.push({
            from: piece.position,
            to: additionalMove.to,
            capturedPieces: [...move.capturedPieces!, ...(additionalMove.capturedPieces || [])],
          });
        }
      } else {
        moves.push(move);
      }
    }
  }

  return moves;
}

export function hasCaptureMoves(board: (Piece | null)[][], color: PieceColor): boolean {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const piece = board[row][col];
      if (piece && piece.color === color) {
        const captureMoves = getCaptureMoves(board, piece);
        if (captureMoves.length > 0) return true;
      }
    }
  }
  return false;
}

export function applyMove(board: (Piece | null)[][], move: Move): (Piece | null)[][] {
  const newBoard = board.map((row) => [...row]);
  const piece = newBoard[move.from.row][move.from.col];

  if (!piece) return newBoard;

  // Remove captured pieces
  if (move.capturedPieces) {
    for (const capturedPos of move.capturedPieces) {
      newBoard[capturedPos.row][capturedPos.col] = null;
    }
  }

  // Move piece
  newBoard[move.to.row][move.to.col] = {
    ...piece,
    position: move.to,
  };
  newBoard[move.from.row][move.from.col] = null;

  // Promote to king
  if (
    (piece.color === "white" && move.to.row === 0) ||
    (piece.color === "black" && move.to.row === BOARD_SIZE - 1)
  ) {
    newBoard[move.to.row][move.to.col]!.type = "king";
  }

  return newBoard;
}

export function checkWinner(board: (Piece | null)[][], currentPlayer: PieceColor): PieceColor | null {
  let whiteCount = 0;
  let blackCount = 0;
  let currentPlayerHasMoves = false;

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const piece = board[row][col];
      if (piece) {
        if (piece.color === "white") whiteCount++;
        if (piece.color === "black") blackCount++;

        if (piece.color === currentPlayer) {
          const moves = getValidMoves(board, piece);
          if (moves.length > 0) currentPlayerHasMoves = true;
        }
      }
    }
  }

  if (whiteCount === 0) return "black";
  if (blackCount === 0) return "white";
  if (!currentPlayerHasMoves) return currentPlayer === "white" ? "black" : "white";

  return null;
}
