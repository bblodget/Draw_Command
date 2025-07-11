import * as nearley from 'nearley';
import grammar from './voice-commands.js';
import type { ParsedCommand } from '../types/grammar';

// Test the grammar with various commands
function testGrammar(): void {
  console.log('Testing Voice Commands Grammar...\n');

  const testCases: string[] = [
    // Basic commands
    'computer, draw a square please.',
    'computer, draw a red circle please.',
    'computer, move the square left please.',
    'computer, make the square bigger please.',
    'computer, color the triangle blue please.',
    'computer, delete the circle please.',
    'computer, clear please.',
    
    // Commands with values
    'computer, move the square up 100 pixels please.',
    'computer, rotate the triangle 45 degrees please.',
    
    // Pronoun references
    'computer, make it bigger please.',
    'computer, move it left please.',
    'computer, color it red please.',
    
    // Complex size relationships (new target commands)
    'computer, make the circle the same size as the triangle please.',
    'computer, make it twice as big as the square please.',
    
    // Spatial relationships (new target commands)
    'computer, move the triangle to the left of the square please.',
    'computer, draw a circle above the triangle please.',
  ];

  let passedCount = 0;
  let failedCount = 0;

  testCases.forEach((testCase, index) => {
    console.log(`Test ${index + 1}: "${testCase}"`);
    
    try {
      const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
      parser.feed(testCase);
      
      if (parser.results.length > 0) {
        console.log('✅ PASSED');
        const result = parser.results[0] as ParsedCommand;
        console.log('Result:', JSON.stringify(result, null, 2));
        passedCount++;
      } else {
        console.log('❌ FAILED - No parse results');
        failedCount++;
      }
    } catch (error) {
      console.log('❌ FAILED - Parse error:', (error as Error).message);
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

// Export for potential use in other modules
export { testGrammar };

// Run the tests if this file is executed directly
if (require.main === module) {
  testGrammar();
}