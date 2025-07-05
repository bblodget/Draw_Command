import { Header, StatusBar } from './components/UI';
import { Canvas } from './components/Canvas';
import { VoiceInterface } from './components/VoiceInterface';
import { Alert } from './components/common';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto p-6">
        <div className="mb-6">
          <Alert type="info">
            Welcome to Draw Command! This is a voice-controlled drawing demo. 
            Say "Computer, draw a red square please" to get started.
          </Alert>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Canvas />
          </div>
          
          <div className="lg:col-span-1">
            <VoiceInterface />
          </div>
        </div>
      </main>

      <StatusBar />
    </div>
  );
}

export default App;