import { readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { zipSync } from 'fflate';

const catalogRoot = resolve('contributions');
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const versionPattern = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;
const packageFiles = ['catalog.json', 'manifest.json', 'system.json'];
const maxBytes = 8 * 1024 * 1024;

/** @typedef {{manifest_version: 1, package_id: string, version: string, requires_sdk: string, system_schema: string, system: 'system.json'}} Manifest */
/** @typedef {{summary: string, category: string, tags: string[]}} CatalogMetadata */
/** @typedef {{name: string, instances: {instance_id: string, interface_ref: string}[], workflow: Record<string, unknown>}} Definition */
/** @typedef {{owner: string, project: string, version: string, manifest: Manifest, metadata: CatalogMetadata, definition: Definition, directory: string}} Release */
/** @typedef {{owner: string, project: string, latest: Release, releases: Release[]}} Project */

/** @param {string} directory @param {RegExp} pattern */
function readDirectories(directory, pattern) {
  return readdirSync(directory, { withFileTypes: true }).map((entry) => {
    if (!entry.isDirectory() || !pattern.test(entry.name)) {
      throw new Error(`Unexpected catalog path: ${join(directory, entry.name)}`);
    }
    return entry.name;
  });
}

/** @param {string} file */
function readJson(file) {
  if (statSync(file).size > maxBytes) throw new Error(`File exceeds 8 MiB: ${file}`);
  try {
    return JSON.parse(readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));
  } catch (error) {
    throw new Error(`Invalid JSON in ${file}`, { cause: error });
  }
}

/** @param {unknown} value @returns {value is Record<string, unknown>} */
function isObject(value) {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

/** @param {unknown} value */
function isText(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

/** @param {string} directory @param {string} owner @param {string} project @param {string} version @returns {Release} */
function loadRelease(directory, owner, project, version) {
  const files = readdirSync(directory, { withFileTypes: true });
  if (files.length !== packageFiles.length || files.some((file) => !file.isFile() || !packageFiles.includes(file.name))) {
    throw new Error(`Expected catalog.json, manifest.json and system.json in ${directory}`);
  }
  const manifest = readJson(join(directory, 'manifest.json'));
  const metadata = readJson(join(directory, 'catalog.json'));
  const system = readJson(join(directory, 'system.json'));
  if (!isObject(manifest) || Object.keys(manifest).length !== 6 ||
      manifest.manifest_version !== 1 || manifest.package_id !== `${owner}/${project}` ||
      manifest.version !== version || manifest.system !== 'system.json' ||
      manifest.system_schema !== 'rsi.system-definition.v4' || !isText(manifest.requires_sdk)) {
    throw new Error(`Invalid design package manifest in ${directory}`);
  }
  if (!isObject(metadata) || !isText(metadata.summary) || !isText(metadata.category) ||
      !Array.isArray(metadata.tags) || !metadata.tags.every(isText) ||
      new Set(metadata.tags).size !== metadata.tags.length) {
    throw new Error(`Expected a summary, category and unique tags in ${directory}/catalog.json`);
  }
  if (!isObject(system) || system.format !== 'real-rsi.system-design.v2' ||
      !isObject(system.document) || system.document.schema_id !== manifest.system_schema ||
      !isObject(system.document.requirements) || !isObject(system.document.metadata) ||
      !isObject(system.document.metadata.instances) || !Array.isArray(system.document.interface_drafts)) {
    throw new Error(`Expected a portable Panel v2 design in ${directory}/system.json`);
  }
  const definition = system.document.definition;
  if (!isObject(definition) || !isText(definition.name) || !isObject(definition.workflow) ||
      !Array.isArray(definition.instances) || !definition.instances.every((instance) =>
        isObject(instance) && isText(instance.instance_id) && isText(instance.interface_ref))) {
    throw new Error(`Expected named Module instances and an inline Workflow in ${directory}/system.json`);
  }
  return {
    owner, project, version, directory,
    manifest: /** @type {Manifest} */ (manifest),
    metadata: /** @type {CatalogMetadata} */ (metadata),
    definition: /** @type {Definition} */ (definition),
  };
}

/** @param {string} a @param {string} b */
function compareVersions(a, b) {
  const left = a.split('.').map(BigInt);
  const right = b.split('.').map(BigInt);
  for (let i = 0; i < 3; i++) {
    if (left[i] !== right[i]) return left[i] < right[i] ? -1 : 1;
  }
  return 0;
}

/** @param {string} owner @param {string} project @param {string} version */
export function loadCatalogRelease(owner, project, version) {
  if (!slugPattern.test(owner) || !slugPattern.test(project) || !versionPattern.test(version)) {
    throw new Error(`Invalid contribution path: ${owner}/${project}/${version}`);
  }
  return loadRelease(join(catalogRoot, owner, project, version), owner, project, version);
}

/** @returns {Project[]} */
export function loadCatalog(root = catalogRoot) {
  return readDirectories(root, slugPattern).flatMap((owner) => {
    const ownerDirectory = resolve(root, owner);
    return readDirectories(ownerDirectory, slugPattern).map((project) => {
      const projectDirectory = join(ownerDirectory, project);
      const releases = readDirectories(projectDirectory, versionPattern)
        .sort((a, b) => compareVersions(b, a))
        .map((version) => loadRelease(join(projectDirectory, version), owner, project, version));
      if (!releases.length) throw new Error(`Package has no versions: ${owner}/${project}`);
      return { owner, project, latest: releases[0], releases };
    });
  }).sort((a, b) => a.latest.manifest.package_id.localeCompare(b.latest.manifest.package_id));
}

/** @param {Release} release */
export function designJson(release) {
  return readFileSync(join(release.directory, 'system.json'));
}

/** @param {Release} release */
export function designZip(release) {
  const archive = zipSync({
    'manifest.json': readFileSync(join(release.directory, 'manifest.json')),
    'system.json': designJson(release),
  }, { mtime: new Date(2000, 0, 1) });
  if (archive.length > maxBytes) throw new Error(`Design ZIP exceeds 8 MiB: ${release.directory}`);
  return archive;
}
