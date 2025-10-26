# Gemini CLI Project Guidelines

This file sets the guidelines for the Gemini CLI assistant working on the "Quick Vibe Memo" project.

## 1. Coding Style & Conventions

- **Language:** TypeScript
- **Framework:** React
- **Styling:** Tailwind CSS
- **Formatting:** Follow standard Prettier formatting rules.
- **Naming:** Use camelCase for variables and functions. Use PascalCase for components.

## 2. Framework Choices

- Use functional components with React Hooks.
- Avoid class components.
- State management for this project will be handled by React's built-in hooks (`useState`, `useEffect`, `useContext`). No external state management libraries like Redux are needed.

## 3. AI Collaboration Instructions

- When generating code, please provide clear explanations for complex parts.
- When adding new features, also generate or update corresponding tests if applicable.
- All significant changes should be committed with a descriptive message following the Conventional Commits specification.
