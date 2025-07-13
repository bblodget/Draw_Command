# Draw Command: Speech-to-Drawing Demo

A modern recreation of the iconic 1980s TI professional computer demo, allowing you to draw and manipulate shapes on screen using natural voice commands. Features advanced BNF grammar parsing, spatial relationships, and comprehensive natural language understanding.

## 🌐 Live Demo

🚀 **[Try the Live Demo](https://bblodget.github.io/Draw_Command/)**

**Ready to use right now!** - Full voice-controlled drawing experience with no setup required.

## 🎯 Quick Start Commands

Try saying these commands:
- **"Computer, draw a red square please"** - Creates a red square
- **"Computer, draw a blue circle to the left of the square please"** - Spatial positioning
- **"Computer, make the square bigger please"** - Resize shapes
- **"Computer, rotate the circle 45 degrees please"** - Custom rotation
- **"Computer, move it to the right please"** - Pronoun references
- **"Computer, make the triangle the same size as the square please"** - Size matching

## ✨ Features

### 🎙️ Advanced Voice Processing
- **Natural Language Understanding**: Sophisticated BNF grammar parser handles complex commands
- **Spatial Relationships**: "Draw a circle to the left of the square"
- **Pronoun Support**: "Move it to the right", "Make it bigger"
- **Size Relationships**: "Make the triangle the same size as the square"
- **Custom Angles**: "Rotate the square 45 degrees"
- **Distance Control**: "Move the circle 150 pixels left"

### 🎨 Drawing Capabilities
- **3 Shape Types**: Squares, circles, triangles
- **12+ Colors**: Red, blue, green, yellow, purple, orange, pink, brown, black, white, gray, cyan
- **Shape Operations**: Draw, move, delete, resize, rotate, color change
- **Collision Detection**: Smart positioning prevents overlapping
- **Canvas Boundaries**: Shapes stay within visible area

### 🖥️ Professional Interface
- **Draggable Voice Control**: Move the control panel anywhere
- **Real-time Transcript**: See your commands as you speak
- **Visual Feedback**: Color-coded status indicators
- **Always-visible UI**: Optimized for demos and presentations
- **Responsive Design**: Works on desktop and tablet

### 🧠 Intelligence Features
- **Context Awareness**: Understands "it", "the red square", etc.
- **Command Variations**: "Draw" vs "Create", "Delete" vs "Remove"
- **Filler Word Handling**: Natural speech patterns supported
- **Error Recovery**: Helpful feedback for unrecognized commands
- **Circle Humor**: Fun responses for rotating circles

## 📊 Project Status

**🎉 FEATURE COMPLETE AND DEPLOYED!**

- **Phase 1**: ✅ **COMPLETED** - Core Functionality (18/18 tasks, 49-52 hours)
- **Phase 1.5**: ✅ **COMPLETED** - GitHub Pages Deployment
- **Phase 2**: 🔄 **IN PROGRESS** - Final Polish (1/5 tasks completed)

### Revolutionary Achievements

**🏆 BNF Grammar Architecture**: Replaced regex-based parsing with sophisticated grammar system supporting:
- Complex spatial relationships
- Advanced pronoun resolution  
- Natural language variations
- Sub-50ms parsing performance

**🎯 Advanced Commands**: Far beyond original goals:
- 5 spatial relationships (left of, right of, above, below, next to)
- 7 resize commands with intensity modifiers
- Custom rotation angles with negative support
- Visual size conversion between shape types

**📦 Production Deployment**: Live demo with zero server costs, automatic CI/CD, and HTTPS microphone access.

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Voice**: Web Speech API (recognition + synthesis)
- **Parsing**: BNF Grammar with Nearley.js (replaced regex)
- **Graphics**: HTML5 Canvas + Fabric.js
- **Deployment**: GitHub Pages with GitHub Actions CI/CD
- **Architecture**: 100% client-side, no backend required

## 🎮 Complete Command Reference

### Basic Drawing
- "Computer, draw a square please"
- "Computer, create a blue circle please"  
- "Computer, draw a green triangle please"

### Spatial Relationships
- "Computer, draw a circle to the left of the square please"
- "Computer, draw a triangle above the circle please"
- "Computer, draw a square to the right of the triangle please"
- "Computer, draw a circle below the square please"
- "Computer, draw a triangle next to the circle please"

### Movement Commands
- "Computer, move the square left please"
- "Computer, move the circle 100 pixels right please"
- "Computer, move the triangle up please"
- "Computer, move it down please" (pronoun reference)

### Resize Commands
- "Computer, make the square bigger please" (1.5x)
- "Computer, make the circle much bigger please" (2x)
- "Computer, make the triangle a little smaller please" (0.8x)
- "Computer, make the square the same size as the circle please"

### Rotation Commands
- "Computer, rotate the triangle please" (30° default)
- "Computer, rotate the square 45 degrees please"
- "Computer, rotate the circle negative 90 degrees please"

### Color Commands
- "Computer, color the square blue please"
- "Computer, make the circle red please"
- "Computer, change the triangle to purple please"

### Utility Commands
- "Computer, delete the square please"
- "Computer, remove the circle please"

## 🚀 Local Development

### Prerequisites
- Node.js 18+
- Modern browser with microphone support
- HTTPS for microphone access (included in dev server)

### Setup

1. **Clone and install**
   ```bash
   git clone https://github.com/bblodget/Draw_Command.git
   cd Draw_Command
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Open browser**
   Navigate to `http://localhost:5173` and grant microphone permissions

### Available Scripts

```bash
npm run dev          # Start development server with HMR
npm run build        # Build for production
npm run preview      # Preview production build locally
npm run lint         # Run ESLint code quality checks
npm run type-check   # Run TypeScript type checking
```

## 📁 Project Architecture

```
Draw_Command/
├── src/
│   ├── components/
│   │   ├── VoiceInterface/        # Voice control UI and logic
│   │   │   ├── index.tsx          # Main voice interface component
│   │   │   ├── CommandDisplay.tsx # Transcript and command display
│   │   │   ├── HelpPanel.tsx      # Quick start guide
│   │   │   └── VoiceStatusIndicator.tsx # Status indicators
│   │   ├── Canvas/                # Drawing canvas and shapes
│   │   │   └── DrawingCanvas.tsx  # Main canvas component
│   │   └── common/                # Shared UI components
│   ├── services/
│   │   ├── voice.service.ts       # Web Speech API integration
│   │   ├── canvas.service.ts      # Shape management and operations
│   │   ├── command.service.ts     # Legacy regex parser (deprecated)
│   │   └── grammar-command.service.ts # BNF grammar parser
│   ├── types/                     # TypeScript definitions
│   │   └── index.ts              # Shape and command types
│   ├── utils/                     # Utility functions
│   │   └── index.ts              # ID generation and helpers
│   └── grammar/                   # BNF grammar definition
│       ├── voice-commands.ne      # Nearley.js grammar file
│       └── voice-commands.js      # Compiled grammar
├── docs/                          # Comprehensive documentation
│   ├── plan.md                   # Development roadmap
│   ├── requirements.md           # Project requirements
│   ├── specification.md          # Technical specification
│   ├── development-workflow.md   # Development process
│   ├── voice_commands.md         # Command documentation
│   └── quick_start.md           # Quick reference guide
├── .claude/                      # Development session tracking
└── public/                       # Static assets
```

## 📚 Documentation

- **[CLAUDE.md](CLAUDE.md)** - Project overview and development guide
- **[Voice Commands Guide](docs/voice_commands.md)** - Complete command reference
- **[Development Plan](docs/plan.md)** - Roadmap and progress tracking
- **[Development Workflow](docs/development-workflow.md)** - Session-based development process
- **[Requirements](docs/requirements.md)** - Functional requirements
- **[Technical Specification](docs/specification.md)** - Architecture details

## 🔧 Advanced Features

### BNF Grammar System
The project uses a sophisticated grammar-based parser instead of simple regex matching:

- **8-Phase Grammar Implementation**: Incremental development from basic shapes to advanced features
- **Nearley.js Integration**: Production-ready parser with TypeScript support  
- **Natural Language Support**: Handles filler words, variations, and complex syntax
- **Extensible Architecture**: Easy to add new commands and features

### Three Object Model
Simplified interaction model with one instance per shape type:
- One square, one circle, one triangle maximum
- Unambiguous shape references ("the square", "it")
- Automatic replacement when creating duplicate types
- Enhanced spatial relationship calculations

### Collision Detection & Smart Positioning
- **Random Position Generation**: New shapes placed at non-overlapping locations
- **Boundary Protection**: All shapes stay within canvas bounds
- **Spatial Relationship Accuracy**: Precise positioning relative to reference shapes
- **User Position Preservation**: Manual positioning maintained during operations

## 🐛 Troubleshooting

### Voice Recognition Issues

**Microphone not working:**
- Ensure HTTPS connection (required for microphone access)
- Check browser permissions for microphone
- Try refreshing the page and re-granting permissions

**Commands not recognized:**
- Start every command with "Computer"
- End every command with "please"
- Speak clearly and at moderate pace
- Check transcript area to see what was heard

**Incomplete commands:**
- Wait for complete transcript before speaking again
- Allow system to finish speaking before next command
- Avoid speaking over the system's voice responses

### Canvas Issues

**Shapes overlapping:**
- This was a known bug, fixed in Task 2.4
- If still occurring, refresh the page

**Shapes moving off screen:**
- Boundary protection should prevent this
- Use drag controls to manually reposition shapes if needed

**Performance issues:**
- Try refreshing the page
- Close other browser tabs using microphone
- Check browser console for error messages

### Browser Compatibility

| Browser | Voice Recognition | Voice Synthesis | BNF Grammar | Canvas |
|---------|------------------|-----------------|-------------|---------|
| Chrome  | ✅ Full Support  | ✅ Full Support | ✅ Full Support | ✅ Full Support |
| Firefox | ✅ Full Support  | ✅ Full Support | ✅ Full Support | ✅ Full Support |
| Safari  | ⚠️ Limited       | ✅ Full Support | ✅ Full Support | ✅ Full Support |
| Edge    | ✅ Full Support  | ✅ Full Support | ✅ Full Support | ✅ Full Support |

## 🤝 Contributing

We welcome contributions! The project follows a session-based development workflow:

1. **Fork the repository**
2. **Read the development workflow**: [docs/development-workflow.md](docs/development-workflow.md)
3. **Create feature branch**: `git checkout -b feature/amazing-feature`
4. **Follow session-based development**: Use todo lists and task-by-task approval
5. **Test thoroughly**: Ensure voice commands work across browsers
6. **Submit pull request**: Include session documentation

### Development Process
- **Session-based development** with comprehensive tracking
- **Task-by-task approval** before commits
- **Feature branch isolation** for stability
- **Comprehensive testing** including voice recognition
- **Documentation updates** for all changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏆 Project Achievements

### Technical Breakthroughs
- **Revolutionary BNF Grammar**: Replaced regex with sophisticated natural language parser
- **Advanced Spatial Understanding**: Complex positioning relationships
- **Zero Server Dependencies**: 100% client-side with GitHub Pages deployment
- **Professional Demo Quality**: Production-ready voice interface

### Development Excellence
- **Comprehensive Documentation**: 6 detailed documentation files
- **Session-based Workflow**: Complete audit trail of all development work
- **Extensive Testing**: Cross-browser voice recognition testing
- **User-Centered Design**: Iterative feedback and refinement

### Timeline Achievement
- **Feature Complete**: All original goals achieved plus advanced features
- **Production Deployed**: Live demo available with zero hosting costs
- **Sustainable Architecture**: Maintainable and extensible codebase

## 🙏 Acknowledgments

- **Inspiration**: 1980s TI Professional Computer voice demo
- **Modern Technologies**: Web Speech API, HTML5 Canvas, React ecosystem
- **Development Methodology**: Session-based development with comprehensive tracking
- **Community**: Open source tools and libraries that made this possible

## 📞 Support

- **Live Demo**: [https://bblodget.github.io/Draw_Command/](https://bblodget.github.io/Draw_Command/)
- **Issues**: [GitHub Issues](https://github.com/bblodget/Draw_Command/issues)
- **Documentation**: Comprehensive guides in [docs/](docs/) folder
- **Development Sessions**: Complete history in [.claude/sessions/](.claude/sessions/)

---

**🎉 Experience the magic of voice-controlled computing - recreated for the modern web!**
