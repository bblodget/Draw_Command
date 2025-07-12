import type { SpatialRelation, SizeRelation } from './grammar';

export interface DrawCommand {
  type: 'draw' | 'move' | 'delete' | 'clear' | 'resize' | 'rotate' | 'color';
  shape?: 'square' | 'circle' | 'triangle' | 'line';
  pronoun?: 'it';
  color?: string;
  size?: number;
  position?: { x: number; y: number };
  targetId?: string;
  resizeMode?: 'relative' | 'match';
  resizeFactor?: number;
  targetShape?: 'square' | 'circle' | 'triangle';
  direction?: 'up' | 'down' | 'left' | 'right';
  value?: number;
  unit?: string;
  spatialRelation?: SpatialRelation;
  sizeRelation?: SizeRelation;
}

export interface Shape {
  id: string;
  type: 'square' | 'circle' | 'triangle' | 'line';
  color: string;
  position: { x: number; y: number };
  size: number;
  createdAt: Date;
}