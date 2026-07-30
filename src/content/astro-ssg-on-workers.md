---
title: 蓦然回首，到了和 Cloudflare Pages 说再见的时候
pubDate: 2026-07-31
---

用 Cloudflare Pages 很长时间了。

连接 Git 仓库，选择预设框架，等待一会儿，网站就上线了。提交之后也会自动重新部署，很省心。

后来 Cloudflare 力推 Workers，将 Pages 的入口藏得越来越深，力图取代 Pages。我只是想部署静态网站，不在乎什么 Workers。

在用 Astro 重构 [RimSage](https://rimsage.com) 的官网后，试着在 Cloudflare Pages 上也部署一份，等 VPS 过期就迁移过来。

## 不愉快的意外

部署时没细看，弄成部署在 Workers 上了，当时的场景大概是这样：

<img src="https://oss-1259210922.cos.ap-nanjing.myqcloud.com/Cloudflare/WorkersOrPages" width="991px" height="670px" alt="Workers Or Pages" loading="lazy" />

全然没注意到底部的 Pages 入口，将 Astro SSG 项目部署到了 Workers。

部署后，发现 Cloudflare 给我的仓库提了个 PR，我想这也太先进了。可仔细一看，发现它引入了 `@astrojs/cloudflare@13.5.4` 和 `Wrangler`，让项目变成了 Server 模式。

这让我有点生气，这也太平台绑定了，这个项目静态部署在 VPS 上好好的呢。愤懑之下取消了合并，重新以 Pages 部署，还是老伙计可靠呀。

## 意外的愉快

心血来潮想试试 Cloudflare 优选，听说最简单的方式是以 Workers 部署网站，我抱着“实在不行就 SSR 吧”的心态再次选择了 Workers。

没想到，这次不再有 PR，直接就部署好了。看到这里更是令我开心：

<img src="https://oss-1259210922.cos.ap-nanjing.myqcloud.com/Cloudflare/OnlyStaticAssets" width="1148" height="266" alt="Only Static Assets" loading="lazy" />

只有静态资产的 Worker 是被原生支持的！

好事是什么时候发生的呢？要是过去我也就抛诸脑后了，懒得细查。

## 让 Agent 查查

现在可是人工智能的时代，让 Agent 来分析再合适不过。

GPT 很快找到了 Cloudflare bot 在 5 月 26 日留下的提交：“Add Cloudflare Workers configuration”。在这次改动中，它安装了 `@astrojs/cloudflare@13.5.4` 和 Wrangler，创建了 `cloudflare/workers-autoconfig`，还写了几份配置文件。

了解 `@astrojs/cloudflare` 13.5.4 变动，发现了关键：这个版本将 adapter 的构建输出固定为 `server`。

这意味着，即使每一个页面已经被静态生成了，项目仍会构建 SSR 环境和 Worker 入口。

## 只差两天

Cloudflare bot 在 5 月 26 日为我的项目选择了当时最新的 13.5.4。

就在第二天，Astro 合并了一项[修复](https://github.com/withastro/astro/commit/4cff3a107c3750ab5f0878a6b41836705282b771)：让完全静态的项目跳过 SSR 构建。

再过一天，修复随 `@astrojs/cloudflare` 13.6.0 发布。自此，adapter 不再固定为 `server`，而是判断构建类型，若所有页面均已预渲染，就直接跳过 SSR 构建。

也就是说，要是晚两天再试，体验就截然不同了。

现在的情况是，虽然产品名叫 Cloudflare Workers，但可以只是分发静态资源，并没有 Worker 存在。

## 奇怪的感慨

既然 Workers 这么好用了，确实到了和 Cloudflare Pages 说再见的时候，迎接新时代吧。

顺手逛了一圈 Cloudflare 控制台，发现许多面板也比印象中更好用了。

我觉得我生活在一个幸福的时代，生产工具的演进增益着我。
