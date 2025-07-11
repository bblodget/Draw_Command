# Voice Command Grammar (Simplified BNF)

This document presents a simplified BNF (Backus-Naur Form) grammar for the voice command system, built incrementally.

## Current Grammar (Phase 2, Step 2.2)

We're expanding to support all three basic shapes, common fillers, and colored drawing commands.

### Main Structure
```bnf
<command-phrase> ::= "computer" <command> "please"

<command> ::= <verb>
            | <verb> <object-phrase>
```

### Verbs
```bnf
<verb> ::= "draw" | "clear"
```

### Object Phrases
```bnf
<object-phrase> ::= <filler> <shape>
                  | <filler> <color> <shape>

<filler> ::= "a" | "an" | "the"

<shape> ::= "square" | "circle" | "triangle"
```

### Colors
```bnf
<color> ::= "red" | "blue" | "green" | "yellow" | "purple" | "orange" | "black" | "white" | "pink" | "brown" | "gray" | "grey"
```

## Test Commands

This grammar should handle:
- `computer draw a square please`
- `computer draw an circle please`
- `computer draw the triangle please`
- `computer draw a red square please`
- `computer draw a blue circle please`
- `computer draw the green triangle please`
- `computer clear please`

## Next Steps

Once this works, we'll incrementally add:
1. ✅ More shapes (circle, triangle) - **COMPLETED**
2. ✅ More fillers (the, an) - **COMPLETED**
3. ✅ Color list (red, blue, etc.) - **COMPLETED**
4. ✅ Colors in draw commands - **COMPLETED**
5. More verbs (move, color, etc.)
6. Modifiers (colors, directions)
7. Complex relationships

## Implementation Notes

The actual Nearley grammar will include JavaScript postprocessing functions to build command objects, but we'll keep the structure simple and focused.