End the current development session by:

1. Check `.claude/sessions/.current-session` for the active session
2. If no active session, inform user there's nothing to end
3. If session exists, append a comprehensive summary including:
   - Session duration
   - **Workflow Completion:**
     * **For Feature Development:**
       - Feature branch name and final status
       - Whether changes were committed and merged
       - Branch cleanup status
     * **For PR Review:**
       - PR number and final decision (approve/reject/request changes)
       - Review findings and recommendations
       - Whether PR was merged or needs changes
       - Branch cleanup status
   - Git summary:
     * Total files changed (added/modified/deleted)
     * List all changed files with change type
     * Number of commits made (if any)
     * Final git status
     * **Workflow compliance:** Confirm proper branch usage and process
   - Todo summary:
     * Total tasks completed/remaining
     * List all completed tasks
     * List any incomplete tasks with status
   - Key accomplishments
   - All features implemented or reviewed
   - Problems encountered and solutions
   - Breaking changes or important findings
   - Dependencies added/removed
   - Configuration changes
   - Deployment steps taken
   - Lessons learned
   - What wasn't completed
   - Tips for future developers

4. **Complete Workflow:**
   - **For Feature Development:**
     - If `$ARGUMENTS` contains "abort":
       - Document that session was aborted (no merge)
       - Commit the session log to the feature branch
       - Switch back to main branch
       - Cherry-pick the session log commit to main (preserves documentation without feature code)
       - Delete the feature branch without merging
     - Otherwise (normal completion):
       - If changes are committed but not merged, offer to merge to main
       - If feature branch exists, merge to main and delete the branch
       - Switch back to main branch
       - Document the final merge commit
       - **Update plan.md** to reflect completed tasks and current progress
   - **For PR Review:**
     - Document the final review decision
     - If approved, note that PR can be merged
     - If rejected or needs changes, document specific feedback
     - Switch back to main branch
     - Clean up PR branch if no longer needed

5. Empty the `.claude/sessions/.current-session` file (don't remove it, just clear its contents)
6. Inform user the session has been documented and workflow completed

**Usage:**
- `/session-end` - Complete session normally (merge changes to main)
- `/session-end abort` - End session without merging (document and cleanup only)

The summary should be thorough enough that another developer (or AI) can understand everything that happened without reading the entire session.

**Feature Development Completion Checklist:**
- ✅ Feature implemented and tested
- ✅ Changes committed to feature branch
- ✅ Feature branch merged to main (unless aborted)
- ✅ Feature branch deleted
- ✅ Session documented
- ✅ Back on main branch

**PR Review Completion Checklist:**
- ✅ PR branch checked out and tested
- ✅ Functional testing completed
- ✅ Code review completed
- ✅ Edge cases tested
- ✅ Final decision documented
- ✅ Back on main branch
- ✅ PR branch cleaned up (if needed)