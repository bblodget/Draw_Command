import { useState, useRef, useCallback } from 'react';
import { Header, StatusBar } from './components/UI';
import { Canvas } from './components/Canvas';
import { VoiceInterface } from './components/VoiceInterface';
import { Alert } from './components/common';
import { CommandService } from './services/command.service';
import { CanvasService } from './services/canvas.service';
import type { DrawCommand } from './types';

function App() {
  const [lastCommand, setLastCommand] = useState<string>('');
  const [commandResult, setCommandResult] = useState<{ success: boolean; message: string } | null>(null);
  const commandService = useRef(new CommandService());
  const canvasServiceRef = useRef<CanvasService | null>(null);

  const handleCanvasReady = useCallback((canvasService: CanvasService) => {
    canvasServiceRef.current = canvasService;
  }, []);

  const executeCommand = (command: DrawCommand) => {
    if (!canvasServiceRef.current) {
      setCommandResult({ success: false, message: 'Canvas not ready' });
      return;
    }

    try {
      const canvas = canvasServiceRef.current;
      
      switch (command.type) {
        case 'draw':
          if (command.shape && command.position) {
            // Drawing a new shape
            switch (command.shape) {
              case 'square':
                canvas.drawSquare(command.color, command.size, command.position);
                setCommandResult({ success: true, message: `Drew a ${command.color || 'red'} square` });
                break;
              case 'circle':
                canvas.drawCircle(command.color, command.size, command.position);
                setCommandResult({ success: true, message: `Drew a ${command.color || 'blue'} circle` });
                break;
              case 'triangle':
                canvas.drawTriangle(command.color, command.size, command.position);
                setCommandResult({ success: true, message: `Drew a ${command.color || 'green'} triangle` });
                break;
            }
          } else if (command.shape && command.color) {
            // Color change command (interpreted as draw with color)
            // For Phase 1, we'll create a new shape with the specified color
            // In Phase 2, this will change the color of existing shapes
            switch (command.shape) {
              case 'square':
                canvas.drawSquare(command.color);
                setCommandResult({ success: true, message: `Drew a ${command.color} square` });
                break;
              case 'circle':
                canvas.drawCircle(command.color);
                setCommandResult({ success: true, message: `Drew a ${command.color} circle` });
                break;
              case 'triangle':
                canvas.drawTriangle(command.color);
                setCommandResult({ success: true, message: `Drew a ${command.color} triangle` });
                break;
            }
          }
          break;
          
        case 'move':
          // For Phase 1, we'll just log this
          // In Phase 2, this will actually move existing shapes
          setCommandResult({ 
            success: false, 
            message: 'Move command will be implemented in Phase 2' 
          });
          break;
          
        case 'delete':
          // For Phase 1, we'll just log this
          // In Phase 2, this will delete specific shapes
          setCommandResult({ 
            success: false, 
            message: 'Delete command will be implemented in Phase 2' 
          });
          break;
          
        case 'clear':
          canvas.clearAll();
          setCommandResult({ success: true, message: 'Cleared the canvas' });
          break;
          
        default:
          setCommandResult({ success: false, message: 'Unknown command type' });
      }
    } catch (error) {
      setCommandResult({ 
        success: false, 
        message: `Error executing command: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
    }
  };

  const handleVoiceCommand = (command: string) => {
    console.log('Voice command received:', command);
    setLastCommand(command);
    
    // Parse the command
    const parsedCommand = commandService.current.parseCommand(command);
    
    if (parsedCommand) {
      console.log('Parsed command:', parsedCommand);
      executeCommand(parsedCommand);
    } else {
      setCommandResult({ 
        success: false, 
        message: 'Could not understand the command. Try "draw a red square" or "clear".' 
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto p-6">
        <div className="mb-6">
          <Alert type="info">
            Welcome to Draw Command! This is a voice-controlled drawing demo. 
            Click "Start Voice Recognition" and say "Computer, draw a red square please" to test.
          </Alert>
        </div>

        {lastCommand && (
          <div className="mb-6">
            <Alert type="success">
              Last command detected: "{lastCommand}"
            </Alert>
          </div>
        )}

        {commandResult && (
          <div className="mb-6">
            <Alert type={commandResult.success ? 'success' : 'error'}>
              {commandResult.message}
            </Alert>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Canvas onCanvasReady={handleCanvasReady} />
          </div>
          
          <div className="lg:col-span-1">
            <VoiceInterface onCommand={handleVoiceCommand} />
          </div>
        </div>
      </main>

      <StatusBar />
    </div>
  );
}

export default App;