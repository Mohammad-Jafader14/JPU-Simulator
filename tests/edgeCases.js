import { startGroup, assert, endGroup } from "./helpers.js";

export function runEdgeCaseTests(ctx, CPU) {
  startGroup("Edge Cases", ctx);

  CPU.reset();

  CPU.writeRegister(5, -1);

  assert("Negative register clamps", CPU.readRegister(5) === 255, ctx);

  CPU.writeRegister(5, 999);

  assert("Large register clamps", CPU.readRegister(5) === 231, ctx);

  CPU.pushStackBack(999);

  assert("Stack clamps", CPU.stack[7] === 231, ctx);

  CPU.pc = 255;

  CPU.tick();

  assert("PC wraps after 255", CPU.pc === 0, ctx);

  CPU.ROM[0] = null;

  assert("Null ROM becomes NOP", CPU.fetch().opcode === 0, ctx);

  endGroup(ctx);
}
