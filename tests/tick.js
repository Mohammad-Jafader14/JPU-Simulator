import {
  startGroup,
  assert,
  endGroup
} from "./helpers.js";


export function runTickTests(ctx, CPU) {

  startGroup("Tick", ctx);


  CPU.reset();


  CPU.ROM[0] = {
    opcode: 2,
    rg: 5,
    operand: 99
  };


  CPU.tick();


  assert(
    "Tick executes instruction",
    CPU.readRegister(5) === 99,
    ctx
  );


  assert(
    "Tick increments PC",
    CPU.pc === 1,
    ctx
  );



  CPU.reset();


  CPU.ROM[0] = {
    opcode: 1,
    operand: 50
  };


  CPU.tick();


  assert(
    "Tick respects JMP",
    CPU.pc === 50,
    ctx
  );


  endGroup(ctx);
}