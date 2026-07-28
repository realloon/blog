---
title: RimSage
pubDate: 2026-1-27
---

如果你曾使用 AI 辅助开发 Mod，你会发现，主流LLM在编程“能力”上是没有问题的，但常犯“知识”错误：使用不存在的 RimWorld API。

很大程度上，这不能怪 LLM，它当然只能依赖互联网中已经存在的资料来训练和检索知识，这势必让它掌握的可能是过时、错误乃至虚假的 API。

一个自然的想法是，“我们可以先将所有的源码喂给 LLM 呀，这样它不就全知全能了吗？”理论上确实如此，但实际面临两个问题：

模型的上下文窗口有限。目前（2026年1月）的主流LLM上下文窗口集中在 256K 左右，而 RimWorld 的源码，光 C# 就超过一百万行，XML 更是四百多万行，即使是有 2M 上下文的 Grok 4 Fast，也是远远无法吞下如此庞大的代码量的。

上下文越长，模型表现越差。理想情况下，应提供给LLM尽可能少的必要消息。尽管不是越短的上下文越好，但更长的上下文往往是坏味道。无关的、冗余的信息只是噪音，它们不仅浪费 Tokens，还会降低 LLM 的输出表现[^1]：

![instructionfollowing](https://www.humanlayer.dev/blog/writing-a-good-claude-md/instructionfollowing.png)

业界早有解决上述问题的成熟方案，即建立代码库索引。实际上，你用 Argument Code、Cursor 或 Claude Code 等 AI 客户端打开 RimWorld 的源码仓库，你就享受到了。但这仍存在一些不足之处。首先，这要求你反编译一份 RimWorld 源码，并将其作为Agent的工作目录，这就存在不便之处。其次，这种检索方式基于通用方案，未对 RimWorld 的特定架构做针对设计，效率较差。再者，面对如此庞大的体量，不仅难以保证检索的质量和效果，还会消耗大量 Tokens。

[RimSage](https://github.com/realloon/RimSage) 因上述思考而生。它是我开发的 MCP Server，为 Agent 提供一系列工具，让其像专业程序员那样在 RimWorld 源码中高效检索信息，掌握真相。

[^1]: <https://www.humanlayer.dev/blog/writing-a-good-claude-md>
