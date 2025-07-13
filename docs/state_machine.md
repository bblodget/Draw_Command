# State Machine for Voice Command Transcript Management

## Overview

The voice command system uses a 4-state finite state machine to manage transcript accumulation and command execution. This replaces the previous complex accumulation logic with a clean, predictable approach that eliminates transcript continuity issues.

## State Definitions

### **IDLE State**
- **Purpose**: Waiting for the attention word "computer"
- **Behavior**: 
  - Ignores all speech input except "computer"
  - Transcript display remains empty or shows previous completed command
  - No accumulation occurs
- **Transition**: When "computer" is detected → **CLEAR**

### **CLEAR State** 
- **Purpose**: Reset and initialize for new command
- **Behavior**:
  - Clears any previous transcript data
  - Initializes `stateTranscript` with text starting from last "computer"
  - Checks if command is already complete (contains "please")
- **Transitions**: 
  - If command complete (has "please") → **EXECUTION**
  - If command incomplete → **TRANSCRIPT**

### **TRANSCRIPT State**
- **Purpose**: Accumulate command text until execution trigger
- **Behavior**:
  - Continuously updates `stateTranscript` with latest speech recognition results
  - Displays accumulated transcript to user in real-time
  - Monitors for "please" keyword in **final** speech recognition results
  - Watches for new "computer" that might indicate a separate command
- **Transitions**:
  - When "please" detected in final text → **EXECUTION**
  - When new separate "computer" detected → **CLEAR**

### **EXECUTION State**
- **Purpose**: Process command and provide response
- **Behavior**:
  - Extracts command from accumulated transcript
  - Executes command through callback system
  - Ignores any new speech input during processing
  - Provides voice response to user
- **Transition**: After command completion → **IDLE**

## State Flow Diagram

```
  ┌─────────┐    "computer"    ┌─────────┐    immediate    ┌─────────────┐
  │  IDLE   │ ──────────────→  │  CLEAR  │ ──────────────→ │ TRANSCRIPT  │
  │         │                  │         │                 │             │
  └─────────┘                  └─────────┘                 └─────────────┘
       ↑                             ↑                            │
       │                             │                            │
       │ command complete            │ new "computer"    "please" │
       │                             └────────────────────────────│
       │                                                 in final │
       │                       ┌─────────────┐           text    │
       └───────────────────────│ EXECUTION   │←──────────────────┘
                               │             │
                               └─────────────┘
```

## Key Implementation Details

### Event-Driven Processing
- Each speech recognition event processes **one state transition**
- No recursive calls or while loops that could cause infinite recursion
- State changes happen between speech recognition events, not within them

### Speech Recognition Integration
- **All Text**: Complete text from entire speech recognition session
- **Final Text**: Only finalized (not interim) speech recognition results  
- **Interim Text**: Live, in-progress speech recognition (used for display only)

### Execution Criteria
Commands only execute when **all** conditions are met:
1. Currently in **TRANSCRIPT** state
2. "please" detected in speech recognition text
3. "please" appears in **final** text (not just interim)
4. `finalText.length > 0` (ensures speech recognition has finalized)

### New Command Detection
The system detects separate commands using heuristics:
- Multiple "computer" instances in the text
- Multiple "please" instances (suggesting completed + new command)
- Patterns suggesting a new command has started

### Transcript Management
- **IDLE**: `stateTranscript` unchanged (preserves last completed command for user reference)
- **CLEAR**: `stateTranscript = allText` (clears and resets with new speech recognition)
- **TRANSCRIPT**: `stateTranscript = allText` (continuously updated with latest speech)
- **EXECUTION**: `stateTranscript` preserved for command processing, remains visible after return to IDLE

## Example Flow

**User says**: "Computer draw a red square please"

```
Speech Event 1: "Computer"
State: IDLE → CLEAR
Action: Reset transcript, initialize with "Computer"

Speech Event 2: "Computer dr"  
State: CLEAR → TRANSCRIPT
Action: Update transcript to "Computer dr", display to user

Speech Event 3: "Computer draw a"
State: TRANSCRIPT (no change)
Action: Update transcript to "Computer draw a", display to user

Speech Event 4: "Computer draw a red square please" (FINAL)
State: TRANSCRIPT → EXECUTION  
Action: Execute command "Computer draw a red square please"

After Command Completion:
State: EXECUTION → IDLE
Action: Keep transcript visible
```

## Benefits of State Machine Approach

### **Predictable Behavior**
- Clear state transitions with defined triggers
- No complex accumulation logic that could fail
- Easy to debug with state logging

### **Clean Transcript Management**  
- Automatic clearing between commands
- No old commands persisting in transcript
- Clear separation between commands

### **Reliable Execution**
- Commands only execute when completely ready
- No premature execution on partial input
- Proper timing with speech recognition finalization

### **Maintainable Code**
- Simple state machine logic vs complex accumulation
- Easy to add new states or modify behavior
- Comprehensive logging for debugging

### **Error Prevention**
- No infinite recursion possible
- Clear separation of concerns between states
- Robust handling of edge cases

## Debugging with Console Logs

The state machine includes comprehensive logging with the `[STATE MACHINE]` prefix:

```javascript
[STATE MACHINE] Current state: IDLE
[STATE MACHINE] hasComputer: true, hasPlease: false
[STATE MACHINE] finalText: "computer"
[STATE MACHINE] IDLE -> CLEAR (found "computer")
[STATE MACHINE] CLEAR -> TRANSCRIPT, initialized: "computer draw a red square"
[STATE MACHINE] TRANSCRIPT updating: "computer draw a red square please"
[STATE MACHINE] TRANSCRIPT -> EXECUTION (found "please" in FINAL text)
[STATE MACHINE] Executing command: "computer draw a red square please"
[STATE MACHINE] EXECUTION -> IDLE (command processed)
```

## Implementation File

The state machine is implemented in `/src/services/voice.service.ts` as part of the `VoiceService` class.

Key methods:
- `processStateTransitions()`: Main state machine logic
- `isNewComputerCommand()`: Detects when a new command starts
- `executeCommand()`: Processes commands and returns to IDLE
- `clearTranscript()`: Manual reset to IDLE state

## Future Enhancements

Potential improvements to consider:
1. **Timeout handling**: Return to IDLE if stuck in TRANSCRIPT for too long
2. **Error states**: Add error handling states for better recovery
3. **Partial command execution**: Handle commands without "please"
4. **Multi-language support**: Adapt attention/execution words per language
5. **Custom wake words**: Allow configuration of attention word

This state machine design provides a solid foundation for reliable voice command processing with clear, predictable behavior that users can understand and trust.