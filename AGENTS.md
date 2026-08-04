# AGENTS.md

Guidance for AI agents and developers working in this repository.

## Project status

**PoliticalGraph** is a greenfield repository ([GitHub description](https://github.com/sameep-speedstar/PoliticalGraph): mapping political ideology on a 3D scale). As of the initial commit, the only tracked file is `README.md`. There is no application source, dependency manifest, CI, or service topology yet.

## Cursor Cloud specific instructions

- **No runnable services:** There is nothing to start (`npm run dev`, Docker Compose, etc.). Do not expect lint, test, or build scripts until the project adds them.
- **Update script:** The VM update step is a no-op (`true`) because this repo has no installable dependencies.
- **When code lands:** Revisit the update script and this section. Typical stacks for a 3D web visualization might include Node (pnpm/npm), a frontend framework, and optionally a small API—but follow whatever manifests and README the repo adds.
- **Git:** Default branch is `main`; remote is `origin` on `github.com/sameep-speedstar/PoliticalGraph`.
- **Validation without an app:** `git status`, presence of `README.md`, and `git log -1` are the only meaningful automated checks today.
