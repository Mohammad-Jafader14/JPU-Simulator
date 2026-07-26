import {
  startGroup,
  assert,
  endGroup
} from "./helpers.js";

import { executeALU } from "../js/alu.js";


export function runALUFlagTests(ctx, CPU) {

  startGroup("ALU Flags", ctx);


  let output;


  output = executeALU(
    0,
    0,
    0
  );


  assert(
    "Zero flag",
    output.flags.zr === true,
    ctx
  );


  assert(
    "Not zero flag",
    output.flags.nzr === false,
    ctx
  );


  output = executeALU(
    0,
    200,
    100
  );


  assert(
    "Carry flag",
    output.flags.cry === true,
    ctx
  );



  output = executeALU(
    14,
    255,
    20
  );


  assert(
    "MAX flag",
    output.flags.max === true,
    ctx
  );



  output = executeALU(
    15,
    5,
    10
  );


  assert(
    "Less comparison",
    output.flags["a<b"] === true,
    ctx
  );


  output = executeALU(
    15,
    10,
    10
  );


  assert(
    "Equal comparison",
    output.flags["a=b"] === true,
    ctx
  );


output = executeALU(
    13,
    7,
    5
);


assert(
    "Prime detection",
    output.flags.prm === true,
    ctx
);


  endGroup(ctx);
}