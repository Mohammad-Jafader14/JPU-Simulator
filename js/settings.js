/** Settings page controller. Keeps personal preferences local to this browser. */
import { applyTheme } from "./ui.js";
import { TEST_ACCESS_CODE, TEST_ACCESS_KEY } from "../tests/access.js";

// Default preferences define the initial browser experience before any user changes are saved.
const defaults = {
  theme: "system",
  defaultSpeed: 20,
  numberFormat: "all",
  hints: true,
};
const saved = JSON.parse(localStorage.getItem("cpu-settings") || "{}");
const settings = { ...defaults, ...saved };
const form = document.getElementById("settingsForm");

function syncThemeSelection(themePreference) {
  const selected = document.querySelector(
    `input[name="theme"][value="${themePreference}"]`,
  );
  if (selected) {
    selected.checked = true;
  }
}

syncThemeSelection(settings.theme);
form.defaultSpeed.value = settings.defaultSpeed;
form.numberFormat.value = settings.numberFormat;
form.hints.checked = settings.hints;

// Saving the form writes the latest settings back to localStorage so they are available on refresh.
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const next = {
    theme: form.querySelector("input[name='theme']:checked").value,
    defaultSpeed: Math.min(
      240,
      Math.max(1, Number(form.defaultSpeed.value) || 20),
    ),
    numberFormat: form.numberFormat.value,
    hints: form.hints.checked,
  };
  localStorage.setItem("cpu-settings", JSON.stringify(next));
  applyTheme(next.theme);
  document.getElementById("settingsStatus").textContent =
    "Settings saved for this browser.";
});

document.getElementById("resetSettings").addEventListener("click", () => {
  localStorage.removeItem("cpu-settings");
  form.reset();
  syncThemeSelection(defaults.theme);
  form.defaultSpeed.value = defaults.defaultSpeed;
  form.numberFormat.value = defaults.numberFormat;
  form.hints.checked = defaults.hints;
  applyTheme(defaults.theme);
  document.getElementById("settingsStatus").textContent =
    "Settings reset to defaults.";
});

// This gate only hides developer tooling from casual visitors; it is not a security boundary.
document.getElementById("openTests").addEventListener("click", () => {
  const code = document.getElementById("testCode").value;
  const status = document.getElementById("testAccessStatus");
  if (TEST_ACCESS_CODE === "CHANGE_ME") {
    status.textContent =
      "Set your private code in tests/access.js before using this gate.";
    return;
  }
  if (code !== TEST_ACCESS_CODE) {
    status.textContent = "That code is incorrect.";
    return;
  }
  sessionStorage.setItem(TEST_ACCESS_KEY, "granted");
  window.location.href = "test.html";
});
