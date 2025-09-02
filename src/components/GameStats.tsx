"use client";

import React from 'react';
import { GameStats, GameState } from '@/types/game';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface GameStatsProps {
  gameState: GameState;
  gameStats: GameStats;
  timeLeft?: number;
  className?: string;
}

export const GameStatsPanel: React.FC<GameStatsProps> = ({
  gameState,
  gameStats,
  timeLeft,
  className = '',
}) => {
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatPlaytime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Current Game Stats */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Current Game</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{gameState.score}</div>
              <div className="text-xs text-gray-500">Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{gameState.highScore}</div>
              <div className="text-xs text-gray-500">Best</div>
            </div>
          </div>
          
          {timeLeft !== undefined && timeLeft > 0 && (
            <>
              <Separator />
              <div className="text-center">
                <div className={`text-xl font-bold ${timeLeft <= 10 ? 'text-red-600' : 'text-orange-600'}`}>
                  {formatTime(timeLeft)}
                </div>
                <div className="text-xs text-gray-500">Time Remaining</div>
              </div>
            </>
          )}
          
          <Separator />
          
          <div className="flex justify-center">
            <Badge 
              variant={gameState.status === 'playing' ? 'default' : 
                      gameState.status === 'gameOver' ? 'destructive' : 
                      gameState.status === 'paused' ? 'secondary' : 'outline'}
              className="text-xs"
            >
              {gameState.status === 'menu' ? 'Ready to Play' :
               gameState.status === 'playing' ? 'Playing' :
               gameState.status === 'paused' ? 'Paused' :
               gameState.status === 'gameOver' ? 'Game Over' : 'Unknown'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Overall Statistics */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Statistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-purple-600">{gameStats.totalGames}</div>
              <div className="text-xs text-gray-500">Games Played</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-green-600">{gameStats.bestScore}</div>
              <div className="text-xs text-gray-500">Best Score</div>
            </div>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-blue-600">{gameStats.totalScore.toLocaleString()}</div>
              <div className="text-xs text-gray-500">Total Points</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-orange-600">{gameStats.averageScore}</div>
              <div className="text-xs text-gray-500">Average Score</div>
            </div>
          </div>
          
          <Separator />
          
          <div className="text-center">
            <div className="text-lg font-semibold text-indigo-600">
              {formatPlaytime(gameStats.playtime)}
            </div>
            <div className="text-xs text-gray-500">Total Playtime</div>
          </div>
          
          {gameStats.totalGames > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <div className="text-xs text-gray-500 text-center">Performance</div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-green-50 p-2 rounded">
                    <div className="text-sm font-medium text-green-700">
                      {Math.round((gameStats.totalScore / gameStats.totalGames) / Math.max(1, gameStats.bestScore) * 100)}%
                    </div>
                    <div className="text-xs text-green-600">Consistency</div>
                  </div>
                  <div className="bg-blue-50 p-2 rounded">
                    <div className="text-sm font-medium text-blue-700">
                      {Math.round(gameStats.playtime / gameStats.totalGames)}s
                    </div>
                    <div className="text-xs text-blue-600">Avg Game</div>
                  </div>
                  <div className="bg-purple-50 p-2 rounded">
                    <div className="text-sm font-medium text-purple-700">
                      {Math.round(gameStats.totalScore / Math.max(1, (gameStats.playtime / 60) * 60))}
                    </div>
                    <div className="text-xs text-purple-600">Points/Min</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Quick Tips */}
      {gameState.status === 'menu' && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-blue-800">How to Play</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-blue-700">
            <ul className="space-y-1">
              <li>• Click or press SPACE to jump</li>
              <li>• Avoid pipes and ground</li>
              <li>• Score points by passing through pipes</li>
              <li>• Customize your bird and difficulty</li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};