import { execFileSync } from 'node:child_process';
import { designZip, loadCatalog, loadCatalogRelease } from '../src/lib/catalog.mjs';

function changedReleases(base) {
  if (!/^[0-9a-f]{40}$/.test(base)) throw new Error('Expected a Git commit SHA for --since');
  const diff = execFileSync('git', [
    'diff', '--name-status', '--no-renames', '-z', base, 'HEAD', '--', 'contributions/',
  ], { encoding: 'utf8' });
  const changes = diff.split('\0');
  changes.pop();
  const versions = new Set();
  for (let i = 0; i < changes.length; i += 2) {
    const [status, path] = changes.slice(i, i + 2);
    if (status !== 'A') throw new Error(`Published contribution files must remain unchanged: ${path}`);
    const parts = path.split('/');
    if (parts.length !== 5) throw new Error(`Expected contributions/<owner>/<project>/<version>/<file>: ${path}`);
    versions.add(parts.slice(1, 4).join('/'));
  }
  return [...versions].map((version) => loadCatalogRelease(...version.split('/')));
}

const [mode, base, extra] = process.argv.slice(2);
if (mode && (mode !== '--since' || !base || extra)) {
  throw new Error('Usage: npm run validate -- [--since <commit SHA>]');
}
const releases = mode ? changedReleases(base) : loadCatalog().flatMap((project) => project.releases);
for (const release of releases) designZip(release);
console.log(`Validated ${releases.length} design release(s).`);
