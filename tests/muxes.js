import {
  startGroup,
  assert,
  endGroup
} from "./helpers.js";


export function runMuxTests(ctx, CPU) {

  startGroup("MUXes", ctx);


  CPU.reset();


  CPU.writeRegister(5, 99);


  assert(
    "A MUX selects register",
    CPU.readA(5) === 99,
    ctx
  );


  assert(
    "B MUX selects register",
    CPU.readB(5, 123) === 99,
    ctx
  );


  assert(
    "B MUX selects operand using register 63",
    CPU.readB(63, 123) === 123,
    ctx
  );


  assert(
    "Operand clamps to 8-bit",
    CPU.readB(63, 300) === 44,
    ctx
  );


  endGroup(ctx);
}