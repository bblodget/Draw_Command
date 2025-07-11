# Voice Commands Grammar - Phase 1, Step 1.1
# Goal: Parse "computer draw a [shape] please" and "computer clear please"
# Supports: square, circle, triangle

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

# Fillers
filler -> "a" {% id %}

# Shapes
shape -> "square" {% id %}
    | "circle" {% id %}
    | "triangle" {% id %}

# Whitespace
_ -> [\s]:*  {% () => null %}