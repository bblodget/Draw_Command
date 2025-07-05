Start a new development session by creating a session file in `.claude/sessions/` with the format `YYYY-MM-DD-HHMM-$ARGUMENTS.md` (or just `YYYY-MM-DD-HHMM.md` if no name provided).

The session file should begin with:
1. Session name and timestamp as the title
2. Session overview section with start time
3. Goals section (ask user for goals if not clear)
4. Development workflow section tracking branch creation
5. Empty progress section ready for updates

**Development Workflow Integration:**
- Automatically create a feature branch using the session name: `git checkout -b feature-$ARGUMENTS` (or `feature-session-YYYY-MM-DD-HHMM` if no name)
- Document the branch name in the session file
- Remind user that changes will remain uncommitted until testing is complete
- Set up workflow tracking for the session

After creating the file, create or update `.claude/sessions/.current-session` to track the active session filename.

Confirm the session has started and remind the user they can:
- Update it with `/project:session-update`
- End it with `/project:session-end`
- Follow the development workflow: implement → test → commit → merge