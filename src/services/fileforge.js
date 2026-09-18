import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";

export async function scanDownloads() {
  return invoke("scan_downloads");
}

export async function quickSort() {
  return invoke("quick_sort");
}

export async function undoSort() {
  return invoke("undo_sort");
}

export async function scanFolderExtensions(folder) {
  return invoke("scan_folder_extensions", { folder });
}

export async function selectFolder() {
  return open({
    directory: true,
    multiple: false,
  });
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
