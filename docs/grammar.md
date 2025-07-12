# Voice Command Grammar (Simplified BNF)

This document presents a simplified BNF (Backus-Naur Form) grammar for the voice command system, built incrementally.

## Current Grammar (Phase 6, Step 6.2)

We're expanding to support all three basic shapes, common fillers, colored drawing commands, movement commands, delete commands, color change commands, resize commands, and pronoun support.

### Main Structure
```bnf
<command-phrase> ::= "computer" <command> "please"

<command> ::= <clear>
            | <draw> <draw-object-phrase>
            | <move> <move-object-phrase>
            | <delete> <delete-object-phrase>
            | <color-verb> <color-object-phrase>
            | <resize-verb> <resize-object-phrase>

<draw> ::= "draw"
<move> ::= "move"
<delete> ::= "delete" | "remove"
<color-verb> ::= "color" | "fill" | "make"
<resize-verb> ::= "resize" | "make"
```

### Object Phrases

**Note**: Move and delete commands intentionally don't support color specification because the three-object model (one square, one circle, one triangle) makes color redundant. "Move the square" or "delete the square" uniquely identifies the shape regardless of its current color.

```bnf
<draw-object-phrase> ::= <fillers> <shape>
                       | <fillers> <color> <shape>

<move-object-phrase> ::= <pronoun-or-shape> <fillers>? <direction>
                       | <pronoun-or-shape> <fillers>? <direction> <number>
                       | <pronoun-or-shape> <fillers>? <direction> <number> <unit>
                       | <pronoun-or-shape> <fillers>? <number> <fillers>? <direction>
                       | <pronoun-or-shape> <fillers>? <number> <unit> <fillers>? <direction>

<delete-object-phrase> ::= <pronoun-or-shape>

<color-object-phrase> ::= <pronoun-or-shape> <fillers>? <color>

<resize-object-phrase> ::= <pronoun-or-shape> <fillers>? <size-modifier>
                         | <pronoun-or-shape> <fillers>? "same" "size" "as" <fillers>? <shape>

<the-shape> ::= <fillers> <shape>
<pronoun> ::= "it"
<pronoun-or-shape> ::= <the-shape> | <pronoun>

<fillers> ::= <filler>
            | <fillers> <filler>

<filler> ::= "a" | "an" | "the" | "to" | "with"

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

### Numbers and Units
```bnf
<number> ::= [1-9][0-9]*
<unit> ::= "pixels"

<size-modifier> ::= "bigger" | "smaller" | "larger"
                  | "much bigger" | "much smaller"
                  | "a little bigger" | "a little smaller"
```

## Test Commands

This grammar should handle:
- `computer draw a square please`
- `computer draw a red square please`
- `computer draw a blue circle please`
- `computer move the square left please`
- `computer move the square to the right please`
- `computer move the circle up please`
- `computer move the triangle to the left please`
- `computer move the square up 100 please`
- `computer move the square up 100 pixels please`
- `computer move the circle left 50 please`
- `computer move the triangle 600 pixels to the right please`
- `computer delete the square please`
- `computer remove the circle please`
- `computer color the square red please`
- `computer make the circle blue please`
- `computer fill the triangle with green please`
- `computer make the square bigger please`
- `computer resize the circle smaller please`
- `computer make the triangle much bigger please`
- `computer make the square the same size as the circle please`
- `computer clear please`

**New pronoun support:**
- `computer move it to the right please`
- `computer color it blue please`
- `computer delete it please`
- `computer make it bigger please`
- `computer move it up 50 pixels please`

**Note**: `<fillers>` can match one or more filler words, so "a", "the", "to", "to the", etc. all work naturally. The pronoun "it" refers to the last shape that was operated on and doesn't require filler words.

## Next Steps

Once this works, we'll incrementally add:
1. ✅ More shapes (circle, triangle) - **COMPLETED**
2. ✅ More fillers (the, an) - **COMPLETED**
3. ✅ Color list (red, blue, etc.) - **COMPLETED**
4. ✅ Colors in draw commands - **COMPLETED**
5. ✅ Move verb and directions - **COMPLETED**
6. ✅ More verbs (color, delete, etc.) - **COMPLETED**
7. ✅ Resize commands (make bigger/smaller) - **COMPLETED**
8. ✅ Pronoun support ("it") - **COMPLETED**
9. Modifiers and complex relationships

## Implementation Notes

The actual Nearley grammar will include JavaScript postprocessing functions to build command objects, but we'll keep the structure simple and focused.