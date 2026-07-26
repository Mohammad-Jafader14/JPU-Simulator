import {
  startGroup,
  assert,
  endGroup
} from "./helpers.js";


export function runRAMTests(ctx, CPU) {

  startGroup("RAM", ctx);


  CPU.reset();


  // Register -> RAM0

  CPU.writeRegister(5, 123);

  CPU.execute({
    opcode:4,
    b:5,
    operand:10
  });


  assert(
    "Register -> RAM0",
    CPU.ram0[10] === 123,
    ctx
  );



  // RAM0 -> Register

  CPU.execute({
    opcode:5,
    rg:6,
    operand:10
  });


  assert(
    "RAM0 -> Register",
    CPU.readRegister(6) === 123,
    ctx
  );



  // Register -> RAM1

  CPU.writeRegister(7, 55);


  CPU.execute({
    opcode:6,
    b:7,
    operand:20
  });


  assert(
    "Register -> RAM1",
    CPU.ram1[20] === 55,
    ctx
  );



  // RAM1 -> Register

  CPU.execute({
    opcode:7,
    rg:8,
    operand:20
  });


  assert(
    "RAM1 -> Register",
    CPU.readRegister(8) === 55,
    ctx
  );



  assert(
    "RAM0 address 0 works",
    CPU.ram0[0] === 0,
    ctx
  );


  assert(
    "RAM1 address 255 exists",
    CPU.ram1.length === 256,
    ctx
  );


  endGroup(ctx);
}