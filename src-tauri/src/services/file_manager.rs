use std::path::{Path, PathBuf};
use std::{fs, thread, time::Duration};

pub fn extension_matches(path: &Path, extensions: &[String]) -> bool {
    let ext = match path.extension().and_then(|e| e.to_str()) {
        Some(value) => format!(".{value}").to_lowercase(),
        None => return false,
    };

    extensions.iter().any(|item| item.to_lowercase() == ext)
}

pub fn unique_destination(
    folder: &Path,
    file_name: &std::ffi::OsStr,
) -> PathBuf {
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
        destination =
            folder.join(format!("{stem}_{counter}{extension}"));

        if !destination.exists() {
            return destination;
        }

        counter += 1;
    }
}

pub fn move_matching_file(
    path: &Path,
    destination_folder: &Path,
    extensions: &[String],
) -> Option<(PathBuf, PathBuf)> {
    if !path.is_file() || !extension_matches(path, extensions) {
        return None;
    }

    let name = path.file_name()?;
    let destination = unique_destination(destination_folder, name);

    // First try the normal rename.
    match fs::rename(path, &destination) {
        Ok(_) => {
            return Some((
                path.to_path_buf(),
                destination,
            ));
        }

        Err(error) => {
            // Cross-drive move on Windows.
            if error.raw_os_error() != Some(17) {
                eprintln!(
                    "[FileForge] Move failed: {:?} -> {:?} | Error: {}",
                    path,
                    destination,
                    error
                );
                return None;
            }

            println!(
                "[FileForge] Cross-drive move detected. Copying: {:?} -> {:?}",
                path,
                destination
            );
        }
    }

    // Copy the file to the destination drive.
    match fs::copy(path, &destination) {
        Ok(_) => {
            // Verify that the destination actually exists.
            if !destination.exists() {
                eprintln!(
                    "[FileForge] Copy verification failed: {:?}",
                    destination
                );

                let _ = fs::remove_file(&destination);
                return None;
            }

            // Only delete the original after successful copy.
            match fs::remove_file(path) {
                Ok(_) => {
                    println!(
                        "[FileForge] Cross-drive move successful: {:?} -> {:?}",
                        path,
                        destination
                    );

                    Some((
                        path.to_path_buf(),
                        destination,
                    ))
                }

                Err(error) => {
                    eprintln!(
                        "[FileForge] Copy succeeded but source could not be deleted: {:?} | Error: {}",
                        path,
                        error
                    );

                    // Don't pretend the move succeeded.
                    None
                }
            }
        }

        Err(error) => {
            eprintln!(
                "[FileForge] Cross-drive copy failed: {:?} -> {:?} | Error: {}",
                path,
                destination,
                error
            );

            None
        }
    }
}