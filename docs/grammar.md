# Voice Command Grammar (Simplified BNF)

This document presents a simplified BNF (Backus-Naur Form) grammar for the voice command system, built incrementally.

## Current Grammar (Phase 3, Step 3.1)

We're expanding to support all three basic shapes, common fillers, colored drawing commands, and movement commands.

### Main Structure
```bnf
<command-phrase> ::= "computer" <command> "please"

<command> ::= <verb>
            | <verb> <object-phrase>
```

### Verbs
```bnf
<verb> ::= "draw" | "clear" | "move"
```

### Object Phrases
```bnf
<object-phrase> ::= <fillers> <shape>
                  | <fillers> <color> <shape>
                  | <fillers> <shape> <direction>
                  | <fillers> <color> <shape> <direction>
                  | <fillers> <shape> <fillers> <direction>
                  | <fillers> <color> <shape> <fillers> <direction>

<fillers> ::= <filler>
            | <fillers> <filler>

<filler> ::= "a" | "an" | "the" | "to"

<shape> ::= "square" | "circle" | "triangle"
```

### Colors
```bnf
<color> ::= "red" | "blue" | "green" | "yellow" | "purple" | "orange" | "black" | "white" | "pink" | "brown" | "gray" | "grey"
```

### Directions
```bnf
<direction> ::= "up" | "down" | "left" | "right"
```

## Test Commands

This grammar should handle:
- `computer draw a square please`
- `computer draw a red square please`
- `computer draw a blue circle please`
- `computer move the square left please`
- `computer move the square to the right please`
- `computer move the red circle to up please`
- `computer move the blue triangle to the left please`
- `computer clear please`

**Note**: `<fillers>` can match one or more filler words, so "a", "the", "to", "to the", etc. all work naturally.

## Next Steps

Once this works, we'll incrementally add:
1. ✅ More shapes (circle, triangle) - **COMPLETED**
2. ✅ More fillers (the, an) - **COMPLETED**
3. ✅ Color list (red, blue, etc.) - **COMPLETED**
4. ✅ Colors in draw commands - **COMPLETED**
5. ✅ Move verb and directions - **COMPLETED**
6. More verbs (color, delete, etc.)
7. Modifiers and complex relationships

## Implementation Notes

The actual Nearley grammar will include JavaScript postprocessing functions to build command objects, but we'll keep the structure simple and focused.