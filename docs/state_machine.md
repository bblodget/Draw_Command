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
  - Executes command through callback system with duplicate prevention
  - Ignores any new speech input during processing
  - Provides voice response to user
  - **Clears stateTranscript** to prevent duplicate execution
  - **Restarts speech recognition** to clear accumulated results
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
- **EXECUTION**: `stateTranscript` used for command processing, then **cleared** to prevent duplicate execution

### Speech Recognition Session Management
- **Automatic Restart**: After each command execution, speech recognition restarts to clear accumulated results
- **Duplicate Prevention**: Commands are prevented from executing multiple times within cooldown period
- **Session Isolation**: Each new command starts with a fresh speech recognition session

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
Action: Clear stateTranscript, restart speech recognition, keep currentTranscript visible
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
- Speech recognition restart prevents command accumulation

### **Reliable Execution**
- Commands only execute when completely ready
- No premature execution on partial input
- Proper timing with speech recognition finalization
- Duplicate command prevention with cooldown system
- Fresh speech recognition session for each command

### **Maintainable Code**
- Simple state machine logic vs complex accumulation
- Easy to add new states or modify behavior
- Comprehensive logging for debugging

### **Error Prevention**
- No infinite recursion possible
- Clear separation of concerns between states
- Robust handling of edge cases

## Production Implementation

**Note**: The state machine implementation in production does not include debug console logging for performance and clean console output.

### Development Debug Logging (Removed in Production)
During development, the state machine included detailed logging such as:

```javascript
// Example of debug logs that were used during development:
[STATE MACHINE] Current state: IDLE
[STATE MACHINE] IDLE -> CLEAR (found "computer")
[STATE MACHINE] CLEAR -> TRANSCRIPT, initialized: "computer draw a red square"
[STATE MACHINE] TRANSCRIPT -> EXECUTION (found "please" in FINAL text)
[STATE MACHINE] EXECUTION -> IDLE (command processed)
```

### Error Logging (Preserved)
- **Error handling**: `console.error()` for actual failures and exceptions
- **Warnings**: `console.warn()` for invalid commands or missing references
- **Permission issues**: Microphone and speech synthesis errors

### For Development Debugging
If debugging is needed during development, temporarily add console.log statements to:
- **State transitions**: Track state changes and triggers
- **Command processing**: Monitor command extraction and execution
- **Duplicate prevention**: Verify when commands are ignored as duplicates
- **Speech recognition**: Monitor restart and session management
- **Transcript management**: Track stateTranscript clearing and updates

## Implementation File

The state machine is implemented in `/src/services/voice.service.ts` as part of the `VoiceService` class.

Key methods:
- `processStateTransitions()`: Main state machine logic
- `isNewComputerCommand()`: Detects when a new command starts
- `executeCommand()`: Processes commands, prevents duplicates, clears state, and restarts recognition
- `clearTranscript()`: Manual reset to IDLE state
- Auto-restart mechanism via `shouldRestart` flag and `onend` handler

## Advanced Features

### Duplicate Command Prevention
- **Cooldown System**: Commands are prevented from executing multiple times within 2 seconds
- **Command Comparison**: Exact command matching to identify duplicates
- **Logging**: Duplicate attempts are logged for debugging

### Speech Recognition Session Management
- **Automatic Restart**: Recognition restarts after each command to prevent accumulation
- **Session Isolation**: Each command starts fresh without previous session data
- **Timing Control**: 100ms delay between stop and restart to prevent issues

### Enhanced Error Prevention
- **State Transcript Clearing**: Prevents old commands from contaminating new ones
- **Recognition Reset**: Eliminates accumulated speech recognition artifacts
- **Comprehensive Logging**: All state transitions and decisions are logged

## Future Enhancements

Potential improvements to consider:
1. **Timeout handling**: Return to IDLE if stuck in TRANSCRIPT for too long
2. **Error states**: Add error handling states for better recovery
3. **Partial command execution**: Handle commands without "please"
4. **Multi-language support**: Adapt attention/execution words per language
5. **Custom wake words**: Allow configuration of attention word
6. **Configurable cooldown**: Allow adjustment of duplicate prevention timing

This state machine design provides a solid foundation for reliable voice command processing with clear, predictable behavior that users can understand and trust. The enhanced session management and duplicate prevention features ensure robust performance in real-world usage scenarios.