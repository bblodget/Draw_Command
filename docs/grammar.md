# Voice Command Grammar (Simplified BNF)

This document presents a simplified BNF (Backus-Naur Form) grammar for the voice command system, built incrementally.

## Current Grammar (Phase 8, Step 8.2)

We're expanding to support all three basic shapes, common fillers, colored drawing commands, movement commands, delete commands, color change commands, resize commands, pronoun support, and spatial relationships.

### Main Structure
```bnf
<command-phrase> ::= "computer" <command> "please"

<command> ::= <clear>
            | <draw> <draw-object-phrase>
            | <move> <move-object-phrase>
            | <delete> <delete-object-phrase>
            | <color-verb> <color-object-phrase>
            | <resize-verb> <resize-object-phrase>
            | <rotate> <rotate-object-phrase>

<draw> ::= "draw" | "create"
<move> ::= "move"
<delete> ::= "delete" | "remove"
<color-verb> ::= "color" | "fill" | "make"
<resize-verb> ::= "resize" | "make"
<rotate> ::= "rotate"
```

### Object Phrases

**Note**: Move and delete commands intentionally don't support color specification because the three-object model (one square, one circle, one triangle) makes color redundant. "Move the square" or "delete the square" uniquely identifies the shape regardless of its current color.

```bnf
<draw-object-phrase> ::= <fillers> <shape>
                       | <fillers> <color> <shape>
                       | <fillers> <shape> <spatial-relationship> <fillers>? <shape>
                       | <fillers> <color> <shape> <spatial-relationship> <fillers>? <shape>

<move-object-phrase> ::= <pronoun-or-shape> <fillers>? <direction>
                       | <pronoun-or-shape> <fillers>? <direction> <number>
                       | <pronoun-or-shape> <fillers>? <direction> <number> <unit>
                       | <pronoun-or-shape> <fillers>? <number> <fillers>? <direction>
                       | <pronoun-or-shape> <fillers>? <number> <unit> <fillers>? <direction>
                       | <pronoun-or-shape> <fillers>? <spatial-relationship> <fillers>? <shape>

<delete-object-phrase> ::= <pronoun-or-shape>

<color-object-phrase> ::= <pronoun-or-shape> <fillers>? <color>

<resize-object-phrase> ::= <pronoun-or-shape> <fillers>? <size-modifier>
                         | <pronoun-or-shape> <fillers>? "same" "size" "as" <fillers>? <shape>

<rotate-object-phrase> ::= <pronoun-or-shape>
                         | <pronoun-or-shape> <fillers>? <sign>? <number>
                         | <pronoun-or-shape> <fillers>? <sign>? <number> "degrees"

<the-shape> ::= <fillers> <shape>
<pronoun> ::= "it"
<pronoun-or-shape> ::= <the-shape> | <pronoun>

<fillers> ::= <filler>
            | <fillers> <filler>

<filler> ::= "a" | "an" | "the" | "to" | "with"

<shape> ::= "square" | "circle" | "triangle"
```

### Spatial Relationships
```bnf
<spatial-relationship> ::= "to" "the" "left" "of"
                         | "to" "the" "right" "of"
                         | "above"
                         | "below"
                         | "next" "to"
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

<sign> ::= "negative" | "minus"
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
- `computer rotate the triangle please`
- `computer rotate the square 45 please`
- `computer rotate it negative 30 degrees please`
- `computer rotate the circle minus 90 please`
- `computer clear please`

**New pronoun support:**
- `computer move it to the right please`
- `computer color it blue please`
- `computer delete it please`
- `computer make it bigger please`
- `computer move it up 50 pixels please`
- `computer rotate it please`
- `computer rotate it 45 degrees please`

**New spatial relationship support:**
- `computer draw a circle to the left of the square please`
- `computer draw a red triangle to the right of the circle please`
- `computer draw a square above the triangle please`
- `computer draw a blue circle below the square please`
- `computer draw a triangle next to the circle please`
- `computer move the square to the left of the circle please`
- `computer move it above the triangle please`
- `computer move the circle next to the square please`

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
9. ✅ Spatial relationships ("to the left of", "above", etc.) - **COMPLETED**
10. ⏳ Rotate commands (rotate with angles) - **IN PROGRESS**
11. Advanced modifiers and complex relationships

## Implementation Notes

The actual Nearley grammar will include JavaScript postprocessing functions to build command objects, but we'll keep the structure simple and focused.

### Spatial Relationship Implementation Details

When implementing spatial relationships, the system should:

1. **Calculate relative positions** based on the reference shape's bounds
2. **Avoid overlaps** by positioning shapes with appropriate spacing
3. **Handle edge cases** when reference shapes don't exist
4. **Support all four directions** with natural positioning logic:
   - **Left/Right**: Position horizontally with spacing
   - **Above/Below**: Position vertically with spacing  
   - **Next to**: Try positioning in this priority order:
     1. To the right of the reference shape
     2. To the left of the reference shape  
     3. Above the reference shape
     4. Below the reference shape
     If a position would place the shape outside canvas bounds, try the next option in the sequence.

The spatial relationship commands work with both draw and move operations, allowing users to create shapes in specific positions relative to existing shapes or move existing shapes to new relative positions.

### Rotation Implementation Details

When implementing rotation commands, the system should:

1. **Default angle**: Use 30° as the default rotation (visually noticeable for squares and triangles)
2. **Direction convention**: 
   - Positive angles = clockwise rotation
   - Negative angles (using "negative" or "minus") = counterclockwise rotation
3. **Special case for circles**: Since circles look identical when rotated, provide a humorous response:
   - "I rotated the circle... just kidding!"
   - "Ha! Nice try, but circles don't show rotation"
4. **Angle units**: 
   - "degrees" unit is optional
   - Numbers without units are assumed to be degrees
5. **Visual demo focus**: All angles are chosen to create visible changes for demonstration purposes

**Supported rotation commands:**
- `rotate the square` → 30° clockwise (default)
- `rotate the triangle 45` → 45° clockwise
- `rotate it negative 30 degrees` → 30° counterclockwise
- `rotate the circle minus 90` → humorous response (no actual rotation)