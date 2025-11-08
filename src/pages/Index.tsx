import { useState, useEffect } from "react";
import { GameMenu } from "@/components/checkers/GameMenu";
import { CheckersBoard } from "@/components/checkers/CheckersBoard";
import { GameInfo } from "@/components/checkers/GameInfo";
import { Piece, Position, GameMode, Difficulty, PieceColor } from "@/types/checkers";
import {
  createInitialBoard,
  getValidMoves,
  applyMove,
  hasCaptureMoves,
  checkWinner,
} from "@/utils/checkersLogic";
import { getAIMove } from "@/utils/checkersAI";
import { toast } from "sonner";

const Index = () => {
  const [gameState, setGameState] = useState<"menu" | "playing">("menu");
  const [board, setBoard] = useState<(Piece | null)[][]>(createInitialBoard());
  const [currentPlayer, setCurrentPlayer] = useState<PieceColor>("white");
  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);
  const [validMoves, setValidMoves] = useState<Position[]>([]);
  const [gameMode, setGameMode] = useState<GameMode>("pvp");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [winner, setWinner] = useState<PieceColor | null>(null);
  const [isAIThinking, setIsAIThinking] = useState(false);

  const handleStartGame = (mode: GameMode, diff?: Difficulty) => {
    setGameMode(mode);
    if (diff) setDifficulty(diff);
    setGameState("playing");
    setBoard(createInitialBoard());
    setCurrentPlayer("white");
    setSelectedPiece(null);
    setValidMoves([]);
    setWinner(null);
    toast.success("Jogo iniciado! Boa sorte!");
  };

  const handleBackToMenu = () => {
    setGameState("menu");
    setBoard(createInitialBoard());
    setCurrentPlayer("white");
    setSelectedPiece(null);
    setValidMoves([]);
    setWinner(null);
  };

  const handleReset = () => {
    setBoard(createInitialBoard());
    setCurrentPlayer("white");
    setSelectedPiece(null);
    setValidMoves([]);
    setWinner(null);
    toast.success("Jogo reiniciado!");
  };

  const handleSquareClick = (row: number, col: number) => {
    if (winner || isAIThinking) return;

    const clickedPiece = board[row][col];

    // If clicking on valid move destination
    if (selectedPiece && validMoves.some((move) => move.row === row && move.col === col)) {
      const move = validMoves.find((m) => m.row === row && m.col === col);
      if (!move) return;

      const fullMove = getValidMoves(board, selectedPiece).find(
        (m) => m.to.row === row && m.to.col === col
      );
      if (!fullMove) return;

      const newBoard = applyMove(board, fullMove);
      setBoard(newBoard);
      setSelectedPiece(null);
      setValidMoves([]);

      const gameWinner = checkWinner(newBoard, currentPlayer === "white" ? "black" : "white");
      if (gameWinner) {
        setWinner(gameWinner);
        toast.success(
          `Jogador ${gameWinner === "white" ? "Branco" : "Preto"} venceu!`,
          { duration: 5000 }
        );
        return;
      }

      setCurrentPlayer(currentPlayer === "white" ? "black" : "white");
      return;
    }

    // If clicking on own piece
    if (clickedPiece && clickedPiece.color === currentPlayer) {
      const mustCapture = hasCaptureMoves(board, currentPlayer);
      const moves = getValidMoves(board, clickedPiece, mustCapture);

      if (moves.length === 0) {
        toast.error("Esta peça não tem movimentos válidos!");
        return;
      }

      setSelectedPiece(clickedPiece);
      setValidMoves(moves.map((m) => m.to));
      return;
    }

    // Deselect if clicking elsewhere
    setSelectedPiece(null);
    setValidMoves([]);
  };

  // AI move effect
  useEffect(() => {
    if (
      gameState === "playing" &&
      gameMode === "pve" &&
      currentPlayer === "black" &&
      !winner &&
      !isAIThinking
    ) {
      setIsAIThinking(true);

      // Delay AI move for better UX
      setTimeout(() => {
        const aiMove = getAIMove(board, difficulty, "black");

        if (aiMove) {
          const newBoard = applyMove(board, aiMove);
          setBoard(newBoard);

          const gameWinner = checkWinner(newBoard, "white");
          if (gameWinner) {
            setWinner(gameWinner);
            toast.success(
              `Jogador ${gameWinner === "white" ? "Branco" : "Preto"} venceu!`,
              { duration: 5000 }
            );
          } else {
            setCurrentPlayer("white");
          }
        }

        setIsAIThinking(false);
      }, 800);
    }
  }, [currentPlayer, gameState, gameMode, winner, board, difficulty, isAIThinking]);

  if (gameState === "menu") {
    return <GameMenu onStartGame={handleStartGame} />;
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center gap-8 p-4 lg:p-8">
      <div className="order-2 lg:order-1">
        <CheckersBoard
          board={board}
          selectedPiece={selectedPiece}
          validMoves={validMoves}
          onSquareClick={handleSquareClick}
        />
      </div>
      <div className="order-1 lg:order-2">
        <GameInfo
          currentPlayer={currentPlayer}
          gameMode={gameMode}
          difficulty={difficulty}
          winner={winner}
          onReset={handleReset}
          onBackToMenu={handleBackToMenu}
        />
      </div>
    </div>
  );
};

export default Index;
