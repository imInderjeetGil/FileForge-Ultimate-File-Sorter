pub mod quick_sort;
pub mod rules;
pub mod scanner;
pub mod activity;
pub mod app;

pub use app::{
    exit_app,
    open_downloads_folder,
};

pub use activity::{clear_activity, get_activity};

pub use rules::{
    delete_rule,
    get_rules,
    save_rule,
    set_rule_enabled,
    update_rule,

};
pub use scanner::scan_folder_extensions;
pub use quick_sort::{
    get_downloads_folder,
    quick_sort,
    scan_downloads,
    scan_folder,
    undo_sort,
};

