/**
 * Executes one 8-bit ALU operation and returns both its result and condition flags.
 * The CPU uses this helper as a pure function so the arithmetic logic can be tested
 * independently from the rest of the emulator and reused in other interfaces later.
 */
export function executeALU(operation, a, b) {
  a &= 0xff;
  b &= 0xff;

  let result = 0;

  switch (operation) {
    case 0: // ADD
      result = a + b;
      result &= 0xff;
      break;

    case 1: // SUB
      result = (a - b) & 0xff;
      break;

    case 2: // MUL
      result = (a * b) & 0xff;
      break;

    case 3: // MUL2
      result = ((a * b) >> 8) & 0xff;
      break;

    case 4: // MOD
      result = b === 0 ? 0 : a % b;
      break;

    case 5: // SHL
      result = (a << b) & 0xff;
      break;

    case 6: // SHR
      result = (a >>> b) & 0xff;
      break;

    case 7: // ROR
      b &= 7;
      result = ((a >>> b) | (a << (8 - b))) & 0xff;
      break;

    case 8: // ROL
      b &= 7;
      result = ((a << b) | (a >>> (8 - b))) & 0xff;
      break;

    case 9: // AND
      result = a & b;
      break;

    case 10: // NAND
      result = ~(a & b) & 0xff;
      break;

    case 11: // OR
      result = a | b;
      break;

    case 12: // NOR
      result = ~(a | b) & 0xff;
      break;

    case 13: // XOR
      result = a ^ b;
      break;

    case 14: // MAX
      result = Math.max(a, b);
      break;

    case 15: // MIN
      result = Math.min(a, b);
      break;
    default:
      result = 0;
      break;
  }
  let carry = a + b > 255;
  return {
    result,
    flags: getFlags(result, carry, a, b),
  };
}

/** Small primality check used by the PRM/NPRM condition flags. */
function isprm(n) {
  if (n < 2) return false;

  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) return false;
  }

  return true;
}

/** Builds every condition flag from the final result and original ALU inputs. */
function getFlags(value, carry, a, b) {
  value &= 0xff;

  const prm = isprm(value);

  return {
    zr: value === 0,
    nzr: value !== 0,

    msb: (value & 0x80) !== 0,
    nmsb: (value & 0x80) === 0,

    lsb: (value & 1) !== 0,
    nlsb: (value & 1) === 0,

    cry: carry,
    ncry: !carry,

    "a>b": a > b,
    "a<b": a < b,

    "a=b": a === b,
    "a!=b": a !== b,

    max: value === 255,
    nmax: value !== 255,

    prm: prm,
    nprm: !prm,
  };
}
