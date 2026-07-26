# Contributing to JPU

## Project map

- `js/cpu.js` is the simulator state and instruction execution engine. It must not depend on the page UI.
- `js/alu.js` contains 8-bit arithmetic and generates the flags used by conditions.
- `js/romMem.js` owns the 256-slot ROM array. `js/rom.js` edits that array and saves it in browser storage.
- `js/dash.js` renders the CPU state and controls stepping/running. It should only display data and call public CPU methods.
- `js/data.js` is the single source of truth for labels and editor option lists.
- `js/ui.js` loads browser-wide interface settings. `js/settings.js` reads and saves them.
- `tests/` contains browser-run regression checks. Add a focused test whenever changing instruction behavior.

## Commenting standard

Write comments for intent, not obvious syntax. Every new module needs a short purpose comment. Add a comment before a complex algorithm, browser-storage format, or simulator rule that another contributor could accidentally change. Keep comments accurate whenever behavior changes.

## Guardrails

- CPU numbers are always normalized to unsigned 8-bit values (`0` through `255`).
- Register `R0` is read-only zero; `ACC` is `R63`.
- ROM addresses, RAM addresses, and the program counter wrap at `255`.
- Keep CPU logic separate from DOM code so React migration can reuse the simulator core.
