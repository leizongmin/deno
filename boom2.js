// deno run -A --unstable recverror.js

import { assert } from "https://deno.land/std@0.108.0/testing/asserts.ts";

await Promise.all([serve(), curl()]);

async function serve() {
  const listener = Deno.listen({ port: 8000 });
  const conn = await listener.accept();
  const http = Deno.serveHttp(conn);

  let i = 0;
  for (;;) {
    const req = await http.nextRequest();
    if (req == null) break;

    await req.respondWith((async () => {
      await delay(10);
      const res = new Response(`Response #${++i}`);
      await delay(10);
      return res;
    })());
  }
}

async function curl() {
  const proc = Deno.run({
    cmd: ["curl", "--http2-prior-knowledge", "http://localhost:8000/?[0-999]"],
  });
  await delay(200);
  proc.kill("SIGKILL");
  const status = await proc.status();
  assert(!status.success);
}

async function delay(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}
