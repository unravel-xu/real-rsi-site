---
title: 导入 System 设计
description: 在 real-rsi Panel 中导入设计 ZIP 或 system.json。
---

1. 打开[配置市场](../../market/)，进入你要使用的配置详情页。
2. 从「版本下载」选择设计 ZIP 或 `system.json`。
3. 在自己的 Panel 打开「系统」列表，选择「导入系统」。
4. 选中文件，点击「导入并打开」。Panel 会创建独立草稿。
5. 在草稿中依次查看需求、Module、接口和 Workflow。准备发布时，继续走 Panel 的审阅与校验流程。

## 文件与版本

- 设计 ZIP 根目录包含 `system.json`，同时附带贡献包的 `manifest.json`。Panel 也支持单独导入 `system.json`。
- 此目录收录使用设计格式 `real-rsi.system-design.v2` 和 System Schema `rsi.system-definition.v4` 的包。需要支持该格式的 Panel。
- Panel 对上传文件及 ZIP 内的 `system.json` 分别执行 8 MiB 限制。
- 要运行实验，还需要发布设计版本，并按实验要求提供实现绑定、输入、资源和预算。GSM8K 的 CLI 复跑条件见[示例指南](../gsm8k/#复跑实验)。
