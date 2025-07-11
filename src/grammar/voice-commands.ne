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
object_phrase -> fillers _ shape  {% ([, , shape]) => ({ type: 'shape', value: shape }) %}
    | fillers _ color _ shape  {% ([, , color, , shape]) => ({ type: 'shape', value: shape, color: color }) %}
    | fillers _ shape _ direction  {% ([, , shape, , direction]) => ({ type: 'shape', value: shape, direction: direction }) %}
    | fillers _ color _ shape _ direction  {% ([, , color, , shape, , direction]) => ({ type: 'shape', value: shape, color: color, direction: direction }) %}
    | fillers _ shape _ fillers _ direction  {% (d) => {
        console.log('Grammar debug - fillers_shape_fillers_direction:', d);
        return { type: 'shape', value: d[2], direction: d[6] };
    } %}
    | fillers _ color _ shape _ fillers _ direction  {% ([, , color, , shape, , , direction]) => ({ type: 'shape', value: shape, color: color, direction: direction }) %}

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

# Whitespace
_ -> [\s]:*  {% () => null %}