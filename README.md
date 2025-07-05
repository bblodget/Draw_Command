# Draw Command: Speech-to-Drawing Demo

A modern recreation of the iconic 1980s TI professional computer demo, allowing you to draw and manipulate shapes on screen using natural voice commands.

## 🎯 Demo

Try saying:
- "Computer, draw a red square please"
- "Computer, color the square blue please"
- "Computer, move the square to the left please"
- "Computer, make the square bigger please"
- "Computer, draw a circle to the right of the square please"

## ✨ Features

- **Voice Recognition**: Real-time speech-to-text using your browser's microphone
- **Natural Language**: AI-powered understanding of conversational commands
- **Interactive Canvas**: Draw and manipulate shapes with voice commands
- **Voice Feedback**: The computer responds with spoken confirmations
- **Context Awareness**: Understands references like "it" and "the red square"
- **Cross-Browser**: Works in Chrome, Firefox, Safari, and Edge

## 🚀 Quick Start

### Live Demo
Visit the live demo at: [Coming Soon - Vercel Deployment]

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/speech-to-drawing-demo.git
   cd speech-to-drawing-demo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Add your OpenAI API key to `.env.local`:
   ```
   VITE_OPENAI_API_KEY=your_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

6. **Grant microphone permissions** when prompted

## 🎮 How to Use

### Basic Commands

**Drawing Shapes:**
- "Computer, draw a red square please"
- "Computer, create a blue circle please"
- "Computer, make a green triangle please"

**Modifying Shapes:**
- "Computer, color the square blue please"
- "Computer, make the circle bigger please"
- "Computer, move the triangle to the right please"

**Spatial Relationships:**
- "Computer, draw a circle to the left of the square please"
- "Computer, place a triangle above the circle please"
- "Computer, put a rectangle next to the square please"

**System Commands:**
- "Computer, clear the canvas please"
- "Computer, undo the last action please"
- "Computer, what can I draw please"

### Voice Command Tips

1. **Start with "Computer"** - This wakes up the system
2. **End with "please"** - This executes your command
3. **Be specific** - "the red square" is clearer than "it"
4. **Speak clearly** - The system works best with clear pronunciation
5. **Wait for confirmation** - The computer will respond when it understands

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Voice Recognition**: Web Speech API
- **AI Processing**: OpenAI GPT-4
- **Graphics**: HTML5 Canvas + Fabric.js
- **Deployment**: Vercel

## 📁 Project Structure

```
speech-to-drawing-demo/
├── src/
│   ├── components/
│   │   ├── VoiceInterface/     # Speech recognition and synthesis
│   │   ├── Canvas/            # Drawing canvas and shape management
│   │   └── UI/                # User interface components
│   ├── services/
│   │   ├── voiceService.ts    # Voice recognition logic
│   │   ├── commandParser.ts   # Command parsing and AI integration
│   │   └── canvasService.ts   # Canvas and shape operations
│   ├── types/                 # TypeScript type definitions
│   └── utils/                 # Utility functions
├── docs/                      # Project documentation
├── public/                    # Static assets
└── api/                       # Vercel serverless functions
```

## 🔧 Development

### Prerequisites
- Node.js 18+ 
- npm or yarn
- OpenAI API key (for AI features)

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

### Environment Variables

Create a `.env.local` file with:

```env
# OpenAI API Key (required for AI features)
VITE_OPENAI_API_KEY=your_openai_api_key_here

# Optional: Custom API endpoint
VITE_API_BASE_URL=https://your-vercel-app.vercel.app
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Follow our [Development Workflow](docs/development-workflow.md)
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

## 📚 Documentation

- **[CLAUDE.md](CLAUDE.md)** - Project overview and documentation guide
- **[Requirements](docs/requirements.md)** - Functional and non-functional requirements
- **[Specification](docs/specification.md)** - Technical architecture and implementation details
- **[Development Plan](docs/plan.md)** - Detailed development roadmap
- **[Development Workflow](docs/development-workflow.md)** - How we develop and collaborate

## 🐛 Troubleshooting

### Common Issues

**Microphone not working:**
- Check browser permissions
- Try refreshing the page
- Ensure you're using HTTPS (required for microphone access)

**Voice recognition not responding:**
- Make sure you say "Computer" to wake up the system
- End commands with "please"
- Check that your microphone is working in other applications

**Shapes not appearing:**
- Check the browser console for errors
- Ensure the canvas is visible and not covered by other elements
- Try refreshing the page

**AI features not working:**
- Verify your OpenAI API key is set correctly
- Check that you have sufficient API credits
- Ensure you're connected to the internet

### Browser Compatibility

| Browser | Voice Recognition | Voice Synthesis | Canvas |
|---------|------------------|-----------------|---------|
| Chrome  | ✅ Full Support  | ✅ Full Support | ✅ Full Support |
| Firefox | ✅ Full Support  | ✅ Full Support | ✅ Full Support |
| Safari  | ⚠️ Limited       | ✅ Full Support | ✅ Full Support |
| Edge    | ✅ Full Support  | ✅ Full Support | ✅ Full Support |

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the 1980s TI Professional Computer demo
- Built with modern web technologies and AI capabilities
- Thanks to the Web Speech API and OpenAI for making this possible

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/speech-to-drawing-demo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/speech-to-drawing-demo/discussions)
- **Documentation**: Check the [docs/](docs/) folder for detailed information

---

**Made with ❤️ to recreate the magic of early voice-controlled computing** 