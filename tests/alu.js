import {
  startGroup,
  assert,
  endGroup
} from "./helpers.js";

import { executeALU } from "../js/alu.js";


export function runALUTests(ctx, CPU) {

  startGroup("ALU", ctx);


  const tests = [

    {
      name: "ADD",
      op: 0,
      a: 5,
      b: 3,
      expected: 8
    },

    {
      name: "SUB",
      op: 1,
      a: 5,
      b: 3,
      expected: 2
    },

    {
      name: "MUL",
      op: 2,
      a: 5,
      b: 3,
      expected: 15
    },

    {
      name: "MUL2",
      op: 3,
      a: 255,
      b: 2,
      expected: 1
    },

    {
      name: "MOD",
      op: 4,
      a: 10,
      b: 3,
      expected: 1
    },

    {
      name: "SHL",
      op: 5,
      a: 1,
      b: 3,
      expected: 8
    },

    {
      name: "SHR",
      op: 6,
      a: 8,
      b: 3,
      expected: 1
    },

    {
      name: "ROR",
      op: 7,
      a: 1,
      b: 1,
      expected: 128
    },

    {
      name: "ROL",
      op: 8,
      a: 128,
      b: 1,
      expected: 1
    },

    {
      name: "AND",
      op: 9,
      a: 0b1100,
      b: 0b1010,
      expected: 0b1000
    },

    {
      name: "NAND",
      op: 10,
      a: 0b1100,
      b: 0b1010,
      expected: 0b11110111
    },

    {
      name: "OR",
      op: 11,
      a: 0b1100,
      b: 0b1010,
      expected: 0b1110
    },

    {
      name: "NOR",
      op: 12,
      a: 0b1100,
      b: 0b1010,
      expected: 0b11110001
    },

    {
      name: "XOR",
      op: 13,
      a: 0b1100,
      b: 0b1010,
      expected: 0b0110
    },

    {
      name: "MAX",
      op: 14,
      a: 100,
      b: 50,
      expected: 100
    },

    {
      name: "MIN",
      op: 15,
      a: 100,
      b: 50,
      expected: 50
    }

  ];


  tests.forEach(t => {

    const result = executeALU(
      t.op,
      t.a,
      t.b
    );


    assert(
      t.name,
      result.result === t.expected,
      ctx
    );

  });


  endGroup(ctx);
}