import { build } from 'esbuild';
await build({entryPoints:['api/handler.ts'],bundle:true,platform:'node',format:'esm',outfile:'api/index.js',packages:'external',banner:{js:'import { createRequire } from "module"; const require = createRequire(import.meta.url);'},external:['pg','@electric-sql/pglite']});
