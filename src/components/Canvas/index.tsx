import React, { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
import { CanvasService } from '../../services/canvas.service';
import { Button } from '../common';

interface CanvasProps {
  onCanvasReady?: (canvasService: CanvasService) => void;
}

export const Canvas: React.FC<CanvasProps> = ({ onCanvasReady }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const canvasServiceRef = useRef<CanvasService>(new CanvasService());
  const [isCanvasReady, setIsCanvasReady] = useState(false);

  useEffect(() => {
    if (!canvasRef.current || fabricCanvasRef.current) return; // Prevent re-initialization

    // Initialize Fabric.js canvas
    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: '#ffffff',
      selection: true,
      selectionBorderColor: '#2563eb',
      selectionColor: 'rgba(37, 99, 235, 0.1)',
      selectionLineWidth: 2,
      hoverCursor: 'pointer',
      moveCursor: 'move',
      defaultCursor: 'default',
      containerClass: 'canvas-container',
    });

    fabricCanvasRef.current = fabricCanvas;
    canvasServiceRef.current.setCanvas(fabricCanvas);
    setIsCanvasReady(true);
    
    // Notify parent component that canvas is ready
    if (onCanvasReady) {
      onCanvasReady(canvasServiceRef.current);
    }

    // Cleanup function
    return () => {
      fabricCanvas.dispose();
      fabricCanvasRef.current = null;
      setIsCanvasReady(false);
    };
  }, []); // Remove dependency to ensure it only runs once

  const handleDrawSquare = () => {
    canvasServiceRef.current.drawSquare('red', 100);
  };

  const handleDrawCircle = () => {
    canvasServiceRef.current.drawCircle('blue', 50);
  };

  const handleDrawTriangle = () => {
    canvasServiceRef.current.drawTriangle('green', 100);
  };

  const handleClear = () => {
    canvasServiceRef.current.clearAll();
  };

  return (
    <div>
      <div className="mb-4 flex gap-2">
        <Button onClick={handleDrawSquare} disabled={!isCanvasReady}>
          Draw Square
        </Button>
        <Button onClick={handleDrawCircle} disabled={!isCanvasReady}>
          Draw Circle
        </Button>
        <Button onClick={handleDrawTriangle} disabled={!isCanvasReady}>
          Draw Triangle
        </Button>
        <Button onClick={handleClear} variant="secondary" disabled={!isCanvasReady}>
          Clear Canvas
        </Button>
      </div>
      <div className="relative inline-block">
        <div className="border-2 border-gray-300 rounded-lg bg-white overflow-hidden shadow-lg" style={{ width: '800px', height: '600px' }}>
          <canvas
            ref={canvasRef}
            className="block"
          />
          {!isCanvasReady && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-50">
              <p className="text-lg">Loading canvas...</p>
            </div>
          )}
        </div>
        <div className="absolute -bottom-8 left-0 text-xs text-gray-500">
          Click shapes to select • Drag to move • Use corners to resize/rotate
        </div>
      </div>
    </div>
  );
};