import React, { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
import { CanvasService } from '../../services/canvas.service';

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

    // Get container dimensions
    const container = canvasRef.current.parentElement;
    const containerWidth = container?.clientWidth || window.innerWidth;
    const containerHeight = container?.clientHeight || window.innerHeight - 200; // Account for header/footer

    // Initialize Fabric.js canvas
    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: containerWidth,
      height: containerHeight,
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

    // Handle window resize
    const handleResize = () => {
      const newWidth = container?.clientWidth || window.innerWidth;
      const newHeight = container?.clientHeight || window.innerHeight - 200;
      fabricCanvas.setDimensions({ width: newWidth, height: newHeight });
    };

    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      fabricCanvas.dispose();
      fabricCanvasRef.current = null;
      setIsCanvasReady(false);
    };
  }, []); // Remove dependency to ensure it only runs once


  return (
    <div className="w-full h-full relative">
      <div className="w-full h-full bg-white border-2 border-gray-300 rounded-lg overflow-hidden shadow-lg">
        <canvas
          ref={canvasRef}
          className="block w-full h-full"
        />
        {!isCanvasReady && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-50">
            <p className="text-lg">Loading canvas...</p>
          </div>
        )}
      </div>
      <div className="absolute bottom-4 left-4 text-xs text-gray-500 bg-white px-2 py-1 rounded shadow">
        Click shapes to select • Drag to move • Use corners to resize/rotate
      </div>
    </div>
  );
};