import { CPU } from "../js/cpu.js";

import { createContext, finish } from "./helpers.js";

import { runRegisterTests } from "./registers.js";

import { runStackTests } from "./stack.js";

import { runMuxTests } from "./muxes.js";

import { runConditionTests } from "./conditions.js";

import { runControlUnitTests } from "./controlUnit.js";

import { runRAMTests } from "./ram.js";

import { runResetTests } from "./reset.js";

import { runALUTests } from "./alu.js";

import { runALUFlagTests } from "./aluFlags.js";

import { runFetchTests } from "./fetch.js";

import { runTickTests } from "./tick.js";

import { runExecutionTests } from "./execution.js";

import { runEdgeCaseTests } from "./edgeCases.js";

const output = document.getElementById("consoleOutput");

const summary = document.getElementById("summary");

const button = document.getElementById("runTests");

button.onclick = () => {
  output.textContent = "";

  CPU.reset();

  const ctx = createContext(output);

  runRegisterTests(ctx, CPU);

  runStackTests(ctx, CPU);

  runMuxTests(ctx, CPU);

  runConditionTests(ctx, CPU);

  runControlUnitTests(ctx, CPU);

  runRAMTests(ctx, CPU);

  runResetTests(ctx, CPU);

  runALUTests(ctx, CPU);

  runALUFlagTests(ctx, CPU);

  runFetchTests(ctx, CPU);

  runTickTests(ctx, CPU);

  runExecutionTests(ctx, CPU);

  runEdgeCaseTests(ctx, CPU);

  finish(ctx, summary);
};
