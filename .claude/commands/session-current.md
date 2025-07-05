Show the current session status by:

1. Check if `.claude/sessions/.current-session` exists
2. If no active session, inform user and suggest starting one
3. If active session exists:
   - Show session name and filename
   - Calculate and show duration since start
   - **Workflow Status:**
     * **For Feature Development:**
       - Current feature branch name
       - Workflow phase (Implementation/Testing/Commit Ready/Merge Ready)
       - Git status (committed/uncommitted changes)
       - Current branch vs main branch
     * **For PR Review:**
       - PR number and branch name
       - Workflow phase (Setup/Testing/Code Review/Edge Cases/Decision)
       - Review progress and current focus
       - Original branch vs PR branch
   - Show last few updates
   - Show current goals/tasks
   - **Workflow Next Steps:**
     * What phase we're in and what's next
     * For feature development: Remind user of testing requirements before commit
     * For PR review: Remind user of testing requirements before approval
   - Remind user of available commands

Keep the output concise and informative.

**Feature Development Phase Indicators:**
- 🔧 **Implementation:** Making code changes
- 🧪 **Testing:** Awaiting user testing and feedback
- ✅ **Commit Ready:** User approved, ready to commit
- 🚀 **Merge Ready:** Committed and ready for merge

**PR Review Phase Indicators:**
- 🔄 **Setup:** Fetching and checking out PR branch
- 🧪 **Testing:** Functional and performance testing
- 📝 **Code Review:** Examining code changes and quality
- 🔍 **Edge Cases:** Testing boundary conditions
- ✅ **Decision:** Approve, request changes, or reject