/** Dashboard controller: renders CPU state and wires the run/step controls. */
import {
  FLAGS,
  OPCODES,
  ALU,
  REGISTERS,
  B_SOURCES,
  CONDITIONS,
  BINARY_VALUES,
  DEFAULT_ROM,
} from "./data.js";
import { CPU } from "./cpu.js";
import { ROM } from "./romMem.js";

// Apply presentation preferences without affecting the CPU's stored values.
const settings = JSON.parse(localStorage.getItem("cpu-settings") || "{}");

// Expose the shared CPU object globally so the page scripts can inspect it in the console.
window.CPU = CPU;

const registers = CPU.registers;
const ram0 = CPU.ram0;
const ram1 = CPU.ram1;
const stack = CPU.stack;

// Format values consistently so the dashboard can display binary, decimal, and hex views.
// The same helper is reused for registers, RAM, stack entries, and the program counter.
function format(value) {
  value &= 255;

  const binary = value.toString(2).padStart(8, "0");
  const decimal = String(value);
  const hex = `0x${value.toString(16).toUpperCase().padStart(2, "0")}`;

  if (settings.numberFormat === "binary")
    return `${binary} | ${decimal} | ${hex}`;
  if (settings.numberFormat === "decimal")
    return `${decimal} | ${binary} | ${hex}`;
  if (settings.numberFormat === "hex") return `${hex} | ${binary} | ${decimal}`;

  return `${binary} | ${decimal} | ${hex}`;
}

function createTable(id, array, prefix) {
  const table = document.getElementById(id);

  if (!table) return;

  table.innerHTML = "";

  array.forEach((value, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td class="border px-2 whitespace-nowrap font-bold">
        ${prefix}${index}
      </td>

      <td
        class="border px-2 whitespace-nowrap"
        id="${prefix}${index}"
      >
        ${format(value)}
      </td>
    `;

    table.appendChild(row);
  });
}

function createFlags() {
  const grid = document.getElementById("flagsGrid");

  if (!grid) return;

  grid.innerHTML = "";

  FLAGS.forEach((flag) => {
    const div = document.createElement("div");

    div.id = "flag_" + flag.key;

    div.textContent = `${flag.label}: 0`;

    grid.appendChild(div);
  });
}

function initializeDashboard() {
  createTable("registerTable", registers, "R");
  createTable("ram0Table", ram0, "RAM0_");
  createTable("ram1Table", ram1, "RAM1_");
  createTable("stackTable", stack, "STACK_");

  createFlags();
  updateDisplay();
}

initializeDashboard();

function updateTable(array, prefix) {
  array.forEach((value, index) => {
    const element = document.getElementById(prefix + index);
    if (element) element.textContent = format(value);
  });
}

function updateFlags() {
  FLAGS.forEach((flag) => {
    const element = document.getElementById("flag_" + flag.key);

    if (!element) return;

    element.textContent = `${flag.label}: ${CPU.flags[flag.key] ? 1 : 0}`;
  });
}

function updateROMDisplay() {
  const table = document.getElementById("romTable");

  if (!table) return;

  table.innerHTML = "";

  ROM.forEach((ins, index) => {
    if (ins === null) return;

    const row = document.createElement("tr");

    row.innerHTML = `
      <td class="border px-2 whitespace-nowrap">
        ${index}
      </td>

      <td class="border px-2 whitespace-nowrap">
        ${OPCODES[ins.opcode] ?? "??? "}
      </td>

      <td class="border px-2 whitespace-nowrap">
        ${REGISTERS[ins.rg] ?? "-"}
      </td>

      <td class="border px-2 whitespace-nowrap">
        ${REGISTERS[ins.a] ?? "-"}
      </td>

      <td class="border px-2 whitespace-nowrap">
        ${B_SOURCES[ins.b] ?? "-"}
      </td>

      <td class="border px-2 whitespace-nowrap">
        ${ALU[ins.alu] ?? "-"}
      </td>

      <td class="border px-2 whitespace-nowrap">
        ${ins.operand ?? "-"}
      </td>

      <td class="border px-2 whitespace-nowrap">
        ${ins.useCondition ? CONDITIONS[ins.condition] : "-"}
      </td>
    `;

    table.appendChild(row);
  });
}

function updatePC() {
  const element = document.getElementById("pcValue");
  if (element) element.textContent = format(CPU.pc);
}

function updateInstruction() {
  const ins = CPU.fetch();
  const element = document.getElementById("instructionText");

  if (!element) return;

  element.innerHTML = `
  <div>
    <b>Opcode</b>: ${OPCODES[ins.opcode]} <br />
    <b>Destination</b>: ${REGISTERS[ins.rg]} <br />
    <b>Source A</b>: ${REGISTERS[ins.a]} <br />
    <b>Source B</b>: ${B_SOURCES[ins.b]} <br />
    <b>ALU Function</b>: ${ALU[ins.alu]} <br />
    </div>
    <div>
    <b>Operand</b>: ${ins.operand} <br />
    <b>Set Flags</b>: ${BINARY_VALUES[Number(ins.setFlags)]} <br />
    <b>Invert Output</b>: ${BINARY_VALUES[Number(ins.invert)]} <br />
    <b>Use Condition</b>: ${BINARY_VALUES[Number(ins.useCondition)]} <br />
    <b>Condition</b>: ${CONDITIONS[ins.condition]} <br />
    </div>
  `;
}

/** Shows halt state next to the current instruction without modifying CPU data. */
function updateHaltStatus() {
  const instruction = document.getElementById("instructionText");
  if (!instruction) return;
  if (CPU.halted)
    instruction.insertAdjacentHTML(
      "afterbegin",
      '<p class="font-bold">STATUS: HALTED — select RESET to run again.</p>',
    );
}

function updateSignals() {
  const ins = CPU.fetch();
  const element = document.getElementById("signalsText");

  if (!element) return;

  element.textContent = JSON.stringify(CPU.controlUnit(ins), null, 2);
}

function updateALU() {
  const alu = CPU.lastALU;
  const element = document.getElementById("aluText");

  if (!element) return;

  element.innerHTML = `
A: ${format(alu.a)} <br />
B: ${format(alu.b)} <br />
OUT: ${format(alu.out)} <br />
OP: ${alu.op} <br />`;
}

// Refresh the dashboard from the current CPU state after each step or clock tick.
// This keeps the visible panels and the emulator state synchronized without manual updates.
export function updateDisplay() {
  updateTable(registers, "R");
  updateTable(ram0, "RAM0_");
  updateTable(ram1, "RAM1_");
  updateTable(stack, "STACK_");

  updateFlags();

  updateROMDisplay();

  updatePC();

  updateInstruction();
  updateHaltStatus();

  updateSignals();

  updateALU();
}

let running = false;
let cpuLoop = null;

function stopClock() {
  if (cpuLoop !== null) {
    clearInterval(cpuLoop);
    cpuLoop = null;
  }

  running = false;
}

const clockSpeedInput = document.getElementById("cpuSpeed");
clockSpeedInput.value = settings.defaultSpeed || clockSpeedInput.value;

document.getElementById("cpuReset").onclick = () => {
  stopClock();
  CPU.reset();
  updateDisplay();
};

window.addEventListener("DOMContentLoaded", () => {
  initializeDashboard();
});

function getClockSpeed() {
  let hz = Number(clockSpeedInput.value);

  if (Number.isNaN(hz)) hz = 1;

  if (hz < 1) hz = 1;

  if (hz > 100) hz = 100;

  clockSpeedInput.value = hz;

  return hz;
}

// Start the clock loop when the user presses Run.
// Each tick executes one instruction and immediately redraws the interface.
document.getElementById("cpuRun").onclick = () => {
  if (running) return;

  running = true;

  cpuLoop = setInterval(() => {
    CPU.tick();

    updateDisplay();

    if (CPU.halted || !running) {
      stopClock();
    }
  }, 1000 / getClockSpeed());
};

clockSpeedInput.oninput = getClockSpeed;

document.getElementById("cpuPause").onclick = () => {
  stopClock();
};

// Step executes a single instruction without starting the repeating timer.
// This is useful for debugging and for observing how the machine changes one instruction at a time.
document.getElementById("cpuStep").onclick = () => {
  stopClock();
  CPU.tick();

  updateDisplay();
};

document.getElementById("cpuBack").onclick = () => {
  CPU.pc = (CPU.pc - 1) & 255;

  updateDisplay();
};

updateDisplay();
