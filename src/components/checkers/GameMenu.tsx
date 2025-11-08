import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GameMode, Difficulty } from "@/types/checkers";
import { Users, Bot } from "lucide-react";
import { useState } from "react";

interface GameMenuProps {
  onStartGame: (mode: GameMode, difficulty?: Difficulty) => void;
}

export const GameMenu = ({ onStartGame }: GameMenuProps) => {
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null);

  const handleModeSelect = (mode: GameMode) => {
    if (mode === "pvp") {
      onStartGame(mode);
    } else {
      setSelectedMode(mode);
    }
  };

  const handleDifficultySelect = (difficulty: Difficulty) => {
    onStartGame("pve", difficulty);
  };

  if (selectedMode === "pve") {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Escolha a Dificuldade</CardTitle>
            <CardDescription>Selecione o nível de desafio contra a IA</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => handleDifficultySelect("easy")}
              className="w-full h-16 text-lg"
              variant="outline"
            >
              Fácil
            </Button>
            <Button
              onClick={() => handleDifficultySelect("medium")}
              className="w-full h-16 text-lg"
              variant="outline"
            >
              Médio
            </Button>
            <Button
              onClick={() => handleDifficultySelect("hard")}
              className="w-full h-16 text-lg"
              variant="outline"
            >
              Difícil
            </Button>
            <Button
              onClick={() => setSelectedMode(null)}
              className="w-full"
              variant="secondary"
            >
              Voltar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold mb-2">Jogo de Dama</CardTitle>
          <CardDescription className="text-lg">Escolha o modo de jogo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={() => handleModeSelect("pvp")}
            className="w-full h-20 text-xl flex items-center justify-center gap-3"
            variant="default"
          >
            <Users className="w-8 h-8" />
            Dois Jogadores
          </Button>
          <Button
            onClick={() => handleModeSelect("pve")}
            className="w-full h-20 text-xl flex items-center justify-center gap-3"
            variant="outline"
          >
            <Bot className="w-8 h-8" />
            Contra o Computador
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
