import type { Shape } from '../types';

export class CanvasService {
  private shapes: Map<string, Shape> = new Map();

  addShape(shape: Shape): void {
    this.shapes.set(shape.id, shape);
  }

  getShape(id: string): Shape | undefined {
    return this.shapes.get(id);
  }

  getAllShapes(): Shape[] {
    return Array.from(this.shapes.values());
  }

  removeShape(id: string): boolean {
    return this.shapes.delete(id);
  }

  clearAll(): void {
    this.shapes.clear();
  }
}