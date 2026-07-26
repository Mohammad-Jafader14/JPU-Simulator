import { DEFAULT_ROM } from "./data.js";

const saved = localStorage.getItem("ROM");

export const ROM = Array.from({ length: 256 }, () => ({ ...DEFAULT_ROM }));

export function saveROM() {
    localStorage.setItem(
        "ROM",
        JSON.stringify(ROM)
    );
}

export function resetROM() {
    for (let i = 0; i < 256; i++) {
        ROM[i] = { ...DEFAULT_ROM };
    }

    saveROM();
}

if (saved) {
    try {
        const data = JSON.parse(saved);

        if (Array.isArray(data)) {
            for (let i = 0; i < 256; i++) {
                ROM[i] = {
                    ...DEFAULT_ROM,
                    ...(data[i] ?? {})
                };
            }
        }
    } catch {
        console.warn("Failed to load ROM.");
    }
}