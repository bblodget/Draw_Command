import * as fabric from 'fabric';
import type { Shape } from '../types';
import { generateId } from '../utils';

export class CanvasService {
  private shapes: Map<string, Shape> = new Map();
  private fabricCanvas: fabric.Canvas | null = null;
  private fabricObjects: Map<string, fabric.Object> = new Map();
  private shapesByType: Map<string, string> = new Map(); // shape type -> shape id

  setCanvas(canvas: fabric.Canvas): void {
    this.fabricCanvas = canvas;
    
    // Ensure canvas is in selection mode, not drawing mode
    canvas.isDrawingMode = false;
    canvas.selection = true;
    
    // Add hover effects
    canvas.on('mouse:over', (e) => {
      if (e.target) {
        e.target.set('shadow', new fabric.Shadow({
          color: 'rgba(0, 0, 0, 0.2)',
          blur: 10,
          offsetX: 3,
          offsetY: 3,
        }));
        canvas.renderAll();
      }
    });

    canvas.on('mouse:out', (e) => {
      if (e.target) {
        e.target.set('shadow', null);
        canvas.renderAll();
      }
    });
  }

  drawSquare(color: string = 'red', size: number = 100, position?: { x: number; y: number }): { id: string; wasReplaced: boolean; oldShape?: Shape } {
    if (!this.fabricCanvas) throw new Error('Canvas not initialized');

    // Check if a square already exists
    const oldShape = this.getShapeByType('square');
    const wasReplaced = oldShape !== undefined;
    if (wasReplaced) {
      // Remove the existing square
      this.removeShapeByType('square');
    }

    const id = generateId();
    const rect = new fabric.Rect({
      left: position?.x ?? 100,
      top: position?.y ?? 100,
      width: size,
      height: size,
      fill: color,
      stroke: '#374151',
      strokeWidth: 2,
      cornerStyle: 'circle',
      cornerColor: '#2563eb',
      cornerStrokeColor: '#1e40af',
      borderColor: '#2563eb',
      borderScaleFactor: 2,
      transparentCorners: false,
      cornerSize: 8,
      selectable: true,
      evented: true,
      hasControls: true,
      hasBorders: true,
      lockMovementX: false,
      lockMovementY: false,
    });

    this.fabricCanvas.add(rect);
    this.fabricObjects.set(id, rect);
    this.fabricCanvas.renderAll(); // Force canvas to render

    const shape: Shape = {
      id,
      type: 'square',
      color,
      position: { x: rect.left!, y: rect.top! },
      size,
      createdAt: new Date(),
    };

    this.addShape(shape);
    return { id, wasReplaced, oldShape };
  }

  drawCircle(color: string = 'blue', size: number = 50, position?: { x: number; y: number }): { id: string; wasReplaced: boolean; oldShape?: Shape } {
    if (!this.fabricCanvas) throw new Error('Canvas not initialized');

    // Check if a circle already exists
    const oldShape = this.getShapeByType('circle');
    const wasReplaced = oldShape !== undefined;
    if (wasReplaced) {
      // Remove the existing circle
      this.removeShapeByType('circle');
    }

    const id = generateId();
    const circle = new fabric.Circle({
      left: position?.x ?? 200,
      top: position?.y ?? 100,
      radius: size,
      fill: color,
      stroke: '#374151',
      strokeWidth: 2,
      cornerStyle: 'circle',
      cornerColor: '#2563eb',
      cornerStrokeColor: '#1e40af',
      borderColor: '#2563eb',
      borderScaleFactor: 2,
      transparentCorners: false,
      cornerSize: 8,
      selectable: true,
      evented: true,
      hasControls: true,
      hasBorders: true,
      lockMovementX: false,
      lockMovementY: false,
    });

    this.fabricCanvas.add(circle);
    this.fabricObjects.set(id, circle);
    this.fabricCanvas.renderAll(); // Force canvas to render

    const shape: Shape = {
      id,
      type: 'circle',
      color,
      position: { x: circle.left!, y: circle.top! },
      size,
      createdAt: new Date(),
    };

    this.addShape(shape);
    return { id, wasReplaced, oldShape };
  }

  drawTriangle(color: string = 'green', size: number = 100, position?: { x: number; y: number }): { id: string; wasReplaced: boolean; oldShape?: Shape } {
    if (!this.fabricCanvas) throw new Error('Canvas not initialized');

    // Check if a triangle already exists
    const oldShape = this.getShapeByType('triangle');
    const wasReplaced = oldShape !== undefined;
    if (wasReplaced) {
      // Remove the existing triangle
      this.removeShapeByType('triangle');
    }

    const id = generateId();
    const triangle = new fabric.Triangle({
      left: position?.x ?? 300,
      top: position?.y ?? 100,
      width: size,
      height: size,
      fill: color,
      stroke: '#374151',
      strokeWidth: 2,
      cornerStyle: 'circle',
      cornerColor: '#2563eb',
      cornerStrokeColor: '#1e40af',
      borderColor: '#2563eb',
      borderScaleFactor: 2,
      transparentCorners: false,
      cornerSize: 8,
      selectable: true,
      evented: true,
      hasControls: true,
      hasBorders: true,
      lockMovementX: false,
      lockMovementY: false,
    });

    this.fabricCanvas.add(triangle);
    this.fabricObjects.set(id, triangle);
    this.fabricCanvas.renderAll(); // Force canvas to render

    const shape: Shape = {
      id,
      type: 'triangle',
      color,
      position: { x: triangle.left!, y: triangle.top! },
      size,
      createdAt: new Date(),
    };

    this.addShape(shape);
    return { id, wasReplaced, oldShape };
  }

  private addShape(shape: Shape): void {
    this.shapes.set(shape.id, shape);
    this.shapesByType.set(shape.type, shape.id);
  }

  getShape(id: string): Shape | undefined {
    return this.shapes.get(id);
  }

  getAllShapes(): Shape[] {
    return Array.from(this.shapes.values());
  }

  removeShape(id: string): boolean {
    const fabricObject = this.fabricObjects.get(id);
    if (fabricObject && this.fabricCanvas) {
      this.fabricCanvas.remove(fabricObject);
      this.fabricObjects.delete(id);
    }
    return this.shapes.delete(id);
  }

  clearAll(): void {
    if (this.fabricCanvas) {
      this.fabricCanvas.clear();
    }
    this.shapes.clear();
    this.fabricObjects.clear();
    this.shapesByType.clear();
  }

  // New methods for single-instance shape management
  hasShapeType(shapeType: string): boolean {
    return this.shapesByType.has(shapeType);
  }

  getShapeByType(shapeType: string): Shape | undefined {
    const shapeId = this.shapesByType.get(shapeType);
    return shapeId ? this.shapes.get(shapeId) : undefined;
  }

  private removeShapeByType(shapeType: string): boolean {
    const existingShapeId = this.shapesByType.get(shapeType);
    if (existingShapeId) {
      this.removeShape(existingShapeId);
      this.shapesByType.delete(shapeType);
      return true;
    }
    return false;
  }

  getExistingShapeTypes(): string[] {
    return Array.from(this.shapesByType.keys());
  }
}