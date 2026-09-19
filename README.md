# FileForge

### Ultimate File Sorter for Windows

**FileForge** is a native desktop file organization application that automatically sorts files into meaningful folders and lets users create persistent rules for continuous background organization.

Built with **Tauri 2, Rust, React, Vite, and Tailwind CSS**, FileForge combines a lightweight modern interface with native filesystem operations for fast and reliable file management.

> Stop manually organizing your Downloads folder.
> Define how your files should be handled once — FileForge takes care of the rest.

---

## ✨ Features

### ⚡ Quick Sorting

Organize files from any selected folder with a single action.

FileForge automatically classifies supported files into predefined categories:

* 📄 Documents
* 🖼 Images
* 🎬 Videos
* 🎵 Music
* 📦 Archives
* ⚙ Installers
* 📁 Miscellaneous

After sorting, FileForge provides a breakdown of how many files were moved into each category.

### ↶ Undo Sorting

Quick Sorting maintains a history of file movements so the latest sorting operation can be reverted.

Undo restores files to their original locations and removes folders created by the sorting operation when appropriate.

This provides a safer workflow than permanently moving files without a recovery mechanism.

---

### ⚙ Advanced Sorting

Create custom file organization rules based on:

* Watch folder
* File extensions
* Destination folder
* Background execution

Example:

```text
Rule: Java Development Files

Watch Folder:
D:\Downloads

Extensions:
.java
.jar
.class

Destination:
D:\Projects\Java
```

Whenever a matching file arrives in the watched directory, FileForge can automatically move it to the configured destination.

---

### 👁 Folder Monitoring

Advanced Sorting uses filesystem event monitoring to detect newly created or modified files.

The application uses the Rust `notify` ecosystem to watch configured folders without continuously polling the filesystem.

This enables event-driven automation such as:

```text
File arrives
     ↓
Filesystem event detected
     ↓
FileForge checks active rules
     ↓
Extension matched
     ↓
Destination resolved
     ↓
File moved
     ↓
Activity recorded
```

---

### 💾 Persistent Rules

Sorting rules survive application restarts.

Rules are stored locally in:

```text
%APPDATA%\FileForge\rules.json
```

When FileForge starts, enabled rules are loaded and their background watchers are automatically restored.

This means users do not need to recreate their automation every time they restart Windows.

---

### ▶ Run / Pause Rules

Every Advanced Sorting rule can be:

* **Running** — background sorting is active
* **Paused** — the rule remains saved but does not automatically move files

Rules can also be edited or deleted.

Deleting a rule does **not** delete or move existing files.

---

### 📊 Activity Tracking

FileForge records background sorting activity, including:

* Rule name
* File name
* Source path
* Destination path
* Timestamp

This makes it easier to understand what FileForge has automatically changed.

---

### 🖥 System Tray Integration

FileForge is designed to run quietly in the background.

Closing the main application window hides FileForge to the system tray instead of terminating the application.

From the tray, users can:

* Open FileForge
* Exit FileForge

This allows Advanced Sorting rules to continue running without keeping the main UI visible.

---

### 🔒 Windows Security Awareness

FileForge can require Windows Controlled Folder Access permissions when attempting to modify protected directories.

The application provides an in-app notice explaining where users can allow FileForge through Windows Security.

---

### 🪶 Lightweight Native Architecture

Unlike a traditional web application, FileForge does not require a backend server, database server, or Python runtime.

The application consists of:

```text
React UI
   ↓
Tauri IPC
   ↓
Rust backend
   ↓
Windows filesystem
```

This makes FileForge suitable for native desktop deployment.

---

# 🏗 Architecture

FileForge follows a **hybrid desktop architecture**.

The frontend handles presentation and user interaction while Rust handles privileged/native filesystem operations.

```text
┌─────────────────────────────────────────────────────────┐
│                      FileForge                           │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │                  React Frontend                   │  │
│  │                                                   │  │
│  │  AppShell                                         │  │
│  │     │                                             │  │
│  │     ├── Home                                      │  │
│  │     ├── Quick Sorting                             │  │
│  │     ├── Advanced Sorting                          │  │
│  │     └── About                                     │  │
│  │                                                   │  │
│  │  React 19 + Vite + Tailwind CSS                   │  │
│  └──────────────────────┬────────────────────────────┘  │
│                         │                                │
│                    Tauri IPC                             │
│                         │                                │
│  ┌──────────────────────▼────────────────────────────┐  │
│  │                  Rust Backend                     │  │
│  │                                                   │  │
│  │  Commands                                         │  │
│  │     │                                             │  │
│  │     ├── Quick Sort                                │  │
│  │     ├── Scanner                                   │  │
│  │     ├── Rules                                     │  │
│  │     ├── Activity                                  │  │
│  │     └── Application                               │  │
│  │                                                   │  │
│  │  Services                                         │  │
│  │     │                                             │  │
│  │     ├── File Manager                              │  │
│  │     ├── Rule Manager                              │  │
│  │     └── Filesystem Watcher                        │  │
│  └──────────────────────┬────────────────────────────┘  │
│                         │                                │
│              ┌──────────┴───────────┐                    │
│              │                      │                    │
│        Windows FS              Local Storage              │
│              │                      │                    │
│      User Files/Folders        rules.json                │
│                               activity/history            │
└─────────────────────────────────────────────────────────┘
```

---

# 🔄 Core Data Flow

## Quick Sorting

```text
User selects folder
       ↓
React UI
       ↓
Tauri invoke()
       ↓
Rust quick_sort command
       ↓
Scan folder
       ↓
Determine file category
       ↓
Create category directory if required
       ↓
Move file
       ↓
Record operation in history
       ↓
Return sorting statistics
       ↓
React displays result
```

---

## Advanced Sorting

```text
User creates rule
       ↓
React collects configuration
       ↓
Tauri IPC
       ↓
Rust validates rule
       ↓
Rule saved to rules.json
       ↓
Watcher started if enabled
       ↓
Filesystem event occurs
       ↓
notify detects event
       ↓
File extension checked
       ↓
Matching file moved
       ↓
ActivityEntry generated
       ↓
Activity stored
```

---

# 🧱 Project Structure

```text
FileForge-Ultimate-File-Sorter/
│
├── public/
│
├── src/
│   │
│   ├── components/
│   │   ├── AppShell.jsx
│   │   └── ExtensionList.jsx
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── QuickSorting.jsx
│   │   ├── AdvancedSorting.jsx
│   │   ├── AdvancedSorting.css
│   │   └── About.jsx
│   │
│   ├── services/
│   │   └── fileforge.js
│   │
│   ├── App.jsx
│   └── App.css
│
├── src-tauri/
│   │
│   ├── src/
│   │   │
│   │   ├── commands/
│   │   │   ├── mod.rs
│   │   │   ├── quick_sort.rs
│   │   │   ├── scanner.rs
│   │   │   ├── rules.rs
│   │   │   ├── activity.rs
│   │   │   └── app.rs
│   │   │
│   │   ├── models/
│   │   │   ├── mod.rs
│   │   │   ├── rule.rs
│   │   │   ├── history.rs
│   │   │   └── activity.rs
│   │   │
│   │   ├── services/
│   │   │   ├── file_manager.rs
│   │   │   ├── rules.rs
│   │   │   ├── watcher.rs
│   │   │   └── activity.rs
│   │   │
│   │   ├── lib.rs
│   │   └── main.rs
│   │
│   ├── Cargo.toml
│   └── tauri.conf.json
│
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

---

# 🧩 Architectural Responsibilities

## React Frontend

Responsible for:

* User interface
* Navigation
* Folder selection
* Rule configuration
* Extension selection
* Sorting status
* Activity presentation
* User feedback
* Application controls

The frontend does not directly manipulate files.

---

## Tauri IPC Layer

The frontend communicates with Rust through Tauri commands.

Example:

```javascript
await invoke("quick_sort", {
    folder
});
```

This provides a controlled boundary between the UI and native filesystem functionality.

---

## Rust Command Layer

Commands expose native functionality to the frontend.

Major command groups include:

```text
Quick Sorting
├── scan_downloads
├── scan_folder
├── quick_sort
├── undo_sort
└── get_downloads_folder

Rules
├── get_rules
├── save_rule
├── update_rule
├── set_rule_enabled
└── delete_rule

Scanner
└── scan_folder_extensions

Activity
├── get_activity
└── clear_activity

Application
├── open_downloads_folder
└── exit_app
```

---

# 👀 Rule Engine

An Advanced Sorting rule contains:

```text
Rule
├── ID
├── Rule Name
├── Watch Folder
├── Extensions
├── Destination
└── Enabled
```

Conceptually:

```text
IF

    file is created/modified
    AND
    file extension matches rule

THEN

    move file
    to configured destination
    AND
    record activity
```

For example:

```text
IF extension == ".pdf"
AND watch_folder == "Downloads"

THEN

move → Documents/PDFs
```

Multiple rules can coexist independently.

---

# 🔭 Filesystem Watcher

FileForge uses filesystem events instead of repeatedly scanning directories.

The watcher maintains active rules and monitors their configured directories.

```text
AppState
   │
   └── watchers
        │
        ├── Rule A → Downloads
        ├── Rule B → Desktop
        └── Rule C → Incoming
```

When an event occurs:

```text
Create / Modify
      ↓
notify callback
      ↓
inspect affected path
      ↓
extension matching
      ↓
move_matching_file()
      ↓
activity logging
```

Watchers are non-recursive, meaning Advanced Sorting currently operates on files directly inside the configured watch folder rather than recursively processing nested directories.

---

# 💾 Local Persistence

FileForge intentionally uses lightweight local persistence rather than requiring a database server.

### Rules

Stored under:

```text
%APPDATA%\FileForge\rules.json
```

Example conceptual structure:

```json
[
  {
    "id": "rule-id",
    "rule_name": "Move PDFs",
    "watch_folder": "D:\\Downloads",
    "extensions": [".pdf"],
    "destination": "D:\\Documents\\PDFs",
    "enabled": true
  }
]
```

This makes rules:

* Persistent
* Human-readable
* Easy to back up
* Independent of an external database

---

# 🧠 Design Principles

FileForge is built around several principles.

### 1. Native-first

Filesystem operations belong in Rust rather than the frontend.

### 2. User-controlled automation

Users explicitly define:

```text
What to watch
What files to match
Where to move them
Whether automation is enabled
```

### 3. Recoverability

Quick Sorting maintains movement history so users can undo the latest operation.

### 4. Local operation

File organization happens locally on the user's machine.

### 5. Event-driven automation

Advanced Sorting uses filesystem events instead of unnecessary continuous polling.

### 6. Minimal infrastructure

No:

* Backend server
* Cloud database
* External API
* Authentication service
* Subscription infrastructure

is required for core functionality.

---

# 🛠 Technology Stack

| Layer             | Technology                     |
| ----------------- | ------------------------------ |
| Desktop Framework | Tauri 2                        |
| Frontend          | React 19                       |
| Build Tool        | Vite 8                         |
| Styling           | Tailwind CSS 4                 |
| Icons             | Fluent UI React Icons / Lucide |
| Native Backend    | Rust                           |
| Filesystem Events | `notify`                       |
| Serialization     | Serde / serde_json             |
| IPC               | Tauri Commands                 |
| Persistence       | Local JSON                     |
| Package Manager   | npm                            |
| Native Build      | Cargo                          |
| Target Platform   | Windows                        |

---

# 📋 Requirements

For development, install:

* Windows 10/11
* Node.js
* npm
* Rust
* Cargo
* Tauri development prerequisites

Verify your installation:

```powershell
node --version
npm --version
rustc --version
cargo --version
```

---

# 🚀 Installation

## 1. Clone the repository

```bash
git clone https://github.com/imInderjeetGil/FileForge-Ultimate-File-Sorter.git
```

Enter the project:

```bash
cd FileForge-Ultimate-File-Sorter
```

---

## 2. Install frontend dependencies

```bash
npm install
```

---

## 3. Install Tauri prerequisites

Follow the official Tauri setup documentation for your operating system and ensure the Rust toolchain and required native dependencies are available.

---

# ▶️ Development

Start the Tauri development environment:

```bash
npm run tauri dev
```

This starts:

```text
Vite development server
        +
Tauri native application
```

The frontend can also be developed independently with:

```bash
npm run dev
```

However, native filesystem functionality requires the Tauri runtime.

---

# 🏭 Production Build

Build the frontend:

```bash
npm run build
```

Build the complete desktop application:

```bash
npm run tauri build
```

Tauri will compile the Rust backend and package the application according to the configured bundle targets.

---

# 📦 Installing a Release

For normal users, use the installer generated by the Tauri build/release process rather than running the development environment.

The packaged application provides a native Windows desktop experience without requiring Node.js or Rust on the target machine.

---

# 🎯 Use Cases

## 1. Downloads Folder Management

A common Downloads folder might contain:

```text
Downloads/
├── image.png
├── resume.pdf
├── movie.mp4
├── song.mp3
├── project.zip
├── setup.exe
└── random.txt
```

Quick Sorting transforms this into:

```text
Downloads/
├── Documents/
│   └── resume.pdf
│
├── Images/
│   └── image.png
│
├── Videos/
│   └── movie.mp4
│
├── Music/
│   └── song.mp3
│
├── Archives/
│   └── project.zip
│
├── Installers/
│   └── setup.exe
│
└── Miscellaneous/
    └── random.txt
```

---

## 2. Developer Workspace

Automatically move programming files:

```text
Downloads
   │
   ├── .java
   ├── .jar
   ├── .class
   └── .sql
          │
          ▼
     Development/
```

---

## 3. Design Assets

Create a rule for:

```text
.png
.jpg
.jpeg
.svg
.webp
```

and automatically move incoming assets into:

```text
Design Assets/
```

---

## 4. Academic Workflow

Automatically separate:

```text
.pdf
.docx
.pptx
.xlsx
```

from a general Downloads directory into:

```text
College/
├── Documents/
├── Presentations/
└── Spreadsheets/
```

---

## 5. Automated Incoming Folder

Use Advanced Sorting as an automated inbox.

```text
Incoming/
    │
    ├── PDF ────────► Documents/
    ├── JPG ────────► Images/
    ├── ZIP ────────► Archives/
    └── EXE ────────► Installers/
```

Once configured, the user does not need to manually move every file.

---

# 🧑‍💻 Example Workflow

### Quick Sorting

```text
1. Open FileForge
2. Go to Quick Sorting
3. Select a folder
4. Review file count
5. Click "Quick Sort"
6. Review category statistics
7. Use "Undo" if necessary
```

---

### Advanced Sorting

```text
1. Open Advanced Sorting
2. Click "+ New Rule"
3. Enter a rule name
4. Select Watch Folder
5. Select file extensions
6. Select Destination
7. Enable Background Running
8. Save the rule
```

FileForge then handles matching files automatically.

---

# 🔐 Security & Safety

FileForge performs local filesystem operations, so users should understand that sorting rules can move files.

Recommended practice:

> Start with a test folder before creating automation rules for important directories.

Avoid configuring rules that could unintentionally move:

* System files
* Application directories
* Important project structures
* Files required by running applications

Advanced Sorting should primarily be used with user-controlled directories such as:

```text
Downloads
Desktop
Documents
Pictures
Incoming
```

---

# ⚠️ Current Limitations

FileForge is actively evolving.

Current architectural limitations include:

* Advanced Sorting watches directories non-recursively.
* Rules are stored locally in JSON.
* Quick Sorting uses predefined file categories.
* File organization is extension-based rather than content-aware.
* Advanced rules currently target files directly inside the watched folder.
* Windows permissions such as Controlled Folder Access may affect filesystem operations.

These constraints are intentional parts of the current implementation and provide a foundation for future capabilities.

---

# 🗺️ Roadmap

Potential future development includes:

### File Intelligence

* [ ] Content-aware file classification
* [ ] AI-assisted organization
* [ ] Smart filename generation
* [ ] Duplicate detection
* [ ] Similar-file detection
* [ ] Date-based organization

### Automation

* [ ] Recursive folder monitoring
* [ ] More advanced conditional rules
* [ ] Rule priorities
* [ ] Multiple conditions per rule
* [ ] Scheduled sorting
* [ ] Custom actions

### File Operations

* [ ] Archive extraction
* [ ] Batch renaming
* [ ] Empty-folder cleanup
* [ ] Temporary-file cleanup
* [ ] Duplicate cleanup
* [ ] File metadata inspection

### User Experience

* [ ] Drag-and-drop rules
* [ ] Import/export configurations
* [ ] Improved activity analytics
* [ ] Sorting previews
* [ ] Better notifications
* [ ] More customization

### Platform

* [ ] Improved Windows integration
* [ ] macOS support
* [ ] Linux support

---

# 🤝 Contributing

Contributions are welcome.

### Fork the repository

```bash
git fork
```

Or use GitHub's **Fork** button.

### Create a branch

```bash
git checkout -b feature/my-feature
```

### Make your changes

Follow the existing project structure and keep frontend and native functionality separated.

### Test locally

```bash
npm run build
npm run tauri dev
```

### Commit

```bash
git add .
git commit -m "feat: add my feature"
```

### Push

```bash
git push origin feature/my-feature
```

Then open a Pull Request.

---

# 🐛 Reporting Issues

When opening an issue, include:

* Windows version
* FileForge version
* Steps to reproduce
* Expected behavior
* Actual behavior
* Relevant error messages
* Screenshots where applicable

For filesystem-related issues, also mention:

* Watch folder
* Destination folder
* File extension involved
* Whether the rule was enabled
* Whether Windows security restrictions were involved

---

# 📜 License

This project is currently distributed through the repository under the license specified in the project files.

See:

```text
LICENSE
```

for the applicable terms.

---

# 👨‍💻 Author

**Inderjeet Singh**

Computer Science & Engineering

GitHub:

https://github.com/imInderjeetGil

---

# ⭐ Support the Project

If FileForge is useful to you:

* ⭐ Star the repository
* 🐛 Report bugs
* 💡 Suggest features
* 🔧 Contribute improvements
* 📢 Share the project

---

## FileForge

**Organize once. Automate forever.**

A lightweight native file-management tool designed to turn messy folders into predictable workflows.
