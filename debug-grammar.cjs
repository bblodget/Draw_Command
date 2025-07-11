const nearley = require('nearley');
console.log('About to require grammar...');
const grammar = require('./src/grammar/voice-commands');
console.log('Grammar imported successfully');

console.log('Grammar object:', typeof grammar);
console.log('Grammar keys:', Object.keys(grammar));
console.log('Grammar:', grammar);
console.log('ParserRules type:', typeof grammar.ParserRules);
console.log('ParserRules is array:', Array.isArray(grammar.ParserRules));

if (grammar.ParserRules) {
  console.log('ParserRules length:', grammar.ParserRules.length);
  console.log('First rule:', grammar.ParserRules[0]);
}

try {
  const compiledGrammar = nearley.Grammar.fromCompiled(grammar);
  console.log('Grammar compiled successfully');
  
  const parser = new nearley.Parser(compiledGrammar);
  console.log('Parser created successfully');
  
  parser.feed('computer, draw a square please.');
  console.log('Parse results:', parser.results.length);
  
} catch (error) {
  console.error('Error:', error.message);
  console.error('Stack:', error.stack);
}