import {
  startGroup,
  assert,
  endGroup
} from "./helpers.js";


export function runResetTests(ctx, CPU) {

  startGroup("Reset", ctx);


  CPU.pc = 100;

  CPU.writeRegister(5, 55);

  CPU.ram0[20] = 99;

  CPU.ram1[30] = 88;

  CPU.stack[7] = 77;


  CPU.flags.zr = true;

  CPU.flags.prm = true;


  CPU.reset();



  assert(
    "PC reset",
    CPU.pc === 0,
    ctx
  );


  assert(
    "Registers reset",
    CPU.readRegister(5) === 0,
    ctx
  );


  assert(
    "RAM0 reset",
    CPU.ram0[20] === 0,
    ctx
  );


  assert(
    "RAM1 reset",
    CPU.ram1[30] === 0,
    ctx
  );


  assert(
    "Stack reset",
    CPU.stack[7] === 0,
    ctx
  );


  assert(
    "Flags reset",
    CPU.flags.zr === false &&
    CPU.flags.prm === false,
    ctx
  );


  endGroup(ctx);
}