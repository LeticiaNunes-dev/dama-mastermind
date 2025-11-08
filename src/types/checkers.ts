export type PieceColor = "white" | "black";
export type PieceType = "normal" | "king";

export interface Position {
  row: number;
  col: number;
}

export interface Piece {
  color: PieceColor;
  type: PieceType;
  position: Position;
}

export interface Move {
  from: Position;
  to: Position;
  capturedPieces?: Position[];
}

export type GameMode = "pvp" | "pve";
export type Difficulty = "easy" | "medium" | "hard";
export type GameState = "menu" | "playing" | "ended";

export interface GameConfig {
  mode: GameMode;
  difficulty?: Difficulty;
}
