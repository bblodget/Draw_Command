# Speech-to-Drawing Demo - Technical Specification

## Technology Stack

### Frontend Framework
- **React 18** with **TypeScript** - Modern, component-based UI development
- **Vite** - Fast development server and build tool
- **Tailwind CSS** - Utility-first CSS framework for rapid styling

### Voice Recognition & Synthesis
- **Web Speech API** - Browser-native speech recognition and synthesis
  - `SpeechRecognition` for real-time speech-to-text
  - `SpeechSynthesis` for text-to-speech responses
- **Fallback**: OpenAI Whisper API for improved accuracy (serverless function)

### Natural Language Processing
- **OpenAI GPT-4 API** - Parse natural language commands into structured actions
- **Serverless Function** - Secure API key handling and command processing

### Graphics Rendering
- **HTML5 Canvas** - Primary drawing surface
- **Fabric.js** - Canvas library for object manipulation and selection
- **Custom Shape Classes** - Extensible shape system

### Deployment & Infrastructure
- **Vercel** - Hosting and serverless functions
- **GitHub** - Version control and CI/CD integration

## System Architecture

### High-Level Architecture
```
User Speech → Web Speech API → React App → Serverless Function → OpenAI API → Command Parser → Canvas Engine → Visual Output
```

### Component Structure
```
App/
├── components/
│   ├── VoiceInterface/
│   │   ├── SpeechRecognition.tsx
│   │   ├── SpeechSynthesis.tsx
│   │   └── VoiceControls.tsx
│   ├── Canvas/
│   │   ├── DrawingCanvas.tsx
│   │   ├── ShapeRenderer.tsx
│   │   └── CanvasControls.tsx
│   ├── UI/
│   │   ├── CommandDisplay.tsx
│   │   ├── StatusIndicator.tsx
│   │   └── HelpPanel.tsx
│   └── common/
│       ├── Button.tsx
│       └── Modal.tsx
├── services/
│   ├── voiceService.ts
│   ├── commandParser.ts
│   ├── canvasService.ts
│   └── apiService.ts
├── types/
│   ├── commands.ts
│   ├── shapes.ts
│   └── voice.ts
└── utils/
    ├── colorUtils.ts
    ├── geometryUtils.ts
    └── speechUtils.ts
```

## Implementation Details

### 1. Voice Recognition System

#### Speech Recognition Flow
```typescript
interface VoiceRecognitionConfig {
  continuous: true;
  interimResults: true;
  lang: 'en-US';
  maxAlternatives: 1;
}

interface SpeechResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}
```

#### Attention Word Detection
- Listen for "computer" as trigger word
- Buffer speech until "please" is detected
- Process complete command phrase

#### Error Handling
- Fallback to OpenAI Whisper for unclear speech
- Retry mechanism for failed recognition
- User feedback for recognition issues

### 2. Command Processing Pipeline

#### Command Structure
```typescript
interface Command {
  action: 'draw' | 'modify' | 'move' | 'delete' | 'system';
  target?: string; // shape identifier
  properties?: {
    shape?: 'square' | 'circle' | 'triangle' | 'rectangle';
    color?: string;
    size?: { width: number; height: number };
    position?: { x: number; y: number };
    relativeTo?: string; // spatial relationships
  };
  context?: {
    lastShape?: string;
    selectedShape?: string;
  };
}
```

#### OpenAI Integration
```typescript
// Serverless function: /api/parse-command
interface ParseCommandRequest {
  speech: string;
  context: {
    existingShapes: Shape[];
    lastCommand?: Command;
  };
}

interface ParseCommandResponse {
  command: Command;
  confidence: number;
  alternatives?: Command[];
}
```

### 3. Canvas Engine

#### Shape Management
```typescript
interface Shape {
  id: string;
  type: 'square' | 'circle' | 'triangle' | 'rectangle';
  properties: {
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    rotation: number;
  };
  metadata: {
    createdAt: Date;
    lastModified: Date;
    createdBy: string; // command that created it
  };
}
```

#### Fabric.js Integration
- Use Fabric.js for object manipulation
- Custom shape classes for each shape type
- Event handling for selection and modification
- Undo/redo system using command history

### 4. Voice Response System

#### Speech Synthesis
```typescript
interface VoiceResponse {
  text: string;
  priority: 'high' | 'normal' | 'low';
  interruptible: boolean;
}

interface ResponseTemplates {
  confirmations: Record<string, string>;
  errors: Record<string, string>;
  help: Record<string, string>;
}
```

#### Response Queue
- Queue system for multiple responses
- Priority handling for confirmations vs. help
- Interruption handling for urgent messages

## API Design

### Serverless Functions

#### `/api/parse-command`
```typescript
POST /api/parse-command
{
  "speech": "computer draw a red square please",
  "context": {
    "existingShapes": [...],
    "lastCommand": {...}
  }
}

Response:
{
  "command": {
    "action": "draw",
    "properties": {
      "shape": "square",
      "color": "red"
    }
  },
  "confidence": 0.95
}
```

#### `/api/fallback-speech`
```typescript
POST /api/fallback-speech
{
  "audio": "base64-encoded-audio",
  "language": "en-US"
}

Response:
{
  "transcript": "computer draw a red square please",
  "confidence": 0.92
}
```

## Data Flow

### 1. Voice Input Flow
1. User speaks → Web Speech API captures audio
2. Speech recognition processes audio in real-time
3. Attention word ("computer") detection
4. Command phrase buffering until "please"
5. Speech sent to command parser

### 2. Command Processing Flow
1. Raw speech sent to serverless function
2. OpenAI GPT-4 parses natural language
3. Structured command returned to frontend
4. Command validated against current state
5. Canvas engine executes command

### 3. Response Flow
1. Command execution result determined
2. Appropriate response template selected
3. Text-to-speech synthesis triggered
4. Response displayed visually
5. Canvas updated with new state

## Security Considerations

### API Key Management
- OpenAI API keys stored in Vercel environment variables
- No client-side exposure of sensitive credentials
- Rate limiting on serverless functions

### Input Validation
- Sanitize all user speech input
- Validate command structure before execution
- Prevent malicious canvas operations

### CORS Configuration
- Configure CORS for Vercel deployment
- Secure communication between frontend and API

## Performance Optimization

### Frontend Optimizations
- React.memo for expensive components
- Debounced speech recognition
- Canvas rendering optimization
- Lazy loading for non-critical features

### API Optimizations
- Caching for common command patterns
- Batch processing for multiple commands
- Connection pooling for OpenAI API calls

## Development Phases

### Phase 1: Core Functionality
- Basic speech recognition and synthesis
- Simple shape drawing (square, circle)
- Basic command parsing with regex
- Canvas rendering with Fabric.js

### Phase 2: AI Enhancement
- OpenAI integration for natural language
- Advanced command parsing
- Context awareness and references
- Error handling and fallbacks

### Phase 3: Advanced Features
- Complex shapes and patterns
- Spatial relationship commands
- Undo/redo system
- Export/import functionality

## Testing Strategy

### Unit Tests
- Command parser logic
- Shape manipulation functions
- Voice recognition utilities
- Canvas operations

### Integration Tests
- End-to-end voice command flow
- API integration testing
- Cross-browser compatibility
- Performance benchmarks

### User Testing
- Demo presentation testing
- Accessibility testing
- Error scenario testing
- Performance under load

## Deployment Strategy

### Development Environment
- Local development with Vercel CLI
- Hot reloading for rapid iteration
- Environment variable management

### Production Deployment
- GitHub integration with Vercel
- Automatic deployments on main branch
- Preview deployments for pull requests
- Environment-specific configurations 