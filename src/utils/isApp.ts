import {platform} from "@tauri-apps/plugin-os";

export const isApp = () => {
    try {
        return platform() !== undefined;
    } catch {
        return false
    }
}