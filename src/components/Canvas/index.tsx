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

    // Get dimensions - use window height and calculate available space
    const headerHeight = 80; // Approximate header height
    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight - headerHeight;

    // Debug logging
    console.log('Canvas initialization:');
    console.log('- Window dimensions:', window.innerWidth, 'x', window.innerHeight);
    console.log('- Header height:', headerHeight);
    console.log('- Calculated canvas dimensions:', containerWidth, 'x', containerHeight);

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

    // Handle window resize with debouncing
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const headerHeight = 80; // Approximate header height
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight - headerHeight;
        
        // Debug logging
        console.log('Canvas resize:');
        console.log('- Window dimensions:', window.innerWidth, 'x', window.innerHeight);
        console.log('- Header height:', headerHeight);
        console.log('- New canvas dimensions:', newWidth, 'x', newHeight);
        
        // Update canvas dimensions
        fabricCanvas.setDimensions({ width: newWidth, height: newHeight });
        
        // Ensure all shapes stay within bounds after resize
        canvasServiceRef.current.enforceCanvasBounds();
        
        fabricCanvas.renderAll();
      }, 100); // 100ms debounce
    };

    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
      fabricCanvas.dispose();
      fabricCanvasRef.current = null;
      setIsCanvasReady(false);
    };
  }, []); // Remove dependency to ensure it only runs once


  return (
    <div className="w-full h-full relative bg-white">
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
  );
};