import {
  startGroup,
  assert,
  endGroup
} from "./helpers.js";


export function runFetchTests(ctx, CPU) {

  startGroup("Fetch", ctx);


  CPU.ROM[0] = {
    opcode: 2,
    rg: 5,
    operand: 123
  };


  CPU.pc = 0;


  const instruction = CPU.fetch();


  assert(
    "Fetch returns ROM instruction",
    instruction.opcode === 2,
    ctx
  );


  CPU.pc = 20;


  const empty = CPU.fetch();


  assert(
    "Empty ROM returns NOP",
    empty.opcode === 0,
    ctx
  );


  endGroup(ctx);
}