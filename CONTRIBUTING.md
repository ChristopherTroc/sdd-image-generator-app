# Contributing Guidelines

Thank you for contributing to this project! Please follow these guidelines to ensure a smooth collaboration.

## Development Workflow

1. **Clone the repository and install dependencies:**
   ```bash
   nvm use
   npm install
   ```

2. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes:**
   - Write TypeScript code with full type annotations
   - Follow the project structure: components in `src/components/`, utilities in `src/lib/`
   - Use Tailwind CSS for styling
   - Keep components small and focused

4. **Check code quality:**
   ```bash
   npm run type-check
   npm run lint
   npm run format
   ```

5. **Commit with clear messages:**
   ```bash
   # Husky will automatically run pre-commit checks
   git commit -m "feat: add new feature"
   ```

6. **Push and create a pull request:**
   ```bash
   git push origin feature/your-feature-name
   ```

## Code Style

- **TypeScript**: Use strict mode, add types to all variables and functions
- **Naming**: Use camelCase for variables/functions, PascalCase for components/classes
- **Formatting**: Code is automatically formatted by Prettier on commit
- **Imports**: Use path aliases (`@/...`) instead of relative paths

## Component Guidelines

### Create a New Component

```typescript
// src/components/MyComponent.tsx

interface MyComponentProps {
  title: string;
  onClick?: () => void;
}

export function MyComponent({ title, onClick }: MyComponentProps) {
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="font-semibold">{title}</h3>
      {onClick && <button onClick={onClick}>Click me</button>}
    </div>
  );
}
```

### Component Best Practices

- Prop interface should be named `ComponentNameProps`
- Use TypeScript for type safety
- Use Tailwind CSS for styling
- Keep components small and single-responsibility
- Export named exports for better tree-shaking
- Add JSDoc comments for complex logic

## Testing

Run tests before submitting a pull request:

```bash
npm run type-check    # Type checking
npm run lint          # Linting
npm run format        # Code formatting
```

## Commit Messages

Use clear, descriptive commit messages:

- `feat: add new feature`
- `fix: resolve bug in component`
- `docs: update README`
- `refactor: improve performance`
- `style: fix formatting`

## Pull Request Process

1. Update README.md if needed with new features or changes
2. Test your changes locally: `npm run build && npm run start`
3. Ensure all checks pass: `npm run type-check && npm run lint`
4. Provide a clear description of changes in the PR

## Issues and Discussions

- Report bugs with clear reproduction steps
- Suggest features with clear use cases
- Ask questions in discussions for help

## Questions?

Feel free to open an issue or discussion if you have questions or need clarification.

Happy coding! 🚀
