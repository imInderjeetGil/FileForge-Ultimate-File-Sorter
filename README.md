# FileForge

<p align="center">
  <img src="./app-icon.png" alt="FileForge app icon" width="120" />
</p>

<p align="center">
  <strong>Organize once. Automate forever.</strong><br/>
  Native desktop file sorting with one-click cleanup and background rules.
</p>

<p align="center">
  <img alt="Version" src="https://img.shields.io/badge/version-1.1.0-3b82f6" />
  <img alt="Desktop" src="https://img.shields.io/badge/desktop-Tauri%202-8b5cf6" />
  <img alt="Platform" src="https://img.shields.io/badge/platform-Windows-0ea5e9" />
</p>

## Overview

**FileForge** is a Tauri + Rust + React desktop app for organizing files by extension.

It supports two main workflows:

- **Quick Sorting**: sort files from a selected folder into category folders (Documents, Images, Videos, Music, Archives, Installers, Miscellaneous).
- **Advanced Sorting**: create persistent rules that watch a folder and automatically move matching files in the background.

All operations are local on your machine; no backend server or cloud service is required.

## Preview

- App icon: [`/app-icon.png`](./app-icon.png)
- In-app About page links: repository, releases, and issues

> No UI screenshots are currently committed in this repository.

## Feature Highlights

- One-click folder sorting with category breakdown
- Undo for the latest Quick Sorting operation
- Rule-based automation with enable/pause controls
- Folder watcher powered by filesystem events (`notify`)
- Activity history for moved files
- System tray behavior (close-to-tray, reopen/exit from tray menu)
- Collision-safe file moves (`name`, `name_1`, `name_2`, ...)

## Tech Stack

- **Desktop shell:** Tauri 2
- **Frontend:** React 19, Vite 8, Tailwind CSS 4
- **Backend:** Rust
- **File watcher:** `notify`
- **IPC:** Tauri commands (`invoke`)
- **Persistence:** Local JSON files under `%APPDATA%\FileForge`

## System Requirements

### Runtime (current implementation)

- Windows environment (uses `USERPROFILE`, `APPDATA`, `explorer.exe`)

### Development

- Node.js + npm
- Rust + Cargo
- Tauri prerequisites for your OS: <https://v2.tauri.app/start/prerequisites/>

## Installation & Setup

```bash
git clone https://github.com/imInderjeetGil/FileForge-Ultimate-File-Sorter.git
cd FileForge-Ultimate-File-Sorter
npm install
```

## Development Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Run Vite frontend only |
| `npm run tauri dev` | Run full desktop app (frontend + Rust backend) |
| `npm run build` | Build frontend assets into `dist/` |
| `npm run tauri build` | Build/package desktop app |
| `npm run preview` | Preview built frontend |

## Usage Workflow

### Quick Sorting

1. Open **Quick Sorting**
2. Select a folder (defaults to Downloads)
3. Run **Quick Sort**
4. Review per-category counts
5. Use **Undo** if needed

### Advanced Sorting

1. Open **Advanced Sorting**
2. Create a new rule with:
   - Rule name
   - Watch folder
   - Extensions to match
   - Destination folder
   - Background enabled/paused state
3. Save rule
4. FileForge watches for create/modify events and moves matching files

## Configuration & Data

There is no `.env` file in this repository.

### Development environment variable

- `TAURI_DEV_HOST` (used by Vite config for host/HMR in Tauri dev)

### Local app data files

Stored under `%APPDATA%\FileForge`:

- `rules.json` (saved rules)
- `activity.json` (advanced sorting + quick sort activity log)
- `history.json` (latest quick-sort move history for undo)

## Build & Packaging Notes

`npm run tauri build` compiles Rust and bundles the app via Tauri.

Tauri bundle icons are configured in:

- [`/src-tauri/tauri.conf.json`](./src-tauri/tauri.conf.json)

## Project Structure

```text
FileForge-Ultimate-File-Sorter/
├── src/                # React UI (pages, components, frontend services)
├── src-tauri/          # Rust backend, Tauri config, native commands/services
├── public/
├── package.json
└── README.md
```

## Security & Privacy

- File operations happen locally on your machine.
- Advanced rules can move files automatically, so test rules on a sample folder first.
- On Windows, Controlled Folder Access may block moves until FileForge is allowed.
- Avoid creating rules that target protected/system application directories.

## Contributing

Contributions are welcome.

1. Fork this repository on GitHub
2. Create a feature branch
3. Make focused changes
4. Validate locally (`npm run build`, then `npm run tauri dev` for desktop behavior)
5. Open a pull request

## Roadmap

There is no formal roadmap file in this repository today. Current code and existing docs indicate likely future directions such as:

- Recursive watch support
- More advanced rule conditions
- Improved activity analytics and previews
- Expanded platform support

## License

A `LICENSE` file is not currently present in this repository. Add one before redistribution to make usage terms explicit.

## Links & Acknowledgements

- Repository: <https://github.com/imInderjeetGil/FileForge-Ultimate-File-Sorter>
- Releases: <https://github.com/imInderjeetGil/FileForge-Ultimate-File-Sorter/releases>
- Issues: <https://github.com/imInderjeetGil/FileForge-Ultimate-File-Sorter/issues>
- Built with [Tauri](https://tauri.app/), React, Vite, and Rust

---

**Author:** [@imInderjeetGil](https://github.com/imInderjeetGil)
