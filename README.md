# FileForge

### Ultimate File Sorter for Windows

A lightweight native desktop application that automatically organizes files into meaningful folders using quick sorting, custom automation rules, and background folder monitoring.

<p align="center">
  <a href="https://github.com/imInderjeetGil/FileForge-Ultimate-File-Sorter">Repository</a>
  ·
  <a href="https://github.com/imInderjeetGil/FileForge-Ultimate-File-Sorter/issues">Report a Bug</a>
  ·
  <a href="https://github.com/imInderjeetGil/FileForge-Ultimate-File-Sorter/issues">Request a Feature</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/DESKTOP-APPLICATION-555555?style=for-the-badge" alt="Desktop Application" />
  <img src="https://img.shields.io/badge/TAURI-2-FFC131?style=for-the-badge&logo=tauri&logoColor=black" alt="Tauri 2" />
  <img src="https://img.shields.io/badge/REACT-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/VITE-8-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/RUST-BACKEND-DEA584?style=for-the-badge&logo=rust&logoColor=black" alt="Rust" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/TAILWIND-CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/FILESYSTEM-MONITORING-4CAF50?style=for-the-badge" alt="Filesystem Monitoring" />
  <img src="https://img.shields.io/badge/PLATFORM-WINDOWS-0078D6?style=for-the-badge&logo=windows&logoColor=white" alt="Windows" />
</p>

---

## Overview

**FileForge** is a native Windows file organization application designed to make file management faster, safer, and more automated.

It provides a centralized interface for sorting files, creating custom organization rules, monitoring folders in the background, tracking file activity, and undoing the latest sorting operation.

The system combines:

- A React and Vite desktop interface
- A Tauri-powered native application shell
- A Rust backend for filesystem operations
- Event-driven folder monitoring
- Local JSON-based rule persistence
- Extension-based file classification

> Organize your files once. Let FileForge handle the rest.

> **Important:** FileForge performs real filesystem operations and can automatically move files. Always test rules with a temporary folder before using them on important directories.

---

## Features

### Quick Sorting

Organize files from a selected folder with one action.

FileForge categorizes files into predefined folders such as:

- Documents
- Images
- Videos
- Music
- Archives
- Installers
- Miscellaneous

After sorting, the application displays a summary of the files moved into each category.

### Undo Sorting

FileForge maintains a history of the latest sorting operation.

The undo feature can:

- Restore files to their original locations
- Reverse the latest sorting action
- Remove folders created during the sorting operation when appropriate

### Advanced Sorting Rules

Create custom rules based on:

- Watch folder
- File extensions
- Destination folder
- Enabled or paused status

Example:

```text
Rule name: Java Development Files
Watch folder: C:\Users\YourName\Downloads
Extensions: .java, .jar, .class
Destination: C:\Users\YourName\Projects\Java
```

When a matching file appears in the watched folder, FileForge can automatically move it to the configured destination.

### Background Folder Monitoring

Advanced Sorting uses filesystem events to detect new or modified files.

```text
File appears
    ↓
Filesystem event detected
    ↓
Active rules are checked
    ↓
File extension is matched
    ↓
File is moved
    ↓
Activity is recorded
```

### Persistent Rules

Saved rules remain available after restarting the application.

On Windows, rules are stored locally at:

```text
%APPDATA%\FileForge\rules.json
```

FileForge does not require a cloud database or external backend service for core functionality.

### Rule Management

Each rule can be:

- Created
- Edited
- Enabled
- Paused
- Deleted

Pausing a rule keeps its configuration but stops automatic file movement.

### Activity Tracking

FileForge records background sorting activity, including:

- Rule name
- File name
- Source path
- Destination path
- Timestamp

This makes it easier to understand what files were moved automatically.

### System Tray Support

FileForge can continue running in the background through the system tray.

Users can:

- Reopen the application
- Continue background monitoring
- Exit FileForge completely

### Native Desktop Performance

FileForge uses Rust for native filesystem operations through Tauri.

```text
React UI
   ↓
Tauri IPC
   ↓
Rust Backend
   ↓
Windows Filesystem
```

---

## Technology Stack

| Layer | Technology |
| --- | --- |
| Desktop Framework | Tauri 2 |
| Frontend | React 19 |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| Native Backend | Rust |
| Filesystem Monitoring | `notify` |
| Serialization | Serde / `serde_json` |
| Desktop Communication | Tauri Commands |
| Persistence | Local JSON |
| Package Manager | npm |
| Native Build System | Cargo |
| Primary Platform | Windows |

---

## How It Works

### Quick Sorting Flow

```text
User selects a folder
        ↓
React interface
        ↓
Tauri command invocation
        ↓
Rust scans the folder
        ↓
File category is detected
        ↓
Destination folder is created if required
        ↓
File is moved
        ↓
Operation is recorded
        ↓
Sorting summary is displayed
```

### Advanced Sorting Flow

```text
User creates a rule
        ↓
Rule is validated
        ↓
Rule is saved locally
        ↓
Folder watcher starts
        ↓
New file event is detected
        ↓
File extension is checked
        ↓
Matching file is moved
        ↓
Activity entry is recorded
```

---

## Supported File Categories

Quick Sorting uses predefined extension-based categories:

```text
Documents
Images
Videos
Music
Archives
Installers
Miscellaneous
```

Advanced Sorting allows users to select custom extensions and destinations.

FileForge currently organizes files based on their file extensions rather than their content.

---

## Requirements

For development, install:

- Windows 10 or Windows 11
- Node.js
- npm
- Rust
- Cargo
- Tauri development prerequisites

Verify the required tools:

```powershell
node --version
npm --version
rustc --version
cargo --version
```

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/imInderjeetGil/FileForge-Ultimate-File-Sorter.git
cd FileForge-Ultimate-File-Sorter
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the desktop application

```bash
npm run tauri -- dev
```

This launches the Vite development server and opens FileForge as a native Tauri application.

---

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Build the frontend application |
| `npm run preview` | Preview the production frontend build |
| `npm run tauri -- dev` | Run FileForge in development mode |
| `npm run tauri -- build` | Build the native desktop application |

---

## Building for Production

Build the frontend:

```bash
npm run build
```

Build the complete native application:

```bash
npm run tauri -- build
```

The Tauri build process compiles the Rust backend and generates native application bundles using the configured targets.

Build artifacts are generated inside the Tauri build output directory.

---

## Project Structure

```text
FileForge-Ultimate-File-Sorter/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── assets/
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── src-tauri/
│   ├── src/
│   │   ├── commands/
│   │   ├── models/
│   │   ├── services/
│   │   ├── lib.rs
│   │   └── main.rs
│   ├── Cargo.toml
│   └── tauri.conf.json
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

### Frontend Responsibilities

The React frontend handles:

- User interface rendering
- Navigation
- Folder selection
- Sorting configuration
- Rule creation and editing
- Activity display
- User feedback

### Rust Backend Responsibilities

The Rust backend handles:

- Folder scanning
- File classification
- File movement
- Undo history
- Rule persistence
- Filesystem monitoring
- Activity logging
- Native application behavior
- System tray integration

---

## Local Persistence

FileForge stores rules locally in JSON format.

Default Windows location:

```text
%APPDATA%\FileForge\rules.json
```

Example rule structure:

```json
[
  {
    "id": "rule-id",
    "rule_name": "Move PDF files",
    "watch_folder": "C:\\Users\\YourName\\Downloads",
    "extensions": [".pdf"],
    "destination": "C:\\Users\\YourName\\Documents\\PDFs",
    "enabled": true
  }
]
```

Local persistence makes the configuration:

- Lightweight
- Human-readable
- Easy to back up
- Independent of external services

---

## Example Use Cases

### Downloads Folder Organization

Automatically organize a Downloads folder containing:

```text
resume.pdf
image.png
movie.mp4
song.mp3
project.zip
installer.exe
```

Into:

```text
Documents/
Images/
Videos/
Music/
Archives/
Installers/
```

### Developer Workspace

Create a rule for development files:

```text
.java
.jar
.class
.sql
```

Move them automatically into:

```text
Development/
```

### Design Assets

Automatically move image assets such as:

```text
.png
.jpg
.jpeg
.svg
.webp
```

Into:

```text
Design Assets/
```

### Academic Documents

Organize:

```text
.pdf
.docx
.pptx
.xlsx
```

Into an academic documents folder.

---

## Safety Considerations

FileForge moves files on the local filesystem. Use the following precautions:

- Test new rules with a temporary directory.
- Avoid monitoring system folders.
- Avoid application installation directories.
- Review source and destination folders carefully.
- Avoid overlapping rules unless intentional.
- Keep backups of important files.

Windows Controlled Folder Access or other security settings may prevent FileForge from modifying protected directories.

---

## Current Limitations

- Advanced Sorting currently monitors folders non-recursively.
- File classification is extension-based.
- Rules are stored locally in JSON.
- Quick Sorting uses predefined categories.
- Advanced rules process files directly inside the configured folder.
- Windows permissions may affect file movement.
- The application is currently focused on Windows.

---

## Roadmap

Potential future improvements include:

- Recursive folder monitoring
- Date-based file organization
- Duplicate file detection
- Content-aware classification
- AI-assisted organization
- Scheduled sorting
- Rule priorities
- Multiple conditions per rule
- Sorting previews
- Configuration import and export
- Batch renaming
- Archive extraction
- Improved activity analytics
- macOS and Linux support

---

## Contributing

Contributions, bug reports, and feature requests are welcome.

### Development Workflow

1. Fork the repository.
2. Create a feature branch:

   ```bash
   git checkout -b feature/your-feature
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Make your changes.
5. Build the frontend:

   ```bash
   npm run build
   ```

6. Test the desktop application:

   ```bash
   npm run tauri -- dev
   ```

7. Commit your changes:

   ```bash
   git add .
   git commit -m "feat: describe your change"
   ```

8. Push your branch and open a pull request.

Please keep frontend UI logic separate from native filesystem functionality.

---

## License

No license has currently been specified for this repository.

Until a license is added, the project should be considered **all rights reserved**. Please contact the repository owner before redistributing or using the source code in another project.

---

## Acknowledgements

FileForge is built with:

- [Tauri](https://tauri.app/)
- [React](https://react.dev/)
- [Vite](https://vite.dev/)
- [Rust](https://www.rust-lang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [notify](https://github.com/notify-rs/notify)
- [Lucide](https://lucide.dev/)
- [Fluent UI System Icons](https://github.com/microsoft/fluentui-system-icons/)

---

## Repository

[github.com/imInderjeetGil/FileForge-Ultimate-File-Sorter](https://github.com/imInderjeetGil/FileForge-Ultimate-File-Sorter)
