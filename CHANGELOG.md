# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned

- Rule priority and ordering
- Bulk selection and deletion
- Auto-creation of missing tags
- Rule groups and folders
- Localization (i18n)
- Statistics dashboard with charts

---

## [2.1.0] — 2026-10-10

### Added

- **Modern, theme-aware UI** that adapts to Super Productivity's light and dark themes.
- **Tabbed interface** with three sections: Rules, Test, and Settings.
- **Live preview** in the Test tab — see which tags would apply to any task title.
- **Inline rule editing** — modify keyword and tags without leaving the list.
- **Search bar** to filter rules by keyword or tag.
- **Enable/disable switches** for individual rules.
- **Tag validation indicators** — green dots for existing tags, red for missing ones.
- **Statistics panel** showing total rules, tags applied, and last activity.
- **Import / Export** of rules as JSON for backup and sharing.
- **Ripple effects** and smooth animations throughout the UI.
- **Snackbar notifications** for user feedback (success and error states).
- **Custom confirmation dialog** for destructive actions.
- **Keyboard shortcuts**: `Enter` to add/save, `Esc` to cancel/close.

### Changed

- Redesigned the plugin layout with a card-based structure.
- Improved typography, spacing, and overall visual hierarchy.
- Reworked color tokens to derive automatically from the host theme.
- Replaced system `confirm()` prompts with a styled modal.

### Fixed

- Duplicate tags are no longer applied when a task is updated multiple times.
- Invalid RegExp patterns are now skipped gracefully instead of crashing.
- Tags missing from the app are visually indicated instead of silently ignored.

---

## [2.0.0] — 2026-10-10

### Added

- Introduced structured storage format (`{ version, rules, stats }`).
- Per-rule statistics: application count and creation date.
- Automatic migration from the legacy array-based format.

### Changed

- **Architecture**: Hooks now live in `plugin.js` (host context) so that tagging
  works even when the settings UI is closed.
- Renamed internal storage keys and consolidated all data under a single JSON payload.

### Fixed

- **Critical**: Tagging logic did not run for newly created tasks. Switched from
  the unreliable `action` + `ADD_TASK_SUCCESS` pattern to the official
  `taskCreated` and `taskUpdate` hooks.

---

## [1.0.0] — 2026-10-10

### Added

- Initial release.
- Basic keyword-to-tag rule engine.
- Simple settings panel with add and delete functionality.
- Persistent rules via Super Productivity's synced storage.

---

[Unreleased]: https://github.com/owarimono/super-productivity-auto-tag/compare/v2.1.0...HEAD
[2.1.0]: https://github.com/owarimono/super-productivity-auto-tag/compare/v2.0.0...v2.1.0
[2.0.0]: https://github.com/owarimono/super-productivity-auto-tag/compare/v1.0.0...v2.0.0
[1.0.0]: https://github.com/owarimono/super-productivity-auto-tag/releases/tag/v1.0.0
