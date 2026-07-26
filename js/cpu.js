/**
 * JPU simulation core. This module deliberately has no DOM access so it can
 * later be reused by a React interface without changing instruction behavior.
 */
import { executeALU } from "./alu.js";
import { ROM } from "./romMem.js";
import { DEFAULT_ROM } from "./data.js";

// Load the ROM from browser storage when the page starts so programs survive refreshes.
// This keeps the emulator state persistent without coupling the CPU core to the DOM.

// One shared mutable CPU instance. UI modules display and control this object.
export const CPU = {
  //                CPU                STATE

  pc: 0,
  // HLT freezes execution at the current address until Reset is selected.
  halted: false,
  lastALU: {
    a: 0,
    b: 0,
    out: 0,
    op: 0,
  },

  registers: Array.from({ length: 64 }, () => 0),

  ram0: Array.from({ length: 256 }, () => 0),

  ram1: Array.from({ length: 256 }, () => 0),

  stack: Array.from({ length: 8 }, () => 0),

  flags: {
    zr: false,
    nzr: false,

    msb: false,
    nmsb: false,

    lsb: false,
    nlsb: false,

    cry: false,
    ncry: false,

    "a>b": false,
    "a<b": false,

    "a=b": false,
    "a!=b": false,

    max: false,
    nmax: false,

    prm: false,
    nprm: false,
  },

  ROM: ROM,

  // Reset clears execution state and returns the machine to a clean, initial state.
  // This is used by the UI when the user wants to start a program from the beginning.
  reset() {
    this.pc = 0;
    this.halted = false;

    this.registers.fill(0);
    this.ram0.fill(0);
    this.ram1.fill(0);
    this.stack.fill(0);

    for (const key in this.flags) this.flags[key] = false;

    this.lastALU = {
      a: 0,
      b: 0,
      out: 0,
      op: 0,
    };
  },

  // Fetch reads the currently addressed instruction from the ROM.
  // The fallback object keeps execution safe even if the ROM slot is empty or undefined.
  fetch() {
    return this.ROM[this.pc] ?? DEFAULT_ROM;
  },

  // Tick advances the CPU by one instruction cycle.
  // It protects against running again after a HALT and preserves the current PC when
  // an instruction changes it directly, such as JMP, CALL, and RET.
  tick() {
    // A halted CPU must not advance the PC or execute another instruction.
    if (this.halted) return;
    const oldPC = this.pc;

    const instruction = this.fetch();

    if (typeof instruction.opcode !== "number") {
      this.pc = (this.pc + 1) & 255;
      return;
    }

    this.execute(instruction);

    if (this.pc === oldPC) {
      this.pc++;
    }

    this.pc &= 255;
  },

  pushStackBack(value) {
    this.stack.shift();

    this.stack.push(value & 255);
  },
  popStackBack() {
    let value = this.stack[7];

    this.stack[7] = 0;

    return value;
  },
  pushStackFront(value) {
    this.stack.pop();

    this.stack.unshift(value & 255);
  },
  popStackFront() {
    let value = this.stack[0];

    this.stack[0] = 0;

    return value;
  },

  readA(index) {
    return this.readRegister(index);
  },
  readB(index, operand) {
    if (index === 63) return operand & 255;

    return this.readRegister(index);
  },

  // Condition checks map a numeric condition code to the current CPU flags.
  // This keeps instruction branches readable and makes the condition system easy to extend.
  checkCondition(condition) {
    switch (condition) {
      case 0:
        return this.flags.zr;

      case 1:
        return this.flags.nzr;

      case 2:
        return this.flags.msb;

      case 3:
        return this.flags.nmsb;

      case 4:
        return this.flags.lsb;

      case 5:
        return this.flags.nlsb;

      case 6:
        return this.flags.cry;

      case 7:
        return this.flags.ncry;

      case 8:
        return this.flags.greater;

      case 9:
        return this.flags.less;

      case 10:
        return this.flags.equal;

      case 11:
        return this.flags.inequal;

      case 12:
        return this.flags.max;

      case 13:
        return this.flags.nmax;

      case 14:
        return this.flags.prm;

      case 15:
        return this.flags.nprm;

      default:
        return false;
    }
  },

  // Instructions

  // Execute is the main instruction dispatcher.
  // It resolves the opcode, applies optional conditions, and performs the side effect
  // for the current instruction before advancing the program counter.
  execute(ins) {
    const control = this.controlUnit(ins);

    if (ins.useCondition) {
      if (!this.checkCondition(ins.condition)) {
        this.pc++;

        this.pc &= 255;

        return;
      }
    }

    if (control.halt) {
      this.halted = true;

      return;
    }

    // CONDITIONS GO HERE LATER
    // if instruction fails condition:
    // return;

    switch (ins.opcode) {
      case 0:
        // NOP

        break;

      case 1:
        // JMP

        this.pc = ins.operand & 255;

        return;

      case 2:
        // LDI

        this.writeRegister(ins.rg, ins.operand);

        break;

      case 3:
        // ALU

        this.executeALUInstruction(ins);

        break;

      case 4:
        // STR0

        this.ram0[ins.operand & 255] = this.readRegister(ins.b);

        break;

      case 5:
        // LOD0

        this.writeRegister(ins.rg, this.ram0[ins.operand & 255]);

        break;

      case 6:
        // STR1

        this.ram1[ins.operand & 255] = this.readRegister(ins.b);

        break;

      case 7:
        // LOD1

        this.writeRegister(ins.rg, this.ram1[ins.operand & 255]);

        break;

      case 8:
        // CAL

        this.pushStackBack((this.pc + 1) & 255);

        this.pc = ins.operand & 255;

        return;

      case 9:
        // RET

        this.pc = this.popStackBack();

        return;

      case 10:
        // PSHL

        this.pushStackBack(this.readRegister(ins.b));

        break;

      case 11:
        // PSHF

        this.pushStackFront(this.readRegister(ins.b));

        break;

      case 12:
        // POPL

        this.popStackBack();

        break;

      case 13:
        // POPF

        this.popStackFront();

        break;
    }

    this.pc++;

    this.pc &= 255;
  },

  // ALU instructions share one path so arithmetic and bitwise operations use the same
  // read/write rules, flag handling, and result storage behavior.
  executeALUInstruction(ins) {
    let a = this.readA(ins.a);

    let b = this.readB(ins.b, ins.operand);

    let output = executeALU(ins.alu, a, b);

    let result = output.result;

    if (ins.invert) result = ~result & 255;

    if (ins.setFlags) this.flags = output.flags;

    this.writeRegister(ins.rg, result);

    this.lastALU = {
      a,
      b,
      out: result,
      op: ins.alu,
    };
  },

  readRegister(index) {
    if (index === 0) return 0;

    return this.registers[index] & 255;
  },

  writeRegister(index, value) {
    if (index === 0) return;

    this.registers[index] = value & 255;
  },
  // The control unit describes the expected control signals for a given instruction.
  // The dashboard uses this output to show the instruction's signals without changing CPU state.
  // Returning the same four keys for every opcode keeps the signal panel height stable.
  controlUnit(ins) {
    switch (ins.opcode) {
      case 0:
        // NOP
        return {
          pcChange: false,
          writeReg: false,
          writeRAM: false,
          halt: false,
        };

      case 1:
        // JMP
        return {
          pcChange: true,
          writeReg: false,
          writeRAM: false,
          halt: false,
        };

      case 2:
        // LDI
        return {
          pcChange: false,
          writeReg: true,
          writeRAM: false,
          halt: false,
        };

      case 3:
        // ALU
        return {
          pcChange: false,
          writeReg: true,
          writeRAM: false,
          halt: false,
        };

      case 4:
        // STR0
        return {
          pcChange: false,
          writeReg: false,
          writeRAM: true,
          halt: false,
        };

      case 5:
        // LOD0
        return {
          pcChange: false,
          writeReg: true,
          writeRAM: false,
          halt: false,
        };

      case 6:
        // STR1
        return {
          pcChange: false,
          writeReg: false,
          writeRAM: true,
          halt: false,
        };

      case 7:
        // LOD1
        return {
          pcChange: false,
          writeReg: true,
          writeRAM: false,
          halt: false,
        };

      case 8:
      case 9:
        // CAL / RET
        return {
          pcChange: true,
          writeReg: false,
          writeRAM: false,
          halt: false,
        };

      case 10:
      case 11:
      case 12:
      case 13:
        // PSHL / PSHF / POPL / POPF
        return {
          pcChange: false,
          writeReg: false,
          writeRAM: false,
          halt: false,
        };

      case 14:
        // HLT
        return {
          pcChange: false,
          writeReg: false,
          writeRAM: false,
          halt: true,
        };

      default:
        return {
          pcChange: false,
          writeReg: false,
          writeRAM: false,
          halt: false,
        };
    }
  },
};
