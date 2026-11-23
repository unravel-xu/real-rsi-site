# real-rsi-site

real-rsi 的公开文档和社区配置市场。首页、Starlight 文档和 Astro 市场共享一次静态构建。

- [公开站点](https://unravel-xu.github.io/real-rsi-site/)
- [投稿指南](https://unravel-xu.github.io/real-rsi-site/docs/contribute/)

## 本地开发

需要 Node.js 22.23.4 或更新版本及 npm。CI 使用 Node.js 24。

```sh
npm ci
npm run dev
```

使用 Astro 输出的站点地址，开发和生产共用 `/real-rsi-site/` 路径前缀。

```sh
npm run validate
npm run check
npm run build
```

## 贡献与发布

一个版本目录使用 `contributions/<owner>/<project>/<version>/`。目录包含 `manifest.json`、内联 Workflow 的 Panel 设计 `system.json`，以及 `catalog.json`。新增版本时保留已发布版本的目录。市场从这些文件生成详情和下载，`catalog.json` 不进入 Panel 的设计 ZIP。

文档是可独立阅读的公开指南，位于 `src/content/docs/docs/`。GSM8K 的首个条目使用 Panel 预设导出的设计，完整实验包由兼容的 real-rsi CLI 处理。

GitHub Actions 校验投稿和站点改动。通过构建的 `main` 部署到 GitHub Pages，仓库的 Pages 发布源使用 GitHub Actions。
