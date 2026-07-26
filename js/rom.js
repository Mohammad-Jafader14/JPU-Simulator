/** ROM Editor controller: maps the form to ROM slots and handles local import/export. */
import {
  OPCODES,
  ALU,
  REGISTERS,
  B_SOURCES,
  FLAGS,
  CONDITIONS,
  BINARY_VALUES,
  DEFAULT_ROM,
} from "./data.js";

import { ROM, saveROM } from "./romMem.js";
import { EXAMPLES } from "./examples.js";

// Restore the ROM from browser storage when the editor loads so saved programs remain available.
saveROM();

for (let i = 0; i < 256; i++) {
  if (ROM[i] === null) ROM[i] = { ...DEFAULT_ROM };
}

const opcodeSelect = document.getElementById("opcodeSelect");
const aSelect = document.getElementById("aSelect");
const bSelect = document.getElementById("bSelect");
const rgSelect = document.getElementById("rgSelect");
const aluSelect = document.getElementById("aluSelect");

const setFlagsSelect = document.getElementById("setFlagsSelect");

const invertSelect = document.getElementById("invertSelect");

const conditionSelect = document.getElementById("conditionSelect");

const useConditionSelect = document.getElementById("useConditionSelect");

const operandInput = document.getElementById("operandInput");

// Populate and load the guided programs shown above the ROM editor.
const exampleSelect = document.getElementById("exampleSelect");
EXAMPLES.forEach((example) =>
  exampleSelect.add(new Option(example.name, example.id)),
);
document.getElementById("loadExample").onclick = () => {
  const example = EXAMPLES.find((item) => item.id === exampleSelect.value);
  if (!example) return;
  for (let i = 0; i < 256; i++)
    ROM[i] = structuredClone(example.program[i] || DEFAULT_ROM);
  romPC = 0;
  updateAddress();
  loadForm();
  saveStatus.textContent = `Loaded “${example.name}”. Select SAVE to keep it in this browser.`;
};

window.ROM = ROM;

let romPC = 0;

function fillSelect(id, array) {
  const select = document.getElementById(id);

  array.forEach((item, index) => {
    const option = document.createElement("option");

    option.value = index;
    option.textContent = item;

    select.appendChild(option);
  });
}

fillSelect("opcodeSelect", OPCODES);
fillSelect("aSelect", REGISTERS);
fillSelect("bSelect", B_SOURCES);
fillSelect("rgSelect", REGISTERS);
fillSelect("aluSelect", ALU);
fillSelect("conditionSelect", CONDITIONS);
fillSelect("setFlagsSelect", BINARY_VALUES);
fillSelect("invertSelect", BINARY_VALUES);
fillSelect("useConditionSelect", BINARY_VALUES);

function updateAddress() {
  const el = document.getElementById("romAddress");

  el.textContent = `${romPC.toString(2).padStart(8, "0")} | ${romPC} | 0x${romPC.toString(16).toUpperCase()}`;
}

// Gather the selected form values into the instruction object shape expected by the CPU.
function getForm() {
  return {
    opcode: Number(opcodeSelect.value),
    a: Number(aSelect.value),
    b: Number(bSelect.value),
    rg: Number(rgSelect.value),
    alu: Number(aluSelect.value),

    setFlags: Number(setFlagsSelect.value),
    invert: Number(invertSelect.value),

    condition: Number(conditionSelect.value),
    useCondition: Number(useConditionSelect.value),

    operand: Number(operandInput.value),
  };
}

function loadForm() {
  let ins = ROM[romPC];

  opcodeSelect.value = ins.opcode;
  aSelect.value = ins.a;
  bSelect.value = ins.b;
  rgSelect.value = ins.rg;
  aluSelect.value = ins.alu;

  setFlagsSelect.value = ins.setFlags;
  invertSelect.value = ins.invert;

  conditionSelect.value = ins.condition;
  useConditionSelect.value = ins.useCondition;

  operandInput.value = ins.operand;
}

function clampOperand() {
  let value = Number(operandInput.value);

  if (value < 0) value = 0;

  if (value > 255) value = 255;

  operandInput.value = value;
}

operandInput.oninput = clampOperand;

document.getElementById("romSet").onclick = () => {
  ROM[romPC] = structuredClone(getForm());

  updateAddress();
  loadForm();
};
document.getElementById("romPCInc").onclick = () => {
  if (romPC < 255) romPC++;
  else romPC = 0;

  updateAddress();
  loadForm();
};

document.getElementById("romPCDec").onclick = () => {
  if (romPC > 0) romPC--;
  else romPC = 255;

  updateAddress();
  loadForm();
};

document.getElementById("romPCR").onclick = () => {
  romPC = 0;

  updateAddress();
  loadForm();
};

document.getElementById("romReset").onclick = () => {
  if (confirm("RESET ENTIRE ROM?")) {
    for (let i = 0; i < 256; i++) {
      ROM[i] = { ...DEFAULT_ROM };
    }

    romPC = 0;

    updateAddress();
    loadForm();
  }
};

const saveStatus = document.getElementById("saveStatus");

// Persist the current ROM contents in localStorage so the editor can recover them later.
document.getElementById("romSave").onclick = () => {
  localStorage.setItem("ROM", JSON.stringify(ROM));

  saveStatus.textContent = "ROM saved to localStorage.";
};

// Export the ROM as a JSON bundle with a custom JPUR format so it can be shared or archived.
document.getElementById("romExport").onclick = () => {
  const data = {
    format: "JPUR",

    version: 1,

    architecture: "JPU",

    rom: ROM,
  };

  const blob = new Blob(
    [JSON.stringify(data, null, 2)],

    {
      type: "application/json",
    },
  );

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");

  a.href = url;

  let fileName = prompt("Enter ROM name:", "MyProgram");

  if (fileName === null) return;

  fileName = fileName.trim();

  if (fileName === "") fileName = "MyProgram";

  a.download = fileName + ".jpur";

  a.click();

  URL.revokeObjectURL(url);
};

// Import a previously exported ROM file and replace the current editor contents.
document.getElementById("romImport").onchange = (e) => {
  const file = e.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {
    const data = JSON.parse(reader.result);

    if (data.format !== "JPUR") {
      alert("Invalid JPUR file.");

      return;
    }

    if (data.version !== 1) {
      alert("Unsupported JPUR version.");

      return;
    }

    if (!Array.isArray(data.rom)) {
      alert("ROM data missing.");

      return;
    }

    for (let i = 0; i < 256; i++) {
      ROM[i] = data.rom[i] ?? { ...DEFAULT_ROM };
    }

    romPC = 0;

    updateAddress();

    loadForm();

    saveStatus.textContent = `Imported ${data.rom.length} ROM instructions from ${file.name}.`;
  };

  reader.readAsText(file);
};

updateAddress();
loadForm();
