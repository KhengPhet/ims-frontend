// Vercel Serverless Function entry point for Angular SSR.
//
// vercel.json rewrites every request to /api, which maps to this file.
// It lazy-loads the compiled Angular server bundle (built by `ng build`)
// and delegates to the `reqHandler` exported from src/server.ts.
// The listen() call in src/server.ts is skipped because this module is
// not the main entry point (isMainModule(import.meta.url) === false).

const path = require('path');
const { pathToFileURL } = require('url');

let angularHandler;

module.exports = async function handler(req, res) {
  if (!angularHandler) {
    const serverPath = path.join(
      process.cwd(),
      'dist/inventory-client/server/server.mjs',
    );
    const mod = await import(pathToFileURL(serverPath).href);
    angularHandler = mod.reqHandler;
  }
  return angularHandler(req, res);
};
