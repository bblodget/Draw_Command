# Session Refresh Command

This command is designed to be run after the `/compact` command when the context gets too long. It refreshes the session by reviewing key documentation and the current session log.

## Purpose

After context compaction, this command ensures that Claude has access to the most important project information by reviewing:
- Development workflow documentation
- Project plan
- Current session log

## Command

```
Before we begin after the context has been compacted, please review the following key documents to refresh our session context:

1. **Development Workflow** - Please read and understand `docs/development-workflow.md` to refresh your knowledge of our development processes and conventions.

2. **Project Plan** - Please review `docs/plan.md` to understand our current project goals, milestones, and overall direction.

3. **Current Session Log** - Please read `.claude/sessions/.current-session` to understand what we've been working on in this session and where we left off.

After reviewing these documents, please provide a brief summary of:
- The current state of the project based on the plan
- Any active development tasks or issues we were working on
- The development workflow we should follow for continued work

This will help us continue seamlessly after the context compaction.
```

## Usage

Run this command after using `/compact` when the context becomes too long. This ensures Claude maintains awareness of the project's current state and can continue development work effectively.
