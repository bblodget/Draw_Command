// TypeScript interfaces for parsed voice commands

export interface ParsedCommand {
  verb: string;
  preModifier: ModifierPhrase | null;
  object: ObjectPhrase;
  postModifier: ModifierPhrase | null;
  value: ValuePhrase | null;
}

export interface ObjectPhrase {
  type: 'shape' | 'pronoun';
  value: string;
  preFillers?: string[];
  postFillers?: string[];
}

export interface ModifierPhrase {
  type: 'simple' | 'spatial' | 'size_relation';
  value: string | SpatialRelation | SizeRelation;
  preFillers?: string[];
  postFillers?: string[];
}

export interface SpatialRelation {
  relation: 'left_of' | 'right_of' | 'above' | 'below' | 'next_to';
  reference: string;
}

export interface SizeRelation {
  relation: 'same_size' | 'twice_as_big' | 'half_size';
  reference: string;
}

export interface ValuePhrase {
  number: number;
  unit: string | null;
}

// Command types for the application
export interface DrawCommand {
  type: 'draw' | 'move' | 'color' | 'make' | 'resize' | 'rotate' | 'delete' | 'clear';
  shape?: 'square' | 'circle' | 'triangle';
  pronoun?: 'it';
  color?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
  size?: 'bigger' | 'smaller' | 'much bigger' | 'much smaller' | 'a little bigger' | 'a little smaller';
  value?: number;
  unit?: string;
  spatialRelation?: SpatialRelation;
  sizeRelation?: SizeRelation;
  position?: { x: number; y: number };
  resizeMode?: 'relative' | 'match' | 'absolute';
  resizeFactor?: number;
  targetShape?: 'square' | 'circle' | 'triangle';
}