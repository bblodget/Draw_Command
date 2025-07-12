# Voice Commands Grammar - Phase 6, Step 6.2
# Goal: Parse "computer [verb] [filler] [color?] [shape] [direction?] please" and "computer clear please"
# Supports: square, circle, triangle, it (pronoun)
# Fillers: a, an, the, to, with
# Colors: red, blue, green, yellow, purple, orange, black, white, pink, brown, gray, grey
# Directions: up, down, left, right
# Size modifiers: bigger, smaller, larger, much bigger, much smaller, a little bigger, a little smaller
# Verbs: draw, move, delete, remove, color, make, fill, resize

# Main rule
main -> "computer" _ command _ "please"     {% ([,, cmd]) => cmd %}

# Command structure with explicit verb-object relationships
command -> clear_command {% id %}
    | draw_command {% id %}
    | move_command {% id %}
    | delete_command {% id %}
    | color_command {% id %}
    | resize_command {% id %}

# Command types
clear_command -> "clear"  {% () => ({ verb: 'clear', object: null }) %}

draw_command -> "draw" _ draw_object_phrase  {% ([,, object]) => ({ verb: 'draw', object: object }) %}
    | "create" _ draw_object_phrase  {% ([,, object]) => ({ verb: 'draw', object: object }) %}

move_command -> "move" _ move_object_phrase  {% ([,, object]) => ({ verb: 'move', object: object }) %}

delete_command -> delete_verb _ delete_object_phrase  {% ([verb,, object]) => ({ verb: verb, object: object }) %}

color_command -> color_verb _ color_object_phrase  {% ([verb,, object]) => ({ verb: verb, object: object }) %}

resize_command -> resize_verb _ resize_object_phrase  {% ([verb,, object]) => ({ verb: verb, object: object }) %}

# Delete verb (handles both delete and remove)
delete_verb -> "delete" {% id %}
    | "remove" {% id %}

# Color verb (handles color, fill, and make)
color_verb -> "color" {% id %}
    | "fill" {% id %}
    | "make" {% id %}

# Resize verb (handles resize and make)
resize_verb -> "resize" {% id %}
    | "make" {% id %}

# Draw object phrases (no direction)
draw_object_phrase -> fillers _ shape  {% ([, , shape]) => ({ type: 'shape', value: shape }) %}
    | fillers _ color _ shape  {% ([, , color, , shape]) => ({ type: 'shape', value: shape, color: color }) %}

# Move object phrases (with direction, no color allowed)
# Using optional_fillers to simulate <fillers>? pattern
move_object_phrase -> pronoun_or_shape optional_fillers _ direction  {% ([obj, , , direction]) => ({ ...obj, direction: direction }) %}
    | pronoun_or_shape optional_fillers _ direction _ number  {% ([obj, , , direction, , number]) => ({ ...obj, direction: direction, distance: number }) %}
    | pronoun_or_shape optional_fillers _ direction _ number _ unit  {% ([obj, , , direction, , number, , unit]) => ({ ...obj, direction: direction, distance: number, unit: unit }) %}
    | pronoun_or_shape optional_fillers _ number optional_fillers _ direction  {% ([obj, , , number, , , direction]) => ({ ...obj, direction: direction, distance: number }) %}
    | pronoun_or_shape optional_fillers _ number _ unit optional_fillers _ direction  {% ([obj, , , number, , unit, , , direction]) => ({ ...obj, direction: direction, distance: number, unit: unit }) %}

# Delete object phrases (simple shape reference, no color needed)
delete_object_phrase -> pronoun_or_shape  {% ([obj]) => obj %}

# Color object phrases (shape and target color)
color_object_phrase -> pronoun_or_shape optional_fillers _ color  {% ([obj, , , color]) => ({ ...obj, color: color }) %}

# Resize object phrases (shape and size modifier or size relation)
resize_object_phrase -> pronoun_or_shape optional_fillers _ size_modifier  {% ([obj, , , modifier]) => ({ ...obj, sizeModifier: modifier }) %}
    | pronoun_or_shape optional_fillers _ "same" _ "size" _ "as" optional_fillers _ shape  {% ([obj, , , , , , , , , , shape]) => ({ ...obj, sizeRelation: 'same_size_as', targetShape: shape }) %}

# Optional fillers (can be empty or contain fillers)
optional_fillers -> null {% () => null %}
    | _ fillers {% () => null %}

# Fillers (one or more)
fillers -> filler {% () => null %}
    | fillers _ filler {% () => null %}

# Individual filler words
filler -> "a" {% id %}
    | "an" {% id %}
    | "the" {% id %}
    | "to" {% id %}
    | "with" {% id %}

# Pronoun and shape rules
the_shape -> fillers _ shape {% ([, , shape]) => ({ type: 'shape', value: shape }) %}

pronoun -> "it" {% () => ({ type: 'pronoun', value: 'it' }) %}

pronoun_or_shape -> the_shape {% id %}
    | pronoun {% id %}

# Shapes
shape -> "square" {% id %}
    | "circle" {% id %}
    | "triangle" {% id %}

# Colors
color -> "red" {% id %}
    | "blue" {% id %}
    | "green" {% id %}
    | "yellow" {% id %}
    | "purple" {% id %}
    | "orange" {% id %}
    | "black" {% id %}
    | "white" {% id %}
    | "pink" {% id %}
    | "brown" {% id %}
    | "gray" {% id %}
    | "grey" {% id %}

# Directions
direction -> "up" {% id %}
    | "down" {% id %}
    | "left" {% id %}
    | "right" {% id %}

# Numbers (simple integer support for now)
number -> [1-9] [0-9]:* {% (d) => parseInt(d[0] + d[1].join('')) %}

# Size modifiers
size_modifier -> "bigger" {% id %}
    | "smaller" {% id %}
    | "larger" {% id %}
    | "much" _ "bigger" {% () => "much bigger" %}
    | "much" _ "smaller" {% () => "much smaller" %}
    | "a" _ "little" _ "bigger" {% () => "a little bigger" %}
    | "a" _ "little" _ "smaller" {% () => "a little smaller" %}

# Units
unit -> "pixels" {% id %}

# Whitespace
_ -> [\s]:*  {% () => null %}