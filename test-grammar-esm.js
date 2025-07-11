import * as nearley from 'nearley';
import grammar from './src/grammar/voice-commands.js';

// Test the grammar with various commands
function testGrammar() {
  console.log('Testing Voice Commands Grammar...\n');
  console.log('Nearley object:', nearley);
  console.log('Grammar object:', grammar);

  const testCases = [
    // Minimal test cases for our simple grammar
    'computer draw a square please',
    'computer clear please',
  ];

  let passedCount = 0;
  let failedCount = 0;

  testCases.forEach((testCase, index) => {
    console.log(`Test ${index + 1}: "${testCase}"`);
    
    try {
      const parser = new nearley.default.Parser(nearley.default.Grammar.fromCompiled(grammar));
      parser.feed(testCase);
      
      if (parser.results.length > 0) {
        console.log('✅ PASSED');
        const result = parser.results[0];
        console.log('Result:', JSON.stringify(result, null, 2));
        passedCount++;
      } else {
        console.log('❌ FAILED - No parse results');
        failedCount++;
      }
    } catch (error) {
      console.log('❌ FAILED - Parse error:', error.message);
      failedCount++;
    }
    
    console.log('---\n');
  });

  console.log(`\nSummary: ${passedCount} passed, ${failedCount} failed out of ${testCases.length} tests`);
  
  if (failedCount === 0) {
    console.log('🎉 All tests passed!');
  } else {
    console.log('⚠️  Some tests failed - grammar needs refinement');
  }
}

testGrammar();