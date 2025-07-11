# Voice Commands Grammar - Phase 2, Step 2.2
# Goal: Parse "computer draw [filler] [color?] [shape] please" and "computer clear please"
# Supports: square, circle, triangle
# Fillers: a, an, the
# Colors: red, blue, green, yellow, purple, orange, black, white, pink, brown, gray, grey

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

# Object phrases
object_phrase -> filler _ shape  {% ([, , shape]) => ({ type: 'shape', value: shape }) %}
    | filler _ color _ shape  {% ([, , color, , shape]) => ({ type: 'shape', value: shape, color: color }) %}

# Fillers
filler -> "a" {% id %}
    | "an" {% id %}
    | "the" {% id %}

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

# Whitespace
_ -> [\s]:*  {% () => null %}