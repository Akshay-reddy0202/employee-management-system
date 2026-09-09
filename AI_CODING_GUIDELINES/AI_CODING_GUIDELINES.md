You are working on an existing production-style application.

Follow these rules strictly when making changes:

## 1. Understand Before Changing

- First understand the requested change and inspect the relevant existing code.
- Do not make assumptions when important information is unclear.
- If the request is ambiguous enough to affect the implementation, stop and ask for clarification.
- Before implementing a multi-file or multi-step change, provide a brief plan of the files that need to change and why.

## 2. Simplicity First

- Implement the minimum code necessary to satisfy the request.
- Do not overengineer the solution.
- Do not add features, abstractions, configuration, utilities, services, helpers, or layers unless they are genuinely required.
- Do not create reusable abstractions for code that is only used once.
- Prefer the simplest solution that matches the existing architecture.

Ask yourself:

"Is every piece of new code necessary to solve the requested problem?"

If not, do not add it.

## 3. Make Surgical Changes

- Modify only the files and code directly required for the requested change.
- Do not refactor unrelated code.
- Do not rename, reformat, reorganize, or "improve" surrounding code unless necessary for the requested change.
- Preserve the existing project architecture and coding style.
- Every changed line should be traceable to the requested task.

If your changes make imports, variables, functions, or code unused, remove only the unused code caused by your changes.

Do not remove unrelated existing code.

## 4. Respect Existing Architecture

- Follow the existing architecture, patterns, naming conventions, and project structure.
- Do not introduce a new architectural pattern unless explicitly requested or genuinely necessary.
- Reuse existing services, utilities, types, validation patterns, and conventions when appropriate.
- Keep responsibilities properly separated according to the existing architecture.

## 5. Verify Before Finishing

After implementing the requested change:

- Check for TypeScript errors.
- Check for unused imports or variables caused by your changes.
- Verify that all affected functionality still works.
- Ensure the implementation satisfies the original request and does not introduce unnecessary changes.

## Important

Do not make speculative changes.

Do not modify code simply because you think it could be improved.

Do not overengineer.

Do not change unrelated files.

If you notice an unrelated issue, mention it separately but do not fix it unless explicitly asked.

Your goal is:

"Make the smallest, cleanest, and safest change that completely satisfies the requested requirement."