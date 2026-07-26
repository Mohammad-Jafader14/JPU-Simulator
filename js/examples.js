/**
 * Beginner programs for the ROM Editor. Each entry contains only the fields
 * understood by the CPU, making it safe to copy into the shared 256-slot ROM.
 */
import { DEFAULT_ROM } from "./data.js";

const instruction = (fields) => ({ ...DEFAULT_ROM, ...fields });

export const EXAMPLES = [
  {
    id: "addition",
    name: "Add 5 + 7",
    description: "Loads 5 and 7, adds them, stores 12 in ACC, then halts.",
    program: [
      instruction({ opcode: 2, rg: 1, operand: 5 }),
      instruction({ opcode: 2, rg: 2, operand: 7 }),
      instruction({ opcode: 3, a: 1, b: 2, rg: 63, alu: 0, setFlags: 1 }),
      instruction({ opcode: 14 }),
    ],
  },
  {
    id: "memory",
    name: "Store and load RAM",
    description:
      "Writes 42 into R1, stores it in RAM 0 at address 10, then loads it into R2.",
    program: [
      instruction({ opcode: 2, rg: 1, operand: 42 }),
      instruction({ opcode: 4, b: 1, operand: 10 }),
      instruction({ opcode: 5, rg: 2, operand: 10 }),
      instruction({ opcode: 14 }),
    ],
  },
  {
    id: "stack",
    name: "Stack ends: PSHL and PSHF",
    description:
      "Pushes 10 onto the last end and 20 onto the first end of the stack, then halts.",
    program: [
      instruction({ opcode: 2, rg: 1, operand: 10 }),
      instruction({ opcode: 2, rg: 2, operand: 20 }),
      instruction({ opcode: 10, b: 1 }),
      instruction({ opcode: 11, b: 2 }),
      instruction({ opcode: 14 }),
    ],
  },
];
