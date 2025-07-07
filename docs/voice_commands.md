# Voice Commands Documentation

## Overview

The Draw Command application uses a **"Computer, [command] please"** format for voice recognition:
- **"Computer"** - Attention word that wakes up the system
- **"please"** - Execution word that triggers the command

## 🎯 The Three Object Model

The Draw Command system operates on a simple principle: **only one shape of each type can exist at a time**.

### How It Works
- **One Square** - Only one square can exist on the canvas
- **One Circle** - Only one circle can exist on the canvas  
- **One Triangle** - Only one triangle can exist on the canvas

### What This Means
- When you draw a new square, it **replaces** any existing square
- When you change a shape's color, it **replaces** the old shape with a new colored version
- Each shape type is independent - you can have a square, circle, and triangle all at once
- This design eliminates ambiguity - "move the square" always refers to THE square

### Voice Feedback
The system provides intelligent voice responses:
- **New shape**: "I drew a blue square for you"
- **Replacing shape**: "I replaced the red square with a blue one"
- **Changing color**: "I changed the square to blue"

This simple model makes voice commands unambiguous and predictable, perfect for demonstration purposes.

## 🟢 Currently Supported Commands

### Drawing Shapes
These commands create shapes on the canvas (replacing any existing shape of the same type).

| Command | Example | Status | Notes |
|---------|---------|--------|-------|
| Draw Square | "Computer, draw a red square please" | ✅ Full Support | Creates/replaces the square |
| Draw Circle | "Computer, draw a blue circle please" | ✅ Full Support | Creates/replaces the circle |
| Draw Triangle | "Computer, draw a green triangle please" | ✅ Full Support | Creates/replaces the triangle |

**Format Variations:**
- "draw a [color] [shape]" - with article
- "draw [color] [shape]" - without article
- "draw a [shape]" - default color (red for square, blue for circle, green for triangle)

### Canvas Management
These commands manage the overall canvas state.

| Command | Example | Status | Notes |
|---------|---------|--------|-------|
| Clear Canvas | "Computer, clear please" | ✅ Full Support | Removes all shapes |
| Clear All | "Computer, clear all please" | ✅ Full Support | Same as clear |
| Clear Canvas | "Computer, clear the canvas please" | ✅ Full Support | Same as clear |

### Color Commands
These commands change the color of existing shapes (or create new ones if none exist).

| Command | Example | Status | Notes |
|---------|---------|--------|-------|
| Color Square | "Computer, color the square red please" | ✅ Full Support | Changes existing square to red |
| Color Circle | "Computer, color the circle blue please" | ✅ Full Support | Changes existing circle to blue |
| Color Triangle | "Computer, color the triangle green please" | ✅ Full Support | Changes existing triangle to green |

**Format Variations:**
- "color the [shape] [color]" - with article
- "color [shape] [color]" - without article

## 🟡 Partially Supported Commands

### Move Commands
These commands are parsed correctly but not yet executed (shows placeholder message).

| Command | Example | Status | Notes |
|---------|---------|--------|-------|
| Move Up | "Computer, move the square up please" | ⚠️ Parsed Only | Shows "Phase 2" message |
| Move Down | "Computer, move the circle down please" | ⚠️ Parsed Only | Shows "Phase 2" message |
| Move Left | "Computer, move the triangle left please" | ⚠️ Parsed Only | Shows "Phase 2" message |
| Move Right | "Computer, move the square right please" | ⚠️ Parsed Only | Shows "Phase 2" message |

**Format Variations:**
- "move the [shape] [direction]" - with article
- "move [shape] [direction]" - without article

### Delete Commands
These commands are parsed correctly but not yet executed (shows placeholder message).

| Command | Example | Status | Notes |
|---------|---------|--------|-------|
| Delete Shape | "Computer, delete the square please" | ⚠️ Parsed Only | Shows "Phase 2" message |
| Remove Shape | "Computer, remove the circle please" | ⚠️ Parsed Only | Shows "Phase 2" message |

**Format Variations:**
- "delete the [shape]" - with article
- "delete [shape]" - without article
- "remove the [shape]" - with article
- "remove [shape]" - without article

## 🔴 Future Commands (Not Started)

### Advanced Shape Operations
These commands will be implemented in Phase 2 with AI-powered natural language processing.

| Command | Example | Status | Notes |
|---------|---------|--------|-------|
| Resize Shape | "Computer, make the square bigger please" | ❌ Not Started | Requires shape targeting |
| Rotate Shape | "Computer, rotate the circle 45 degrees please" | ❌ Not Started | Requires shape targeting |
| Duplicate Shape | "Computer, copy the triangle please" | ❌ Not Started | Requires shape targeting |
| Group Shapes | "Computer, group the square and circle please" | ❌ Not Started | Requires multiple shape targeting |

### Spatial Relationship Commands
These commands will enable positioning shapes relative to each other.

| Command | Example | Status | Notes |
|---------|---------|--------|-------|
| Relative Positioning | "Computer, draw a circle to the left of the square please" | ❌ Not Started | Requires spatial awareness |
| Above/Below | "Computer, place a triangle above the circle please" | ❌ Not Started | Requires spatial awareness |
| Next To | "Computer, put a rectangle next to the square please" | ❌ Not Started | Requires spatial awareness |
| Align Shapes | "Computer, align the squares horizontally please" | ❌ Not Started | Requires multiple shape targeting |

### Advanced Shape Types
These shapes will be added in future phases.

| Command | Example | Status | Notes |
|---------|---------|--------|-------|
| Draw Rectangle | "Computer, draw a red rectangle please" | ❌ Not Started | Requires rectangle shape |
| Draw Oval | "Computer, draw a blue oval please" | ❌ Not Started | Requires oval shape |
| Draw Line | "Computer, draw a straight line please" | ❌ Not Started | Requires line shape |
| Draw Text | "Computer, write 'Hello' please" | ❌ Not Started | Requires text rendering |

### System Commands
These commands will provide system-level functionality.

| Command | Example | Status | Notes |
|---------|---------|--------|-------|
| Undo | "Computer, undo the last action please" | ❌ Not Started | Requires command history |
| Redo | "Computer, redo the last action please" | ❌ Not Started | Requires command history |
| Save | "Computer, save the drawing please" | ❌ Not Started | Requires file system integration |
| Load | "Computer, load my drawing please" | ❌ Not Started | Requires file system integration |
| Help | "Computer, what can I draw please" | ❌ Not Started | Requires help system |

### Context-Aware Commands
These commands will use natural language references to shapes.

| Command | Example | Status | Notes |
|---------|---------|--------|-------|
| Pronoun References | "Computer, move it to the right please" | ❌ Not Started | Requires context tracking |
| Color References | "Computer, delete the red square please" | ❌ Not Started | Requires shape identification |
| Size References | "Computer, make the big circle smaller please" | ❌ Not Started | Requires size analysis |
| Position References | "Computer, move the top triangle down please" | ❌ Not Started | Requires position analysis |

## 🎨 Supported Colors

The system currently recognizes these 12 colors with hex value mapping:

| Color | Hex Code | Status |
|-------|----------|--------|
| red | #FF0000 | ✅ Supported |
| blue | #0000FF | ✅ Supported |
| green | #00FF00 | ✅ Supported |
| yellow | #FFFF00 | ✅ Supported |
| purple | #800080 | ✅ Supported |
| orange | #FFA500 | ✅ Supported |
| black | #000000 | ✅ Supported |
| white | #FFFFFF | ✅ Supported |
| pink | #FFC0CB | ✅ Supported |
| brown | #A52A2A | ✅ Supported |
| gray/grey | #808080 | ✅ Supported |

## 📋 Command Format Flexibility

The parser accepts various natural language variations:

### Articles (Optional)
- "draw a red square" or "draw red square"
- "color the square red" or "color square red"
- "move the square left" or "move square left"

### Synonyms
- "delete" or "remove" for deletion commands
- "clear", "clear all", or "clear the canvas" for clearing

### Direction Variations
- "up", "down", "left", "right" for movement

## 🔧 Technical Implementation

### Current Implementation (Phase 1)
- **Regex-based parsing** for basic command recognition
- **Web Speech API** for voice recognition
- **Fabric.js** for canvas manipulation
- **React hooks** for state management

### Future Implementation (Phase 2)
- **OpenAI GPT-4** for natural language processing
- **Context awareness** for shape references
- **Spatial relationship** understanding
- **Advanced shape manipulation** capabilities

## 🚀 Development Phases

### Phase 1: Core Functionality ✅
- Basic voice recognition
- Simple command parsing
- Shape creation
- Canvas clearing
- Color changing (single instance shapes)

### Phase 2: AI Enhancement 🚧
- OpenAI API integration
- Natural language processing
- Shape movement and deletion
- Context-aware commands

### Phase 3: Advanced Features 📋
- Spatial relationships
- Advanced shapes
- System commands
- Context awareness

## 📝 Error Handling

The system provides user-friendly error messages for:
- **Unrecognized commands**: "Could not understand the command. Try 'draw a red square' or 'clear'."
- **Canvas not ready**: "Canvas not ready"
- **Invalid colors**: Falls back to default colors
- **Voice recognition errors**: Displays specific error messages

## 🧪 Testing Commands

To test the system, try these basic commands:
1. "Computer, draw a red square please"
2. "Computer, draw a blue circle please"
3. "Computer, color the square blue please" (changes square to blue)
4. "Computer, clear please"
5. "Computer, move the square left please" (shows Phase 2 message)
