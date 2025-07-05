import type { DrawCommand } from '../types';

export class CommandService {
  parseCommand(text: string): DrawCommand | null {
    // Placeholder for command parsing logic
    // In Phase 1, this will use regex
    // In Phase 2, this will use OpenAI
    console.log('Parsing command:', text);
    return null;
  }
}