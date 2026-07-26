import { startGroup, assert, endGroup } from "./helpers.js";

export function runExecutionTests(ctx, CPU) {
  startGroup("Execution", ctx);

  // LDI

  CPU.reset();

  CPU.execute({
    opcode: 2,
    rg: 5,
    operand: 123,
  });

  assert("LDI writes register", CPU.readRegister(5) === 123, ctx);

  // JMP

  CPU.reset();

  CPU.execute({
    opcode: 1,
    operand: 50,
  });

  assert("JMP changes PC", CPU.pc === 50, ctx);

  // STR0

  CPU.reset();

  CPU.writeRegister(5, 77);

  CPU.execute({
    opcode: 4,
    b: 5,
    operand: 20,
  });

  assert("STR0 stores RAM", CPU.ram0[20] === 77, ctx);

  // LOD0

  CPU.reset();

  CPU.ram0[20] = 88;

  CPU.execute({
    opcode: 5,
    rg: 6,
    operand: 20,
  });

  assert("LOD0 loads RAM", CPU.readRegister(6) === 88, ctx);

  // STR1

  CPU.reset();

  CPU.writeRegister(7, 99);

  CPU.execute({
    opcode: 6,
    b: 7,
    operand: 30,
  });

  assert("STR1 stores RAM", CPU.ram1[30] === 99, ctx);

  // LOD1

  CPU.reset();

  CPU.ram1[30] = 111;

  CPU.execute({
    opcode: 7,
    rg: 8,
    operand: 30,
  });

  assert("LOD1 loads RAM", CPU.readRegister(8) === 111, ctx);

  // PSHL

  CPU.reset();

  CPU.writeRegister(5, 44);

  CPU.execute({
    opcode: 10,
    b: 5,
  });

  assert("PSHL pushes value", CPU.stack[7] === 44, ctx);

  // PSHF

  CPU.reset();

  CPU.writeRegister(5, 55);

  CPU.execute({
    opcode: 11,
    b: 5,
  });

  assert("PSHF pushes front", CPU.stack[0] === 55, ctx);

  // POPL

  CPU.reset();

  CPU.stack[7] = 66;

  CPU.execute({
    opcode: 12,
  });

  assert("POPL removes last", CPU.stack[7] === 0, ctx);

  // POPF

  CPU.reset();

  CPU.stack[0] = 77;

  CPU.execute({
    opcode: 13,
  });

  assert("POPF removes first", CPU.stack[0] === 0, ctx);

  endGroup(ctx);
}
