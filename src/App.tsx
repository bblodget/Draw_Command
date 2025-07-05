import { useState } from 'react';
import { Header, StatusBar } from './components/UI';
import { Canvas } from './components/Canvas';
import { VoiceInterface } from './components/VoiceInterface';
import { Alert } from './components/common';

function App() {
  const [lastCommand, setLastCommand] = useState<string>('');

  const handleVoiceCommand = (command: string) => {
    console.log('Voice command received:', command);
    setLastCommand(command);
    // TODO: In next task, this will parse and execute the command
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Canvas />
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