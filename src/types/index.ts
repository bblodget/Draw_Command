export interface DrawCommand {
  type: 'draw' | 'move' | 'delete' | 'clear';
  shape?: 'square' | 'circle' | 'triangle' | 'line';
  color?: string;
  size?: number;
  position?: { x: number; y: number };
  targetId?: string;
}

export interface Shape {
  id: string;
  type: 'square' | 'circle' | 'triangle' | 'line';
  color: string;
  position: { x: number; y: number };
  size: number;
  createdAt: Date;
}