import React from 'react';

interface CommandDisplayProps {
  transcript: string;
  lastCommand: string;
  commandResult: { success: boolean; message: string } | null;
}

export const CommandDisplay: React.FC<CommandDisplayProps> = ({
  transcript,
  lastCommand,
  commandResult
}) => {
  return (
    <div className="space-y-3">
      {/* Current Transcript */}
      {transcript && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 animate-fade-in">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900">Listening:</p>
              <p className="text-base text-blue-800 font-mono">{transcript}</p>
            </div>
          </div>
        </div>
      )}

      {/* Last Command */}
      {lastCommand && !transcript && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700">Last command:</p>
              <p className="text-base text-gray-900 font-mono">{lastCommand}</p>
            </div>
          </div>
        </div>
      )}

      {/* Command Result */}
      {commandResult && !transcript && (
        <div className={`rounded-lg p-3 border ${
          commandResult.success 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-start gap-2">
            {commandResult.success ? (
              <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <p className={`text-sm ${
              commandResult.success ? 'text-green-800' : 'text-red-800'
            }`}>
              {commandResult.message}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};