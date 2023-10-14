import "./register.ts"
export * as Http from "./http/Http.ts"
export * from "./print/print.ts"

export async function buildClient({ outdir = 'static/dist' }) {
  return await Bun.build({
    entrypoints: ['src/client/client.ts'],
    minify: true,
    outdir,
    target: 'browser',
  })
}
