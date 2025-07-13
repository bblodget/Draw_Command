import React, { useEffect, useRef, useState } from 'react';
import { VoiceService } from '../../services/voice.service';
import type { VoiceRecognitionCallbacks } from '../../services/voice.service';
import { Button, Alert } from '../common';
import { VoiceStatusIndicator } from './VoiceStatusIndicator';
import { CommandDisplay } from './CommandDisplay';
import { HelpPanel } from './HelpPanel';

interface VoiceInterfaceProps {
    onCommand?: (command: string) => void;
    lastCommand?: string;
    commandResult?: { success: boolean; message: string } | null;
    isDraggable?: boolean;
    onVoiceServiceReady?: (voiceService: any) => void;
}

export const VoiceInterface: React.FC<VoiceInterfaceProps> = ({ onCommand, lastCommand, commandResult, isDraggable = false, onVoiceServiceReady }) => {
    const voiceServiceRef = useRef<VoiceService>(new VoiceService());
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [isSupported, setIsSupported] = useState(false);
    const [micPermission, setMicPermission] = useState<boolean | null>(null);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isSystemSpeaking, setIsSystemSpeaking] = useState(false);

    // Drag functionality
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const dragRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const voiceService = voiceServiceRef.current;
        setIsSupported(voiceService.isSpeechRecognitionSupported());

        const callbacks: VoiceRecognitionCallbacks = {
            onTranscript: (transcript: string) => {
                setTranscript(transcript);
            },
            onCommand: (command: string) => {
                if (onCommand) {
                    onCommand(command);
                    setTranscript(''); // Clear after command execution
                }
            },
            onError: (error: string) => {
                console.error('Voice recognition error:', error);
                setIsListening(false);
            },
            onStart: () => {
                setIsListening(true);
            },
            onEnd: () => {
                setIsListening(false);
            },
            onSpeechStart: () => {
                setIsSpeaking(true);
            },
            onSpeechEnd: () => {
                setIsSpeaking(false);
            },
            onSystemSpeakStart: () => {
                setIsSystemSpeaking(true);
            },
            onSystemSpeakEnd: () => {
                setIsSystemSpeaking(false);
            }
        };

        voiceService.setCallbacks(callbacks);

        // Notify parent that VoiceService is ready
        if (onVoiceServiceReady) {
            onVoiceServiceReady(voiceService);
        }
    }, [onCommand, onVoiceServiceReady]);

    // Drag handlers
    const handleMouseDown = (e: React.MouseEvent) => {
        if (!isDraggable || !dragRef.current) return;

        setIsDragging(true);

        // Get the actual current position of the element
        const rect = dragRef.current.getBoundingClientRect();
        const currentX = rect.left;
        const currentY = rect.top;

        // If this is the first drag (position is still 0,0), update position to actual screen coordinates
        if (position.x === 0 && position.y === 0) {
            setPosition({ x: currentX, y: currentY });
        }

        // Store the offset from the mouse to the current position
        setDragOffset({
            x: e.clientX - currentX,
            y: e.clientY - currentY
        });
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging || !isDraggable) return;

        // Calculate new position relative to the starting drag offset
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;

        // Apply bounds checking using same Math.max/min pattern as canvas shapes
        const panelWidth = 400; // Fixed width from CSS: width: '400px'

        // Get actual panel height from DOM element
        const panelHeight = dragRef.current?.offsetHeight || 400; // Fallback to 400px if not available

        const maxX = window.innerWidth - panelWidth;
        const maxY = window.innerHeight - panelHeight;

        const constrainedX = Math.max(0, Math.min(newX, maxX));
        const constrainedY = Math.max(0, Math.min(newY, maxY));

        setPosition({
            x: constrainedX,
            y: constrainedY
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging, dragOffset]);

    const handleStartListening = async () => {
        const voiceService = voiceServiceRef.current;

        if (micPermission === null) {
            const hasPermission = await voiceService.requestMicrophonePermission();
            setMicPermission(hasPermission);
            if (!hasPermission) {
                console.error('Microphone permission is required for voice commands');
                return;
            }
        }

        voiceService.startListening();
    };

    const handleStopListening = () => {
        voiceServiceRef.current.stopListening();
    };

    const testSpeak = async () => {
        try {
            await voiceServiceRef.current.speak('Voice interface is working correctly');
        } catch {
            console.error('Speech synthesis failed');
        }
    };

    if (!isSupported) {
        return (
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <h2 className="text-xl font-bold mb-2 text-red-800">Voice Interface</h2>
                <Alert type="error">
                    Speech recognition is not supported in this browser. Try using Chrome, Firefox, or Edge.
                </Alert>
            </div>
        );
    }

    return (
        <div
            ref={dragRef}
            className={`bg-white rounded-lg shadow-lg border border-gray-200 ${isDraggable ? 'cursor-move fixed z-50' : ''} ${isDragging ? 'shadow-2xl' : ''}`}
            style={isDraggable ? {
                position: 'fixed',
                right: position.x === 0 && position.y === 0 ? '16px' : 'auto',
                top: position.x === 0 && position.y === 0 ? '100px' : position.y,
                left: position.x !== 0 || position.y !== 0 ? position.x : 'auto',
                width: '400px',
                maxHeight: 'calc(100vh - 200px)',
                overflowY: 'auto',
                transform: isDragging ? 'scale(1.02)' : 'scale(1)',
                transition: isDragging ? 'none' : 'transform 0.2s ease',
                zIndex: 50
            } : {}}
        >
            <div
                className={`px-4 py-3 border-b border-gray-200 ${isDraggable ? 'cursor-move' : ''}`}
                onMouseDown={handleMouseDown}
            >
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-800">Voice Control</h2>
                    {isDraggable && (
                        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                        </svg>
                    )}
                </div>
            </div>
            <div className="p-4">

                {/* Simplified error handling - only show critical errors */}
                {micPermission === false && (
                    <div className="mb-4">
                        <Alert type="warning">
                            Microphone access required. Please allow and refresh.
                        </Alert>
                    </div>
                )}

                <div className="space-y-4">
                    {/* Status Indicator */}
                    <div className="flex items-center justify-between">
                        <VoiceStatusIndicator
                            isListening={isListening}
                            isSpeaking={isSpeaking}
                            hasTranscript={transcript.length > 0}
                            micPermission={micPermission}
                            isSystemSpeaking={isSystemSpeaking}
                        />
                    </div>

                    <div className="flex gap-2">
                        <Button
                            onClick={handleStartListening}
                            disabled={isListening || micPermission === false}
                            variant="primary"
                        >
                            {isListening ? 'Listening...' : 'Start Voice Recognition'}
                        </Button>

                        <Button
                            onClick={handleStopListening}
                            disabled={!isListening}
                            variant="secondary"
                        >
                            Stop
                        </Button>

                        <Button
                            onClick={testSpeak}
                            variant="secondary"
                        >
                            Test Speech
                        </Button>
                    </div>

                    {/* Command Display */}
                    <CommandDisplay
                        transcript={transcript}
                        lastCommand={lastCommand || ''}
                        commandResult={commandResult || null}
                    />

                    {/* Help Panel */}
                    <HelpPanel />
                </div>
            </div>
        </div>
    );
};