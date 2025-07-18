# Development Workflow

## Overview

This document outlines our collaborative development process using session-based development with structured todo lists and task-by-task approval to maintain a stable main branch while implementing new features safely for the Draw Command project.

## Starting a New Project

When starting a new project, follow this structured approach to set up the development framework and documentation:

### 1. Copy Project Framework

Copy over the starting project framework which includes:
- `.claude/commands/session-*.md` - Session management commands
- `.claude/sessions/.current-session` - Current session tracking file
- `docs/development-workflow.md` - This workflow documentation

### 2. Create Core Documentation

**docs/requirements.md**
- Lists project requirements without specifying implementation details
- Tech stack agnostic - focuses on what the system should do, not how
- Defines functional and non-functional requirements
- Serves as the foundation for all other planning documents

**docs/specification.md**
- Specifies the technical implementation approach
- Defines the tech stack and architecture decisions
- Explains how requirements will be implemented
- Bridges requirements to implementation details

**docs/plan.md**
- Development plan broken into phases, tasks, and steps
- **Phases**: Major development milestones (e.g., "Core Functionality", "Advanced Features")
- **Tasks**: Specific work items within phases (e.g., "Task 1.4: Attention Word Detection")
- **Steps**: Detailed implementation steps within tasks
- Sessions typically work at the **Task level** of granularity
- Provides clear roadmap for development progress

### 3. Development Flow

1. **Requirements** → Define what the system should do
2. **Specification** → Define how to implement it
3. **Plan** → Break work into manageable tasks
4. **Sessions** → Implement tasks using this workflow
5. **Documentation** → Keep all docs updated as work progresses

### Core Principles

1. **Main branch stability** - The main branch should always be in a working state
2. **Session-based development** - All work is organized into tracked development sessions
3. **Feature isolation** - New features are developed in dedicated branches
4. **Task-by-task approval** - Each task is tested and approved before committing
5. **Collaborative approval** - Features are merged only after user approval

### 1. Session Start

**Starting a new development session:**

```bash
# Start a new session with a specific goal (normally a Task from plan.md)
/session-start "Task 1.4: Attention Word Detection"

# Or start a PR review session
/session-start-pr 123 "Review attention word detection implementation"
```

**Session Setup Process:**
1. **Goal Agreement** - Define clear, specific goals for the session (typically based on plan.md tasks)
2. **Todo List Creation** - Break the goal into bite-sized, manageable tasks
3. **Feature Branch Creation** - Automatically creates a feature branch for the session
4. **Session Documentation** - Creates a session file to track progress

**Example Session Start:**
```
User: "/session-start Task 1.4: Attention Word Detection"

Claude: 
1. Creates feature branch: feature-attention-word-detection
2. Agrees on goal with user: "Implement 'computer' and 'please' detection system to buffer speech and extract complete command phrases" (from plan.md)
3. Creates todo list:
   - [ ] Create attention word detection logic
   - [ ] Buffer speech between "computer" and "please"
   - [ ] Extract complete command phrases
   - [ ] Add visual feedback for attention word detection
   - [ ] Handle partial commands and timeouts
   - [ ] Test with various speech patterns
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
git commit -m "Add attention word detection integration

🤖 Generated with Claude Code
Task: Set up attention word detection system

Co-Authored-By: Claude <noreply@anthropic.com>"
```

**Phase 5: Session Update**
- **User initiates session update** with `/session-update` or `/session-update commit`
- Claude automatically generates comprehensive session update including:
  - Current timestamp (from `date` command)
  - Automatic summary of recent activities
  - Workflow status (Implementation/Testing/Commit Ready/Merge Ready)
  - Git status summary (files changed, current branch, last commit)
  - Todo list progress (completed/in-progress/pending tasks)
  - Testing feedback and approval status
  - Any issues encountered and solutions implemented
- If user includes "commit" in command, Claude also commits recent changes
- If user includes custom note, it's added to the session update

### 3. Session Management

**Session Commands:**
```bash
# Check current session status
/session-current

# Update session with progress (user initiates)
/session-update
/session-update commit
/session-update "custom note"
/session-update commit "custom note"

# List all sessions
/session-list

# End session when all tasks complete
/session-end
```

**Session Update Usage:**
```
User: "/session-update"
User: "/session-update commit"
User: "/session-update 'Completed attention word detection logic'"
User: "/session-update commit 'User approved implementation, ready to commit'"
```

**Session Update Format (Auto-generated by Claude):**
```
# First run date command to get current time
date

### Update - 2025-07-18 8:21 AM

**Workflow Phase:** Testing
**Feature Branch:** feature-attention-word-detection
**Status:** Changes uncommitted, awaiting user testing

**Summary**: Implemented speech buffering between "computer" and "please"

**Git Changes**:
- Modified: src/components/VoiceInterface/AttentionWordDetector.tsx
- Added: src/services/attentionWordService.ts
- Current branch: feature-attention-word-detection (commit: abc123)
- **Workflow Status:** ✅ Uncommitted changes ready for testing

**Todo Progress**: 2 completed, 1 in progress, 4 pending
- ✓ Completed: Create attention word detection logic
- ✓ Completed: Buffer speech between "computer" and "please"
- 🔄 In Progress: User testing phase

**Testing Status**: Awaiting user feedback on attention word detection functionality
**Details**: System now recognizes "computer" as trigger and buffers speech until "please" is detected
```

### 4. Session Completion

**When all tasks are complete:**

**User:** `/session-end`

**Claude automatically:**
1. **Generates comprehensive session summary** including:
   - Session duration
   - Feature branch name and final status
   - Git summary (files changed, commits made, final status)
   - Todo summary (completed/remaining tasks)
   - Key accomplishments and features implemented
   - Problems encountered and solutions
   - Lessons learned and tips for future developers

2. **Completes workflow:**
   - If changes are committed but not merged, offers to merge to main
   - Merges feature branch to main
   - Deletes the feature branch
   - Switches back to main branch
   - Documents the final merge commit
   - **Updates plan.md** to reflect completed tasks and current progress

3. **Cleans up session tracking**
   - Empties the current session file
   - Confirms session has been documented and workflow completed

**Alternative: Session Abort**
**User:** `/session-end abort`
- Documents that session was aborted (no merge)
- Commits session log to feature branch
- Switches back to main branch
- Cherry-picks session log commit to main (preserves documentation without feature code)
- Deletes feature branch without merging

**Final Commit Example:**
```bash
git commit -m "Complete attention word detection implementation

🤖 Generated with Claude Code
Session: Task 1.4: Attention Word Detection

- Created attention word detection logic
- Buffer speech between "computer" and "please"
- Extract complete command phrases
- Add visual feedback for attention word detection
- Handle partial commands and timeouts
- Test with various speech patterns

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
User: "/session-start Task 1.4: Attention Word Detection" (from plan.md)

Claude: 
1. Creates feature branch: feature-attention-word-detection
2. Agrees on goal and creates todo list
3. Proposes first task: "Create attention word detection logic"
```

User: "Go ahead with the first task"

Claude:
1. Implements attention word detection logic
2. Self-tests the implementation
3. Asks: "Please test the attention word detection logic"

User: "Logic works, ready to commit"

Claude:
1. Commits the changes
2. User: "/session-update commit 'Completed attention word detection logic'"
3. Proposes next task: "Buffer speech between 'computer' and 'please'"

[Continue through all tasks...]

User: "/session-end"

Claude:
1. Generates comprehensive session summary
2. Merges feature branch to main
3. Deletes feature branch
4. Updates plan.md with completed tasks
5. Confirms session completion
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
- **Start sessions** with `/session-start` using Tasks from plan.md
- **Approve each task** before Claude begins work
- **Test thoroughly** before approving commits
- **Test voice commands in different browsers**
- **Provide clear feedback** on issues found
- **Give explicit approval** before merge ("Looks good!", "Ready to merge")
- **Don't hesitate to request changes** or improvements
- **Use session commands** to track progress
- **Initiate session updates** with `/session-update` or `/session-update commit`
- **Add custom notes** to session updates when needed
- **End sessions** with `/session-end` when all tasks complete
- **Abort sessions** with `/session-end abort` if needed

## Emergency Procedures

### If Session Needs to be Abandoned
```bash
# End the session early without merging
/session-end abort

# Claude automatically:
# - Documents session was aborted
# - Commits session log to feature branch
# - Switches back to main branch
# - Cherry-picks session log to main (preserves documentation)
# - Deletes feature branch without merging
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