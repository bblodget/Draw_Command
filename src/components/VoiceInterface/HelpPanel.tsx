import React, { useState } from 'react';

export const HelpPanel: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Helper function to render pattern with styled placeholders
  const renderPattern = (pattern: string) => {
    const parts = pattern.split(/(\[[^\]]+\])/);
    return parts.map((part, index) => {
      if (part.startsWith('[') && part.endsWith(']')) {
        return (
          <span key={index} className="bg-blue-100 text-blue-800 px-1 rounded">
            {part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  const commands = [
    { 
      pattern: 'draw a [color] [shape]', 
      example: 'Computer, draw a red square please',
      description: 'Creates a new shape on the canvas' 
    },
    { 
      pattern: 'color the [shape] [color]', 
      example: 'Computer, color the square blue please',
      description: 'Changes the color of an existing shape' 
    },
    { 
      pattern: 'move the [shape] [direction] [distance]', 
      example: 'Computer, move the circle left 100 please',
      description: 'Moves a shape in any direction (distance is optional)' 
    },
    { 
      pattern: 'delete the [shape]', 
      example: 'Computer, delete the triangle please',
      description: 'Removes a specific shape from the canvas' 
    },
    { 
      pattern: 'clear', 
      example: 'Computer, clear please',
      description: 'Removes all shapes from the canvas' 
    },
  ];

  const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'brown', 'black', 'white', 'gray'];
  const shapes = ['square', 'circle', 'triangle'];
  const directions = ['up', 'down', 'left', 'right'];

  return (
    <div className="bg-blue-50 rounded-lg border border-blue-200 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-blue-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium text-blue-900">Voice Commands Guide</span>
        </div>
        <svg 
          className={`w-5 h-5 text-blue-600 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-4 animate-fade-in">
          {/* How to use */}
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">How to Use</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
              <li>Click "Start Voice Recognition"</li>
              <li>Say "Computer" to get the system's attention</li>
              <li>Give your command</li>
              <li>Say "please" to execute</li>
            </ol>
            <p className="mt-2 text-sm font-medium text-blue-900">
              Example: "Computer, draw a red square please"
            </p>
          </div>

          {/* Commands */}
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">Try These Commands</h3>
            <div className="space-y-3">
              {commands.map((cmd, index) => (
                <div key={index} className="relative">
                  {/* Speech bubble style example */}
                  <div className="bg-white rounded-lg p-4 border-2 border-blue-200 shadow-sm hover:shadow-md transition-shadow cursor-default">
                    <div className="flex items-start gap-2">
                      <svg className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                      </svg>
                      <div className="flex-1">
                        <div className="font-medium text-base text-gray-900 mb-2">
                          {cmd.example}
                        </div>
                        <div className="space-y-1">
                          <div className="text-xs text-gray-600">
                            <span className="font-semibold">Pattern:</span>{' '}
                            <span className="font-mono font-semibold text-blue-700">
                              {renderPattern(cmd.pattern)}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {cmd.description}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Reference */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">Shapes</h4>
              <div className="space-y-1">
                {shapes.map(shape => (
                  <div key={shape} className="text-blue-800">• {shape}</div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">Directions</h4>
              <div className="space-y-1">
                {directions.map(dir => (
                  <div key={dir} className="text-blue-800">• {dir}</div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Colors</h4>
            <div className="flex flex-wrap gap-2">
              {colors.map(color => (
                <span 
                  key={color} 
                  className="text-xs px-2 py-1 rounded text-white"
                  style={{ backgroundColor: color === 'white' ? '#e5e7eb' : color }}
                >
                  {color}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};