// deno run -A --unstable demo.js

await Promise.all([serve(), curl()]);

async function serve() {
  const listener = Deno.listen({port: 8000});
  const conn = await listener.accept();
  const http = Deno.serveHttp(conn);
  for (; ;) {
    const req = await http.nextRequest();
    if (req == null) break;

    await req.respondWith((async () => {
      await delay(20);
      return new Response(`Hello`);
    })());
  }
}

async function curl() {
  const proc = Deno.run({
    cmd: ["curl", "--http2-prior-knowledge", "http://localhost:8000/?[1-1000]"],
  });
  await delay(10);
  proc.kill("SIGKILL");
}

async function delay(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}
