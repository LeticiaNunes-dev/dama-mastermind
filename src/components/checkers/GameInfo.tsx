import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieceColor, GameMode, Difficulty } from "@/types/checkers";
import { RotateCcw, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface GameInfoProps {
  currentPlayer: PieceColor;
  gameMode: GameMode;
  difficulty?: Difficulty;
  winner: PieceColor | null;
  onReset: () => void;
  onBackToMenu: () => void;
}

export const GameInfo = ({
  currentPlayer,
  gameMode,
  difficulty,
  winner,
  onReset,
  onBackToMenu,
}: GameInfoProps) => {
  const getDifficultyText = () => {
    if (gameMode === "pvp") return "Dois Jogadores";
    return `IA - ${difficulty === "easy" ? "Fácil" : difficulty === "medium" ? "Médio" : "Difícil"}`;
  };

  return (
    <div className="space-y-4 w-full max-w-md">
      <Card className="shadow-lg">
        <CardContent className="pt-6 space-y-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Modo de Jogo</p>
            <p className="text-lg font-semibold">{getDifficultyText()}</p>
          </div>

          {winner ? (
            <div className="text-center py-4">
              <p className="text-2xl font-bold text-accent mb-2">Fim de Jogo!</p>
              <p className="text-xl">
                Jogador{" "}
                <span
                  className={cn(
                    "font-bold",
                    winner === "white" ? "text-piece-white-border" : "text-piece-black-border"
                  )}
                >
                  {winner === "white" ? "Branco" : "Preto"}
                </span>{" "}
                venceu!
              </p>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground mb-2">Turno Atual</p>
              <div className="flex items-center justify-center gap-3">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full border-4",
                    currentPlayer === "white"
                      ? "bg-piece-white border-piece-white-border"
                      : "bg-piece-black border-piece-black-border"
                  )}
                />
                <p className="text-xl font-bold">
                  {currentPlayer === "white" ? "Branco" : "Preto"}
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={onReset} className="flex-1 gap-2" variant="outline">
              <RotateCcw className="w-4 h-4" />
              Reiniciar
            </Button>
            <Button onClick={onBackToMenu} className="flex-1 gap-2" variant="secondary">
              <Home className="w-4 h-4" />
              Menu
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
