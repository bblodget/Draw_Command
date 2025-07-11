# Voice Commands Grammar - Phase 1, Step 1.2
# Goal: Parse "computer draw [filler] [shape] please" and "computer clear please"
# Supports: square, circle, triangle
# Fillers: a, an, the

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
    | "an" {% id %}
    | "the" {% id %}

# Shapes
shape -> "square" {% id %}
    | "circle" {% id %}
    | "triangle" {% id %}

# Whitespace
_ -> [\s]:*  {% () => null %}