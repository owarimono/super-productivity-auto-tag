# Contributing to Auto Tag Manager

First off, thank you for considering contributing! 🎉

Every kind of contribution is welcome — bug reports, feature suggestions,
documentation improvements, and of course code.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Coding Guidelines](#coding-guidelines)
- [Commit Message Convention](#commit-message-convention)
- [Pull Request Process](#pull-request-process)

---

## Code of Conduct

This project follows a simple rule: **be respectful and constructive**.
Harassment, personal attacks, or discriminatory language will not be tolerated.

---

## How Can I Contribute?

### 🐛 Reporting Bugs

Before opening a new issue, please:

1. Search [existing issues](https://github.com/owarimono/super-productivity-auto-tag/issues)
   to avoid duplicates.
2. Check the **Troubleshooting** section in the README.
3. Provide as much detail as possible:
   - Super Productivity version
   - Operating system
   - Steps to reproduce
   - Expected vs. actual behavior
   - Screenshots or console logs (DevTools `F12`)

Use the **Bug Report** issue template when opening a new issue.

### 💡 Suggesting Features

Open an issue using the **Feature Request** template. Describe:

- The problem you're trying to solve.
- Your proposed solution.
- Any alternatives you've considered.

### 📝 Improving Documentation

Typos, clarifications, or better examples — all welcome. Just open a PR.

### 💻 Contributing Code

See the [Development Setup](#development-setup) section below.

---

## Development Setup

### Prerequisites

- **Node.js** is _not_ required. This project is intentionally build-free.
- A text editor (VS Code, Sublime, Vim, etc.).
- Super Productivity installed for testing.

### Getting the Code

```bash
git clone https://github.com/owarimono/super-productivity-auto-tag.git
cd super-productivity-auto-tag
```

### Testing Your Changes Locally

1. Edit `index.html` or `plugin.js`.
2. Rebuild the plugin ZIP:
   ```powershell
   # Windows PowerShell
   Compress-Archive -Path * -DestinationPath "..\auto-tag-manager.zip" -Force
   ```
   ```bash
   # macOS / Linux
   zip -r ../auto-tag-manager.zip manifest.json plugin.js index.html icon.svg
   ```
3. In Super Productivity: **Settings → Plugins → Clear Plugin Cache** → **Choose Plugin File**.
4. Open DevTools with `F12` to view `[AutoTag]` logs.

---

## Project Structure

```
super-productivity-auto-tag/
├── manifest.json     # Plugin metadata, permissions, hooks
├── plugin.js         # Host-side logic (hooks + header button)
├── index.html        # UI (self-contained HTML + CSS + JS)
├── icon.svg          # Plugin icon
├── README.md         # Main documentation
├── CHANGELOG.md      # Version history
├── CONTRIBUTING.md   # This file
└── LICENSE           # MIT license
```

---

## Coding Guidelines

- **Keep it dependency-free.** No bundlers, frameworks, or npm packages.
- **Vanilla JavaScript (ES2020+).** Use modern syntax but avoid experimental features.
- **2-space indentation.**
- **Single quotes** for strings where possible.
- **Semicolons** required.
- **Use `const` and `let`**, never `var`.
- **Prefer `addEventListener`** over inline `onclick` handlers.
- **Never use `innerHTML` with user data** — build DOM with `createElement`.
- **All user-facing strings in English.**
- **Comment the "why", not the "what".**

---

## Commit Message Convention

Use short, descriptive commit messages in the imperative mood:

```
Add feature X
Fix bug in Y
Update documentation for Z
Refactor rule engine
```

For multi-line commits, add a blank line then a body:

```
Fix duplicate tag application

The `taskUpdate` hook can fire multiple times in quick succession.
We now track already-applied tags in a Set to avoid duplicates.
```

---

## Pull Request Process

1. **Fork** the repository.
2. Create a branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes and test them locally.
4. Update `CHANGELOG.md` under the `[Unreleased]` section.
5. Commit using the convention above.
6. Push your branch:
   ```bash
   git push origin feature/your-feature-name
   ```
7. Open a Pull Request against `main`.

### PR Checklist

- [ ] Tested locally in Super Productivity
- [ ] `CHANGELOG.md` updated
- [ ] Code follows the style guidelines
- [ ] No new dependencies added
- [ ] Documentation updated if needed

---

## Questions?

Feel free to open a [discussion](https://github.com/owarimono/super-productivity-auto-tag/discussions)
or start an issue. We're happy to help!

---

Thank you for contributing! ❤️
