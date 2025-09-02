"use client";

import React from 'react';
import { GameCustomization, BirdColor, BirdShape, BirdSize, BackgroundTheme, PipeStyle, DifficultyLevel, GameMode } from '@/types/game';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { BIRD_COLORS, BACKGROUND_THEMES, PIPE_STYLES, GAME_MODES } from '@/lib/gameConstants';

interface GameCustomizationProps {
  customization: GameCustomization;
  onCustomizationChange: (customization: GameCustomization) => void;
  disabled?: boolean;
}

const ColorSelector: React.FC<{
  colors: Record<string, string>;
  selected: string;
  onSelect: (color: string) => void;
  disabled?: boolean;
}> = ({ colors, selected, onSelect, disabled }) => (
  <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
    {Object.entries(colors).map(([key, value]) => (
      <button
        key={key}
        className={`w-10 h-10 rounded-full border-2 transition-all hover:scale-110 ${
          selected === key ? 'border-gray-800 ring-2 ring-blue-500' : 'border-gray-300'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        style={{ backgroundColor: value }}
        onClick={() => !disabled && onSelect(key)}
        disabled={disabled}
        title={key.charAt(0).toUpperCase() + key.slice(1)}
      />
    ))}
  </div>
);

const ThemePreview: React.FC<{ theme: BackgroundTheme; selected: boolean; onSelect: () => void; disabled?: boolean }> = ({ 
  theme, 
  selected, 
  onSelect, 
  disabled 
}) => {
  const themeData = BACKGROUND_THEMES[theme];
  
  return (
    <div
      className={`relative w-full h-24 rounded-lg cursor-pointer border-2 transition-all hover:scale-105 ${
        selected ? 'border-blue-500 ring-2 ring-blue-500/50' : 'border-gray-300'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      style={{
        background: `linear-gradient(to bottom, ${themeData.skyGradient.join(', ')})`
      }}
      onClick={() => !disabled && onSelect()}
    >
      <div 
        className="absolute bottom-0 left-0 right-0 h-6 rounded-b-md"
        style={{ backgroundColor: themeData.ground }}
      />
      <div className="absolute top-2 left-2 text-xs font-medium text-white bg-black/30 px-2 py-1 rounded">
        {theme.charAt(0).toUpperCase() + theme.slice(1)}
      </div>
    </div>
  );
};

export const GameCustomizationPanel: React.FC<GameCustomizationProps> = ({
  customization,
  onCustomizationChange,
  disabled = false,
}) => {
  const updateCustomization = (key: keyof GameCustomization, value: any) => {
    onCustomizationChange({
      ...customization,
      [key]: value,
    });
  };

  const resetToDefaults = () => {
    onCustomizationChange({
      birdColor: 'yellow',
      birdShape: 'round',
      birdSize: 'medium',
      backgroundTheme: 'day',
      pipeStyle: 'classic',
      difficulty: 'normal',
      particleEffects: true,
      weatherEffects: false,
      gameMode: 'classic',
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto h-fit">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Game Settings</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={resetToDefaults}
            disabled={disabled}
            className="text-xs"
          >
            Reset
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Tabs defaultValue="appearance" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="appearance" className="text-xs">Style</TabsTrigger>
            <TabsTrigger value="gameplay" className="text-xs">Game</TabsTrigger>
            <TabsTrigger value="effects" className="text-xs">Effects</TabsTrigger>
          </TabsList>
          
          <TabsContent value="appearance" className="space-y-6">
            {/* Bird Color */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Bird Color</Label>
              <ColorSelector
                colors={BIRD_COLORS}
                selected={customization.birdColor}
                onSelect={(color) => updateCustomization('birdColor', color as BirdColor)}
                disabled={disabled}
              />
            </div>

            {/* Bird Shape */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Bird Shape</Label>
              <Select
                value={customization.birdShape}
                onValueChange={(value) => updateCustomization('birdShape', value as BirdShape)}
                disabled={disabled}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="round">Round</SelectItem>
                  <SelectItem value="square">Square</SelectItem>
                  <SelectItem value="triangle">Triangle</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Bird Size */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Bird Size</Label>
              <Select
                value={customization.birdSize}
                onValueChange={(value) => updateCustomization('birdSize', value as BirdSize)}
                disabled={disabled}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Background Theme */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Background Theme</Label>
              <div className="grid grid-cols-2 gap-3">
                {(Object.keys(BACKGROUND_THEMES) as BackgroundTheme[]).map((theme) => (
                  <ThemePreview
                    key={theme}
                    theme={theme}
                    selected={customization.backgroundTheme === theme}
                    onSelect={() => updateCustomization('backgroundTheme', theme)}
                    disabled={disabled}
                  />
                ))}
              </div>
            </div>

            {/* Pipe Style */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Pipe Style</Label>
              <Select
                value={customization.pipeStyle}
                onValueChange={(value) => updateCustomization('pipeStyle', value as PipeStyle)}
                disabled={disabled}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(PIPE_STYLES) as PipeStyle[]).map((style) => (
                    <SelectItem key={style} value={style}>
                      {style.charAt(0).toUpperCase() + style.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="gameplay" className="space-y-6">
            {/* Game Mode */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Game Mode</Label>
              <Select
                value={customization.gameMode}
                onValueChange={(value) => updateCustomization('gameMode', value as GameMode)}
                disabled={disabled}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(GAME_MODES) as GameMode[]).map((mode) => (
                    <SelectItem key={mode} value={mode}>
                      {GAME_MODES[mode].name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-1">
                {GAME_MODES[customization.gameMode].description}
              </p>
            </div>

            {/* Difficulty */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Difficulty Level</Label>
              <div className="grid grid-cols-2 gap-2">
                {(['easy', 'normal', 'hard', 'expert'] as DifficultyLevel[]).map((level) => (
                  <Button
                    key={level}
                    variant={customization.difficulty === level ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateCustomization('difficulty', level)}
                    disabled={disabled}
                    className="text-xs"
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </Button>
                ))}
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                <Badge variant="secondary" className="text-xs">
                  Speed: {customization.difficulty === 'easy' ? 'Slow' : 
                          customization.difficulty === 'normal' ? 'Normal' :
                          customization.difficulty === 'hard' ? 'Fast' : 'Very Fast'}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  Gap: {customization.difficulty === 'easy' ? 'Large' : 
                        customization.difficulty === 'normal' ? 'Normal' :
                        customization.difficulty === 'hard' ? 'Small' : 'Tiny'}
                </Badge>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="effects" className="space-y-6">
            {/* Particle Effects */}
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Particle Effects</Label>
                <p className="text-xs text-gray-500 mt-1">
                  Show particles when jumping, scoring, or crashing
                </p>
              </div>
              <Switch
                checked={customization.particleEffects}
                onCheckedChange={(checked) => updateCustomization('particleEffects', checked)}
                disabled={disabled}
              />
            </div>

            {/* Weather Effects */}
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Weather Effects</Label>
                <p className="text-xs text-gray-500 mt-1">
                  Add animated weather based on theme
                </p>
              </div>
              <Switch
                checked={customization.weatherEffects}
                onCheckedChange={(checked) => updateCustomization('weatherEffects', checked)}
                disabled={disabled}
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};