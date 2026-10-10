<div align="center">

# 🏷️ Auto Tag Manager

**A powerful plugin for [Super Productivity](https://github.com/super-productivity/super-productivity) that automatically applies tags to tasks based on keywords in their titles.**

[![Version](https://img.shields.io/badge/version-2.1.0-blue?style=flat-square)](https://github.com/owarimono/auto-tag-manager/releases)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)
[![Super Productivity](https://img.shields.io/badge/super--productivity-18.8%2B-purple?style=flat-square)](https://github.com/super-productivity/super-productivity)
[![Manifest Version](https://img.shields.io/badge/manifest-v1-orange?style=flat-square)](manifest.json)

_Stop tagging manually. Let your task titles do the work._

</div>

---

## 📖 Overview

**Auto Tag Manager** watches every task you create or edit. When a keyword in the task title matches one of your rules, the plugin automatically applies the tags you've configured — instantly, silently, and consistently.

Whether you're managing study sessions, project tasks, or personal errands, this plugin turns your task titles into a self-organizing system.

### Example

| You type…                    | Tags applied automatically       |
| ---------------------------- | -------------------------------- |
| `Chemistry 14 tests`         | `#chemistry` `#science` `#tests` |
| `Math homework due Friday`   | `#math` `#homework`              |
| `🛒 Buy groceries for party` | `#shopping` `#personal`          |

---

## ✨ Features

### 🎯 Core

- **Automatic tagging** — Applies tags the moment a task is created or edited.
- **Regex-powered keywords** — Full `RegExp` support for advanced pattern matching (e.g., `^(todo|fix|bug):`).
- **Multi-tag rules** — One keyword can trigger multiple tags at once.
- **Duplicate-safe** — Never applies the same tag twice to the same task.

### 🎨 Interface

- **Beautiful, native-feeling UI** — Adapts to your Super Productivity theme (light or dark).
- **Live preview** — Type a task title in the _Test_ tab and instantly see which tags would be applied.
- **Inline editing** — Edit rules without leaving the list.
- **Search** — Filter rules by keyword or tag.
- **Toggle switches** — Enable/disable individual rules on the fly.
- **Tag validation** — Visual indicators (green/red dots) show whether a tag actually exists in the app.
- **Statistics** — Track how many tags have been applied and when.
- **Import / Export** — Backup and restore your rules as JSON.

### 🛡️ Reliability

- **Backward compatible** — Auto-migrates older rule formats.
- **Fault-tolerant** — Invalid regex patterns are skipped, not crashed.
- **Persistent** — Rules are stored using Super Productivity's synced storage.

---

## 📸 Screenshots

> **Rules tab** — Manage your keyword-to-tag rules with a clean, native UI.
>
> **Test tab** — Preview how tags would apply to any task title.
>
> **Settings tab** — View statistics and manage data.



---

## 🚀 Installation

### Prerequisites

- **Super Productivity** version **18.8.0** or higher
  ([Download here](https://github.com/super-productivity/super-productivity/releases))

### Steps

1. **Download the latest release**
   Grab the `auto-tag-manager.zip` file from the [Releases](https://github.com/owarimono/auto-tag-manager/releases) page.

2. **Open Super Productivity**
   Navigate to **Settings → Plugins**.

3. **Clear any previous version** _(optional but recommended)_
   Click **Clear Plugin Cache** to avoid stale versions.

4. **Install the plugin**
   Click **Choose Plugin File** and select the downloaded ZIP.

5. **Enable it**
   Toggle the plugin on. An **Auto Tag** button will appear in the app header.

---

## 🎓 Usage

### Creating Your First Rule

1. Click the **Auto Tag** button in the app header.
2. In the _Rules_ tab, fill in the two fields:
   - **Keyword pattern** — A `RegExp` that matches part of a task title (e.g., `chemistry`).
   - **Tags to apply** — Comma-separated tag names that already exist in your app (e.g., `chemistry, science`).
3. Click **Add rule** (or press `Enter`).

That's it. Now create a task titled `Chemistry 101` — the tags `chemistry` and `science` will be applied automatically.

### Advanced Patterns

Because keywords are treated as regular expressions, you can write powerful rules:

| Rule                           | Matches                                     |
| ------------------------------ | ------------------------------------------- |
| `^bug:`                        | Titles starting with `bug:`                 |
| `urgent\|asap`                 | Titles containing either `urgent` or `asap` |
| `\bwork\b`                     | The whole word `work` (not `workshop`)      |
| `(monday\|tuesday\|wednesday)` | Any of the three weekdays                   |
| `\d+\s?(min\|hr)`              | Titles like `30 min` or `2 hr`              |

### Using the Test Tab

Before committing to a rule, use the **Test** tab:

1. Type a sample task title.
2. The plugin shows every matching rule and the tags it would apply.
3. Tags with a **green dot** exist in your app; **red dots** mean the tag is missing and must be created first.

### Managing Data

In the **Settings** tab you can:

- **Export** all rules to a JSON file (great for backups or sharing).
- **Import** rules from a previously exported file.
- **Clear** all rules with a confirmation dialog.

---

## 🧠 How It Works

The plugin is split into two parts, following Super Productivity's plugin architecture:

| File            | Runtime               | Responsibility                                           |
| --------------- | --------------------- | -------------------------------------------------------- |
| `plugin.js`     | Host (always running) | Registers the header button and all task-related hooks.  |
| `index.html`    | Sandboxed iframe (UI) | Renders the settings interface and manages rule storage. |
| `manifest.json` | —                     | Declares permissions and hooks to the host app.          |

### Flow

```
┌────────────────────────────────────────────────────┐
│  User creates / edits a task                       │
│       ↓                                            │
│  Host fires `taskCreated` or `taskUpdate`          │
│       ↓                                            │
│  plugin.js evaluates all enabled rules             │
│       ↓                                            │
│  Matching tags are merged into the task's tagIds   │
│       ↓                                            │
│  API updateTask() persists the change              │
└────────────────────────────────────────────────────┘
```

Because hooks live in `plugin.js` (the host context), tagging works **even when the settings UI is closed**.

---

## 🔐 Permissions

The plugin requests the following permissions:

| Permission             | Why it's needed                                    |
| ---------------------- | -------------------------------------------------- |
| `registerHeaderButton` | To add the "Auto Tag" button to the app header.    |
| `showIndexHtmlAsView`  | To display the settings UI.                        |
| `persistDataSynced`    | To save your rules (and sync them across devices). |
| `loadSyncedData`       | To load your saved rules.                          |
| `showSnack`            | To show inline notifications.                      |
| `getAllTags`           | To look up tag IDs by name.                        |
| `updateTask`           | To apply tags to tasks.                            |
| `getTasks`             | To read task data.                                 |

No data leaves your machine. Nothing is sent to external servers.

---

## 🛠️ Development

### Project Structure

```
auto-tag-manager/
├── manifest.json     # Plugin metadata, permissions, hooks
├── plugin.js         # Host-side logic (hooks + header button)
├── index.html        # UI (self-contained HTML + CSS + JS)
├── icon.svg          # Plugin icon
├── README.md         # This file
└── LICENSE           # MIT license
```

There is **no build step**. Everything is plain JavaScript, HTML, and CSS.

### Local Iteration

1. Make your changes to `index.html` or `plugin.js`.
2. Rebuild the ZIP:
   ```powershell
   Compress-Archive -Path * -DestinationPath "..\auto-tag-manager.zip" -Force
   ```
3. In Super Productivity: **Settings → Plugins → Clear Plugin Cache** → **Choose Plugin File**.

### Debugging

- Open DevTools with `F12` inside Super Productivity.
- All plugin logs are prefixed with `[AutoTag]`.
- Look for messages like:
  ```
  [AutoTag] plugin.js ready.
  [AutoTag] Registered hook: taskCreated
  [AutoTag] Applied tags to: Chemistry 101
  ```

---

## 🧪 Troubleshooting

| Symptom                          | Likely cause & fix                                                                |
| -------------------------------- | --------------------------------------------------------------------------------- |
| Tags are not applied             | The tag doesn't exist in the app. Create it manually first.                       |
| Plugin doesn't appear in header  | Try **Clear Plugin Cache**, then reinstall the ZIP.                               |
| Rule matches but nothing happens | The keyword's regex is invalid. Check the Rules list for red-dot tags.            |
| Cannot see plugin logs           | Right-click the plugin UI and choose **Inspect Element** to open iframe DevTools. |
| Rules disappeared after upgrade  | Migration from older format is automatic; if it fails, check DevTools for errors. |

---

## 🗺️ Roadmap

- [ ] Rule priority / ordering
- [ ] Bulk selection and deletion
- [ ] Tag auto-creation for missing tags
- [ ] Rule groups / folders
- [ ] Localization (i18n)
- [ ] Statistics dashboard with charts

Have an idea? Open an [issue](https://github.com/owarimono/auto-tag-manager/issues).

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. **Fork** the repository.
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**.

### Guidelines

- Keep the code dependency-free (vanilla JS, no bundlers).
- Follow the existing code style (2-space indent, ES2020+).
- Test your changes locally before submitting.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Super Productivity](https://github.com/super-productivity/super-productivity) — for the amazing app and plugin API.
- [Super Productivity Plugin Docs](https://github.com/super-productivity/super-productivity/blob/master/docs/plugin-development.md) — for the official documentation.
- Everyone who has contributed ideas, bug reports, and feedback.

---

<div align="center">

**If this plugin made your workflow better, consider giving it a ⭐**

Made with ❤️ for the Super Productivity community.

</div>
