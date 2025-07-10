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

### Move Commands
These commands move shapes in the specified direction. Default distance is 50 pixels, but you can specify a custom distance.

| Command | Example | Status | Notes |
|---------|---------|--------|-------|
| Move Default | "Computer, move the square up please" | ✅ Full Support | Moves shape 50px up |
| Move Custom | "Computer, move the square up 100 please" | ✅ Full Support | Moves shape 100px up |
| Move Down | "Computer, move the circle down 25 please" | ✅ Full Support | Moves shape 25px down |
| Move Left | "Computer, move the triangle left please" | ✅ Full Support | Moves shape 50px left |
| Move Right | "Computer, move the square right 200 please" | ✅ Full Support | Moves shape 200px right |

**Format Variations:**
- "move the [shape] [direction]" - default 50px distance
- "move [shape] [direction]" - without article
- "move the [shape] [direction] [number]" - custom distance
- "move [shape] [direction] [number]" - custom distance without article

**Distance Limits:**
- Minimum: 10 pixels
- Maximum: 500 pixels
- Default: 50 pixels (when no number specified)
- Invalid numbers default to 50 pixels

**Voice Feedback:**
- Default distance: "I moved the square left"
- Custom distance: "I moved the square left 100 pixels"
- No shape: "There's no square on the canvas to move"
- Canvas edge: "I can't move the square any further in that direction"

### Delete Commands
These commands remove the specified shape from the canvas.

| Command | Example | Status | Notes |
|---------|---------|--------|-------|
| Delete Shape | "Computer, delete the square please" | ✅ Full Support | Removes the square |
| Remove Shape | "Computer, remove the circle please" | ✅ Full Support | Removes the circle |

**Format Variations:**
- "delete the [shape]" - with article
- "delete [shape]" - without article
- "remove the [shape]" - with article
- "remove [shape]" - without article

**Voice Feedback:**
- Success: "I deleted the square"
- No shape: "There's no square on the canvas to delete"

### Resize Commands
These commands resize shapes on the canvas. They work with all three shape types and support "it" references for the most recently created shape.

| Command | Example | Status | Notes |
|---------|---------|--------|-------|
| Make Bigger | "Computer, make the square bigger please" | ✅ Full Support | Increases size by 50% |
| Make Smaller | "Computer, make the circle smaller please" | ✅ Full Support | Decreases size to 67% |
| Much Bigger | "Computer, make it much bigger please" | ✅ Full Support | Doubles the size |
| Much Smaller | "Computer, make it much smaller please" | ✅ Full Support | Halves the size |
| A Little Bigger | "Computer, make it a little bigger please" | ✅ Full Support | Increases size by 20% |
| A Little Smaller | "Computer, make it a little smaller please" | ✅ Full Support | Decreases size by 20% |
| Same Size As | "Computer, make the triangle the same size as the square please" | ✅ Full Support | Matches another shape's visual size |

**Format Variations:**
- "make the [shape] [modifier]" - with article
- "make [shape] [modifier]" - without article  
- "make it [modifier]" - references most recent shape
- "make the [shape] the same size as the [target-shape]" - size matching

**Size Modifiers:**
- **bigger/larger** - 1.5x current size
- **smaller** - 0.67x current size
- **much bigger** - 2x current size
- **much smaller** - 0.5x current size
- **a little bigger** - 1.2x current size
- **a little smaller** - 0.8x current size

**Size Limits:**
- Minimum: 10 pixels
- Maximum: 500 pixels
- Shapes are automatically repositioned if resizing would push them off canvas

**Size Matching Logic:**
- When matching sizes between different shape types, the system uses visual size equivalence
- Circle-to-Square: Uses the circle's diameter to match the square's width
- Square-to-Circle: Uses the square's width to set the circle's diameter
- Same shape types: Direct size copying

**Voice Feedback:**
- "I made the square bigger"
- "I made the circle much smaller"
- "I made it a little bigger"
- "I made the triangle the same size as the square"
- No shape: "There are no shapes on the canvas to resize"

## 🟡 Planned Commands (Next Priority)

These commands will be implemented using the three object model and enhanced regex parsing.

### Shape Manipulation
| Command | Example | Status | Notes |
|---------|---------|--------|-------|
| Rotate Default | "Computer, rotate the triangle please" | 📋 Task 1.10 | Rotates 90 degrees |
| Rotate Custom | "Computer, rotate the triangle 45 degrees please" | 📋 Task 1.10 | Custom rotation |

### Spatial Positioning
| Command | Example | Status | Notes |
|---------|---------|--------|-------|
| Relative Draw | "Computer, draw a circle to the left of the square please" | 📋 Task 1.11 | Smart positioning |
| Relative Move | "Computer, move the circle to the right of the square please" | 📋 Task 1.11 | Position relative to other shapes |

### Context Commands - Pronoun References ("it")
All commands support pronoun references using "it" to refer to the last interacted shape. The system tracks which shape was last created, moved, resized, or otherwise modified.

| Command | Example | Status | Notes |
|---------|---------|--------|-------|
| Pronoun Move | "Computer, move it to the right please" | ✅ Full Support | Moves last interacted shape |
| Pronoun Color | "Computer, color it red please" | ✅ Full Support | Changes last interacted shape color |
| Pronoun Resize | "Computer, make it bigger please" | ✅ Full Support | Resizes last interacted shape |
| Pronoun Delete | "Computer, delete it please" | ✅ Full Support | Deletes last interacted shape |

**How "it" References Work:**
- The system automatically tracks the last shape you interacted with
- Any draw, move, resize, operation updates the "last interacted shape"
- When you use "it" in a command, it refers to this tracked shape
- If no shapes exist, you get helpful error messages like "There are no shapes to move"

### Interactive Help System
| Command | Example | Status | Notes |
|---------|---------|--------|-------|
| Main Help | "Computer, help please" | 📋 Task 1.13 | Interactive help menu |
| Help Categories | "Computer, help with shapes please" | 📋 Task 1.13 | Category-specific help |
| Command Help | "Computer, help with move please" | 📋 Task 1.13 | Detailed command help |

**Interactive Help Flow:**
1. **Level 1 - Main Help**: "I can help you with shapes, colors, or commands. What would you like to know about?"
2. **Level 2 - Categories**: 
   - Shapes: Lists available shapes and drawing options
   - Colors: Lists supported colors
   - Commands: Lists command types (draw, move, delete, etc.)
3. **Level 3 - Specific Help**: Detailed explanations with examples

## 🔴 Future Commands (AI Required)

These advanced commands will require AI-powered natural language processing in Phase 2.

### Natural Language Variations
| Command | Example | Status | Notes |
|---------|---------|--------|-------|
| Complex Sizes | "Computer, make the square a bit smaller please" | ❌ Phase 2 | Requires AI interpretation |
| Descriptive References | "Computer, delete the big red shape please" | ❌ Phase 2 | Requires AI understanding |
| Multiple Operations | "Computer, draw a blue square and move it left please" | ❌ Phase 2 | Requires command chaining |

### Advanced Spatial Commands
| Command | Example | Status | Notes |
|---------|---------|--------|-------|
| Above/Below | "Computer, place a triangle above the circle please" | ❌ Phase 2 | Complex spatial calculation |
| Align Shapes | "Computer, align all shapes horizontally please" | ❌ Phase 2 | Multiple shape coordination |
| Patterns | "Computer, arrange the shapes in a line please" | ❌ Phase 2 | Pattern recognition |

### System Features
| Command | Example | Status | Notes |
|---------|---------|--------|-------|
| Undo/Redo | "Computer, undo the last action please" | ❌ Phase 2 | Command history required |
| Save/Load | "Computer, save this drawing please" | ❌ Phase 2 | File system integration |
| Advanced Help | "Computer, how do I make shapes bigger please" | ❌ Phase 2 | Contextual help system |

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

### Phase 1: Core Functionality 🚧
**Completed**:
- ✅ Basic voice recognition
- ✅ Simple command parsing
- ✅ Shape creation and deletion
- ✅ Shape movement (with custom distances)
- ✅ Color changing (single instance shapes)
- ✅ Canvas clearing
- ✅ Shape resizing (bigger/smaller/percentage/absolute)

**In Progress**:
- 📋 UI Polish and testing
- 📋 Shape rotation (degrees)
- 📋 Relative positioning
- 📋 Help system

**Recently Completed**:
- ✅ **Task 1.12: Pronoun references ("it")** - Full support for all commands (move, color, delete,  resize)
- ✅ Comprehensive lastShapeId tracking system for contextual references
- ✅ Natural conversation flow: "draw a square" → "make it blue" → "move it left" → "delete it"
### Phase 2: AI Enhancement 📅
- OpenAI API integration
- Natural language processing
- Complex command interpretation
- Advanced context awareness

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
4. "Computer, move the square left please" (moves square 50px left)
5. "Computer, move the square up 100 please" (moves square 100px up)
6. "Computer, make the square bigger please" (increases size by 50%)
7. "Computer, make it much bigger please" (doubles the most recent shape)
8. "Computer, make it a little smaller please" (reduces size by 20%)
9. "Computer, delete the circle please" (removes the circle)
10. "Computer, clear please" (removes all shapes)

### Resize Commands Testing:
- "Computer, make the square bigger please" (1.5x size)
- "Computer, make it much smaller please" (0.5x size)
- "Computer, make it a little bigger please" (1.2x size)
- "Computer, make the circle smaller please" (0.67x size)
- "Computer, make it much bigger please" (2x size)
- "Computer, make it a little smaller please" (0.8x size)
- "Computer, make the triangle the same size as the square please" (size matching)

### Pronoun References Testing:
- "Computer, draw a red square please" (creates square and makes it the last interacted shape)
- "Computer, make it blue please" (changes the square to blue)
- "Computer, move it to the right please" (moves the blue square right)
- "Computer, make it bigger please" (resizes the square)
- "Computer, delete it please" (deletes the square)

### Planned Commands Testing (Future):
- "Computer, rotate the triangle 45 degrees please" (Task 1.10)
- "Computer, draw a circle to the left of the square please" (Task 1.11)
- "Computer, help please" (Task 1.13)
