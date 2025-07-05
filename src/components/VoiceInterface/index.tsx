import React, { useEffect, useRef, useState } from 'react';
import { VoiceService } from '../../services/voice.service';
import type { VoiceRecognitionCallbacks } from '../../services/voice.service';
import { Button, Alert } from '../common';

interface VoiceInterfaceProps {
  onCommand?: (command: string) => void;
}

export const VoiceInterface: React.FC<VoiceInterfaceProps> = ({ onCommand }) => {
  const voiceServiceRef = useRef<VoiceService>(new VoiceService());
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [micPermission, setMicPermission] = useState<boolean | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

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
        setError(`Voice recognition error: ${error}`);
        setIsListening(false);
      },
      onStart: () => {
        setIsListening(true);
        setError(null);
      },
      onEnd: () => {
        setIsListening(false);
      },
      onSpeechStart: () => {
        setIsSpeaking(true);
      },
      onSpeechEnd: () => {
        setIsSpeaking(false);
      }
    };

    voiceService.setCallbacks(callbacks);
  }, [onCommand]);

  const handleStartListening = async () => {
    const voiceService = voiceServiceRef.current;
    
    if (micPermission === null) {
      const hasPermission = await voiceService.requestMicrophonePermission();
      setMicPermission(hasPermission);
      if (!hasPermission) {
        setError('Microphone permission is required for voice commands');
        return;
      }
    }

    voiceService.startListening();
  };

  const handleStopListening = () => {
    voiceServiceRef.current.stopListening();
  };

  const handleClearTranscript = () => {
    voiceServiceRef.current.clearTranscript();
    setTranscript('');
    setError(null);
  };

  const testSpeak = async () => {
    try {
      await voiceServiceRef.current.speak('Voice interface is working correctly');
    } catch {
      setError('Speech synthesis failed');
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
    <div className="p-4 bg-gray-100 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Voice Interface</h2>
      
      {error && (
        <div className="mb-4">
          <Alert type="error">{error}</Alert>
        </div>
      )}

      {micPermission === false && (
        <div className="mb-4">
          <Alert type="warning">
            Microphone permission denied. Please allow microphone access and refresh the page.
          </Alert>
        </div>
      )}

      <div className="space-y-4">
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

        <div className="text-sm text-gray-600">
          <p><strong>Status:</strong> {isListening ? (isSpeaking ? 'Listening (speaking detected)' : 'Listening (waiting for speech)') : 'Not listening'}</p>
        </div>

        <div className="bg-white p-3 rounded border min-h-[100px]">
          <div className="text-sm text-gray-500 mb-2">Current transcript:</div>
          <div className="text-gray-800 font-mono text-sm">
            {transcript || (isListening ? 'Say "Computer [command] please"...' : 'Click Start to begin voice recognition')}
          </div>
        </div>

        <Button 
          onClick={handleClearTranscript}
          variant="secondary"
          className="text-xs"
        >
          Clear Transcript
        </Button>

        <div className="text-xs text-gray-500 space-y-1">
          <p><strong>Usage:</strong></p>
          <p>• Say "Computer" to get attention</p>
          <p>• Give your command: "draw a red square"</p>
          <p>• Say "please" to execute the command</p>
          <p><strong>Example:</strong> "Computer, draw a red square please"</p>
        </div>
      </div>
    </div>
  );
};