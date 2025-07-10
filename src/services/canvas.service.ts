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

    // Use Fabric.js built-in constraint system to prevent out-of-bounds movement
    canvas.on('object:moving', (e) => {
      this.preventOutOfBoundsMovement(e.target);
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

    // Determine position: use old position if replacing (no overlap check), or find valid position for new shapes
    let validPosition: { x: number; y: number };
    if (wasReplaced && oldShape) {
      // When replacing, always use the old position (user's chosen location)
      validPosition = oldShape.position;
    } else {
      // For new shapes, find a position that doesn't overlap
      validPosition = this.findValidPosition(size, 'square', position);
    }

    const id = generateId();
    const rect = new fabric.Rect({
      left: validPosition.x,
      top: validPosition.y,
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
    
    // Add event listener to track position changes
    this.addMoveListener(rect, id);
    
    this.fabricCanvas.renderAll(); // Force canvas to render

    const shape: Shape = {
      id,
      type: 'square',
      color,
      position: validPosition,
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

    // Determine position: use old position if replacing (no overlap check), or find valid position for new shapes
    let validPosition: { x: number; y: number };
    if (wasReplaced && oldShape) {
      // When replacing, always use the old position (user's chosen location)
      validPosition = oldShape.position;
    } else {
      // For new shapes, find a position that doesn't overlap
      validPosition = this.findValidPosition(size, 'circle', position);
    }

    const id = generateId();
    const circle = new fabric.Circle({
      left: validPosition.x,
      top: validPosition.y,
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
    
    // Add event listener to track position changes
    this.addMoveListener(circle, id);
    
    this.fabricCanvas.renderAll(); // Force canvas to render

    const shape: Shape = {
      id,
      type: 'circle',
      color,
      position: validPosition,
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

    // Determine position: use old position if replacing (no overlap check), or find valid position for new shapes
    let validPosition: { x: number; y: number };
    if (wasReplaced && oldShape) {
      // When replacing, always use the old position (user's chosen location)
      validPosition = oldShape.position;
    } else {
      // For new shapes, find a position that doesn't overlap
      validPosition = this.findValidPosition(size, 'triangle', position);
    }

    const id = generateId();
    const triangle = new fabric.Triangle({
      left: validPosition.x,
      top: validPosition.y,
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
    
    // Add event listener to track position changes
    this.addMoveListener(triangle, id);
    
    this.fabricCanvas.renderAll(); // Force canvas to render

    const shape: Shape = {
      id,
      type: 'triangle',
      color,
      position: validPosition,
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

  // Collision detection and smart positioning methods
  private checkOverlap(shape1: Shape, shape2: Shape): boolean {
    // Check if two shapes overlap based on their types and positions
    return this.checkBoundingBoxOverlap(shape1, shape2);
  }

  private checkBoundingBoxOverlap(shape1: Shape, shape2: Shape): boolean {
    const bounds1 = this.getShapeBounds(shape1);
    const bounds2 = this.getShapeBounds(shape2);

    return !(bounds1.right < bounds2.left || 
             bounds2.right < bounds1.left || 
             bounds1.bottom < bounds2.top || 
             bounds2.bottom < bounds1.top);
  }

  private getShapeBounds(shape: Shape): { left: number; right: number; top: number; bottom: number } {
    const { x, y } = shape.position;
    const size = shape.size;

    switch (shape.type) {
      case 'square':
        return {
          left: x,
          right: x + size,
          top: y,
          bottom: y + size
        };
      case 'circle':
        // Circle uses radius, so we need to account for that
        const radius = size;
        return {
          left: x - radius,
          right: x + radius,
          top: y - radius,
          bottom: y + radius
        };
      case 'triangle':
        return {
          left: x,
          right: x + size,
          top: y,
          bottom: y + size
        };
      default:
        return { left: x, right: x, top: y, bottom: y };
    }
  }

  private checkPositionOverlap(position: { x: number; y: number }, size: number, shapeType: string): boolean {
    // Check if a position would overlap with existing shapes
    const tempShape: Shape = {
      id: 'temp',
      type: shapeType as any,
      color: '#000000',
      position,
      size,
      createdAt: new Date()
    };

    for (const existingShape of this.shapes.values()) {
      if (this.checkOverlap(tempShape, existingShape)) {
        return true;
      }
    }
    return false;
  }

  private isPositionOnCanvas(position: { x: number; y: number }, size: number, shapeType: string): boolean {
    if (!this.fabricCanvas) return false;

    const canvasWidth = this.fabricCanvas.getWidth();
    const canvasHeight = this.fabricCanvas.getHeight();
    const bounds = this.getShapeBounds({
      id: 'temp',
      type: shapeType as any,
      color: '#000000',
      position,
      size,
      createdAt: new Date()
    });

    return bounds.left >= 0 && 
           bounds.right <= canvasWidth && 
           bounds.top >= 0 && 
           bounds.bottom <= canvasHeight;
  }

  private findValidPosition(size: number, shapeType: string, preferredPosition?: { x: number; y: number }): { x: number; y: number } {
    if (!this.fabricCanvas) {
      return preferredPosition || { x: 100, y: 100 };
    }

    // If preferred position is provided and valid, use it
    if (preferredPosition && 
        this.isPositionOnCanvas(preferredPosition, size, shapeType) && 
        !this.checkPositionOverlap(preferredPosition, size, shapeType)) {
      return preferredPosition;
    }

    const canvasWidth = this.fabricCanvas.getWidth();
    const canvasHeight = this.fabricCanvas.getHeight();
    const maxAttempts = 20;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      let x: number, y: number;

      switch (shapeType) {
        case 'circle':
          // For circles, position is the center, so account for radius
          x = size + Math.random() * (canvasWidth - 2 * size);
          y = size + Math.random() * (canvasHeight - 2 * size);
          break;
        default:
          // For squares and triangles, position is top-left
          x = Math.random() * (canvasWidth - size);
          y = Math.random() * (canvasHeight - size);
          break;
      }

      const position = { x: Math.round(x), y: Math.round(y) };

      if (this.isPositionOnCanvas(position, size, shapeType) && 
          !this.checkPositionOverlap(position, size, shapeType)) {
        return position;
      }
    }

    // Fallback: return a safe position even if it might overlap
    switch (shapeType) {
      case 'circle':
        return { x: Math.max(size, 100), y: Math.max(size, 100) };
      default:
        return { x: 50, y: 50 };
    }
  }

  // Event listener management for tracking shape movements
  private addMoveListener(fabricObject: fabric.Object, shapeId: string): void {
    fabricObject.on('moving', () => {
      this.updateShapePosition(shapeId, fabricObject);
    });

    fabricObject.on('modified', () => {
      this.updateShapePosition(shapeId, fabricObject);
    });
  }

  private updateShapePosition(shapeId: string, fabricObject: fabric.Object): void {
    const shape = this.shapes.get(shapeId);
    if (shape && fabricObject.left !== undefined && fabricObject.top !== undefined) {
      // Update the shape's position in our tracking
      shape.position = { 
        x: Math.round(fabricObject.left), 
        y: Math.round(fabricObject.top) 
      };
    }
  }

  // Move a shape by type with directional offset
  moveShapeByType(shapeType: string, offset: { x: number; y: number }): boolean {
    if (!this.fabricCanvas) return false;

    const shape = this.getShapeByType(shapeType);
    if (!shape) return false;

    const fabricObject = this.fabricObjects.get(shape.id);
    if (!fabricObject) return false;

    // Calculate new position
    const currentPos = shape.position;
    const newX = currentPos.x + offset.x;
    const newY = currentPos.y + offset.y;

    // Get canvas dimensions
    const canvasWidth = this.fabricCanvas.getWidth();
    const canvasHeight = this.fabricCanvas.getHeight();

    // Calculate shape bounds at new position
    const testShape: Shape = {
      ...shape,
      position: { x: newX, y: newY }
    };
    const bounds = this.getShapeBounds(testShape);

    // Check if new position keeps shape within canvas
    if (bounds.left < 0 || bounds.right > canvasWidth || 
        bounds.top < 0 || bounds.bottom > canvasHeight) {
      return false; // Would move off canvas
    }

    // Update fabric object position
    fabricObject.set({
      left: newX,
      top: newY
    });
    fabricObject.setCoords(); // Update interactive controls
    this.fabricCanvas.renderAll();

    // Update our shape tracking
    shape.position = { x: newX, y: newY };

    return true;
  }

  // Delete a shape by type
  deleteShapeByType(shapeType: string): boolean {
    const shape = this.getShapeByType(shapeType);
    if (!shape) return false;

    // Remove from fabric canvas
    const fabricObject = this.fabricObjects.get(shape.id);
    if (fabricObject && this.fabricCanvas) {
      this.fabricCanvas.remove(fabricObject);
      this.fabricCanvas.renderAll();
    }

    // Clean up our tracking
    this.shapes.delete(shape.id);
    this.fabricObjects.delete(shape.id);
    this.shapesByType.delete(shapeType);

    return true;
  }

  // Prevent out-of-bounds movement by constraining position during drag
  private preventOutOfBoundsMovement(obj: fabric.Object | null): void {
    if (!obj || !this.fabricCanvas) return;

    const canvasWidth = this.fabricCanvas.getWidth();
    const canvasHeight = this.fabricCanvas.getHeight();
    
    // Get object bounding box for current position
    const objBounds = obj.getBoundingRect();
    
    // Calculate constrained position using min/max - this prevents out-of-bounds entirely
    const constrainedLeft = Math.max(0, Math.min(obj.left || 0, canvasWidth - objBounds.width));
    const constrainedTop = Math.max(0, Math.min(obj.top || 0, canvasHeight - objBounds.height));
    
    // Apply constraints immediately - no flicker since we never allow out-of-bounds
    obj.set({
      left: constrainedLeft,
      top: constrainedTop
    });
    obj.setCoords();
    
    // Update our shape tracking
    const shapeEntry = Array.from(this.fabricObjects.entries())
      .find(([, fabricObj]) => fabricObj === obj);
    
    if (shapeEntry) {
      const [shapeId] = shapeEntry;
      const shape = this.shapes.get(shapeId);
      if (shape) {
        shape.position = {
          x: Math.round(constrainedLeft),
          y: Math.round(constrainedTop)
        };
      }
    }
  }

  // Enforce canvas bounds for all objects (called after canvas resize)
  enforceCanvasBounds(): void {
    if (!this.fabricCanvas) return;

    const objects = this.fabricCanvas.getObjects();
    let needsUpdate = false;

    objects.forEach(obj => {
      const oldLeft = obj.left;
      const oldTop = obj.top;
      
      this.preventOutOfBoundsMovement(obj);
      
      // Check if position was changed
      if (obj.left !== oldLeft || obj.top !== oldTop) {
        needsUpdate = true;
        
        // Update our shape tracking
        const shapeEntry = Array.from(this.fabricObjects.entries())
          .find(([, fabricObj]) => fabricObj === obj);
        
        if (shapeEntry) {
          const [shapeId] = shapeEntry;
          const shape = this.shapes.get(shapeId);
          if (shape && obj.left !== undefined && obj.top !== undefined) {
            shape.position = {
              x: Math.round(obj.left),
              y: Math.round(obj.top)
            };
          }
        }
      }
    });

    if (needsUpdate) {
      this.fabricCanvas.renderAll();
    }
  }

  // Get canvas dimensions
  getCanvasDimensions(): { width: number; height: number } {
    if (!this.fabricCanvas) {
      return { width: 800, height: 600 }; // Default fallback
    }
    return {
      width: this.fabricCanvas.getWidth(),
      height: this.fabricCanvas.getHeight()
    };
  }

  // Resize shape by type
  resizeShapeByType(shapeType: string, resizeFactor: number): boolean {
    if (!this.fabricCanvas) return false;

    const shape = this.getShapeByType(shapeType);
    if (!shape) return false;

    const fabricObject = this.fabricObjects.get(shape.id);
    if (!fabricObject) return false;

    // Calculate new size based on resize factor
    const newSize = Math.max(10, Math.min(500, Math.round(shape.size * resizeFactor)));

    // Check if new size would cause shape to exceed canvas bounds
    const testShape: Shape = {
      ...shape,
      size: newSize
    };
    const bounds = this.getShapeBounds(testShape);
    
    const canvasWidth = this.fabricCanvas.getWidth();
    const canvasHeight = this.fabricCanvas.getHeight();
    
    // Adjust position if needed to keep shape within bounds
    let adjustedPosition = { ...shape.position };
    
    if (bounds.right > canvasWidth) {
      adjustedPosition.x = Math.max(0, canvasWidth - (bounds.right - bounds.left));
    }
    if (bounds.bottom > canvasHeight) {
      adjustedPosition.y = Math.max(0, canvasHeight - (bounds.bottom - bounds.top));
    }

    // Update fabric object based on shape type
    if (shape.type === 'circle') {
      // For circles, size is the radius
      (fabricObject as fabric.Circle).set({
        radius: newSize,
        left: adjustedPosition.x,
        top: adjustedPosition.y
      });
    } else {
      // For squares and triangles, size is width/height
      fabricObject.set({
        width: newSize,
        height: newSize,
        left: adjustedPosition.x,
        top: adjustedPosition.y
      });
    }

    // Update interactive controls and render
    fabricObject.setCoords();
    this.fabricCanvas.renderAll();

    // Update our shape tracking
    shape.size = newSize;
    shape.position = adjustedPosition;

    return true;
  }

  // Get the most recently added shape (for "it" references)
  getMostRecentShape(): Shape | undefined {
    if (this.shapes.size === 0) return undefined;
    
    // Get all shapes and sort by creation time
    const shapesArray = Array.from(this.shapes.values());
    shapesArray.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    return shapesArray[0];
  }
}