export interface DrawCommand {
  type: 'draw' | 'move' | 'delete' | 'clear' | 'resize';
  shape?: 'square' | 'circle' | 'triangle' | 'line';
  color?: string;
  size?: number;
  position?: { x: number; y: number };
  targetId?: string;
  resizeMode?: 'relative';
  resizeFactor?: number;
}

export interface Shape {
  id: string;
  type: 'square' | 'circle' | 'triangle' | 'line';
  color: string;
  position: { x: number; y: number };
  size: number;
  createdAt: Date;
}