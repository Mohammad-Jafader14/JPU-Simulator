import {
  startGroup,
  assert,
  endGroup
} from "./helpers.js";


export function runRegisterTests(ctx, CPU) {

  startGroup("Registers", ctx);


  CPU.reset();


  CPU.writeRegister(5, 123);

  assert(
    "Write Register",
    CPU.readRegister(5) === 123,
    ctx
  );


  CPU.writeRegister(5, 300);

  assert(
    "Register clamps to 8-bit",
    CPU.readRegister(5) === 44,
    ctx
  );


  CPU.writeRegister(0, 255);

  assert(
    "Register 0 is constant zero",
    CPU.readRegister(0) === 0,
    ctx
  );


  CPU.writeRegister(10, 77);

  assert(
    "Read Register",
    CPU.readRegister(10) === 77,
    ctx
  );


  CPU.reset();

  assert(
    "Reset clears registers",
    CPU.readRegister(10) === 0,
    ctx
  );


  endGroup(ctx);
}