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
| Spatial Drawing | "Computer, draw a circle to the left of the square please" | ✅ Full Support | Creates shapes with spatial relationships |

**Format Variations:**
- "draw a [color] [shape]" - with article
- "draw [color] [shape]" - without article
- "draw a [shape]" - default color (red for square, blue for circle, green for triangle)
- "create" can be used instead of "draw"

**Spatial Relationships:**
- "to the left of the [shape]"
- "to the right of the [shape]"
- "above the [shape]"
- "below the [shape]"
- "next to the [shape]"

### Canvas Management
These commands manage the overall canvas state.

| Command | Example | Status | Notes |
|---------|---------|--------|-------|
| Clear Canvas | "Computer, clear please" | ✅ Full Support | Removes all shapes |

### Color Commands
These commands change the color of existing shapes (or create new ones if none exist).

| Command | Example | Status | Notes |
|---------|---------|--------|-------|
| Color Square | "Computer, color the square red please" | ✅ Full Support | Changes existing square to red |
| Color Circle | "Computer, color the circle blue please" | ✅ Full Support | Changes existing circle to blue |
| Color Triangle | "Computer, color the triangle green please" | ✅ Full Support | Changes existing triangle to green |
| Fill Command | "Computer, fill the square green please" | ✅ Full Support | Alternative to "color" |
| Make Color | "Computer, make the square red please" | ✅ Full Support | Alternative to "color" |

**Format Variations:**
- "color the [shape] [color]" - with article
- "color [shape] [color]" - without article
- "fill the [shape] [color]" - alternative verb
- "make the [shape] [color]" - alternative verb

### Move Commands
These commands move shapes in the specified direction. Default distance is 50 pixels, but you can specify a custom distance.

| Command | Example | Status | Notes |
|---------|---------|--------|-------|
| Move Default | "Computer, move the square up please" | ✅ Full Support | Moves shape 50px up |
| Move Custom | "Computer, move the square up 100 please" | ✅ Full Support | Moves shape 100px up |
| Move with Units | "Computer, move the square up 100 pixels please" | ✅ Full Support | Explicit unit specification |
| Spatial Move | "Computer, move the circle to the right of the square please" | ✅ Full Support | Position relative to other shapes |

**Format Variations:**
- "move the [shape] [direction]" - default 50px distance
- "move [shape] [direction]" - without article
- "move the [shape] [direction] [number]" - custom distance
- "move [shape] [direction] [number] pixels" - with unit

**Distance Behavior:**
- Default: 100 pixels (when no number specified)
- No enforced min/max limits - accepts any value from speech recognition
- Canvas boundary protection prevents shapes from moving off-canvas

**Voice Feedback:**
- Default distance: "I moved the square left"
- Custom distance: "I moved the square left 200 pixels"
- No shape: "There's no square on the canvas to move"
- Canvas edge: "I can't move the square any further in that direction"

### Rotation Commands
These commands rotate shapes on the canvas. Default rotation is 30 degrees for demo visibility.

| Command | Example | Status | Notes |
|---------|---------|--------|-------|
| Rotate Default | "Computer, rotate the triangle please" | ✅ Full Support | Rotates 30 degrees |
| Rotate Custom | "Computer, rotate the triangle 45 degrees please" | ✅ Full Support | Custom rotation angle |
| Rotate Negative | "Computer, rotate the square negative 30 please" | ✅ Full Support | Counter-clockwise rotation |
| Rotate with Minus | "Computer, rotate the square minus 45 degrees please" | ✅ Full Support | Alternative negative syntax |
| Circle Rotation | "Computer, rotate the circle please" | ✅ Fun Feature | Humorous responses |

**Format Variations:**
- "rotate the [shape]" - default 30° rotation
- "rotate [shape] [number]" - custom angle
- "rotate [shape] [number] degrees" - with unit
- "rotate [shape] negative [number]" - counter-clockwise
- "rotate [shape] minus [number]" - alternative negative

**Rotation Features:**
- Default angle: 30 degrees (optimized for demo visibility)
- Custom angles supported (any integer)
- Negative/minus keywords for counter-clockwise rotation
- Circle rotation provides humorous responses while maintaining rotation state
- Speech-to-text preprocessing handles degree symbols and punctuation

**Voice Feedback:**
- "I rotated the square by 30 degrees"
- "I rotated the triangle by 45 degrees"
- Circle humor: "I rotated the circle... just kidding!", "Ha ha, very funny!", etc.

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
| Resize Alternative | "Computer, resize the square bigger please" | ✅ Full Support | Alternative to "make" |

**Format Variations:**
- "make the [shape] [modifier]" - with article
- "make [shape] [modifier]" - without article  
- "make it [modifier]" - references most recent shape
- "make the [shape] the same size as the [target-shape]" - size matching
- "resize the [shape] [modifier]" - alternative verb

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

### Context Commands - Pronoun References ("it")
All commands support pronoun references using "it" to refer to the last interacted shape. The system tracks which shape was last created, moved, resized, or otherwise modified.

| Command | Example | Status | Notes |
|---------|---------|--------|-------|
| Pronoun Move | "Computer, move it to the right please" | ✅ Full Support | Moves last interacted shape |
| Pronoun Color | "Computer, color it red please" | ✅ Full Support | Changes last interacted shape color |
| Pronoun Resize | "Computer, make it bigger please" | ✅ Full Support | Resizes last interacted shape |
| Pronoun Rotate | "Computer, rotate it 45 degrees please" | ✅ Full Support | Rotates last interacted shape |
| Pronoun Delete | "Computer, delete it please" | ✅ Full Support | Deletes last interacted shape |

**How "it" References Work:**
- The system automatically tracks the last shape you interacted with
- Any draw, move, resize, rotate, or color operation updates the "last interacted shape"
- When you use "it" in a command, it refers to this tracked shape
- If no shapes exist, you get helpful error messages like "There are no shapes to move"

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

The BNF grammar parser accepts various natural language variations:

### Articles (Optional)
- "draw a red square" or "draw red square"
- "color the square red" or "color square red"
- "move the square left" or "move square left"

### Synonyms
- "delete" or "remove" for deletion commands
- "color", "fill", or "make [color]" for color changes
- "create" or "draw" for shape creation
- "make" or "resize" for size changes

### Filler Words
The system intelligently ignores filler words like:
- "a", "an", "the", "to", "with"
- These can appear anywhere in commands without affecting parsing

### Direction Variations
- "up", "down", "left", "right" for movement

## 🔧 Technical Implementation

### Current Implementation (Phase 1)
- **BNF Grammar with Nearley.js** for sophisticated command parsing
- **Speech-to-text preprocessing** for robust voice recognition
- **Web Speech API** for voice recognition
- **Fabric.js** for canvas manipulation
- **React hooks** for state management
- **Spatial relationship parsing** for complex positioning
- **Pronoun tracking system** for contextual references

### Speech-to-Text Preprocessing
The system includes robust preprocessing to handle speech recognition quirks:
- **Degree symbol conversion**: "45°" → "45 degrees"
- **Negative number handling**: "-30" → "negative 30"
- **Punctuation removal**: Strips commas, periods, and other punctuation
- **Spaced number fixes**: "- 30" → "negative 30"
- **Symbol normalization**: Handles various speech-to-text symbol variations

### BNF Grammar Features
- **Complex spatial relationships**: "to the left of", "above", "below"
- **Natural language variations**: Multiple ways to express the same command
- **Pronoun support**: Comprehensive "it" reference tracking
- **Optional elements**: Articles, filler words, units are all optional
- **Error recovery**: Graceful handling of parsing failures

## 🚀 Development Status

### Phase 1: Core Functionality ✅ COMPLETED
**Completed Features**:
- ✅ Basic voice recognition with attention words
- ✅ BNF grammar-based command parsing (replaced regex)
- ✅ Shape creation, deletion, and manipulation
- ✅ Shape movement with custom distances and spatial relationships
- ✅ Color changing with multiple command variations
- ✅ Canvas clearing and management
- ✅ Shape resizing with percentage and absolute sizing
- ✅ Shape rotation with custom angles and negative rotation
- ✅ Comprehensive pronoun references ("it")
- ✅ Spatial relationship understanding
- ✅ Speech-to-text preprocessing for robust recognition
- ✅ Professional UI with draggable voice control panel
- ✅ Live deployment to GitHub Pages

**Revolutionary Achievements**:
- 🎉 **BNF Grammar Architecture**: Sophisticated natural language processing
- 🎉 **Spatial Intelligence**: "draw a circle to the left of the square"
- 🎉 **Pronoun Support**: Full "it" reference tracking
- 🎉 **Speech Preprocessing**: Handles symbols, punctuation, and variations
- 🎉 **Live Demo**: Fully functional at https://bblodget.github.io/Draw_Command/

## 📝 Error Handling

The system provides user-friendly error messages for:
- **Unrecognized commands**: "Could not understand the command. Try 'draw a red square' or 'clear'."
- **Canvas not ready**: "Canvas not ready"
- **Invalid colors**: Falls back to default colors
- **Voice recognition errors**: Displays specific error messages
- **Grammar parsing errors**: Graceful fallback to error messages
- **Shape not found**: "There's no square on the canvas to move"

## 🧪 Basic Testing Commands

To test the core functionality, try these commands:

### Basic Shape Creation
1. "Computer, draw a red square please"
2. "Computer, draw a blue circle please"
3. "Computer, draw a green triangle please"
4. "Computer, create a yellow square please"

### Color Changes
5. "Computer, color the square blue please"
6. "Computer, make the circle red please"
7. "Computer, fill the triangle purple please"

### Movement
8. "Computer, move the square left please"
9. "Computer, move the circle up 100 please"
10. "Computer, move the triangle right 50 pixels please"

### Resizing
11. "Computer, make the square bigger please"
12. "Computer, make it much smaller please"
13. "Computer, make the triangle the same size as the square please"

### Rotation
14. "Computer, rotate the square please"
15. "Computer, rotate the triangle 45 degrees please"
16. "Computer, rotate the circle please" (watch for humor!)

### Pronouns and Context
17. "Computer, move it to the right please"
18. "Computer, color it green please"
19. "Computer, rotate it negative 30 please"
20. "Computer, delete it please"

### Spatial Relationships
21. "Computer, draw a circle to the left of the square please"
22. "Computer, move the triangle above the circle please"
23. "Computer, draw a square to the right of the triangle please"

### Cleanup
24. "Computer, clear please"

---

## 📖 Example Voice Commands Guide

*This section serves as the in-app help system - a copy-paste friendly guide for demo users*

### Quick Start

The Draw Command application uses **"Computer, [command] please"** format:
- **"Computer"** - wakes up the system
- **"please"** - triggers the command

Try these commands in order to see the system in action!

### 1. Basic Drawing
```
Computer, draw a red square please
Computer, draw a blue circle please  
Computer, draw a green triangle please
Computer, create a yellow square please
```

### 2. Moving Shapes
```
Computer, move the square left please
Computer, move the circle up please
Computer, move the triangle right 100 please
Computer, move the square down 50 pixels please
```

### 3. Changing Colors
```
Computer, color the square blue please
Computer, make the circle red please
Computer, fill the triangle purple please
```

### 4. Resizing Shapes
```
Computer, make the square bigger please
Computer, make the circle smaller please
Computer, make the triangle much bigger please
Computer, make the square a little smaller please
Computer, make the triangle the same size as the square please
```

### 5. Rotating Shapes
```
Computer, rotate the square please
Computer, rotate the triangle 45 degrees please
Computer, rotate the square negative 30 please
Computer, rotate the circle please
```
*Note: Circle rotation is just for fun - it won't look different but the system will give you humorous responses!*

### 6. Spatial Relationships
```
Computer, draw a circle to the left of the square please
Computer, draw a triangle to the right of the circle please
Computer, move the square above the triangle please
Computer, move the circle to the right of the triangle please
```

### 7. Using Pronouns ("it")
```
Computer, draw a red square please
Computer, make it blue please
Computer, move it right please
Computer, rotate it 45 degrees please
Computer, make it bigger please
Computer, delete it please
```

### 8. Cleanup Commands
```
Computer, delete the square please
Computer, remove the circle please
Computer, clear please
```

### 🎨 All Supported Colors
**red, blue, green, yellow, purple, orange, black, white, pink, brown, gray, grey**

Example: `Computer, draw a purple triangle please`

### 🎭 Fun Demo Features

**Circle Rotation Humor**  
Try: `Computer, rotate the circle please`

The system knows circles don't visually rotate, so it responds with fun messages like:
- "I rotated the circle... just kidding!"
- "Ha ha, very funny!"
- "I rotated the circle, I promise"
- "I rotated the circle or am I hallucinating again"

**Spatial Intelligence**  
The system understands spatial relationships:
- "to the left of the square"
- "to the right of the circle" 
- "above the triangle"
- "below the square"

**Smart Pronoun References**  
The system tracks your last action:
- After drawing: "it" refers to the new shape
- After moving: "it" refers to the moved shape
- After resizing: "it" refers to the resized shape

### 🧪 Quick Demo Script

Say these commands one by one for a full demo:

```
Computer, clear please
Computer, draw a red square please
Computer, draw a blue circle to the right of the square please
Computer, make the square bigger please
Computer, rotate it 30 degrees please
Computer, color the circle green please
Computer, move it up 100 please
Computer, draw a yellow triangle below the square please
Computer, make it the same size as the circle please
Computer, rotate the circle please
Computer, move the triangle left please
Computer, clear please
```

### 🎯 Presentation Demo Script

*Perfect for showing off the system (2-minute demo):*

1. `Computer, clear please`
2. `Computer, draw a red square please`
3. `Computer, draw a blue circle to the right of the square please`
4. `Computer, make the square bigger please`
5. `Computer, rotate it 45 degrees please`
6. `Computer, move the circle up please`
7. `Computer, draw a green triangle below the square please`
8. `Computer, make it the same size as the circle please`
9. `Computer, rotate the triangle negative 30 please`
10. `Computer, rotate the circle please` *(watch for humor!)*
11. `Computer, color the square purple please`
12. `Computer, make it much bigger please`
13. `Computer, move the triangle to the left of the circle please`
14. `Computer, clear please`

### ⚡ Voice Recognition Tips

1. **Start slowly**: Say "Computer" and wait to see it in the transcript
2. **Add your verb**: Say your verb like "draw" and wait to see it in the transcript  
3. **Speed up**: Once you see the first two words, you can talk at normal speed
4. **End with "please"**: Don't forget to say "please" at the end
5. **Start over**: If you mess up, just say "Computer" again to start over
6. **Use exact color names** from the supported list

### 🔧 Command Flexibility

The system accepts natural variations:

**Articles (optional)**
- "draw **a** red square" or "draw red square"
- "move **the** square left" or "move square left"

**Synonyms**
- "delete" or "remove" 
- "color", "fill", or "make [color]"
- "create" or "draw"

**Distance/Angle Variations**
- "move up" (default 100 pixels) or "move up 150"
- "rotate" (default 30°) or "rotate 45 degrees"