---
title: 贡献一份配置
description: 从 Panel 导出 System 设计并向公开目录提交 GitHub PR。
---

1. 在 Panel 的「检查与发布」选择「导出完整设计包（ZIP）」。
2. Fork [公开站点仓库](https://github.com/unravel-xu/real-rsi-site)，把 `manifest.json` 和 `system.json` 解包到 `contributions/<owner>/<project>/<version>/`。
3. 将 manifest 的 `package_id` 和 `version` 改为目录中的 `owner/project` 和三段数字版本。
4. 在同一目录添加 `catalog.json`，写上摘要、分类和可供搜索的标签。
5. 提交 PR，说明用途、依赖、分享授权及导入验证结果。更新配置时新增一个版本目录。

```json
{
  "summary": "用训练诊断提出候选 Prompt，经验证后决定是否采用。",
  "category": "Prompt 优化",
  "tags": ["GSM8K", "确定性示例"]
}
```

请使用已有内联 Workflow 的 Panel 设计文件，并整理其中可能包含的本地路径、凭据和私有信息。贡献目录仅包含上述三个文件。实验模板、Python 实现与运行所需资源可在复跑说明中交代获取方式。

PR 校验包结构、版本和设计下载限制。维护者试导入并审核后合并，生产构建会将配置加入目录。
