// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
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
    {"name": "filler", "symbols": [{"literal":"a"}], "postprocess": id},
    {"name": "shape$string$1", "symbols": [{"literal":"s"}, {"literal":"q"}, {"literal":"u"}, {"literal":"a"}, {"literal":"r"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "shape", "symbols": ["shape$string$1"], "postprocess": id},
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", /[\s]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": () => null}
]
  , ParserStart: "main"
}
export default grammar;
