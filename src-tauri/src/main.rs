// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;
use bollard::Docker;
use serde::Serialize;

#[derive(Debug, Serialize)]
struct Container {
    id: String,
    name: String,
    image: String,
    status: String,
}

#[tauri::command]
async fn get_containers() -> Result<Vec<Container>, String> {
    let docker = match Docker::connect_with_local_defaults() {
        Ok(docker) => docker,
        Err(e) => return Err(format!("Failed to connect to Docker: {}", e)),
    };

    let containers = match docker.list_containers::<String>(None).await {
        Ok(containers) => containers,
        Err(e) => return Err(format!("Failed to list containers: {}", e)),
    };

    let result = containers
        .iter()
        .map(|c| Container {
            id: c.id.clone().unwrap_or_default(),
            name: c.names.clone().unwrap_or_default().join(", "),
            image: c.image.clone().unwrap_or_default(),
            status: c.status.clone().unwrap_or_default(),
        })
        .collect();

    Ok(result)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_containers])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}