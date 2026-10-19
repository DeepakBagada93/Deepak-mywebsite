# Playbook: dev

Command: `pnpm run dev`

Run when: Start the local development server for manual verification.

## Procedure
1. Run the command exactly as written, from the repository root.
2. Read the first error, not the last line of output.
3. Fix the cause in source; do not edit the command, config thresholds, or test expectations to pass.
4. Rerun the same command until it exits 0.
5. Record the final command and result in your handoff note.

## Failure handling
- Missing dependency: install with the declared package manager only.
- Environment failure (port in use, missing variable): report it; do not silently stub the code.
- Flaky test: report the test name and evidence; do not retry more than twice.
