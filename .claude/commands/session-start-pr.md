Start a new pull request review session by creating a session file in `.claude/sessions/` with the format `YYYY-MM-DD-HHMM-pr-$PR_NUMBER-$ARGUMENTS.md`.

The session file should begin with:
1. Session name and timestamp as the title (e.g., "PR Review #1 - Refactoring Implementation")
2. Session overview section with start time
3. PR details section:
   - PR number and title
   - Branch name
   - Author and description
   - Files changed
4. Review goals section (ask user for specific focus areas if not clear)
5. PR review workflow section tracking the review process
6. Empty progress section ready for updates

**PR Review Workflow Integration:**
- Fetch and checkout the PR branch: `git fetch origin pull/$PR_NUMBER/head:pr-$ARGUMENTS`
- Document the PR branch name and original branch
- Set up review tracking for the session
- Remind user to test thoroughly before approval

After creating the file, create or update `.claude/sessions/.current-session` to track the active session filename.

Confirm the session has started and remind the user they can:
- Update it with `/project:session-update`
- End it with `/project:session-end`
- Follow the PR review workflow: checkout → test → review → approve/reject

**PR Review Phases:**
- 🔄 **Setup:** Fetching and checking out PR branch
- 🧪 **Testing:** Functional and performance testing
- 📝 **Code Review:** Examining code changes and quality
- 🔍 **Edge Cases:** Testing boundary conditions
- ✅ **Decision:** Approve, request changes, or reject 