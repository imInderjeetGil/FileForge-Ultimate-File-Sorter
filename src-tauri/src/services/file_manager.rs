use std::path::{Path, PathBuf};
use std::{fs, thread, time::Duration};

pub fn extension_matches(path: &Path, extensions: &[String]) -> bool {
    let ext = match path.extension().and_then(|e| e.to_str()) {
        Some(value) => format!(".{value}").to_lowercase(),
        None => return false,
    };

    extensions.iter().any(|item| item.to_lowercase() == ext)
}

pub fn unique_destination(folder: &Path, file_name: &std::ffi::OsStr) -> PathBuf {
    let mut destination = folder.join(file_name);
    if !destination.exists() {
        return destination;
    }

    let stem = Path::new(file_name)
        .file_stem()
        .and_then(|s| s.to_str())
        .unwrap_or("file");
    let extension = Path::new(file_name)
        .extension()
        .and_then(|s| s.to_str())
        .map(|s| format!(".{s}"))
        .unwrap_or_default();

    let mut counter = 1;
    loop {
        destination = folder.join(format!("{stem}_{counter}{extension}"));
        if !destination.exists() {
            return destination;
        }
        counter += 1;
    }
}

pub fn move_matching_file(path: &Path, destination_folder: &Path, extensions: &[String]) {
    if !path.is_file() || !extension_matches(path, extensions) {
        return;
    }

    // A file may still be locked while an application is finishing a copy.
    for _ in 0..5 {
        if let Some(name) = path.file_name() {
            let destination = unique_destination(destination_folder, name);
            match fs::rename(path, &destination) {
                Ok(_) => return,
                Err(_) => thread::sleep(Duration::from_millis(300)),
            }
        } else {
            return;
        }
    }
}
