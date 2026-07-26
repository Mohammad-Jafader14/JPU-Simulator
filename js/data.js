/** Shared instruction, register, flag, and editor-option data. Keep these lists
 * aligned with the numeric cases in cpu.js and alu.js. */
export const OPCODES = [
  "0 : NOP",
  "1 : JMP",
  "2 : LDI",
  "3 : ALU",
  "4 : STR0",
  "5 : LOD0",
  "6 : STR1",
  "7 : LOD1",
  "8 : CAL",
  "9 : RET",
  "10 : PSHL",
  "11 : PSHF",
  "12 : POPL",
  "13 : POPF",
  "14 : HLT",
];

export const ALU = [
  "0 : ADD",
  "1 : SUB",
  "2 : MUL",
  "3 : MUL2",
  "4 : MOD",
  "5 : SHL",
  "6 : SHR",
  "7 : ROR",
  "8 : ROL",
  "9 : AND",
  "10 : NAND",
  "11 : OR",
  "12 : NOR",
  "13 : XOR",
  "14 : MAX",
  "15 : MIN",
];

export const FLAGS = [
  { key: "zr", label: "0 : ZR" },
  { key: "nzr", label: "1 : NZR" },

  { key: "msb", label: "2 : MSB" },
  { key: "nmsb", label: "3 : NMSB" },

  { key: "lsb", label: "4 : LSB" },
  { key: "nlsb", label: "5 : NLSB" },

  { key: "cry", label: "6 : CRY" },
  { key: "ncry", label: "7 : NCRY" },

  { key: "greater", label: "8 : A>B" },
  { key: "less", label: "9 : A<B" },

  { key: "equal", label: "10 : A=B" },
  { key: "inequal", label: "11 : A!=B" },

  { key: "max", label: "12 : MAX" },
  { key: "nmax", label: "13 : NMAX" },

  { key: "prm", label: "14 : PRM" },
  { key: "nprm", label: "15 : NPRM" },
];

export const CONDITIONS = [
  "0 : ZR",
  "1 : NZR",
  "2 : MSB",
  "3 : NMSB",
  "4 : LSB",
  "5 : NLSB",
  "6 : CRY",
  "7 : NCRY",
  "8 : A>B",
  "9 : A<B",
  "10 : A=B",
  "11 : A!=B",
  "12 : MAX",
  "13 : NMAX",
  "14 : PRM",
  "15 : NPRM",
];

export const REGISTERS = Array.from({ length: 64 }, (_, i) => {
  if (i === 0) return "0 : R0 (NULL)";

  if (i === 63) return "63 : ACC";

  return `${i} : R${i}`;
});

export const B_SOURCES = [
  "0 : R0 (NULL)",
  ...Array.from({ length: 62 }, (_, i) => `${i + 1} : R${i + 1}`),
  "63 : OPERAND",
];

export const BINARY_VALUES = ["0", "1"];

export const DEFAULT_ROM = {
  opcode: 0,
  a: 0,
  b: 63,
  rg: 0,
  alu: 0,
  setFlags: 0,
  invert: 0,
  condition: 0,
  useCondition: 0,
  operand: 0,
};
