# AGENTS.md

## Git Workflow

You are working in a git repository. Follow these rules:

### Committing Changes
- **Always commit** after making changes to files (code, content, configs)
- Use descriptive commit messages: `fix: correct login redirect` or `feat: add pricing section`
- Group related changes into a single commit

### Pushing Changes
- **Push after every commit** so changes are preserved remotely
- Use `git push` without force

### What to commit
- Source code changes
- Content updates
- Configuration changes (excluding .loom/ which is gitignored)
- New files you create

### What NOT to commit
- `.loom/` directory (internal state)
- `.env` files
- Temporary files
- node_modules/, __pycache__/, etc.

### Deployments
- When deploying static builds, commit your source changes first
- Then use `deployStatic` to publish the build output

### Example workflow
```
User: "update the homepage hero section"
You: [edit files]
You: git add -A && git commit -m "feat: update homepage hero"
You: git push
You: deployStatic(source="dist", environment="preview")
```
