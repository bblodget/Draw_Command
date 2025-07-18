# Development Workflow

## Overview

This document outlines our collaborative development process using session-based development with structured todo lists and task-by-task approval to maintain a stable main branch while implementing new features safely for the Speech-to-Drawing Demo project.

## Core Principles

1. **Main branch stability** - The main branch should always be in a working state
2. **Session-based development** - All work is organized into tracked development sessions
3. **Feature isolation** - New features are developed in dedicated branches
4. **Task-by-task approval** - Each task is tested and approved before committing
5. **Collaborative approval** - Features are merged only after user approval

## Session-Based Workflow

### 1. Session Start

**Starting a new development session:**

```bash
# Start a new session with a specific goal
/project:session-start "Add physics engine to robot simulation"

# Or start a PR review session
/project:session-start-pr 123 "Review physics engine implementation"
```

**Session Setup Process:**
1. **Goal Agreement** - Define clear, specific goals for the session
2. **Todo List Creation** - Break the goal into bite-sized, manageable tasks
3. **Feature Branch Creation** - Automatically creates a feature branch for the session
4. **Session Documentation** - Creates a session file to track progress

**Example Session Start:**
```
User: "Let's implement basic voice recognition for the speech-to-drawing demo"

Claude: 
1. Starts session: /project:session-start "Implement basic voice recognition"
2. Creates feature branch: feature-basic-voice-recognition
3. Agrees on goal: "Implement Web Speech API integration for real-time speech-to-text functionality"
4. Creates todo list:
   - [ ] Create VoiceInterface component
   - [ ] Implement Web Speech API integration
   - [ ] Add microphone permission handling
   - [ ] Display real-time speech transcription
   - [ ] Add start/stop voice recognition controls
   - [ ] Handle speech recognition errors
   - [ ] Test with different browsers
```

### 2. Task Execution Cycle

**For each task in the todo list:**

**Phase 1: Task Approval**
- Claude proposes the next task to work on
- User approves: "Go ahead with task X" or "Let's work on task Y first"
- Claude confirms and begins implementation

**Phase 2: Implementation**
- Claude implements the task
- Makes code modifications
- Does NOT commit changes initially
- Performs self-review and testing to the best of ability

**Phase 3: User Testing**
- Claude asks user to test the implementation
- User tests and provides feedback:
  - ✅ **Approved:** "Looks good!" or "Ready to commit"
  - ❌ **Needs changes:** "Fix X issue" or "Y doesn't work as expected"
  - 🔄 **More testing needed:** "Let me test this more thoroughly"

**Phase 4: Commit (Only after approval)**
```bash
# Add relevant files to staging
git add <modified-files>

# Create descriptive commit message
git commit -m "Add physics engine integration

🤖 Generated with Claude Code
Task: Set up physics engine library integration

Co-Authored-By: Claude <noreply@anthropic.com>"
```

**Phase 5: Session Update**
- Claude updates the session with progress
- Marks task as completed in todo list
- Documents any issues encountered and solutions
- **Uses `date` command to get accurate timestamps**: Always run `date` to get current time rather than estimating

### 3. Session Management

**Session Commands:**
```bash
# Check current session status
/project:session-current

# Update session with progress
/project:session-update "Completed physics engine integration, moving to collision detection"

# List all sessions
/project:session-list

# End session when all tasks complete
/project:session-end
```

**Session Update Format:**
```
# Get current date and time first
date

### Update - 2025-07-18 8:21 AM

**Workflow Phase:** Testing
**Feature Branch:** feature-basic-voice-recognition
**Status:** Task 2 completed, ready for user testing

**Summary**: Implemented Web Speech API integration

**Git Changes**:
- Modified: src/components/VoiceInterface/SpeechRecognition.tsx
- Added: src/services/voiceService.ts
- Current branch: feature-basic-voice-recognition (commit: abc123)
- **Workflow Status:** ✅ Task completed, awaiting user testing

**Todo Progress**: 2 completed, 1 in progress, 4 pending
- ✓ Completed: Create VoiceInterface component
- ✓ Completed: Implement Web Speech API integration
- 🔄 In Progress: User testing phase

**Testing Status**: Awaiting user feedback on speech recognition functionality
**Details**: Speech recognition now works with microphone permissions and real-time transcription
```

### 4. Session Completion

**When all tasks are complete:**

**User:** "All tasks look good, let's finish the session"

**Claude:**
1. Calls `/project:session-end`
2. Creates final commit with session summary
3. Merges feature branch to main
4. Cleans up feature branch
5. Documents session completion

**Final Commit Example:**
```bash
git commit -m "Complete basic voice recognition implementation

🤖 Generated with Claude Code
Session: Implement basic voice recognition

- Created VoiceInterface component
- Implemented Web Speech API integration
- Added microphone permission handling
- Display real-time speech transcription
- Added start/stop voice recognition controls
- Handled speech recognition errors
- Tested with different browsers

All tasks completed and tested successfully.

Co-Authored-By: Claude <noreply@anthropic.com>"
```

## Branch Naming Convention

**Feature Branches:**
- `feature-*` for new features (auto-generated from session name)
- `fix-*` for bug fixes
- `improve-*` for enhancements
- `refactor-*` for code reorganization

**PR Review Branches:**
- `pr-*` for pull request review sessions

## Example Complete Workflow

```
User: "Let's implement basic voice recognition for the speech-to-drawing demo"

Claude: 
1. /project:session-start "Implement basic voice recognition"
2. Creates feature branch: feature-basic-voice-recognition
3. Agrees on goal and creates todo list
4. Proposes first task: "Create VoiceInterface component"

User: "Go ahead with the first task"

Claude:
1. Implements VoiceInterface component
2. Self-tests the implementation
3. Asks: "Please test the VoiceInterface component"

User: "Component works, ready to commit"

Claude:
1. Commits the changes
2. /project:session-update "Completed VoiceInterface component"
3. Proposes next task: "Implement Web Speech API integration"

[Continue through all tasks...]

User: "All tasks look good, let's finish the session"

Claude:
1. /project:session-end
2. Creates final commit
3. Merges to main: git checkout main && git merge feature-basic-voice-recognition
4. Cleans up: git branch -d feature-basic-voice-recognition
```

## Benefits

✅ **Stable main branch** - Never broken by untested code  
✅ **Session tracking** - Complete history of all development work  
✅ **Task granularity** - Small, manageable tasks with individual approval  
✅ **Quality assurance** - Each task is tested before committing  
✅ **Clear progress** - Always know what's done and what's next  
✅ **Safe experimentation** - Features can be abandoned without affecting main  
✅ **Easy rollback** - Individual tasks can be reverted if needed  

## Important Notes

### For Developer (Claude)
- **Always start with session commands** for new work
- **Wait for task approval** before beginning implementation
- **Never commit before user testing**
- **Update sessions regularly** with progress
- **Always create feature branches** for new work
- **Don't merge without explicit user approval**
- **Keep commits focused and descriptive**
- **Test voice recognition in multiple browsers**
- **Verify canvas functionality after each change**

### For User
- **Approve each task** before Claude begins work
- **Test thoroughly** before approving commits
- **Test voice commands in different browsers**
- **Provide clear feedback** on issues found
- **Give explicit approval** before merge ("Looks good!", "Ready to merge")
- **Don't hesitate to request changes** or improvements
- **Use session commands** to track progress

## Emergency Procedures

### If Session Needs to be Abandoned
```bash
# End the session early
/project:session-end

# Switch back to main
git checkout main

# Delete problematic branch
git branch -D feature-name
```

### If Main Branch Gets Broken
```bash
# Revert to last known good commit
git revert <commit-hash>

# Or reset to previous commit (more aggressive)
git reset --hard HEAD~1
```

## Documentation Updates

When implementing features:
1. Update relevant documentation files
2. Add new documentation if needed
3. Keep docs in sync with code changes
4. Document any new workflows or processes
5. Update session files with documentation changes
6. Update requirements.md if new requirements are discovered
7. Update specification.md if technical decisions change

## Project-Specific Considerations

### Voice Recognition Testing
- Test in Chrome, Firefox, Safari, and Edge
- Verify microphone permissions work correctly
- Test with different speech patterns and accents
- Ensure fallback mechanisms work when speech is unclear

### Canvas Testing
- Verify shapes render correctly
- Test shape manipulation (move, resize, color change)
- Ensure canvas is responsive on different screen sizes
- Test with multiple shapes on screen

### AI Integration Testing
- Verify OpenAI API calls work correctly
- Test natural language command parsing
- Ensure API keys are secure and not exposed
- Test error handling for API failures

---

*This workflow ensures high code quality, maintains a stable development environment, and provides complete tracking of all development work for the Draw Command project.*