import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";


function cleanWindowsPath(path) {
  if (!path) return path;

  if (path.startsWith("\\\\?\\")) {
    return path.slice(4);
  }

  return path;
}

export async function scanDownloads() {
  return invoke("scan_downloads");
}

export async function scanFolder(folder) {
  return invoke("scan_folder", { folder });
}

export async function quickSort(folder) {
  return invoke("quick_sort", {folder});
}

export async function undoSort() {
  return invoke("undo_sort");
}

export async function scanFolderExtensions(folder) {
  return invoke("scan_folder_extensions", { folder });
}

export async function selectFolder() {
  const selected = await open({
    directory: true,
    multiple: false,
  });

  if (!selected) {
    return null;
  }

  console.log("RAW:", selected);
  console.log("CLEAN:", cleanWindowsPath(selected));
  return cleanWindowsPath(selected);
}

export async function getRules() {
  return invoke("get_rules");
}

export async function saveRule(rule) {
  return invoke("save_rule", {
    ruleName: rule.rule_name,
    watchFolder: rule.watch_folder,
    extensions: rule.extensions,
    destination: rule.destination,
    enabled: rule.enabled,
  });
}

export async function updateRule(rule) {
  return invoke("update_rule", {
    ruleId: rule.id,
    ruleName: rule.rule_name,
    watchFolder: rule.watch_folder,
    extensions: rule.extensions,
    destination: rule.destination,
    enabled: rule.enabled,
  });
}

export async function setRuleEnabled(ruleId, enabled) {
  return invoke("set_rule_enabled", {
    ruleId,
    enabled,
  });
}

export async function deleteRule(ruleId) {
  return invoke("delete_rule", {
    ruleId,
  });
}

export async function getActivity() {
  return invoke("get_activity");
}

export async function getDownloadsFolder() {
  return invoke("get_downloads_folder");
}

export async function clearActivity() {
  return invoke("clear_activity");
}

export async function openDownloadsFolder() {
  return invoke("open_downloads_folder");
}

export async function exitApp() {
  return invoke("exit_app");
}