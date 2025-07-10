# Voice Command Syntax Template

## Overview

This document defines the unified syntax template for all voice commands in the Draw Command application. The template provides a flexible structure that supports natural language variations while maintaining consistent parsing.

## Universal Template

```
Computer, [verb] [FILLERS?] [modifier?] [FILLERS?] [object/pronoun] [FILLERS?] [modifier?] [FILLERS?] [value?] [unit?] please.
```

### Template Elements

| Element        | Required | Description                                    | Examples                                    |
|----------------|----------|------------------------------------------------|---------------------------------------------|
| **verb**       | Required | The action to perform                          | `draw`, `move`, `color`, `make`, `resize`, `rotate`, `delete` |
| **FILLERS**    | Optional | Common words that don't change meaning         | `a`, `an`, `the`, `to`, `at`, `in`, `by`   |
| **modifier**   | Optional | Adjectives that modify the command             | `red`, `blue`, `bigger`, `smaller`, `left`, `up` |
| **object/pronoun** | Required | The shape being acted upon                     | `square`, `circle`, `triangle`, `it`       |
| **value**      | Optional | Numeric values for distances, angles, etc.     | `100`, `45`, `2`                           |
| **unit**       | Optional | Units for the value                            | `pixels`, `px`, `degrees`, `deg`, `times`, `percent` |

### Filler Words

**Articles**: `a`, `an`, `the`  
**Prepositions**: `to`, `at`, `in`, `by`

### Modifier Positions

Modifiers can appear in two positions:
- **Before object**: `"draw a red square"` (red modifies square)
- **After object**: `"make the square red"` (red modifies action)

## Template Examples

| Command                    | Verb   | FILLERS | Modifier | FILLERS | Object   | FILLERS | Modifier | FILLERS | Value | Unit     |
|----------------------------|--------|---------|----------|---------|----------|---------|----------|---------|-------|----------|
| `draw a square`            | draw   | a       | -        | -       | square   | -       | -        | -       | -     | -        |
| `draw a red square`        | draw   | a       | red      | -       | square   | -       | -        | -       | -     | -        |
| `draw the square red`      | draw   | the     | -        | -       | square   | -       | red      | -       | -     | -        |
| `move the square left`     | move   | the     | -        | -       | square   | -       | left     | -       | -     | -        |
| `move the square to the left` | move | the     | -        | to the  | square   | -       | left     | -       | -     | -        |
| `move the square up 100`   | move   | the     | -        | -       | square   | -       | up       | -       | 100   | -        |
| `move the square up 100 pixels` | move | the | -        | -       | square   | -       | up       | -       | 100   | pixels   |
| `move the red square left 50` | move | the     | red      | -       | square   | -       | left     | -       | 50    | -        |
| `make the square bigger`   | make   | the     | -        | -       | square   | -       | bigger   | -       | -     | -        |
| `make the square red`      | make   | the     | -        | -       | square   | -       | red      | -       | -     | -        |
| `make the big square red`  | make   | the     | big      | -       | square   | -       | red      | -       | -     | -        |
| `resize the square bigger` | resize | the     | -        | -       | square   | -       | bigger   | -       | -     | -        |
| `resize the red square bigger` | resize | the | red      | -       | square   | -       | bigger   | -       | -     | -        |
| `rotate the triangle 45 degrees` | rotate | the | -        | -       | triangle | -       | -        | -       | 45    | degrees  |
| `rotate the red triangle 45 degrees` | rotate | the | red      | -       | triangle | -       | -        | -       | 45    | degrees  |
| `color the square red`     | color  | the     | -        | -       | square   | -       | red      | -       | -     | -        |
| `color the square to red`  | color  | the     | -        | to      | square   | -       | red      | -       | -     | -        |
| `delete the square`        | delete | the     | -        | -       | square   | -       | -        | -       | -     | -        |
| `delete the red square`    | delete | the     | red      | -       | square   | -       | -        | -       | -     | -        |

## Command Categories

### Drawing Commands
- **Pattern**: `draw [FILLERS?] [color?] [FILLERS?] [shape]`
- **Examples**: 
  - `"Computer, draw a square please"`
  - `"Computer, draw a red circle please"`
  - `"Computer, draw the triangle red please"`

### Movement Commands  
- **Pattern**: `move [FILLERS?] [color?] [FILLERS?] [shape] [FILLERS?] [direction] [FILLERS?] [distance?] [unit?]`
- **Examples**:
  - `"Computer, move the square left please"`
  - `"Computer, move the red square to the right 100 pixels please"`
  - `"Computer, move it up please"`

### Color Commands
- **Pattern**: `color [FILLERS?] [shape] [FILLERS?] [color]`
- **Examples**:
  - `"Computer, color the square red please"`
  - `"Computer, color it blue please"`

### Make Commands (Unified)
- **Pattern**: `make [FILLERS?] [shape] [FILLERS?] [modifier]`
- **Examples**:
  - `"Computer, make the square bigger please"` (resize)
  - `"Computer, make the square red please"` (color)
  - `"Computer, make it smaller please"` (resize with pronoun)

### Resize Commands
- **Pattern**: `resize [FILLERS?] [color?] [FILLERS?] [shape] [FILLERS?] [size_modifier]`
- **Examples**:
  - `"Computer, resize the square bigger please"`
  - `"Computer, resize it much smaller please"`

### Rotation Commands
- **Pattern**: `rotate [FILLERS?] [color?] [FILLERS?] [shape] [FILLERS?] [angle] [unit]`
- **Examples**:
  - `"Computer, rotate the triangle 45 degrees please"`
  - `"Computer, rotate it 90 deg please"`

### Delete Commands
- **Pattern**: `delete [FILLERS?] [color?] [FILLERS?] [shape]`
- **Examples**:
  - `"Computer, delete the square please"`
  - `"Computer, remove it please"`

## Supported Values

### Colors
`red`, `blue`, `green`, `yellow`, `purple`, `orange`, `black`, `white`, `pink`, `brown`, `gray`, `grey`

### Shapes  
`square`, `circle`, `triangle`, `it` (pronoun reference)

### Directions
`up`, `down`, `left`, `right`

### Size Modifiers
`bigger`, `larger`, `smaller`, `much bigger`, `much smaller`, `a little bigger`, `a little smaller`

### Units
- **Distance**: `pixels`, `px`
- **Angle**: `degrees`, `deg`  
- **Scale**: `times`, `percent`, `%`

## Implementation Notes

### Regex Pattern Structure
The template translates to regex patterns with this general structure:
```regex
/^(verb)\s+(?:filler\s+)*(modifier\s+)?(?:filler\s+)*(object)\s+(?:filler\s+)*(modifier\s+)?(?:filler\s+)*(\d+)?\s*(unit)?$/i
```

### Modifier Context Detection
The unified "make" command uses modifier context to determine intent:
- **Size modifiers** (`bigger`, `smaller`, etc.) → route to resize logic
- **Color modifiers** (`red`, `blue`, etc.) → route to color logic

### Pronoun Reference
The pronoun `"it"` refers to the last interacted shape (most recently created, moved, resized, or modified).

## Future Extensions

This template is designed to be extensible:
- **New verbs**: Easy to add new command types
- **New modifiers**: Size, color, and direction modifiers can be expanded
- **New units**: Additional measurement units can be added
- **New fillers**: Common filler words can be added as needed

The template maintains backward compatibility while supporting natural language variations.