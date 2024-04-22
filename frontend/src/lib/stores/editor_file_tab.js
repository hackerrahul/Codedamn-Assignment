import { writable } from "svelte/store";

export const opened_files = writable([])

export const preview_file = writable(null);

export const active_file = writable(null);
export const active_file_content = writable(null);