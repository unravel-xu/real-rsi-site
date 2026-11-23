export const repository = 'https://github.com/unravel-xu/real-rsi-site';

export function sitePath(path = '') {
  return `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path}`;
}

export function siteSectionPath(path: '' | 'docs/' | 'market/' = '') {
  const href = sitePath(path);
  // Keep section navigation on the current deployment when older HTML is cached.
  const revision = import.meta.env.PUBLIC_SITE_REVISION?.slice(0, 12);
  return revision ? `${href}?v=${encodeURIComponent(revision)}` : href;
}

export const navItems = [
  { section: 'home', text: '首页', href: siteSectionPath() },
  { section: 'docs', text: '文档库', href: siteSectionPath('docs/') },
  { section: 'market', text: '配置市场', href: siteSectionPath('market/') },
] as const;
