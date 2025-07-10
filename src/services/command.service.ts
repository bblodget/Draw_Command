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
    clear: /clear(?:\s+(?:all|the\s+canvas))?/i,
    
    // Resize patterns - simplified to just essential commands
    // Matches: "make the square bigger", "make it smaller", "make it much bigger", "make it a little smaller"
    resize: /make\s+(?:the\s+)?(square|circle|triangle|it)\s+(bigger|larger|smaller|much bigger|much smaller|a little bigger|a little smaller)/i,
    
    // Matches: "make the triangle the same size as the square"
    resizeSameAs: /make\s+(?:the\s+)?(square|circle|triangle|it)\s+(?:the\s+)?same\s+size\s+as\s+(?:the\s+)?(square|circle|triangle)/i
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

    // Try to match resize commands
    const resizeMatch = normalizedText.match(this.patterns.resize);
    if (resizeMatch) {
      let shape = resizeMatch[1];
      const modifier = resizeMatch[2];
      
      // Handle "it" reference - for now, we'll need the canvas service to resolve this
      let finalShape: 'square' | 'circle' | 'triangle' | undefined;
      if (shape === 'it') {
        finalShape = undefined; // Will be resolved by the app
      } else {
        finalShape = shape as 'square' | 'circle' | 'triangle';
      }
      
      // Calculate resize factor based on modifier
      let resizeFactor = 1.5; // Default for bigger/larger
      if (modifier === 'smaller') {
        resizeFactor = 0.67; // Make it about 2/3 the size
      } else if (modifier === 'much bigger') {
        resizeFactor = 2.0;
      } else if (modifier === 'much smaller') {
        resizeFactor = 0.5;
      } else if (modifier === 'a little bigger') {
        resizeFactor = 1.2;
      } else if (modifier === 'a little smaller') {
        resizeFactor = 0.8;
      }
      
      return {
        type: 'resize',
        shape: finalShape,
        resizeMode: 'relative',
        resizeFactor
      };
    }

    // Try to match "same size as" resize commands
    const resizeSameAsMatch = normalizedText.match(this.patterns.resizeSameAs);
    if (resizeSameAsMatch) {
      let sourceShape = resizeSameAsMatch[1]; // Shape to resize
      const targetShape = resizeSameAsMatch[2]; // Shape to match size of
      
      // Handle "it" reference for source shape
      let finalSourceShape: 'square' | 'circle' | 'triangle' | undefined;
      if (sourceShape === 'it') {
        finalSourceShape = undefined; // Will be resolved by the app
      } else {
        finalSourceShape = sourceShape as 'square' | 'circle' | 'triangle';
      }
      
      return {
        type: 'resize',
        shape: finalSourceShape,
        resizeMode: 'match',
        targetShape: targetShape as 'square' | 'circle' | 'triangle'
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