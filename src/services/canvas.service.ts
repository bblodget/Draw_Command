import * as fabric from 'fabric';
import type { Shape } from '../types';
import { generateId } from '../utils';

export class CanvasService {
    private shapes: Map<string, Shape> = new Map();
    private fabricCanvas: fabric.Canvas | null = null;
    private fabricObjects: Map<string, fabric.Object> = new Map();
    private shapesByType: Map<string, string> = new Map(); // shape type -> shape id
    private lastInteractedShapeType: string | null = null; // Track last shape type for pronoun resolution

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

    drawSquare(color: string = 'red', size: number = 100, position?: { x: number; y: number }): { id: string; wasReplaced: boolean; oldShape?: Shape; actualColor: string } {
        if (!this.fabricCanvas) throw new Error('Canvas not initialized');

        // Check if a square already exists
        const oldShape = this.getShapeByType('square');
        const wasReplaced = oldShape !== undefined;
        if (wasReplaced) {
            // Remove the existing square
            this.removeShapeByType('square');
        }

        // Determine position: use provided position if available, otherwise use old position if replacing
        let validPosition: { x: number; y: number };
        if (position) {
            // New position explicitly provided (e.g., spatial relationship)
            validPosition = position;
        } else if (wasReplaced && oldShape) {
            // When replacing without new position, use the old position (user's chosen location)
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

        // Apply rotation if preserving from old shape
        if (wasReplaced && oldShape && oldShape.rotation !== 0) {
            rect.rotate(oldShape.rotation);
        }

        this.fabricCanvas.add(rect);
        this.fabricObjects.set(id, rect);

        // Add event listener to track position changes
        this.addMoveListener(rect, id);

        // Update last interacted shape for pronoun resolution
        this.updateLastInteractedShape('square');

        this.fabricCanvas.renderAll(); // Force canvas to render

        const shape: Shape = {
            id,
            type: 'square',
            color,
            position: validPosition,
            size,
            rotation: wasReplaced && oldShape ? oldShape.rotation : 0, // Preserve rotation when replacing
            createdAt: new Date(),
        };

        this.addShape(shape);
        return { id, wasReplaced, oldShape, actualColor: color };
    }

    drawCircle(color: string = 'blue', size: number = 100, position?: { x: number; y: number }): { id: string; wasReplaced: boolean; oldShape?: Shape; actualColor: string } {
        if (!this.fabricCanvas) throw new Error('Canvas not initialized');

        // Check if a circle already exists
        const oldShape = this.getShapeByType('circle');
        const wasReplaced = oldShape !== undefined;
        if (wasReplaced) {
            // Remove the existing circle
            this.removeShapeByType('circle');
        }

        // Determine position: use provided position if available, otherwise use old position if replacing
        let validPosition: { x: number; y: number };
        if (position) {
            // New position explicitly provided (e.g., spatial relationship)
            validPosition = position;
        } else if (wasReplaced && oldShape) {
            // When replacing without new position, use the old position (user's chosen location)
            validPosition = oldShape.position;
        } else {
            // For new shapes, find a position that doesn't overlap
            validPosition = this.findValidPosition(size, 'circle', position);
        }

        const id = generateId();
        const circle = new fabric.Circle({
            left: validPosition.x,
            top: validPosition.y,
            radius: size / 2, // Convert diameter to radius for Fabric.js
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

        // Apply rotation if preserving from old shape (circles don't show rotation but we track it)
        if (wasReplaced && oldShape && oldShape.rotation !== 0) {
            circle.rotate(oldShape.rotation);
        }

        this.fabricCanvas.add(circle);
        this.fabricObjects.set(id, circle);

        // Add event listener to track position changes
        this.addMoveListener(circle, id);

        // Update last interacted shape for pronoun resolution
        this.updateLastInteractedShape('circle');

        this.fabricCanvas.renderAll(); // Force canvas to render

        const shape: Shape = {
            id,
            type: 'circle',
            color,
            position: validPosition,
            size, // Store diameter as size (consistent with other shapes)
            rotation: wasReplaced && oldShape ? oldShape.rotation : 0, // Preserve rotation when replacing
            createdAt: new Date(),
        };

        this.addShape(shape);
        return { id, wasReplaced, oldShape, actualColor: color };
    }

    drawTriangle(color: string = 'green', size: number = 100, position?: { x: number; y: number }): { id: string; wasReplaced: boolean; oldShape?: Shape; actualColor: string } {
        if (!this.fabricCanvas) throw new Error('Canvas not initialized');

        // Check if a triangle already exists
        const oldShape = this.getShapeByType('triangle');
        const wasReplaced = oldShape !== undefined;
        if (wasReplaced) {
            // Remove the existing triangle
            this.removeShapeByType('triangle');
        }

        // Determine position: use provided position if available, otherwise use old position if replacing
        let validPosition: { x: number; y: number };
        if (position) {
            // New position explicitly provided (e.g., spatial relationship)
            validPosition = position;
        } else if (wasReplaced && oldShape) {
            // When replacing without new position, use the old position (user's chosen location)
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

        // Apply rotation if preserving from old shape
        if (wasReplaced && oldShape && oldShape.rotation !== 0) {
            triangle.rotate(oldShape.rotation);
        }

        this.fabricCanvas.add(triangle);
        this.fabricObjects.set(id, triangle);

        // Add event listener to track position changes
        this.addMoveListener(triangle, id);

        // Update last interacted shape for pronoun resolution
        this.updateLastInteractedShape('triangle');

        this.fabricCanvas.renderAll(); // Force canvas to render

        const shape: Shape = {
            id,
            type: 'triangle',
            color,
            position: validPosition,
            size,
            rotation: wasReplaced && oldShape ? oldShape.rotation : 0, // Preserve rotation when replacing
            createdAt: new Date(),
        };

        this.addShape(shape);
        return { id, wasReplaced, oldShape, actualColor: color };
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

        // All shapes now use the same calculation - size represents width/height/diameter
        return {
            left: x,
            right: x + size,
            top: y,
            bottom: y + size
        };
    }

    private checkPositionOverlap(position: { x: number; y: number }, size: number, shapeType: string): boolean {
        // Check if a position would overlap with existing shapes
        const tempShape: Shape = {
            id: 'temp',
            type: shapeType as any,
            color: '#000000',
            position,
            size,
            rotation: 0,
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
            rotation: 0,
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

            // All shapes now use top-left corner positioning
            x = Math.random() * (canvasWidth - size);
            y = Math.random() * (canvasHeight - size);

            const position = { x: Math.round(x), y: Math.round(y) };

            if (this.isPositionOnCanvas(position, size, shapeType) &&
                !this.checkPositionOverlap(position, size, shapeType)) {
                return position;
            }
        }

        // Fallback: return a safe position even if it might overlap
        return { x: 50, y: 50 };
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

        // Update last interacted shape for pronoun resolution
        this.updateLastInteractedShape(shapeType);

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

        // Update last interacted shape for pronoun resolution
        this.updateLastInteractedShape(shapeType);

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

    // Resize shape by type (relative mode)
    resizeShapeByType(shapeType: string, resizeFactor: number): boolean;
    // Resize shape to match another shape's size
    resizeShapeByType(shapeType: string, mode: 'match', targetShapeType: string): boolean;
    resizeShapeByType(shapeType: string, resizeFactorOrMode: number | 'match', targetShapeType?: string): boolean {
        if (!this.fabricCanvas) return false;

        const shape = this.getShapeByType(shapeType);
        if (!shape) return false;

        const fabricObject = this.fabricObjects.get(shape.id);
        if (!fabricObject) return false;

        let newSize: number;

        if (resizeFactorOrMode === 'match') {
            // Match mode: resize to same size as target shape
            if (!targetShapeType) return false;

            const targetShape = this.getShapeByType(targetShapeType);
            if (!targetShape) return false;

            // Convert between different shape size measurements
            newSize = this.convertSizeBetweenShapes(targetShape.type, shape.type, targetShape.size);
        } else {
            // Relative mode: apply resize factor
            newSize = Math.round(shape.size * resizeFactorOrMode);
        }

        // Clamp size to reasonable bounds (min 10px, max 500px)
        newSize = Math.max(10, Math.min(500, newSize));

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
            // For circles, size is diameter, convert to radius for Fabric.js
            (fabricObject as fabric.Circle).set({
                radius: newSize / 2,
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

        // Update last interacted shape for pronoun resolution
        this.updateLastInteractedShape(shapeType);

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

    // Convert size between different shape types for "same size as" functionality
    private convertSizeBetweenShapes(sourceType: string, targetType: string, sourceSize: number): number {
        // If same shape type, use size directly
        if (sourceType === targetType) {
            return sourceSize;
        }

        // All shapes now use the same size measurement (width/height/diameter)
        // No conversion needed since they're all consistent
        return sourceSize;
    }

    // Pronoun resolution support
    getLastInteractedShapeType(): string | null {
        return this.lastInteractedShapeType;
    }

    private updateLastInteractedShape(shapeType: string): void {
        this.lastInteractedShapeType = shapeType;
    }

    // Spatial relationship positioning
    calculateSpatialPosition(shapeSize: number, shapeType: string, relation: string, referenceShapeType: string): { x: number; y: number } | null {
        if (!this.fabricCanvas) return null;

        const referenceShape = this.getShapeByType(referenceShapeType);
        if (!referenceShape) {
            console.warn(`Reference shape ${referenceShapeType} not found for spatial positioning`);
            return null;
        }

        const refBounds = this.getShapeBounds(referenceShape);
        const spacing = 20; // Spacing between shapes
        const canvasWidth = this.fabricCanvas.getWidth();
        const canvasHeight = this.fabricCanvas.getHeight();

        let position: { x: number; y: number };

        switch (relation) {
            case 'left_of':
            case 'to_the_left_of':
                position = {
                    x: refBounds.left - shapeSize - spacing,
                    y: refBounds.top + (refBounds.bottom - refBounds.top - shapeSize) / 2
                };
                break;

            case 'right_of':
            case 'to_the_right_of':
                position = {
                    x: refBounds.right + spacing,
                    y: refBounds.top + (refBounds.bottom - refBounds.top - shapeSize) / 2
                };
                break;

            case 'above':
                position = {
                    x: refBounds.left + (refBounds.right - refBounds.left - shapeSize) / 2,
                    y: refBounds.top - shapeSize - spacing
                };
                break;

            case 'below':
                position = {
                    x: refBounds.left + (refBounds.right - refBounds.left - shapeSize) / 2,
                    y: refBounds.bottom + spacing
                };
                break;

            case 'next_to':
                // Try positions in priority order: right, left, above, below
                const positions = [
                    { x: refBounds.right + spacing, y: refBounds.top + (refBounds.bottom - refBounds.top - shapeSize) / 2 },
                    { x: refBounds.left - shapeSize - spacing, y: refBounds.top + (refBounds.bottom - refBounds.top - shapeSize) / 2 },
                    { x: refBounds.left + (refBounds.right - refBounds.left - shapeSize) / 2, y: refBounds.top - shapeSize - spacing },
                    { x: refBounds.left + (refBounds.right - refBounds.left - shapeSize) / 2, y: refBounds.bottom + spacing }
                ];

                for (const pos of positions) {
                    if (this.isPositionOnCanvas(pos, shapeSize, shapeType)) {
                        position = pos;
                        break;
                    }
                }

                if (!position!) {
                    // If no position works, use the first one anyway
                    position = positions[0];
                }
                break;

            default:
                console.warn(`Unknown spatial relation: ${relation}`);
                return null;
        }

        // Ensure position is within canvas bounds
        // All shapes now use top-left corner positioning
        position.x = Math.max(0, Math.min(canvasWidth - shapeSize, position.x));
        position.y = Math.max(0, Math.min(canvasHeight - shapeSize, position.y));

        return position;
    }

    // Rotate shape by angle (30° default for demo visibility)
    rotateShapeByType(shapeType: string, angle: number = 30): { success: boolean; message: string; isCircle: boolean } {
        const shape = this.getShapeByType(shapeType);
        if (!shape) {
            return { success: false, message: `No ${shapeType} found to rotate`, isCircle: false };
        }

        // Special case for circles - they don't show rotation visually
        if (shapeType === 'circle') {
            // Still update the rotation in our data for consistency, but return humorous message
            shape.rotation = (shape.rotation + angle) % 360;

            // Array of humorous responses for circle rotation
            const circleResponses = [
                "I rotated the circle... just kidding!",
                "Ha ha, very funny!",
                "I rotated the circle, I promise",
                "I rotated the circle or am I hallucinating again",
                "Circles look the same when rotated, but I tracked the rotation for you"
            ];

            // Randomly select a response
            const randomResponse = circleResponses[Math.floor(Math.random() * circleResponses.length)];

            return {
                success: true,
                message: randomResponse,
                isCircle: true
            };
        }

        const fabricObject = this.fabricObjects.get(shape.id);
        if (!fabricObject) {
            return { success: false, message: `Fabric object not found for ${shapeType}`, isCircle: false };
        }

        // Apply rotation to fabric object
        fabricObject.rotate(fabricObject.angle + angle);

        // Update our shape data
        shape.rotation = (shape.rotation + angle) % 360;

        // Update last interacted shape for pronoun resolution
        this.updateLastInteractedShape(shapeType);

        // Re-render canvas
        if (this.fabricCanvas) {
            this.fabricCanvas.renderAll();
        }

        return {
            success: true,
            message: `Rotated the ${shapeType} ${angle} degrees`,
            isCircle: false
        };
    }
}