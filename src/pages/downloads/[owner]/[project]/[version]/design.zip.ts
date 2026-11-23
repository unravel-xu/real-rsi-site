import type { APIRoute, GetStaticPaths } from 'astro';
import { designZip, loadCatalog } from '../../../../../lib/catalog.mjs';

export const getStaticPaths = (() => loadCatalog().flatMap(({ releases }) => releases.map((release) => ({
  params: { owner: release.owner, project: release.project, version: release.version },
  props: { release },
})))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) => new Response(new Uint8Array(designZip(props.release)), {
  headers: { 'content-type': 'application/zip' },
});
