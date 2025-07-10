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

**Coding Guidelines:**
- **Best Practices:** Follow language-specific and industry best practices
- **DRY Principle:** Avoid code duplication - extract common functionality into reusable functions/classes
- **Clean Interfaces:** Design clear, intuitive APIs and interfaces with minimal coupling
- **Simplicity First:** Prefer simple, readable solutions over complex implementations
- **Documentation:** Document code as we go - comments, docstrings, and README updates
- **Refactoring Awareness:** Identify and report potential refactoring opportunities to the user
- **Error Handling:** Implement proper error handling and validation
- **Performance:** Consider performance implications and optimize when necessary
- **Code Style:** Follow consistent formatting and naming conventions
- **Security:** Consider security implications, especially for user input and data handling
- **Accessibility:** Ensure code supports accessibility standards where applicable

After creating the file, create or update `.claude/sessions/.current-session` to track the active session filename.

Confirm the session has started and remind the user they can:
- Update it with `/project:session-update`
- End it with `/project:session-end`
- Follow the development workflow: implement → test → commit → merge