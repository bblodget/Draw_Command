import { useState, useRef, useCallback } from 'react';
import { Header, StatusBar } from './components/UI';
import { Canvas } from './components/Canvas';
import { VoiceInterface } from './components/VoiceInterface';
import { Alert } from './components/common';
import { CommandService } from './services/command.service';
import { CanvasService } from './services/canvas.service';
import { ResponseService } from './services/response.service';
import type { DrawCommand } from './types';

function App() {
  const [lastCommand, setLastCommand] = useState<string>('');
  const [commandResult, setCommandResult] = useState<{ success: boolean; message: string } | null>(null);
  const commandService = useRef(new CommandService());
  const responseService = useRef(new ResponseService());
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
                const squareResult = canvas.drawSquare(command.color, command.size, command.position);
                if (squareResult.wasReplaced && squareResult.oldShape) {
                  const oldColorName = responseService.current.getColorNameFromHex(squareResult.oldShape.color);
                  const newColorName = responseService.current.getColorNameFromHex(command.color || 'red');
                  setCommandResult({ success: true, message: `Replaced the ${oldColorName} square with a ${newColorName} one` });
                  responseService.current.speak(`I replaced the ${oldColorName} square with a ${newColorName} one`);
                } else {
                  const colorName = responseService.current.getColorNameFromHex(command.color || '#FF0000');
                  setCommandResult({ success: true, message: `Drew a ${colorName} square` });
                  responseService.current.respondToDrawCommand('square', command.color);
                }
                break;
              case 'circle':
                const circleResult = canvas.drawCircle(command.color, command.size, command.position);
                if (circleResult.wasReplaced && circleResult.oldShape) {
                  const oldColorName = responseService.current.getColorNameFromHex(circleResult.oldShape.color);
                  const newColorName = responseService.current.getColorNameFromHex(command.color || 'blue');
                  setCommandResult({ success: true, message: `Replaced the ${oldColorName} circle with a ${newColorName} one` });
                  responseService.current.speak(`I replaced the ${oldColorName} circle with a ${newColorName} one`);
                } else {
                  const colorName = responseService.current.getColorNameFromHex(command.color || '#0000FF');
                  setCommandResult({ success: true, message: `Drew a ${colorName} circle` });
                  responseService.current.respondToDrawCommand('circle', command.color);
                }
                break;
              case 'triangle':
                const triangleResult = canvas.drawTriangle(command.color, command.size, command.position);
                if (triangleResult.wasReplaced && triangleResult.oldShape) {
                  const oldColorName = responseService.current.getColorNameFromHex(triangleResult.oldShape.color);
                  const newColorName = responseService.current.getColorNameFromHex(command.color || 'green');
                  setCommandResult({ success: true, message: `Replaced the ${oldColorName} triangle with a ${newColorName} one` });
                  responseService.current.speak(`I replaced the ${oldColorName} triangle with a ${newColorName} one`);
                } else {
                  const colorName = responseService.current.getColorNameFromHex(command.color || '#00FF00');
                  setCommandResult({ success: true, message: `Drew a ${colorName} triangle` });
                  responseService.current.respondToDrawCommand('triangle', command.color);
                }
                break;
            }
          } else if (command.shape && command.color) {
            // Color change command (interpreted as draw with color)
            // For Phase 1, we'll create a new shape with the specified color
            // In Phase 2, this will change the color of existing shapes
            switch (command.shape) {
              case 'square':
                const squareColorResult = canvas.drawSquare(command.color);
                if (squareColorResult.wasReplaced && squareColorResult.oldShape) {
                  const newColorName = responseService.current.getColorNameFromHex(command.color);
                  setCommandResult({ success: true, message: `Changed the square to ${newColorName}` });
                  responseService.current.speak(`I changed the square to ${newColorName}`);
                } else {
                  const colorName = responseService.current.getColorNameFromHex(command.color);
                  setCommandResult({ success: true, message: `Drew a ${colorName} square` });
                  responseService.current.respondToDrawCommand('square', command.color);
                }
                break;
              case 'circle':
                const circleColorResult = canvas.drawCircle(command.color);
                if (circleColorResult.wasReplaced && circleColorResult.oldShape) {
                  const newColorName = responseService.current.getColorNameFromHex(command.color);
                  setCommandResult({ success: true, message: `Changed the circle to ${newColorName}` });
                  responseService.current.speak(`I changed the circle to ${newColorName}`);
                } else {
                  const colorName = responseService.current.getColorNameFromHex(command.color);
                  setCommandResult({ success: true, message: `Drew a ${colorName} circle` });
                  responseService.current.respondToDrawCommand('circle', command.color);
                }
                break;
              case 'triangle':
                const triangleColorResult = canvas.drawTriangle(command.color);
                if (triangleColorResult.wasReplaced && triangleColorResult.oldShape) {
                  const newColorName = responseService.current.getColorNameFromHex(command.color);
                  setCommandResult({ success: true, message: `Changed the triangle to ${newColorName}` });
                  responseService.current.speak(`I changed the triangle to ${newColorName}`);
                } else {
                  const colorName = responseService.current.getColorNameFromHex(command.color);
                  setCommandResult({ success: true, message: `Drew a ${colorName} triangle` });
                  responseService.current.respondToDrawCommand('triangle', command.color);
                }
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
          responseService.current.speak('Move commands are coming in Phase 2', 'normal');
          break;
          
        case 'delete':
          // For Phase 1, we'll just log this
          // In Phase 2, this will delete specific shapes
          setCommandResult({ 
            success: false, 
            message: 'Delete command will be implemented in Phase 2' 
          });
          responseService.current.speak('Delete commands are coming in Phase 2', 'normal');
          break;
          
        case 'clear':
          canvas.clearAll();
          setCommandResult({ success: true, message: 'Cleared the canvas' });
          responseService.current.respondToClearCommand();
          break;
          
        default:
          setCommandResult({ success: false, message: 'Unknown command type' });
          responseService.current.respondWithError('unrecognized');
      }
    } catch (error) {
      setCommandResult({ 
        success: false, 
        message: `Error executing command: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
      responseService.current.respondWithError('generalError');
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
      responseService.current.respondWithError('unrecognized');
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