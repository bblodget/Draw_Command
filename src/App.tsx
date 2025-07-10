import { useState, useRef, useCallback } from 'react';
import { Header } from './components/UI';
import { Canvas } from './components/Canvas';
import { VoiceInterface } from './components/VoiceInterface';
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
          if (command.shape && command.position) {
            // command.position contains the offset (x, y) from directionMap
            // Determine direction name from offset
            let direction = '';
            if (command.position.x > 0) direction = 'right';
            else if (command.position.x < 0) direction = 'left';
            else if (command.position.y > 0) direction = 'down';
            else if (command.position.y < 0) direction = 'up';
            
            const moved = canvas.moveShapeByType(command.shape, command.position);
            if (moved) {
              // Calculate distance from offset
              const distance = Math.abs(command.position.x || command.position.y);
              const distanceText = distance === 50 ? '' : ` ${distance} pixels`;
              
              setCommandResult({ success: true, message: `Moved the ${command.shape} ${direction}${distanceText}` });
              responseService.current.respondToMoveCommand(command.shape, `${direction}${distanceText}`);
            } else {
              // Either shape doesn't exist or would move off canvas
              const shapeExists = canvas.getShapeByType(command.shape);
              if (!shapeExists) {
                setCommandResult({ success: false, message: `No ${command.shape} to move` });
                responseService.current.speak(`There's no ${command.shape} on the canvas to move`, 'normal');
              } else {
                setCommandResult({ success: false, message: `Cannot move the ${command.shape} further ${direction}` });
                responseService.current.speak(`I can't move the ${command.shape} any further in that direction`, 'normal');
              }
            }
          }
          break;
          
        case 'resize':
          // Handle "it" reference - get the most recent shape
          let targetShape = command.shape;
          if (!targetShape) {
            const mostRecent = canvas.getMostRecentShape();
            if (mostRecent) {
              targetShape = mostRecent.type;
            } else {
              setCommandResult({ success: false, message: 'No shapes on canvas to resize' });
              responseService.current.speak(`There are no shapes on the canvas to resize`, 'normal');
              break;
            }
          }
          
          if (command.resizeMode === 'relative' && command.resizeFactor !== undefined) {
            const resized = canvas.resizeShapeByType(targetShape, command.resizeFactor);
            
            if (resized) {
              // Generate appropriate response based on resize factor
              let message = '';
              let spokenMessage = '';
              
              if (command.resizeFactor > 1) {
                const adjective = command.resizeFactor >= 2 ? 'much bigger' : 
                                 command.resizeFactor >= 1.5 ? 'bigger' : 'a little bigger';
                message = `Made the ${targetShape} ${adjective}`;
                spokenMessage = `I made the ${targetShape} ${adjective}`;
              } else {
                const adjective = command.resizeFactor <= 0.5 ? 'much smaller' : 
                                 command.resizeFactor <= 0.67 ? 'smaller' : 'a little smaller';
                message = `Made the ${targetShape} ${adjective}`;
                spokenMessage = `I made the ${targetShape} ${adjective}`;
              }
              
              setCommandResult({ success: true, message });
              responseService.current.speak(spokenMessage, 'normal');
            } else {
              setCommandResult({ success: false, message: `No ${targetShape} to resize` });
              responseService.current.speak(`There's no ${targetShape} on the canvas to resize`, 'normal');
            }
          }
          break;
          
        case 'delete':
          if (command.shape) {
            const deleted = canvas.deleteShapeByType(command.shape);
            if (deleted) {
              setCommandResult({ success: true, message: `Deleted the ${command.shape}` });
              responseService.current.respondToDeleteCommand(command.shape);
            } else {
              setCommandResult({ success: false, message: `No ${command.shape} to delete` });
              responseService.current.speak(`There's no ${command.shape} on the canvas to delete`, 'normal');
            }
          }
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
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      <Header />
      
      {/* Full-screen canvas container */}
      <main className="flex-1 relative overflow-hidden">
        <Canvas onCanvasReady={handleCanvasReady} />
      </main>
      
      {/* Draggable Voice Control panel - positioned relative to entire viewport */}
      <VoiceInterface 
        onCommand={handleVoiceCommand} 
        lastCommand={lastCommand}
        commandResult={commandResult}
        isDraggable={true}
      />
    </div>
  );
}

export default App;