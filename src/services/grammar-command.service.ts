import * as nearley from 'nearley';
import grammar from '../grammar/voice-commands.js';
import type { DrawCommand } from '../types';
import type { ParsedCommand, SpatialRelation, SizeRelation } from '../types/grammar';

export class GrammarCommandService {
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
    
    console.log('Parsing command with grammar:', normalizedText);

    try {
      // Create a new parser instance
      const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
      
      // Parse the command
      parser.feed(normalizedText);
      
      if (parser.results.length === 0) {
        console.warn('No parse results for:', normalizedText);
        return null;
      }
      
      if (parser.results.length > 1) {
        console.warn('Ambiguous parse results for:', normalizedText, 'Using first result');
      }
      
      const parsedCommand = parser.results[0] as ParsedCommand;
      console.log('Parsed command:', parsedCommand);
      
      // Convert parsed command to DrawCommand
      return this.convertToDrawCommand(parsedCommand);
      
    } catch (error) {
      console.error('Grammar parsing error:', error);
      return null;
    }
  }

  private convertToDrawCommand(parsed: ParsedCommand): DrawCommand | null {
    const { verb, object, preModifier, postModifier, value } = parsed;
    
    // Debug logging
    console.log('Converting parsed command:', { verb, object, preModifier, postModifier, value });
    
    // Get the shape or pronoun (handle null object for commands like "clear")
    const shape = object?.type === 'shape' ? object.value as 'square' | 'circle' | 'triangle' : undefined;
    const pronoun = object?.type === 'pronoun' ? object.value as 'it' : undefined;
    const color = object?.color; // Get color from object
    const direction = object?.direction; // Get direction from object
    const distance = object?.distance; // Get distance from object
    const unit = object?.unit; // Get unit from object
    const sizeModifier = object?.sizeModifier; // Get size modifier from object
    const sizeRelation = object?.sizeRelation; // Get size relation from object
    const targetShape = object?.targetShape; // Get target shape for size relation
    const spatialRelation = object?.spatialRelation; // Get spatial relation from object
    const referenceShape = object?.referenceShape; // Get reference shape for spatial relation
    
    console.log('Extracted values:', { shape, pronoun, color, direction, distance, unit, sizeModifier, sizeRelation, targetShape, spatialRelation, referenceShape });
    console.log('Spatial relation details:', { spatialRelation, referenceShape });

    switch (verb) {
      case 'draw':
        return this.handleDrawCommand(shape, pronoun, color, spatialRelation, referenceShape, preModifier, postModifier, value);
      
      case 'move':
        return this.handleMoveCommand(shape, pronoun, direction, distance, unit, spatialRelation, referenceShape, preModifier, postModifier, value);
      
      case 'color':
      case 'colour':
      case 'fill':
        return this.handleColorCommand(shape, pronoun, color, preModifier, postModifier);
      
      case 'make':
        return this.handleMakeCommand(shape, pronoun, color, sizeModifier, sizeRelation, targetShape, preModifier, postModifier, value);
      
      case 'resize':
        return this.handleResizeCommand(shape, pronoun, sizeModifier, sizeRelation, targetShape, preModifier, postModifier, value);
      
      case 'rotate':
        return this.handleRotateCommand(shape, pronoun, preModifier, postModifier, value);
      
      case 'delete':
      case 'remove':
        return this.handleDeleteCommand(shape, pronoun, preModifier, postModifier, value);
      
      case 'clear':
        return { type: 'clear' };
      
      default:
        console.warn('Unknown verb:', verb);
        return null;
    }
  }

  private handleDrawCommand(shape?: 'square' | 'circle' | 'triangle', pronoun?: 'it', objectColor?: string, objectSpatialRelation?: string, objectReferenceShape?: string, preModifier?: any, postModifier?: any, _value?: any): DrawCommand | null {
    if (!shape && !pronoun) {
      console.warn('Draw command needs a shape or pronoun');
      return null;
    }

    // Get color from object first, then from modifiers as fallback
    const color = objectColor || this.extractColor(preModifier, postModifier);
    
    // Get spatial relationship from object first, then from modifiers as fallback
    const spatialRelationString = objectSpatialRelation || this.extractSpatialRelationString(preModifier, postModifier);
    const referenceShape = objectReferenceShape || this.extractReferenceShape(preModifier, postModifier);
    
    // Set appropriate default size for each shape
    const defaultSize = shape === 'circle' ? 50 : 100;
    
    const command: DrawCommand = {
      type: 'draw',
      shape,
      pronoun,
      color: color ? this.normalizeColor(color) : undefined,
      size: defaultSize,
      position: { x: 200, y: 200 } // Default position (center of canvas)
    };

    // Handle spatial relationships from the new grammar structure
    if (spatialRelationString && referenceShape) {
      command.spatialRelation = this.createSpatialRelation(spatialRelationString, referenceShape);
    }

    return command;
  }

  private handleMoveCommand(shape?: 'square' | 'circle' | 'triangle', pronoun?: 'it', objectDirection?: string, objectDistance?: number, objectUnit?: string, objectSpatialRelation?: string, objectReferenceShape?: string, preModifier?: any, postModifier?: any, value?: any): DrawCommand | null {
    if (!shape && !pronoun) {
      console.warn('Move command needs a shape or pronoun');
      return null;
    }

    // Get direction from object first, then from modifiers as fallback
    const direction = objectDirection || this.extractDirection(preModifier, postModifier);
    
    // Get spatial relationship from object first, then from modifiers as fallback
    const spatialRelationString = objectSpatialRelation || this.extractSpatialRelationString(preModifier, postModifier);
    const referenceShape = objectReferenceShape || this.extractReferenceShape(preModifier, postModifier);
    
    // Handle spatial relationships from the new grammar structure
    if (spatialRelationString && referenceShape) {
      return {
        type: 'move',
        shape,
        pronoun,
        spatialRelation: this.createSpatialRelation(spatialRelationString, referenceShape)
      };
    }
    
    if (!direction) {
      console.warn('Move command needs a direction');
      return null;
    }

    // Get distance from object first, then from value, then default to 100
    const distance = objectDistance || value?.number || 100;
    
    // Calculate offset with custom distance
    const baseOffset = this.directionMap[direction];
    const offset = {
      x: baseOffset.x === 0 ? 0 : (baseOffset.x > 0 ? distance : -distance),
      y: baseOffset.y === 0 ? 0 : (baseOffset.y > 0 ? distance : -distance)
    };
    
    return {
      type: 'move',
      shape,
      pronoun,
      direction: direction as 'up' | 'down' | 'left' | 'right',
      value: distance,
      unit: objectUnit || value?.unit || undefined,
      position: offset // This will be used as an offset, not absolute position
    };
  }

  private handleColorCommand(shape?: 'square' | 'circle' | 'triangle', pronoun?: 'it', objectColor?: string, preModifier?: any, postModifier?: any): DrawCommand | null {
    if (!shape && !pronoun) {
      console.warn('Color command needs a shape or pronoun');
      return null;
    }

    // Get color from object first, then from modifiers as fallback
    const color = objectColor || this.extractColor(preModifier, postModifier);
    
    if (!color) {
      console.warn('Color command needs a color');
      return null;
    }

    return {
      type: 'color',
      shape,
      pronoun,
      color: this.normalizeColor(color)
    };
  }

  private handleMakeCommand(shape?: 'square' | 'circle' | 'triangle', pronoun?: 'it', objectColor?: string, objectSizeModifier?: string, objectSizeRelation?: string, objectTargetShape?: string, preModifier?: any, postModifier?: any, _value?: any): DrawCommand | null {
    if (!shape && !pronoun) {
      console.warn('Make command needs a shape or pronoun');
      return null;
    }

    // Handle size relationships from object first
    if (objectSizeRelation && objectTargetShape) {
      return {
        type: 'resize',
        shape,
        pronoun,
        resizeMode: 'match',
        targetShape: objectTargetShape as 'square' | 'circle' | 'triangle'
      };
    }

    // Handle size modifiers from object first
    if (objectSizeModifier) {
      const resizeFactor = this.getSizeModifierFactor(objectSizeModifier);
      return {
        type: 'resize',
        shape,
        pronoun,
        resizeMode: 'relative',
        resizeFactor
      };
    }

    // Handle size relationships from modifiers as fallback
    const sizeRelation = this.extractSizeRelation(preModifier, postModifier);
    if (sizeRelation) {
      return {
        type: 'resize',
        shape,
        pronoun,
        resizeMode: 'match',
        targetShape: sizeRelation.reference as 'square' | 'circle' | 'triangle'
      };
    }

    // Get size modifier from modifiers as fallback
    const sizeModifier = this.extractSizeModifier(preModifier, postModifier);
    if (sizeModifier) {
      const resizeFactor = this.getSizeModifierFactor(sizeModifier);
      return {
        type: 'resize',
        shape,
        pronoun,
        resizeMode: 'relative',
        resizeFactor
      };
    }

    // Get color from object first, then from modifiers as fallback
    const color = objectColor || this.extractColor(preModifier, postModifier);
    if (color) {
      return {
        type: 'color',
        shape,
        pronoun,
        color: this.normalizeColor(color)
      };
    }

    console.warn('Make command needs a size modifier or color');
    return null;
  }

  private handleResizeCommand(shape?: 'square' | 'circle' | 'triangle', pronoun?: 'it', objectSizeModifier?: string, objectSizeRelation?: string, objectTargetShape?: string, preModifier?: any, postModifier?: any, _value?: any): DrawCommand | null {
    if (!shape && !pronoun) {
      console.warn('Resize command needs a shape or pronoun');
      return null;
    }

    // Handle size relationships from object first
    if (objectSizeRelation && objectTargetShape) {
      return {
        type: 'resize',
        shape,
        pronoun,
        resizeMode: 'match',
        targetShape: objectTargetShape as 'square' | 'circle' | 'triangle'
      };
    }

    // Handle size modifiers from object first
    if (objectSizeModifier) {
      const resizeFactor = this.getSizeModifierFactor(objectSizeModifier);
      return {
        type: 'resize',
        shape,
        pronoun,
        resizeMode: 'relative',
        resizeFactor
      };
    }

    // Get size modifier from modifiers as fallback
    const sizeModifier = this.extractSizeModifier(preModifier, postModifier);
    if (!sizeModifier) {
      console.warn('Resize command needs a size modifier');
      return null;
    }

    const resizeFactor = this.getSizeModifierFactor(sizeModifier);
    
    return {
      type: 'resize',
      shape,
      pronoun,
      resizeMode: 'relative',
      resizeFactor
    };
  }

  private handleRotateCommand(shape?: 'square' | 'circle' | 'triangle', pronoun?: 'it', _preModifier?: any, _postModifier?: any, value?: any): DrawCommand | null {
    if (!shape && !pronoun) {
      console.warn('Rotate command needs a shape or pronoun');
      return null;
    }

    // Get angle from value, default to 90 degrees
    const angle = value?.number || 90;
    
    return {
      type: 'rotate',
      shape,
      pronoun,
      value: angle,
      unit: value?.unit || 'degrees'
    };
  }

  private handleDeleteCommand(shape?: 'square' | 'circle' | 'triangle', pronoun?: 'it', _preModifier?: any, _postModifier?: any, _value?: any): DrawCommand | null {
    if (!shape && !pronoun) {
      console.warn('Delete command needs a shape or pronoun');
      return null;
    }

    return {
      type: 'delete',
      shape,
      pronoun
    };
  }

  // Helper methods to extract information from modifiers
  private extractColor(preModifier?: any, postModifier?: any): string | undefined {
    const modifiers = [preModifier, postModifier].filter(Boolean);
    
    for (const modifier of modifiers) {
      if (modifier?.type === 'simple' && this.colorMap[modifier.value]) {
        return modifier.value;
      }
    }
    
    return undefined;
  }

  private extractDirection(preModifier?: any, postModifier?: any): string | undefined {
    const modifiers = [preModifier, postModifier].filter(Boolean);
    const directions = ['up', 'down', 'left', 'right'];
    
    for (const modifier of modifiers) {
      if (modifier?.type === 'simple' && directions.includes(modifier.value)) {
        return modifier.value;
      }
    }
    
    return undefined;
  }

  private extractSizeModifier(preModifier?: any, postModifier?: any): string | undefined {
    const modifiers = [preModifier, postModifier].filter(Boolean);
    const sizeModifiers = ['bigger', 'larger', 'smaller', 'much bigger', 'much smaller', 'a little bigger', 'a little smaller'];
    
    for (const modifier of modifiers) {
      if (modifier?.type === 'simple' && sizeModifiers.includes(modifier.value)) {
        return modifier.value;
      }
    }
    
    return undefined;
  }

  private extractSpatialRelation(preModifier?: any, postModifier?: any): SpatialRelation | undefined {
    const modifiers = [preModifier, postModifier].filter(Boolean);
    
    for (const modifier of modifiers) {
      if (modifier?.type === 'spatial') {
        return modifier.value as SpatialRelation;
      }
    }
    
    return undefined;
  }

  private extractSizeRelation(preModifier?: any, postModifier?: any): SizeRelation | undefined {
    const modifiers = [preModifier, postModifier].filter(Boolean);
    
    for (const modifier of modifiers) {
      if (modifier?.type === 'size_relation') {
        return modifier.value as SizeRelation;
      }
    }
    
    return undefined;
  }

  private getSizeModifierFactor(sizeModifier: string): number {
    switch (sizeModifier) {
      case 'bigger':
      case 'larger':
        return 1.5;
      case 'smaller':
        return 0.67;
      case 'much bigger':
        return 2.0;
      case 'much smaller':
        return 0.5;
      case 'a little bigger':
        return 1.2;
      case 'a little smaller':
        return 0.8;
      default:
        return 1.5; // Default to bigger
    }
  }

  private normalizeColor(color: string): string {
    const normalized = color.toLowerCase();
    return this.colorMap[normalized] || normalized;
  }

  // New helper methods for spatial relationships
  private extractSpatialRelationString(preModifier?: any, postModifier?: any): string | undefined {
    const modifiers = [preModifier, postModifier].filter(Boolean);
    
    for (const modifier of modifiers) {
      if (modifier?.type === 'spatial') {
        return modifier.value?.relation;
      }
    }
    
    return undefined;
  }

  private extractReferenceShape(preModifier?: any, postModifier?: any): string | undefined {
    const modifiers = [preModifier, postModifier].filter(Boolean);
    
    for (const modifier of modifiers) {
      if (modifier?.type === 'spatial') {
        return modifier.value?.reference;
      }
    }
    
    return undefined;
  }

  private createSpatialRelation(relationString: string, referenceShape: string): SpatialRelation {
    // Map grammar spatial relation strings to our type system
    const relationMap: Record<string, 'left_of' | 'right_of' | 'above' | 'below' | 'next_to'> = {
      'to_the_left_of': 'left_of',
      'to_the_right_of': 'right_of',
      'above': 'above',
      'below': 'below',
      'next_to': 'next_to'
    };

    return {
      relation: relationMap[relationString] || 'next_to',
      reference: referenceShape
    };
  }
}