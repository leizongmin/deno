// deno run -A --unstable recverror.js

import {assert} from "https://deno.land/std@0.108.0/testing/asserts.ts";


const proc = Deno.run({
  cmd: ["curl", "--http2-prior-knowledge", "http://localhost:8000/?[0-999]"],
});
await delay(200);
proc.kill("SIGKILL");
const status = await proc.status();
assert(!status.success);

async function delay(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}
