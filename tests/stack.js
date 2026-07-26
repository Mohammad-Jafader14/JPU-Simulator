import { startGroup, assert, endGroup } from "./helpers.js";

export function runStackTests(ctx, CPU) {
  startGroup("Stack", ctx);

  CPU.reset();

  CPU.pushStackBack(123);

  assert("Push Stack", CPU.stack[7] === 123, ctx);

  assert("Pop Stack", CPU.popStackBack() === 123, ctx);

  CPU.reset();

  CPU.pushStackFront(55);

  assert("Push Stack Front", CPU.stack[0] === 55, ctx);

  assert("Pop Stack Front", CPU.popStackFront() === 55, ctx);

  CPU.pushStackBack(300);

  assert("Stack clamps to 8-bit", CPU.stack[7] === 44, ctx);

  endGroup(ctx);
}
