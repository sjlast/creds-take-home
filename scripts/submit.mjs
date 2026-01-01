// Packages the committed work as submission.zip.
import { spawnSync } from 'node:child_process';
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { zipSync } from 'fflate';

const root = resolve(import.meta.dirname, '..');
const outputName = 'submission.zip';

function git(args) {
  const result = spawnSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 });
  if (result.error) {
    if (result.error.code === 'ENOENT') {
      console.error('git was not found. Install git, then run pnpm submit again.');
    } else {
      console.error(`Could not run git: ${result.error.message}`);
    }
    process.exit(1);
  }
  if (result.status !== 0) {
    console.error(`git ${args.join(' ')} failed:\n${result.stderr}`);
    console.error('Run pnpm submit from inside the project folder, which must be a git repository.');
    process.exit(1);
  }
  return result.stdout;
}

// A path from `git status --porcelain` starts after the two status letters and a space.
const dirty = git(['status', '--porcelain'])
  .split('\n')
  .filter((line) => line !== '')
  .map((line) => line.slice(3));

if (dirty.length > 0) {
  console.error('These files are not committed:');
  for (const path of dirty) {
    console.error(`  ${path}`);
  }
  console.error('');
  console.error(
    'Commit them with git, or add them to .gitignore if they should not be sent. Then run pnpm submit again.',
  );
  process.exit(1);
}

const entries = {};

function addFile(relativePath) {
  entries[relativePath] = readFileSync(join(root, relativePath));
}

function addFolder(relativeDir) {
  for (const name of readdirSync(join(root, relativeDir))) {
    const relativePath = `${relativeDir}/${name}`;
    if (statSync(join(root, relativePath)).isDirectory()) {
      addFolder(relativePath);
    } else {
      addFile(relativePath);
    }
  }
}

// With a clean tree, tracked files are the working tree minus ignored files.
for (const path of git(['ls-files', '-z']).split('\0')) {
  if (path !== '' && path !== outputName) {
    addFile(path);
  }
}
addFolder('.git');

const output = join(root, outputName);
writeFileSync(output, zipSync(entries));
console.log(`Wrote ${output}`);
console.log('Send us that file.');
