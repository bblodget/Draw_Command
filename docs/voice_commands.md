# Voice Commands Documentation

## Overview

The Draw Command application uses natural voice commands in a **"Computer, [command] please"** format:
- **"Computer"** - Attention word that activates the system
- **"please"** - Polite ending that executes the command

## 🎯 The Three Object Model

The system uses a simplified interaction model: **one shape of each type** can exist at a time.

### How It Works
- **One Square** - Only one square on the canvas
- **One Circle** - Only one circle on the canvas  
- **One Triangle** - Only one triangle on the canvas

### Benefits
- **No ambiguity** - "the square" always refers to THE square
- **Simple references** - "it" refers to the last interacted shape
- **Clear feedback** - System tells you when shapes are replaced
- **Easy demos** - Perfect for presentations and teaching

## 🎨 Supported Commands

### 1. Drawing Shapes
Create shapes on the canvas. Drawing a shape type that already exists will replace it.

#### Basic Drawing
```
Computer, draw a red square please
Computer, draw a blue circle please
Computer, draw a green triangle please
Computer, create a yellow square please
```

#### Spatial Drawing
```
Computer, draw a circle to the left of the square please
Computer, draw a triangle above the circle please
Computer, draw a square next to the triangle please
```

**Supported Spatial Relations:**
- `to the left of` / `to the right of`
- `above` / `over` (synonyms)
- `below` / `under` (synonyms)  
- `next to` / `beside` / `near` (synonyms)

### 2. Moving Shapes
Move shapes around the canvas with directional commands or spatial positioning.

#### Basic Movement
```
Computer, move the square left please
Computer, move the circle up please
Computer, place the triangle right please
```

#### Movement with Distance
```
Computer, move the square left 100 please
Computer, move the circle up 150 pixels please
Computer, position the triangle down 50 please
```

#### Spatial Movement
```
Computer, move the square to the right of the circle please
Computer, move the triangle above the square please
```

**Default Distance:** 100 pixels when not specified

### 3. Changing Colors
Change the color of existing shapes.

```
Computer, color the square red please
Computer, fill the circle blue please
Computer, make the triangle green please
```

**Supported Colors:** red, blue, green, yellow, purple, orange, pink, brown, black, white, gray/grey

### 4. Resizing Shapes
Resize shapes with intensity modifiers or match sizes between shapes.

#### Basic Resizing
```
Computer, make the square bigger please
Computer, make the circle smaller please
Computer, resize the triangle larger please
```

#### Intensity Modifiers
```
Computer, make the square much bigger please
Computer, make the circle much smaller please
Computer, make the triangle a little bigger please
Computer, make the square a little smaller please
```

#### Size Matching
```
Computer, make the triangle the same size as the square please
Computer, make the circle the same size as the triangle please
```

**Size Modifiers:**
- `bigger`/`larger` → 1.5x current size
- `smaller` → 0.67x current size
- `much bigger` → 2x current size
- `much smaller` → 0.5x current size
- `a little bigger` → 1.2x current size
- `a little smaller` → 0.8x current size

**Size Limits:** 10-500 pixels

### 5. Rotating Shapes
Rotate shapes with default or custom angles.

#### Basic Rotation
```
Computer, rotate the square please
Computer, rotate the triangle 45 degrees please
Computer, rotate the square 90 please
```

#### Counter-clockwise Rotation
```
Computer, rotate the square negative 30 please
Computer, rotate the triangle minus 45 degrees please
```

#### Circle Rotation (Easter Egg)
```
Computer, rotate the circle please
```
*The system responds with humor since circles look the same when rotated!*

**Default Angle:** 30 degrees (when not specified)

### 6. Deleting Shapes
Remove shapes from the canvas.

```
Computer, delete the square please
Computer, remove the circle please
Computer, delete the triangle please
```

### 7. Canvas Management
Clear all shapes from the canvas.

```
Computer, clear please
```

### 8. Using Pronouns ("it")
Use "it" to refer to the last shape you interacted with.

```
Computer, draw a red square please
Computer, move it to the right please
Computer, make it bigger please
Computer, rotate it 45 degrees please
Computer, color it blue please
Computer, delete it please
```

**"It" refers to:**
- The last shape you drew
- The last shape you moved, resized, rotated, or colored
- Automatically tracked by the system

## 🎨 Supported Colors

- **red** • **blue** • **green** • **yellow** • **purple** • **orange**
- **pink** • **brown** • **black** • **white** • **gray/grey**

## 💡 Natural Language Features

### Flexible Phrasing
The system understands many ways to say the same thing:

- **Articles are optional:** "draw a square" = "draw square"
- **Multiple verbs:** "create" = "draw", "remove" = "delete", "place" = "move"
- **Filler words ignored:** "a", "an", "the", "to", "with"

### Spatial Synonyms
- **Above/Over:** "above the square" = "over the square"
- **Below/Under:** "below the circle" = "under the circle"
- **Next to/Beside/Near:** "next to the triangle" = "beside the triangle"

## 🚀 Quick Demo Script

Try these commands in order for a complete demonstration:

```
Computer, clear please
Computer, draw a red square please
Computer, draw a blue circle to the right of the square please
Computer, make the square bigger please
Computer, rotate it 45 degrees please
Computer, draw a green triangle below the square please
Computer, make it the same size as the circle please
Computer, move the circle up 100 please
Computer, color the square purple please
Computer, rotate the circle please
Computer, move the triangle to the left of the circle please
Computer, clear please
```

## ⚡ Voice Recognition Tips

1. **Start slowly**: Say "Computer" and wait for transcript
2. **Speak clearly**: Once recognized, continue at normal speed
3. **End with "please"**: Required to execute the command
4. **Start over**: Say "Computer" again if you make a mistake
5. **Watch the transcript**: Confirms what the system heard

## 🎭 Fun Easter Eggs

### Circle Rotation Humor
Try rotating a circle and enjoy the system's witty responses:
```
Computer, rotate the circle please
```

Responses include:
- "I rotated the circle... just kidding!"
- "Ha ha, very funny!"
- "Nice try! The circle looks exactly the same"
- "I rotated the circle, I promise"
- "I rotated the circle or am I hallucinating again"

## 🔧 Technical Details

### Architecture
- **Parser**: BNF Grammar with Nearley.js
- **Voice**: Web Speech API
- **Canvas**: Fabric.js
- **UI**: React + TypeScript

### Speech Processing
The system preprocesses speech to handle:
- Degree symbols: "45°" → "45 degrees"
- Negative numbers: "-30" → "negative 30"
- Punctuation removal
- Common speech-to-text variations

### Error Messages
Helpful feedback for:
- Unrecognized commands
- Missing shapes
- Canvas boundaries
- Invalid operations