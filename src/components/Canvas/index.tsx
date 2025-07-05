import React, { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';

export const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const [isCanvasReady, setIsCanvasReady] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize Fabric.js canvas
    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: '#ffffff',
      selection: true,
    });

    fabricCanvasRef.current = fabricCanvas;
    setIsCanvasReady(true);

    // Cleanup function
    return () => {
      fabricCanvas.dispose();
      fabricCanvasRef.current = null;
      setIsCanvasReady(false);
    };
  }, []);

  return (
    <div className="border-2 border-gray-300 rounded-lg bg-white overflow-hidden" style={{ width: '800px', height: '600px' }}>
      <canvas
        ref={canvasRef}
        className="block"
      />
      {!isCanvasReady && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          <p>Loading canvas...</p>
        </div>
      )}
    </div>
  );
};