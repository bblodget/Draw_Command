Update the current development session by:

1. Check if `.claude/sessions/.current-session` exists to find the active session
2. If no active session, inform user to start one with `/project:session-start` or `/project:session-start-pr`
3. **Get current date and time** using `date` command for accurate timestamps
4. If session exists, append to the session file with:
   - Current timestamp (from `date` command output)
   - **Automatic summary of recent activities** (always generated)
   - **Workflow Status:**
     * **For Feature Development:**
       - Current phase: Implementation/Testing/Commit Ready/Merge Ready
       - Feature branch name and status
       - Whether changes are committed or still in testing
     * **For PR Review:**
       - Current phase: Setup/Testing/Code Review/Edge Cases/Decision
       - PR branch name and original branch
       - Review progress and findings
   - Git status summary:
     * Files added/modified/deleted (from `git status --porcelain`)
     * Current branch and last commit
     * **Workflow compliance:** Confirm proper branch usage
   - Todo list status:
     * Number of completed/in-progress/pending tasks
     * List any newly completed tasks
   - Any issues encountered
   - Solutions implemented
   - Code changes made
   - **Testing feedback:** Track user testing results and approval status

4. **Optional Arguments:**
   - If `$ARGUMENTS` contains "commit", also commit recent code changes with the session update
   - If `$ARGUMENTS` contains a quoted string (custom note), include that note in the session update
   - Both can be combined: "commit" + custom note

Keep updates concise but comprehensive for future reference.

**Usage:**
- `/session-update` - Create summary and update session (no commit)
- `/session-update commit` - Create summary, update session, and commit changes
- `/session-update "custom note"` - Create summary, update session with custom note (no commit)
- `/session-update commit "custom note"` - Create summary, update session with custom note, and commit changes

**Feature Development Phases:**
- 🔧 **Implementation:** Code changes being made, uncommitted
- 🧪 **Testing:** User testing phase, changes remain uncommitted
- ✅ **Commit Ready:** User approved, ready to commit changes
- 🚀 **Merge Ready:** Committed and ready for merge to main

**PR Review Phases:**
- 🔄 **Setup:** Fetching and checking out PR branch
- 🧪 **Testing:** Functional and performance testing
- 📝 **Code Review:** Examining code changes and quality
- 🔍 **Edge Cases:** Testing boundary conditions
- ✅ **Decision:** Approve, request changes, or reject

Example format for Feature Development:
```
# First run date command to get current time
date

### Update - 2025-07-18 8:21 AM

**Workflow Phase:** Testing
**Feature Branch:** feature-add-physics-engine
**Status:** Changes uncommitted, awaiting user testing

**Summary**: Implemented physics engine integration

**Git Changes**:
- Modified: src/physics/engine.cpp, include/physics/engine.h
- Added: src/physics/collision.cpp
- Current branch: feature-add-physics-engine (commit: abc123)
- **Workflow Status:** ✅ Uncommitted changes ready for testing

**Todo Progress**: 2 completed, 1 in progress, 1 pending
- ✓ Completed: Physics engine integration
- ✓ Completed: Collision detection system
- 🔄 In Progress: User testing phase

**Testing Status**: Awaiting user feedback on physics implementation
**Details**: [user's update or automatic summary]
```

Example format for PR Review:
```
# First run date command to get current time
date

### Update - 2025-07-18 8:21 AM

**Workflow Phase:** Testing
**PR Branch:** pr-refactor (from main)
**Status:** Functional testing in progress

**Summary**: Testing shape creation and selection functionality

**Git Changes**:
- Current branch: pr-refactor (commit: def456)
- **Workflow Status:** ✅ PR branch checked out, testing phase

**Todo Progress**: 1 completed, 2 in progress, 3 pending
- ✓ Completed: Clean rebuild successful
- 🔄 In Progress: Shape creation testing
- 🔄 In Progress: Selection functionality testing

**Testing Status**: Box and Cylinder creation working, testing Beam creation
**Details**: [user's update or automatic summary]
```