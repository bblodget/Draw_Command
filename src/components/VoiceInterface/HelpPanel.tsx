import React, { useState } from 'react';

export const HelpPanel: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);


  const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'brown', 'black', 'white', 'gray', 'grey'];

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
          <span className="font-medium text-blue-900">Quick Start</span>
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
            <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
              <li>Click "Start Voice Recognition"</li>
              <li>Say "Computer [your command] please"</li>
            </ol>
          </div>

          {/* Commands */}
          <div className="space-y-3">
            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">Basic Drawing</h4>
              <ul className="space-y-1 text-sm list-disc list-inside">
                <li className="text-gray-700 font-medium">Computer, draw a square please</li>
                <li className="text-gray-700 font-medium">Computer, create a blue circle please</li>
                <li className="text-gray-700 font-medium">Computer, draw a green triangle please</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">Moving Shapes</h4>
              <ul className="space-y-1 text-sm list-disc list-inside">
                <li className="text-gray-700 font-medium">Computer, move the square left please</li>
                <li className="text-gray-700 font-medium">Computer, move the circle up 100 please</li>
                <li className="text-gray-700 font-medium">Computer, move the triangle right 100 pixels please</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">Changing Colors</h4>
              <ul className="space-y-1 text-sm list-disc list-inside">
                <li className="text-gray-700 font-medium">Computer, color the square blue please</li>
                <li className="text-gray-700 font-medium">Computer, make the circle red please</li>
                <li className="text-gray-700 font-medium">Computer, fill the triangle purple please</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">Resizing Shapes</h4>
              <ul className="space-y-1 text-sm list-disc list-inside">
                <li className="text-gray-700 font-medium">Computer, make the square bigger please</li>
                <li className="text-gray-700 font-medium">Computer, make the circle smaller please</li>
                <li className="text-gray-700 font-medium">Computer, make the triangle much bigger please</li>
                <li className="text-gray-700 font-medium">Computer, make the square a little smaller please</li>
                <li className="text-gray-700 font-medium">Computer, make the triangle the same size as the square please</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">Rotating Shapes</h4>
              <ul className="space-y-1 text-sm list-disc list-inside">
                <li className="text-gray-700 font-medium">Computer, rotate the triangle please</li>
                <li className="text-gray-700 font-medium">Computer, rotate the square 45 degrees please</li>
                <li className="text-gray-700 font-medium">Computer, rotate the square negative 30 please</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">Spatial Relationships</h4>
              <ul className="space-y-1 text-sm list-disc list-inside">
                <li className="text-gray-700 font-medium">Computer, draw a circle to the left of the square please</li>
                <li className="text-gray-700 font-medium">Computer, move the square above the triangle please</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">Using Pronouns ("it")</h4>
              <ul className="space-y-1 text-sm list-disc list-inside">
                <li className="text-gray-700 font-medium">Computer, draw a red square please</li>
                <li className="text-gray-700 font-medium">Computer, make it blue please</li>
                <li className="text-gray-700 font-medium">Computer, make it bigger please</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">Cleanup Commands</h4>
              <ul className="space-y-1 text-sm list-disc list-inside">
                <li className="text-gray-700 font-medium">Computer, delete the square please</li>
                <li className="text-gray-700 font-medium">Computer, remove the circle please</li>
                <li className="text-gray-700 font-medium">Computer, clear please</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg p-3 border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">Available Colors</h4>
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