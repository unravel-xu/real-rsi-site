export const repository = 'https://github.com/unravel-xu/real-rsi-site';

export function sitePath(path = '') {
  return `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path}`;
}

export const navItems = [
  { section: 'home', text: '首页', href: sitePath() },
  { section: 'docs', text: '文档库', href: sitePath('docs/') },
  { section: 'market', text: '配置市场', href: sitePath('market/') },
] as const;
