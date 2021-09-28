// deno run -A --unstable recverror.js

const listener = Deno.listen({port: 8000});
const conn = await listener.accept();
const http = Deno.serveHttp(conn);

let i = 0;
for (; ;) {
  const req = await http.nextRequest();
  if (req == null) break;
  try {
    await req.respondWith((async () => {
      await delay(1000);
      return new Response(`Response #${++i}`);
    })());
  } catch (err) {
    console.error("error", err);
  }
}

async function delay(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}
