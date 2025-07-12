# Voice Commands Grammar - Phase 3, Step 3.1
# Goal: Parse "computer [verb] [filler] [color?] [shape] [direction?] please" and "computer clear please"
# Supports: square, circle, triangle
# Fillers: a, an, the
# Colors: red, blue, green, yellow, purple, orange, black, white, pink, brown, gray, grey
# Directions: up, down, left, right

# Main rule
main -> "computer" _ command _ "please"     {% ([,, cmd]) => cmd %}

# Command structure
command -> verb  {% (d) => ({
    verb: d[0],
    object: null
}) %}
    | verb _ object_phrase  {% (d) => ({
    verb: d[0],
    object: d[2]
}) %}

# Verbs
verb -> "draw" {% id %}
    | "clear" {% id %}
    | "move" {% id %}

# Object phrases
object_phrase -> draw_object_phrase {% id %}
    | move_object_phrase {% id %}

# Draw object phrases (no direction)
draw_object_phrase -> fillers _ shape  {% ([, , shape]) => ({ type: 'shape', value: shape }) %}
    | fillers _ color _ shape  {% ([, , color, , shape]) => ({ type: 'shape', value: shape, color: color }) %}

# Move object phrases (with direction, no color allowed)
# Using optional_fillers to simulate <fillers>? pattern
move_object_phrase -> fillers _ shape optional_fillers _ direction  {% ([, , shape, , , direction]) => ({ type: 'shape', value: shape, direction: direction }) %}
    | fillers _ shape optional_fillers _ direction _ number  {% ([, , shape, , , direction, , number]) => ({ type: 'shape', value: shape, direction: direction, distance: number }) %}
    | fillers _ shape optional_fillers _ direction _ number _ unit  {% ([, , shape, , , direction, , number, , unit]) => ({ type: 'shape', value: shape, direction: direction, distance: number, unit: unit }) %}

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

# Units
unit -> "pixels" {% id %}
    | "px" {% id %}

# Whitespace
_ -> [\s]:*  {% () => null %}