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

### Natural Language Processing
- **Nearley.js** - BNF grammar-based parser for sophisticated command parsing
- **Custom Grammar** - Comprehensive BNF grammar supporting spatial relationships and pronouns
- **TypeScript Integration** - Type-safe command parsing and validation

### Graphics Rendering
- **HTML5 Canvas** - Primary drawing surface
- **Fabric.js** - Canvas library for object manipulation and selection
- **Custom Shape Classes** - Extensible shape system

### Deployment & Infrastructure
- **GitHub Pages** - Static site hosting with automatic CI/CD
- **GitHub Actions** - Automated build and deployment pipeline
- **Vite Build** - Optimized production builds

## System Architecture

### High-Level Architecture
```
User Speech → Web Speech API → React App → BNF Grammar Parser → Command Parser → Canvas Engine → Visual Output
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
│   ├── voice.service.ts
│   ├── grammar-command.service.ts
│   ├── canvas.service.ts
│   └── response.service.ts
├── grammar/
│   ├── voice-commands.ne
│   ├── voice-commands.js
│   └── voice-commands.d.ts
├── types/
│   ├── index.ts
│   ├── grammar.ts
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
- Graceful degradation for unclear speech
- Retry mechanism for failed recognition
- User feedback for recognition issues
- Grammar parsing fallbacks for malformed commands

### 2. Command Processing Pipeline

#### Command Structure
```typescript
interface DrawCommand {
  type: 'draw' | 'move' | 'color' | 'resize' | 'delete' | 'clear';
  shape?: 'square' | 'circle' | 'triangle';
  pronoun?: 'it';
  color?: string;
  size?: number;
  position?: { x: number; y: number };
  direction?: 'up' | 'down' | 'left' | 'right';
  value?: number;
  unit?: string;
  resizeMode?: 'relative' | 'match';
  resizeFactor?: number;
  targetShape?: 'square' | 'circle' | 'triangle';
  spatialRelation?: SpatialRelation;
}
```

#### BNF Grammar Integration
```typescript
interface SpatialRelation {
  relation: 'left_of' | 'right_of' | 'above' | 'below' | 'next_to';
  reference: string;
}

interface ParsedCommand {
  verb: string;
  object?: {
    type: 'shape' | 'pronoun';
    value: string;
    color?: string;
    direction?: string;
    distance?: number;
    unit?: string;
    spatialRelation?: string;
    referenceShape?: string;
  };
  preModifier?: any;
  postModifier?: any;
  value?: any;
}
```

### 3. Canvas Engine

#### Shape Management
```typescript
interface Shape {
  id: string;
  type: 'square' | 'circle' | 'triangle';
  color: string;
  position: { x: number; y: number };
  size: number;
  createdAt: Date;
}
```

#### Fabric.js Integration
- Use Fabric.js for object manipulation
- Three-object model (one square, one circle, one triangle)
- Event handling for selection and modification
- Spatial relationship positioning with boundary protection
- Unified coordinate system for perfect shape alignment

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

## Grammar Design

### BNF Grammar Structure

#### Core Grammar Rules
```bnf
<command> ::= <clear>
            | <draw> <draw-object-phrase>
            | <move> <move-object-phrase>
            | <delete> <delete-object-phrase>
            | <color> <color-object-phrase>
            | <make> <make-object-phrase>

<draw-object-phrase> ::= <fillers> <shape>
                       | <fillers> <color> <shape>
                       | <fillers> <shape> <spatial-relationship> <fillers> <shape>
                       | <fillers> <color> <shape> <spatial-relationship> <fillers> <shape>

<spatial-relationship> ::= "to" "the" "left" "of"
                         | "to" "the" "right" "of"
                         | "above"
                         | "below"
                         | "next" "to"
```

#### Supported Features
- **5 Spatial Relationships**: Comprehensive positioning relative to other shapes
- **Pronoun Support**: "it" references with last-interacted shape tracking
- **Size Relationships**: "same size as" with visual size conversion
- **Natural Language Variations**: Multiple ways to express the same command
- **Numeric Values**: Distance and angle specifications with units

## Data Flow

### 1. Voice Input Flow
1. User speaks → Web Speech API captures audio
2. Speech recognition processes audio in real-time
3. Attention word ("computer") detection
4. Command phrase buffering until "please"
5. Speech sent to command parser

### 2. Command Processing Flow
1. Raw speech processed by Nearley.js grammar parser
2. BNF grammar rules parse natural language into structured commands
3. Grammar service converts parsed result to DrawCommand interface
4. Command validated against current canvas state
5. Canvas engine executes command with spatial relationship support

### 3. Response Flow
1. Command execution result determined
2. Appropriate response template selected
3. Text-to-speech synthesis triggered
4. Response displayed visually
5. Canvas updated with new state

## Security Considerations

### Client-Side Security
- No external API dependencies or keys required
- All processing happens in browser environment
- Grammar parsing prevents code injection attacks

### Input Validation
- Sanitize all user speech input through grammar validation
- Strict command structure validation before execution
- Prevent malicious canvas operations through type safety

### Deployment Security
- Static site deployment with no server-side vulnerabilities
- HTTPS-only access for microphone permissions
- No sensitive data storage or processing

## Performance Optimization

### Frontend Optimizations
- React.memo for expensive components
- Debounced speech recognition
- Canvas rendering optimization
- Lazy loading for non-critical features

### Grammar Parsing Optimizations
- Sub-50ms parsing performance with Nearley.js
- Efficient grammar compilation and caching
- Minimal memory footprint for grammar rules
- Type-safe command processing pipeline

## Development Phases

### Phase 1: Core Functionality ✅ COMPLETED
- Basic speech recognition and synthesis
- Shape drawing (square, circle, triangle)
- **BNF grammar-based command parsing** (replaced regex)
- Canvas rendering with Fabric.js
- **Spatial relationship commands**
- **Pronoun support and context awareness**
- **Natural language processing with 12 colors**
- **Size relationships and numeric values**

### Phase 2: Advanced Features (Future)
- Interactive help system
- Rotation commands
- Undo/redo system
- Export/import functionality

### Phase 3: Polish and Enhancement (Future)
- Performance optimization
- Advanced error handling
- Accessibility improvements
- Demo presentation features

## Testing Strategy

### Unit Tests
- BNF grammar parsing logic
- Shape manipulation functions
- Voice recognition utilities
- Canvas operations and spatial relationships

### Integration Tests
- End-to-end voice command flow
- Grammar parsing integration
- Cross-browser compatibility (Web Speech API)
- Performance benchmarks for parsing and rendering

### User Testing
- Demo presentation testing
- Accessibility testing
- Error scenario testing
- Performance under load

## Deployment Strategy

### Development Environment
- Local development with Vite dev server
- Hot reloading for rapid iteration
- Grammar compilation workflow with Nearley.js

### Production Deployment
- GitHub Pages with automatic deployment
- GitHub Actions for CI/CD pipeline
- Static site generation with Vite build
- No server-side dependencies or configuration required

### Live Demo
- **Production URL**: https://bblodget.github.io/Draw_Command/
- **HTTPS Required**: For microphone access via Web Speech API
- **Fully Functional**: Complete voice-controlled drawing system 