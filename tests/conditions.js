import { startGroup, assert, endGroup } from "./helpers.js";

export function runConditionTests(ctx, CPU) {
  startGroup("Conditions", ctx);

  const conditions = [
    ["ZR", "zr"],
    ["NZR", "nzr"],

    ["MSB", "msb"],
    ["NOT MSB", "nmsb"],

    ["LSB", "lsb"],
    ["NOT LSB", "nlsb"],

    ["CARRY", "cry"],
    ["NOT CARRY", "ncry"],

    ["GREATER", "greater"],
    ["LESS", "less"],

    ["EQUAL", "equal"],
    ["INEQUAL", "inequal"],

    ["MAX", "max"],
    ["NOT MAX", "nmax"],

    ["PRIME", "prm"],
    ["NOT PRIME", "nprm"],
  ];

  conditions.forEach(([name, flag], index) => {
    CPU.flags[flag] = true;

    assert(`${name} condition`, CPU.checkCondition(index) === true, ctx);

    CPU.flags[flag] = false;

    assert(`${name} false condition`, CPU.checkCondition(index) === false, ctx);
  });

  assert(
    "Invalid condition defaults true",
    CPU.checkCondition(255) === true,
    ctx,
  );

  endGroup(ctx);
}
