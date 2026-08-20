import { builtinModules, createRequire } from 'node:module';
import { access, readFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build, context } from 'esbuild';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const externalModules = new Set(['vscode', 'ssh2', ...builtinModules, ...builtinModules.map(name => `node:${name}`)]);

async function resolveProjectImport(specifier, importer) {
  const base = path.resolve(path.dirname(importer), specifier);
  const candidates = [base, `${base}.ts`, path.join(base, 'index.ts')];

  for (const candidate of candidates) {
    try {
      await access(candidate);
      return candidate;
    } catch {
      // Try the next supported TypeScript path.
    }
  }

  throw new Error(`Cannot resolve ${specifier} from ${importer}`);
}

const projectSources = {
  name: 'project-sources',
  setup(buildContext) {
    buildContext.onResolve({ filter: /^project:/ }, args => ({
      path: path.join(projectRoot, args.path.slice('project:'.length)),
      namespace: 'project-source'
    }));

    buildContext.onResolve({ filter: /^\./, namespace: 'project-source' }, async args => ({
      path: await resolveProjectImport(args.path, args.importer),
      namespace: 'project-source'
    }));

    buildContext.onResolve({ filter: /^[^./]/, namespace: 'project-source' }, args => {
      if (externalModules.has(args.path)) {
        return { path: args.path, external: true };
      }

      return {
        path: require.resolve(args.path, { paths: [projectRoot] }),
        namespace: 'isolated-file'
      };
    });

    buildContext.onLoad({ filter: /\.ts$/, namespace: 'project-source' }, async args => ({
      contents: await readFile(args.path, 'utf8'),
      loader: 'ts',
      resolveDir: path.dirname(args.path)
    }));

    buildContext.onResolve({ filter: /.*/, namespace: 'isolated-file' }, args => {
      if (externalModules.has(args.path)) {
        return { path: args.path, external: true };
      }

      return {
        path: require.resolve(args.path, { paths: [path.dirname(args.importer)] }),
        namespace: 'isolated-file'
      };
    });

    buildContext.onLoad({ filter: /.*/, namespace: 'isolated-file' }, async args => ({
      contents: await readFile(args.path, 'utf8'),
      loader: path.extname(args.path) === '.json' ? 'json' : 'js',
      resolveDir: path.dirname(args.path)
    }));
  }
};

const buildOptions = {
  absWorkingDir: os.tmpdir(),
  entryPoints: ['project:src/extension.ts'],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  target: 'node20',
  outfile: path.join(projectRoot, 'dist/extension.js'),
  plugins: [projectSources],
  logLevel: 'info'
};

if (process.argv.includes('--watch')) {
  const buildContext = await context(buildOptions);
  await buildContext.watch();
  console.log('Watching for changes...');
} else {
  await build(buildOptions);
}
