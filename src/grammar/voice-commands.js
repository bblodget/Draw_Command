// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "main$string$1", "symbols": [{"literal":"c"}, {"literal":"o"}, {"literal":"m"}, {"literal":"p"}, {"literal":"u"}, {"literal":"t"}, {"literal":"e"}, {"literal":"r"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "main$string$2", "symbols": [{"literal":"p"}, {"literal":"l"}, {"literal":"e"}, {"literal":"a"}, {"literal":"s"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "main", "symbols": ["main$string$1", "_", "command", "_", "main$string$2"], "postprocess": ([,, cmd]) => cmd},
    {"name": "command", "symbols": ["verb"], "postprocess":  (d) => ({
            verb: d[0],
            object: null
        }) },
    {"name": "command", "symbols": ["verb", "_", "object_phrase"], "postprocess":  (d) => ({
            verb: d[0],
            object: d[2]
        }) },
    {"name": "verb$string$1", "symbols": [{"literal":"d"}, {"literal":"r"}, {"literal":"a"}, {"literal":"w"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "verb", "symbols": ["verb$string$1"], "postprocess": id},
    {"name": "verb$string$2", "symbols": [{"literal":"c"}, {"literal":"l"}, {"literal":"e"}, {"literal":"a"}, {"literal":"r"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "verb", "symbols": ["verb$string$2"], "postprocess": id},
    {"name": "object_phrase", "symbols": ["filler", "_", "shape"], "postprocess": ([, , shape]) => ({ type: 'shape', value: shape })},
    {"name": "object_phrase", "symbols": ["filler", "_", "color", "_", "shape"], "postprocess": ([, , color, , shape]) => ({ type: 'shape', value: shape, color: color })},
    {"name": "filler", "symbols": [{"literal":"a"}], "postprocess": id},
    {"name": "filler$string$1", "symbols": [{"literal":"a"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "filler", "symbols": ["filler$string$1"], "postprocess": id},
    {"name": "filler$string$2", "symbols": [{"literal":"t"}, {"literal":"h"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "filler", "symbols": ["filler$string$2"], "postprocess": id},
    {"name": "shape$string$1", "symbols": [{"literal":"s"}, {"literal":"q"}, {"literal":"u"}, {"literal":"a"}, {"literal":"r"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "shape", "symbols": ["shape$string$1"], "postprocess": id},
    {"name": "shape$string$2", "symbols": [{"literal":"c"}, {"literal":"i"}, {"literal":"r"}, {"literal":"c"}, {"literal":"l"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "shape", "symbols": ["shape$string$2"], "postprocess": id},
    {"name": "shape$string$3", "symbols": [{"literal":"t"}, {"literal":"r"}, {"literal":"i"}, {"literal":"a"}, {"literal":"n"}, {"literal":"g"}, {"literal":"l"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "shape", "symbols": ["shape$string$3"], "postprocess": id},
    {"name": "color$string$1", "symbols": [{"literal":"r"}, {"literal":"e"}, {"literal":"d"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "color", "symbols": ["color$string$1"], "postprocess": id},
    {"name": "color$string$2", "symbols": [{"literal":"b"}, {"literal":"l"}, {"literal":"u"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "color", "symbols": ["color$string$2"], "postprocess": id},
    {"name": "color$string$3", "symbols": [{"literal":"g"}, {"literal":"r"}, {"literal":"e"}, {"literal":"e"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "color", "symbols": ["color$string$3"], "postprocess": id},
    {"name": "color$string$4", "symbols": [{"literal":"y"}, {"literal":"e"}, {"literal":"l"}, {"literal":"l"}, {"literal":"o"}, {"literal":"w"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "color", "symbols": ["color$string$4"], "postprocess": id},
    {"name": "color$string$5", "symbols": [{"literal":"p"}, {"literal":"u"}, {"literal":"r"}, {"literal":"p"}, {"literal":"l"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "color", "symbols": ["color$string$5"], "postprocess": id},
    {"name": "color$string$6", "symbols": [{"literal":"o"}, {"literal":"r"}, {"literal":"a"}, {"literal":"n"}, {"literal":"g"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "color", "symbols": ["color$string$6"], "postprocess": id},
    {"name": "color$string$7", "symbols": [{"literal":"b"}, {"literal":"l"}, {"literal":"a"}, {"literal":"c"}, {"literal":"k"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "color", "symbols": ["color$string$7"], "postprocess": id},
    {"name": "color$string$8", "symbols": [{"literal":"w"}, {"literal":"h"}, {"literal":"i"}, {"literal":"t"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "color", "symbols": ["color$string$8"], "postprocess": id},
    {"name": "color$string$9", "symbols": [{"literal":"p"}, {"literal":"i"}, {"literal":"n"}, {"literal":"k"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "color", "symbols": ["color$string$9"], "postprocess": id},
    {"name": "color$string$10", "symbols": [{"literal":"b"}, {"literal":"r"}, {"literal":"o"}, {"literal":"w"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "color", "symbols": ["color$string$10"], "postprocess": id},
    {"name": "color$string$11", "symbols": [{"literal":"g"}, {"literal":"r"}, {"literal":"a"}, {"literal":"y"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "color", "symbols": ["color$string$11"], "postprocess": id},
    {"name": "color$string$12", "symbols": [{"literal":"g"}, {"literal":"r"}, {"literal":"e"}, {"literal":"y"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "color", "symbols": ["color$string$12"], "postprocess": id},
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", /[\s]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": () => null}
]
  , ParserStart: "main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();

export default grammar;
