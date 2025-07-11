# Voice Commands Grammar - Minimal Version
# Goal: Parse "computer draw a square please" and "computer clear please"

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

# Whitespace
_ -> [\s]:*  {% () => null %}