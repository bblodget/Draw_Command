import { useState, useRef, useCallback } from 'react';
import { Header } from './components/UI';
import { Canvas } from './components/Canvas';
import { VoiceInterface } from './components/VoiceInterface';
import { GrammarCommandService } from './services/grammar-command.service';
import { CanvasService } from './services/canvas.service';
import { ResponseService } from './services/response.service';
import type { DrawCommand } from './types';

function App() {
  const [lastCommand, setLastCommand] = useState<string>('');
  const [commandResult, setCommandResult] = useState<{ success: boolean; message: string } | null>(null);
  const commandService = useRef(new GrammarCommandService());
  const responseService = useRef(new ResponseService());
  const canvasServiceRef = useRef<CanvasService | null>(null);

  const handleCanvasReady = useCallback((canvasService: CanvasService) => {
    canvasServiceRef.current = canvasService;
  }, []);

  // Helper function to resolve pronouns to shape types
  const resolveShapeReference = (command: DrawCommand, canvas: CanvasService): string | null => {
    if (command.shape) {
      return command.shape;
    }
    
    if (command.pronoun === 'it') {
      const lastInteractedType = canvas.getLastInteractedShapeType();
      if (lastInteractedType) {
        return lastInteractedType;
      }
      
      // Fallback to most recent shape if no interaction tracked yet
      const mostRecent = canvas.getMostRecentShape();
      if (mostRecent) {
        return mostRecent.type;
      }
    }
    
    return null;
  };

  // Helper function to calculate position for spatial relationships
  const calculateDrawPosition = (command: DrawCommand, canvas: CanvasService): { x: number; y: number } | null => {
    if (command.spatialRelation) {
      return canvas.calculateSpatialPosition(
        command.size || 100, 
        command.shape!, 
        command.spatialRelation.relation, 
        command.spatialRelation.reference
      );
    }
    return command.position || { x: 200, y: 200 };
  };

  const executeCommand = (command: DrawCommand) => {
    if (!canvasServiceRef.current) {
      setCommandResult({ success: false, message: 'Canvas not ready' });
      return;
    }

    try {
      const canvas = canvasServiceRef.current;
      
      switch (command.type) {
        case 'draw':
          if (command.shape) {
            // Calculate position based on spatial relationship or use provided position
            const position = calculateDrawPosition(command, canvas);
            
            if (!position) {
              setCommandResult({ success: false, message: `Cannot find ${command.spatialRelation?.reference} to position relative to` });
              responseService.current.speak(`I can't find the ${command.spatialRelation?.reference} to position the ${command.shape} relative to`);
              break;
            }

            // Drawing a new shape - simplified with spatial relationship support
            let result;
            const shapeColor = command.color;
            const shapeSize = command.size;
            
            switch (command.shape) {
              case 'square':
                result = canvas.drawSquare(shapeColor, shapeSize, position);
                break;
              case 'circle':
                result = canvas.drawCircle(shapeColor, shapeSize, position);
                break;
              case 'triangle':
                result = canvas.drawTriangle(shapeColor, shapeSize, position);
                break;
            }

            // Generate response messages
            if (result?.wasReplaced && result.oldShape) {
              const oldColorName = responseService.current.getColorNameFromHex(result.oldShape.color);
              const newColorName = responseService.current.getColorNameFromHex(result.actualColor);
              const spatialText = command.spatialRelation ? ` ${command.spatialRelation.relation.replace('_', ' ')} the ${command.spatialRelation.reference}` : '';
              setCommandResult({ success: true, message: `Replaced the ${oldColorName} ${command.shape} with a ${newColorName} one${spatialText}` });
              responseService.current.speak(`I replaced the ${oldColorName} ${command.shape} with a ${newColorName} one${spatialText}`);
            } else if (result) {
              const colorName = responseService.current.getColorNameFromHex(result.actualColor);
              const spatialText = command.spatialRelation ? ` ${command.spatialRelation.relation.replace('_', ' ')} the ${command.spatialRelation.reference}` : '';
              setCommandResult({ success: true, message: `Drew a ${colorName} ${command.shape}${spatialText}` });
              responseService.current.speak(`I drew a ${colorName} ${command.shape}${spatialText}`);
            }
          }
          break;
          
        case 'move':
          const moveShape = resolveShapeReference(command, canvas);
          if (!moveShape) {
            setCommandResult({ success: false, message: 'No shapes on canvas to move' });
            responseService.current.speak(`There are no shapes on the canvas to move`, 'normal');
            break;
          }

          // Handle spatial relationship moves
          if (command.spatialRelation) {
            const existingShape = canvas.getShapeByType(moveShape);
            if (!existingShape) {
              setCommandResult({ success: false, message: `No ${moveShape} to move` });
              responseService.current.speak(`There's no ${moveShape} on the canvas to move`, 'normal');
              break;
            }

            const spatialPosition = canvas.calculateSpatialPosition(
              existingShape.size,
              moveShape,
              command.spatialRelation.relation,
              command.spatialRelation.reference
            );

            if (!spatialPosition) {
              setCommandResult({ success: false, message: `Cannot find ${command.spatialRelation.reference} to position relative to` });
              responseService.current.speak(`I can't find the ${command.spatialRelation.reference} to position the ${moveShape} relative to`, 'normal');
              break;
            }

            const offset = {
              x: spatialPosition.x - existingShape.position.x,
              y: spatialPosition.y - existingShape.position.y
            };

            const moved = canvas.moveShapeByType(moveShape, offset);
            if (moved) {
              const relationText = command.spatialRelation.relation.replace('_', ' ');
              setCommandResult({ success: true, message: `Moved the ${moveShape} ${relationText} the ${command.spatialRelation.reference}` });
              responseService.current.speak(`I moved the ${moveShape} ${relationText} the ${command.spatialRelation.reference}`, 'normal');
            } else {
              setCommandResult({ success: false, message: `Cannot move the ${moveShape} to that position` });
              responseService.current.speak(`I can't move the ${moveShape} to that position`, 'normal');
            }
          } else if (command.position) {
            // command.position contains the offset (x, y) from directionMap
            // Determine direction name from offset
            let direction = '';
            if (command.position.x > 0) direction = 'right';
            else if (command.position.x < 0) direction = 'left';
            else if (command.position.y > 0) direction = 'down';
            else if (command.position.y < 0) direction = 'up';
            
            const moved = canvas.moveShapeByType(moveShape, command.position);
            if (moved) {
              // Calculate distance from offset
              const distance = Math.abs(command.position.x || command.position.y);
              const distanceText = distance === 100 ? '' : ` ${distance} pixels`;
              
              setCommandResult({ success: true, message: `Moved the ${moveShape} ${direction}${distanceText}` });
              responseService.current.respondToMoveCommand(moveShape, `${direction}${distanceText}`);
            } else {
              // Either shape doesn't exist or would move off canvas
              const shapeExists = canvas.getShapeByType(moveShape);
              if (!shapeExists) {
                setCommandResult({ success: false, message: `No ${moveShape} to move` });
                responseService.current.speak(`There's no ${moveShape} on the canvas to move`, 'normal');
              } else {
                setCommandResult({ success: false, message: `Cannot move the ${moveShape} further ${direction}` });
                responseService.current.speak(`I can't move the ${moveShape} any further in that direction`, 'normal');
              }
            }
          }
          break;
          
        case 'color':
          const colorShape = resolveShapeReference(command, canvas);
          if (!colorShape) {
            setCommandResult({ success: false, message: 'No shapes on canvas to color' });
            responseService.current.speak(`There are no shapes on the canvas to color`, 'normal');
            break;
          }
          
          if (command.color) {
            // Get the existing shape's properties to preserve size and position
            const existingShape = canvas.getShapeByType(colorShape);
            if (!existingShape) {
              setCommandResult({ success: false, message: `No ${colorShape} found to color` });
              responseService.current.speak(`There's no ${colorShape} on the canvas to color`, 'normal');
              break;
            }
            
            // For color commands, we create a new shape with the specified color
            // but preserve the existing shape's size and position
            const colorCommand: DrawCommand = {
              type: 'draw',
              shape: colorShape as 'square' | 'circle' | 'triangle',
              color: command.color,
              size: existingShape.size, // Preserve existing size
              position: existingShape.position // Preserve existing position
            };
            
            // Execute the draw command which will replace the existing shape
            executeCommand(colorCommand);
          }
          break;
          
        case 'resize':
          const resizeShape = resolveShapeReference(command, canvas);
          if (!resizeShape) {
            setCommandResult({ success: false, message: 'No shapes on canvas to resize' });
            responseService.current.speak(`There are no shapes on the canvas to resize`, 'normal');
            break;
          }
          
          if (command.resizeMode === 'relative' && command.resizeFactor !== undefined) {
            const resized = canvas.resizeShapeByType(resizeShape, command.resizeFactor);
            
            if (resized) {
              // Generate appropriate response based on resize factor
              let message = '';
              let spokenMessage = '';
              
              if (command.resizeFactor > 1) {
                const adjective = command.resizeFactor >= 2 ? 'much bigger' : 
                                 command.resizeFactor >= 1.5 ? 'bigger' : 'a little bigger';
                message = `Made the ${resizeShape} ${adjective}`;
                spokenMessage = `I made the ${resizeShape} ${adjective}`;
              } else {
                const adjective = command.resizeFactor <= 0.5 ? 'much smaller' : 
                                 command.resizeFactor <= 0.67 ? 'smaller' : 'a little smaller';
                message = `Made the ${resizeShape} ${adjective}`;
                spokenMessage = `I made the ${resizeShape} ${adjective}`;
              }
              
              setCommandResult({ success: true, message });
              responseService.current.speak(spokenMessage, 'normal');
            } else {
              setCommandResult({ success: false, message: `No ${resizeShape} to resize` });
              responseService.current.speak(`There's no ${resizeShape} on the canvas to resize`, 'normal');
            }
          } else if (command.resizeMode === 'match' && command.targetShape) {
            const resized = canvas.resizeShapeByType(resizeShape, 'match', command.targetShape);
            
            if (resized) {
              const message = `Made the ${resizeShape} the same size as the ${command.targetShape}`;
              const spokenMessage = `I made the ${resizeShape} the same size as the ${command.targetShape}`;
              
              setCommandResult({ success: true, message });
              responseService.current.speak(spokenMessage, 'normal');
            } else {
              // Check which shape is missing
              const sourceExists = canvas.getShapeByType(resizeShape);
              const targetExists = canvas.getShapeByType(command.targetShape);
              
              if (!sourceExists && !targetExists) {
                setCommandResult({ success: false, message: `No ${resizeShape} or ${command.targetShape} on the canvas` });
                responseService.current.speak(`There's no ${resizeShape} or ${command.targetShape} on the canvas`, 'normal');
              } else if (!sourceExists) {
                setCommandResult({ success: false, message: `No ${resizeShape} to resize` });
                responseService.current.speak(`There's no ${resizeShape} on the canvas to resize`, 'normal');
              } else {
                setCommandResult({ success: false, message: `No ${command.targetShape} to match size with` });
                responseService.current.speak(`There's no ${command.targetShape} on the canvas to match size with`, 'normal');
              }
            }
          }
          break;
          
        case 'delete':
          const deleteShape = resolveShapeReference(command, canvas);
          if (!deleteShape) {
            setCommandResult({ success: false, message: 'No shapes on canvas to delete' });
            responseService.current.speak(`There are no shapes on the canvas to delete`, 'normal');
            break;
          }
          
          const deleted = canvas.deleteShapeByType(deleteShape);
          if (deleted) {
            setCommandResult({ success: true, message: `Deleted the ${deleteShape}` });
            responseService.current.respondToDeleteCommand(deleteShape);
          } else {
            setCommandResult({ success: false, message: `No ${deleteShape} to delete` });
            responseService.current.speak(`There's no ${deleteShape} on the canvas to delete`, 'normal');
          }
          break;
          
        case 'clear':
          canvas.clearAll();
          setCommandResult({ success: true, message: 'Cleared the canvas' });
          responseService.current.respondToClearCommand();
          break;
          
        case 'rotate':
          const rotateShape = command.shape || (command.pronoun === 'it' ? canvas.getLastInteractedShapeType() : null);
          if (!rotateShape) {
            setCommandResult({ success: false, message: 'No shape specified for rotation' });
            responseService.current.speak('I need to know which shape to rotate', 'normal');
            break;
          }

          // Get angle from command (grammar service handles the default)
          const rotationAngle = command.value || 30; // Fallback just in case
          console.log('Rotation command debug:', { command, rotationAngle });
          
          const rotateResult = canvas.rotateShapeByType(rotateShape, rotationAngle);
          
          if (rotateResult.success) {
            setCommandResult({ success: true, message: rotateResult.message });
            if (rotateResult.isCircle) {
              responseService.current.speak(rotateResult.message, 'normal');
            } else {
              responseService.current.speak(`I rotated the ${rotateShape} ${Math.abs(rotationAngle)} degrees ${rotationAngle >= 0 ? 'clockwise' : 'counterclockwise'}`, 'normal');
            }
          } else {
            setCommandResult({ success: false, message: rotateResult.message });
            responseService.current.speak(rotateResult.message, 'normal');
          }
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