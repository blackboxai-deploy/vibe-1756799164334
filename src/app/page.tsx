"use client";

import React, { useState, useEffect } from 'react';
import { GameCustomization } from '@/types/game';
import { FlappyBirdGame } from '@/components/FlappyBirdGame';
import { GameCustomizationPanel } from '@/components/GameCustomization';
import { GameStatsPanel } from '@/components/GameStats';
import { useGameState } from '@/hooks/useGameState';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { STORAGE_KEYS } from '@/lib/gameConstants';

const DEFAULT_CUSTOMIZATION: GameCustomization = {
  birdColor: 'yellow',
  birdShape: 'round',
  birdSize: 'medium',
  backgroundTheme: 'day',
  pipeStyle: 'classic',
  difficulty: 'normal',
  particleEffects: true,
  weatherEffects: false,
  gameMode: 'classic',
};

export default function HomePage() {
  const [customization, setCustomization] = useState<GameCustomization>(DEFAULT_CUSTOMIZATION);
  const [mobileView, setMobileView] = useState<'game' | 'settings' | 'stats'>('game');
  
  const {
    gameState,
    particles,
    gameStats,
    timeLeft,
    jump,
    startGame,
    resetGame,
  } = useGameState(customization);

  // Load customization from localStorage
  useEffect(() => {
    const savedCustomization = localStorage.getItem(STORAGE_KEYS.CUSTOMIZATION);
    if (savedCustomization) {
      try {
        const parsed = JSON.parse(savedCustomization);
        setCustomization({ ...DEFAULT_CUSTOMIZATION, ...parsed });
      } catch (error) {
        console.warn('Failed to load saved customization:', error);
      }
    }
  }, []);

  // Save customization to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUSTOMIZATION, JSON.stringify(customization));
  }, [customization]);

  const handleCustomizationChange = (newCustomization: GameCustomization) => {
    setCustomization(newCustomization);
  };

  const handleResetStats = () => {
    localStorage.removeItem(STORAGE_KEYS.HIGH_SCORE);
    localStorage.removeItem(STORAGE_KEYS.STATS);
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Flappy Bird
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Customizable bird adventure game
              </p>
            </div>
            
            {/* Mobile Navigation */}
            <div className="md:hidden">
              <Tabs value={mobileView} onValueChange={(value: string) => setMobileView(value as typeof mobileView)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="game" className="text-xs">Game</TabsTrigger>
                  <TabsTrigger value="settings" className="text-xs">Settings</TabsTrigger>
                  <TabsTrigger value="stats" className="text-xs">Stats</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Desktop Layout */}
        <div className="hidden md:grid md:grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Game Area */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Game Area</CardTitle>
                  <div className="flex gap-2">
                    {gameState.status === 'playing' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={resetGame}
                        className="text-xs"
                      >
                        Restart
                      </Button>
                    )}
                    {gameState.status === 'gameOver' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={resetGame}
                        className="text-xs"
                      >
                        Back to Menu
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex justify-center">
                <FlappyBirdGame
                  gameState={gameState}
                  particles={particles}
                  customization={customization}
                  onJump={jump}
                  onStart={startGame}
                  onReset={resetGame}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Game Stats */}
            <GameStatsPanel
              gameState={gameState}
              gameStats={gameStats}
              timeLeft={timeLeft}
            />
            
            {/* Customization */}
            <GameCustomizationPanel
              customization={customization}
              onCustomizationChange={handleCustomizationChange}
              disabled={gameState.status === 'playing'}
            />
            
            {/* Additional Controls */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Jump:</strong> Space or Click</p>
                  <p><strong>Start:</strong> Space or Click</p>
                  <p><strong>Menu:</strong> Escape (when game over)</p>
                </div>
                
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleResetStats}
                  className="w-full text-xs"
                >
                  Reset All Stats
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden">
          <Tabs value={mobileView} onValueChange={(value) => setMobileView(value as typeof mobileView)}>
            <TabsContent value="game" className="mt-4">
              <Card>
                <CardContent className="p-4">
                  <FlappyBirdGame
                    gameState={gameState}
                    particles={particles}
                    customization={customization}
                    onJump={jump}
                    onStart={startGame}
                    onReset={resetGame}
                    className="w-full"
                  />
                  
                  <div className="mt-4 flex justify-center gap-2">
                    {gameState.status === 'playing' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={resetGame}
                        className="text-xs"
                      >
                        Restart
                      </Button>
                    )}
                    {gameState.status === 'gameOver' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={resetGame}
                        className="text-xs"
                      >
                        Back to Menu
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings" className="mt-4">
              <GameCustomizationPanel
                customization={customization}
                onCustomizationChange={handleCustomizationChange}
                disabled={gameState.status === 'playing'}
              />
              
              <Card className="mt-4">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleResetStats}
                    className="w-full text-xs"
                  >
                    Reset All Statistics
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="stats" className="mt-4">
              <GameStatsPanel
                gameState={gameState}
                gameStats={gameStats}
                timeLeft={timeLeft}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              Enjoy playing! Customize your bird and challenge yourself with different difficulty levels.
            </p>
            <div className="mt-2 flex flex-wrap justify-center gap-4 text-xs text-gray-500">
              <span>• 9 Bird Colors</span>
              <span>• 3 Bird Shapes</span>
              <span>• 6 Themes</span>
              <span>• 4 Difficulty Levels</span>
              <span>• 4 Game Modes</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}