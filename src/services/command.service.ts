import type { DrawCommand } from '../types';

export class CommandService {
  // Regex patterns for different command types
  private readonly patterns = {
    // Matches: "draw a red square", "draw a blue circle", "draw a triangle"
    draw: /draw\s+(?:a\s+)?(?:(\w+)\s+)?(square|circle|triangle)/i,
    
    // Matches: "color the square red", "color the circle blue"
    color: /color\s+(?:the\s+)?(square|circle|triangle)\s+(\w+)/i,
    
    // Matches: "move the square left", "move the circle up", "move the square left 100"
    move: /move\s+(?:the\s+)?(square|circle|triangle)\s+(up|down|left|right)(?:\s+(\d+))?/i,
    
    // Matches: "delete the square", "remove the circle"
    delete: /(?:delete|remove)\s+(?:the\s+)?(square|circle|triangle)/i,
    
    // Matches: "clear", "clear all", "clear the canvas"
    clear: /clear(?:\s+(?:all|the\s+canvas))?/i
  };

  // Color mapping for common colors
  private readonly colorMap: Record<string, string> = {
    red: '#FF0000',
    blue: '#0000FF',
    green: '#00FF00',
    yellow: '#FFFF00',
    purple: '#800080',
    orange: '#FFA500',
    black: '#000000',
    white: '#FFFFFF',
    pink: '#FFC0CB',
    brown: '#A52A2A',
    gray: '#808080',
    grey: '#808080'
  };

  // Direction to position offset mapping
  private readonly directionMap: Record<string, { x: number; y: number }> = {
    up: { x: 0, y: -50 },
    down: { x: 0, y: 50 },
    left: { x: -50, y: 0 },
    right: { x: 50, y: 0 }
  };

  parseCommand(text: string): DrawCommand | null {
    // Normalize the text: lowercase and trim
    const normalizedText = text.toLowerCase().trim();
    
    console.log('Parsing command:', normalizedText);

    // Try to match draw command
    const drawMatch = normalizedText.match(this.patterns.draw);
    if (drawMatch) {
      const color = drawMatch[1];
      const shape = drawMatch[2] as 'square' | 'circle' | 'triangle';
      
      // Set appropriate default size for each shape
      const defaultSize = shape === 'circle' ? 50 : 100;
      
      return {
        type: 'draw',
        shape,
        color: color ? this.normalizeColor(color) : undefined,
        size: defaultSize,
        position: { x: 200, y: 200 } // Default position (center of canvas)
      };
    }

    // Try to match color command
    const colorMatch = normalizedText.match(this.patterns.color);
    if (colorMatch) {
      const shape = colorMatch[1] as 'square' | 'circle' | 'triangle';
      const color = colorMatch[2];
      
      return {
        type: 'draw', // We'll use 'draw' type but the app will interpret it as color change
        shape,
        color: this.normalizeColor(color)
      };
    }

    // Try to match move command
    const moveMatch = normalizedText.match(this.patterns.move);
    if (moveMatch) {
      const shape = moveMatch[1] as 'square' | 'circle' | 'triangle';
      const direction = moveMatch[2].toLowerCase() as keyof typeof this.directionMap;
      const customDistance = moveMatch[3] ? parseInt(moveMatch[3], 10) : null;
      
      // Get base direction and apply custom distance if provided
      const baseOffset = this.directionMap[direction];
      const distance = customDistance && customDistance >= 10 && customDistance <= 500 ? customDistance : 50;
      
      // Calculate offset with custom distance
      const offset = {
        x: baseOffset.x === 0 ? 0 : (baseOffset.x > 0 ? distance : -distance),
        y: baseOffset.y === 0 ? 0 : (baseOffset.y > 0 ? distance : -distance)
      };
      
      return {
        type: 'move',
        shape,
        position: offset // This will be used as an offset, not absolute position
      };
    }

    // Try to match delete command
    const deleteMatch = normalizedText.match(this.patterns.delete);
    if (deleteMatch) {
      const shape = deleteMatch[1] as 'square' | 'circle' | 'triangle';
      
      return {
        type: 'delete',
        shape
      };
    }

    // Try to match clear command
    const clearMatch = normalizedText.match(this.patterns.clear);
    if (clearMatch) {
      return {
        type: 'clear'
      };
    }

    // If no pattern matches, return null
    console.warn('No matching command pattern found for:', normalizedText);
    return null;
  }

  private normalizeColor(color: string): string {
    const normalized = color.toLowerCase();
    return this.colorMap[normalized] || normalized;
  }
}