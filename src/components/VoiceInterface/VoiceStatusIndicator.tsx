import React from 'react';

interface VoiceStatusIndicatorProps {
    isListening: boolean;
    isSpeaking: boolean;
    hasTranscript: boolean;
    micPermission: boolean | null;
    isSystemSpeaking: boolean;
}

export const VoiceStatusIndicator: React.FC<VoiceStatusIndicatorProps> = ({
    isListening,
    isSpeaking,
    hasTranscript,
    micPermission,
    isSystemSpeaking
}) => {
    // Determine the current status
    let status: 'idle' | 'waiting' | 'listening' | 'processing' | 'speaking' = 'idle';
    let statusText = 'Click to start';
    let statusColor = 'bg-gray-200';
    let pulseAnimation = '';

    if (micPermission === false) {
        statusText = 'Microphone access denied';
        statusColor = 'bg-red-200';
    } else if (isSystemSpeaking) {
        status = 'speaking';
        statusText = 'System speaking...';
        statusColor = 'bg-purple-200';
        pulseAnimation = 'animate-pulse';
    } else if (isListening) {
        if (isSpeaking) {
            status = 'listening';
            statusText = 'Listening...';
            statusColor = 'bg-green-200';
            pulseAnimation = 'animate-pulse';
        } else if (hasTranscript) {
            status = 'processing';
            statusText = 'Processing command...';
            statusColor = 'bg-blue-200';
        } else {
            status = 'waiting';
            statusText = 'Say "Computer..."';
            statusColor = 'bg-yellow-200';
        }
    }

    return (
        <div className="flex items-center gap-3">
            {/* Status Indicator Dot */}
            <div className="relative">
                <div
                    className={`w-4 h-4 rounded-full ${statusColor} ${pulseAnimation}`}
                    aria-hidden="true"
                />
                {status === 'listening' && (
                    <div className="absolute inset-0 w-4 h-4 rounded-full bg-green-400 animate-ping" />
                )}
                {status === 'speaking' && (
                    <div className="absolute inset-0 w-4 h-4 rounded-full bg-purple-400 animate-ping" />
                )}
            </div>

            {/* Status Text */}
            <span className="text-sm font-medium text-gray-700">
                {statusText}
            </span>

            {/* Visual Waveform when user is speaking */}
            {isSpeaking && !isSystemSpeaking && (
                <div className="flex items-center gap-1 ml-2">
                    <div className="w-1 h-4 bg-green-600 animate-pulse" style={{ animationDelay: '0ms' }} />
                    <div className="w-1 h-6 bg-green-600 animate-pulse" style={{ animationDelay: '150ms' }} />
                    <div className="w-1 h-5 bg-green-600 animate-pulse" style={{ animationDelay: '300ms' }} />
                    <div className="w-1 h-7 bg-green-600 animate-pulse" style={{ animationDelay: '450ms' }} />
                    <div className="w-1 h-4 bg-green-600 animate-pulse" style={{ animationDelay: '600ms' }} />
                </div>
            )}

            {/* Visual Waveform when system is speaking */}
            {isSystemSpeaking && (
                <div className="flex items-center gap-1 ml-2">
                    <div className="w-1 h-4 bg-purple-600 animate-pulse" style={{ animationDelay: '0ms' }} />
                    <div className="w-1 h-6 bg-purple-600 animate-pulse" style={{ animationDelay: '150ms' }} />
                    <div className="w-1 h-5 bg-purple-600 animate-pulse" style={{ animationDelay: '300ms' }} />
                    <div className="w-1 h-7 bg-purple-600 animate-pulse" style={{ animationDelay: '450ms' }} />
                    <div className="w-1 h-4 bg-purple-600 animate-pulse" style={{ animationDelay: '600ms' }} />
                </div>
            )}
        </div>
    );
};