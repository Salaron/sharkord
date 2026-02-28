import esbuild from 'esbuild';
import fs from 'fs';
import path from 'path';

const outDir = path.join(__dirname, '..', 'dist');

const buildOptions: esbuild.BuildOptions = {
  bundle: true,
  sourcemap: 'linked',
  logLevel: 'info',
  format: 'cjs',
  platform: 'node',
  external: ['electron'],
  target: ['esnext'],
  entryPoints: [
    {
      in: 'src/main/index.ts',
      out: 'main'
    },
    {
      in: 'src/preload/index.ts',
      out: 'preload'
    }
  ],
  outdir: outDir
};

if (fs.existsSync(outDir))
  fs.rmdirSync(outDir, { recursive: true });

fs.cpSync('./node_modules/@sharkord/client/dist', outDir, { recursive: true });

fs.mkdirSync(outDir, { recursive: true })

fs.cpSync("./assets/tray.png", path.join(outDir, "tray.png"));

if (process.argv.includes('--watch')) {
  const ctx = await esbuild.context(buildOptions);
  await ctx.watch();
} else {
  await esbuild.build(buildOptions);
}
