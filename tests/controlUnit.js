import {
  startGroup,
  assert,
  endGroup
} from "./helpers.js";


export function runControlUnitTests(ctx, CPU) {

  startGroup("Control Unit", ctx);


  const tests = [
    {
      name: "NOP",
      opcode: 0,
      check: c => c.writeReg === false
    },

    {
      name: "JMP",
      opcode: 1,
      check: c => c.pcChange === true
    },

    {
      name: "LDI",
      opcode: 2,
      check: c => c.writeReg === true
    },

    {
      name: "ALU",
      opcode: 3,
      check: c => c.useALU === true
    },

    {
      name: "STR0",
      opcode: 4,
      check: c => c.writeRAM0 === true
    },

    {
      name: "LOD0",
      opcode: 5,
      check: c => c.readRAM0 === true
    },

    {
      name: "STR1",
      opcode: 6,
      check: c => c.writeRAM1 === true
    },

    {
      name: "LOD1",
      opcode: 7,
      check: c => c.readRAM1 === true
    },

    {
      name: "CAL",
      opcode: 8,
      check: c => c.call === true
    },

    {
      name: "RET",
      opcode: 9,
      check: c => c.return === true
    },

    {
      name: "PSHL",
      opcode: 10,
      check: c => c.pushLast === true
    },

    {
      name: "PSHF",
      opcode: 11,
      check: c => c.pushFirst === true
    },

    {
      name: "POPL",
      opcode: 12,
      check: c => c.popLast === true
    },

    {
      name: "POPF",
      opcode: 13,
      check: c => c.popFirst === true
    },

    {
      name: "HLT",
      opcode: 14,
      check: c => c.halt === true
    }
  ];


  tests.forEach(test => {

    const control = CPU.controlUnit({
      opcode: test.opcode
    });


    assert(
      test.name,
      test.check(control),
      ctx
    );

  });


  assert(
    "Invalid opcode returns empty control",
    Object.keys(
      CPU.controlUnit({opcode:255})
    ).length === 0,
    ctx
  );


  endGroup(ctx);
}