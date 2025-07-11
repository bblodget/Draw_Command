# Voice Command Grammar (Simplified BNF)

This document presents a simplified BNF (Backus-Naur Form) grammar for the voice command system, built incrementally.

## Current Grammar (Phase 1, Step 1.1)

We're expanding from the minimal grammar to support all three basic shapes.

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

<filler> ::= "a"

<shape> ::= "square" | "circle" | "triangle"
```

## Test Commands

This grammar should handle:
- `computer draw a square please`
- `computer draw a circle please`
- `computer draw a triangle please`
- `computer clear please`

## Next Steps

Once this works, we'll incrementally add:
1. ✅ More shapes (circle, triangle) - **COMPLETED**
2. More fillers (the, an)
3. More verbs (move, color, etc.)
4. Modifiers (colors, directions)
5. Complex relationships

## Implementation Notes

The actual Nearley grammar will include JavaScript postprocessing functions to build command objects, but we'll keep the structure simple and focused.