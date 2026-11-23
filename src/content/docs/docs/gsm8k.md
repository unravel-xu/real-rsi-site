---
title: GSM8K 示例
description: 下载 GSM8K Prompt 自改进设计，了解四个 Module 和实验复跑条件。
---

[GSM8K Prompt 自改进 MVP](../../market/real-rsi/gsm8k-prompt/) 根据训练题上的诊断提出候选 Prompt。它先在验证题上比较候选和基线，候选严格胜出才采用，再在独立测试题上对比两份 Prompt。

## 导入设计

从配置页下载 `0.1.0` 设计 ZIP，按[导入指南](../import/)打开草稿。设计包含可直接查看的 Workflow 和四个 Module。

| Module | 职责 |
| --- | --- |
| Provider | 提供题目和评测参考 |
| Executor | 使用给定 Prompt 解题 |
| Improver | 根据诊断提出候选 Prompt |
| Evaluator | 对照参考答案计算结果 |

## 复跑实验

复跑使用完整的 `real-rsi/gsm8k-prompt` 贡献包。需要兼容的 CLI 和 SDK、`experiments/smoke.json`、六道自编 GSM8K 格式题、初始 Prompt，以及样例自定义实现和实验绑定。可从有读取权限的 real-rsi 源码 checkout 中获取这些文件。以下命令在已完成 `make install` 的 Linux、macOS 或 WSL 环境中，从源码仓库根目录运行。

```sh
.venv/bin/python tools/contributions.py check contributions/real-rsi/gsm8k-prompt
.venv/bin/python tools/contributions.py run contributions/real-rsi/gsm8k-prompt \
  --store .rsi/contributions/gsm8k-smoke
```

确定性夹具预期验证集和测试集均从 **1/2 提升到 2/2**，共 **23 次 Module 调用**，结束原因为 `candidate_improved_validation`。这是一项软件流程验收。
