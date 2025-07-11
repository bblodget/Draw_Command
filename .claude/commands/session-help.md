Show help for the session management system:

## Session Management Commands

The session system helps document development work for future reference and integrates with our established development workflow.

### Available Commands:

- `/project:session-start [name]` - Start a new feature development session
- `/project:session-start-pr [pr_number] [name]` - Start a new PR review session
- `/project:session-update [commit] ["note"]` - Update session with automatic summary (optionally commit changes and/or add custom note)
- `/project:session-end [abort]` - End session with comprehensive summary (optionally abort without merging)
- `/project:session-refresh` - Refresh session context after compaction by reviewing key docs
- `/project:session-list` - List all session files
- `/project:session-current` - Show current session status
- `/project:session-help` - Show this help

### How It Works:

1. Sessions are markdown files in `.claude/sessions/`
2. Files use `YYYY-MM-DD-HHMM-name.md` format for features
3. Files use `YYYY-MM-DD-HHMM-pr-PR_NUMBER-name.md` format for PR reviews
4. Only one session can be active at a time
5. Sessions track progress, issues, solutions, and learnings

### Feature Development Workflow Integration:

**Session Start:**
- Automatically creates feature branch: `feature-[session-name]`
- Tracks workflow phases: Implementation → Testing → Commit → Merge
- Ensures changes remain uncommitted during testing

**Workflow Phases:**
- 🔧 **Implementation:** Making code changes (uncommitted)
- 🧪 **Testing:** User testing phase (uncommitted)
- ✅ **Commit Ready:** User approved, ready to commit
- 🚀 **Merge Ready:** Committed and ready for merge

**Session End:**
- Completes workflow by merging feature branch to main
- Cleans up feature branch
- Documents all changes and learnings
- **Abort option:** Can end session without merging (preserves documentation, discards code)

**Session Updates:**
- **Automatic Summary:** Always generates a comprehensive summary of recent activities
- **Custom Notes:** Can include custom notes with quoted strings (e.g., `"Added grammar plan to docs"`)
- **Commit Integration:** Can optionally commit changes with the update
- **Combined Usage:** Supports both custom notes and commits together

### PR Review Workflow Integration:

**Session Start:**
- Fetches and checks out PR branch: `git fetch origin pull/PR_NUMBER/head:pr-name`
- Tracks review phases: Setup → Testing → Code Review → Edge Cases → Decision
- Documents PR details and review goals

**Review Phases:**
- 🔄 **Setup:** Fetching and checking out PR branch
- 🧪 **Testing:** Functional and performance testing
- 📝 **Code Review:** Examining code changes and quality
- 🔍 **Edge Cases:** Testing boundary conditions
- ✅ **Decision:** Approve, request changes, or reject

**Session End:**
- Documents final review decision and findings
- Switches back to main branch
- Cleans up PR branch if needed
- **Abort option:** Can end session without merging (preserves documentation, discards code)

### Session Refresh Command:

The `/project:session-refresh` command is designed to be used after the `/compact` command when the context becomes too long. It refreshes Claude's understanding of the project by reviewing:

- **Development Workflow** (`docs/development-workflow.md`) - Refreshes knowledge of development processes and conventions
- **Project Plan** (`docs/plan.md`) - Reviews current project goals, milestones, and direction
- **Current Session Log** (`.claude/sessions/.current-session`) - Understands what was being worked on and where the session left off

After reviewing these documents, it provides a summary of the current project state, active development tasks, and the workflow to follow for continued work.

**Usage:** Run after `/compact` to maintain project awareness and continue development seamlessly.

### Best Practices:

- Start a session when beginning significant work
- Use feature sessions for development, PR sessions for reviews
- Update regularly with important changes or findings
- Follow the appropriate workflow: implement → test → commit → merge OR checkout → test → review → decide
- End with thorough summary for future reference
- Review past sessions before starting similar work
- Use session-refresh after context compaction to maintain continuity

### Example Workflows:

**Feature Development:**
```
/project:session-start add-physics-engine
# Creates feature-add-physics-engine branch
# Implements physics engine
/project:session-update "Implemented physics engine integration"
# Automatically summarizes recent activities with custom note
# User tests the implementation
/project:session-update commit "User approved physics implementation"
# Summarizes activities with custom note and commits changes to feature branch
/project:session-end
# Merges to main, deletes feature branch, documents session

# OR if feature doesn't work out:
/project:session-end abort
# Documents session, cherry-picks session log to main, discards feature code
```

**PR Review:**
```
/project:session-start-pr 1 refactor-implementation
# Fetches and checks out PR #1
# Tests the refactored code
/project:session-update
# Automatically summarizes testing progress
# Reviews code quality
/project:session-update
# Summarizes code review findings
# Tests edge cases
/project:session-end
# Documents approval decision, switches back to main
```

### Workflow Compliance:

✅ **Stable main branch** - Never broken by untested code  
✅ **Safe experimentation** - Features can be abandoned without affecting main  
✅ **Quality assurance** - All changes are user-tested before integration  
✅ **Thorough reviews** - PRs are systematically tested and reviewed  
✅ **Clear history** - Each feature and review has its own commit history  
✅ **Easy rollback** - Individual features can be reverted if needed