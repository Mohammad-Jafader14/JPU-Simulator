/** Shared interface helpers. Preferences are stored locally in this browser so the UI feels familiar across refreshes. */
const settings = JSON.parse(localStorage.getItem("cpu-settings") || "{}");
const legacyTheme = localStorage.getItem("cpu-theme");
const theme = settings.theme || legacyTheme || "system";

/** Resolves the selected theme to the current operating-system preference when "system" is chosen. */
function resolveTheme(preference) {
  const isDarkSystem = window.matchMedia(
    "(prefers-color-scheme: dark)",
  ).matches;
  if (preference === "system") {
    return isDarkSystem ? "dark" : "light";
  }
  return preference === "dark" ? "dark" : "light";
}

function applyTheme(preference) {
  const resolvedTheme = resolveTheme(preference);
  document.documentElement.dataset.theme = resolvedTheme;
  document.body?.setAttribute("data-theme", resolvedTheme);
}

applyTheme(theme);

// Keep the page in sync if the operating system theme changes while the UI is using the system setting.
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", () => {
    const current = JSON.parse(localStorage.getItem("cpu-settings") || "{}");
    if ((current.theme || legacyTheme || "system") === "system") {
      applyTheme("system");
    }
  });

// One-time compatibility with the original header theme toggle.
if (legacyTheme && !settings.theme) {
  localStorage.setItem("cpu-settings", JSON.stringify({ ...settings, theme }));
}

export { applyTheme, resolveTheme };
