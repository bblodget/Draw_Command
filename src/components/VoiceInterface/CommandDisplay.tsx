import React from 'react';

interface CommandDisplayProps {
    transcript: string;
    lastCommand?: string;
    commandResult?: { success: boolean; message: string } | null;
}

export const CommandDisplay: React.FC<CommandDisplayProps> = ({
    transcript
}) => {
    return (
        <div>
            {/* Transcript Area - Always Visible */}
            <div className={`border rounded-lg p-3 transition-colors duration-200 h-[120px] overflow-y-auto ${transcript
                    ? 'bg-blue-50 border-blue-200 animate-fade-in'
                    : 'bg-gray-50 border-gray-200'
                }`}>
                <div className="flex items-start gap-2">
                    <svg className={`w-5 h-5 mt-0.5 flex-shrink-0 ${transcript ? 'text-blue-600' : 'text-gray-400'
                        }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                    <div className="flex-1">
                        <p className={`text-sm font-medium ${transcript ? 'text-blue-900' : 'text-gray-500'
                            }`}>
                            {transcript ? 'Listening:' : 'Voice Input:'}
                        </p>
                        <p className={`text-base font-mono ${transcript ? 'text-blue-800' : 'text-gray-400'
                            }`}>
                            {transcript || "Say 'Computer...' to start"}
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
};