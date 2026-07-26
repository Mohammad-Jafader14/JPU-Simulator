export function createContext(output) {
  return {
    passed: 0,
    failed: 0,

    groups: 0,
    groupPassed: 0,
    groupFailed: 0,

    output,

    log(text) {
      this.output.textContent += text + "\n";
    },
  };
}


export function startGroup(name, ctx) {
  ctx.groups++;

  ctx.groupPassed = 0;
  ctx.groupFailed = 0;

  ctx.log("");
  ctx.log("==============================");
  ctx.log(name.toUpperCase());
  ctx.log("==============================");
}


export function assert(name, condition, ctx) {
  if (condition) {
    ctx.log(`✅ ${name}`);

    ctx.passed++;
    ctx.groupPassed++;

  } else {
    ctx.log(`❌ ${name}`);

    ctx.failed++;
    ctx.groupFailed++;
  }
}


export function endGroup(ctx) {
  const total = ctx.groupPassed + ctx.groupFailed;

  ctx.log("");

  ctx.log(
    `Score: ${ctx.groupPassed}/${total}`
  );

  ctx.log("");
}


export function finish(ctx, summary) {

  ctx.log("");
  ctx.log("==============================");
  ctx.log("TOTAL");
  ctx.log("==============================");

  ctx.log(
    `Groups: ${ctx.groups}`
  );

  ctx.log(
    `Tests: ${ctx.passed}/${ctx.passed + ctx.failed}`
  );


  summary.innerHTML = `
    <div>
      Groups:
      <b>${ctx.groups}</b>
    </div>

    <div>
      Tests:
      <b>${ctx.passed}/${ctx.passed + ctx.failed}</b>
    </div>

    <div>
      Failed:
      <b>${ctx.failed}</b>
    </div>
  `;
}