---
title: RimWorld 1.6 版本新建 Mod 工程的最佳实践
pubDate: 2025-8-6
---

RimWorld 1.6 版本在底层上做了一些改进，我们制作模组时也可以与之共进！

在过去，新建模组工程的标准做法是下载 `full framework 4.7.2`，这在新版本仍稳健可靠。但不再是固定步骤！依据 RimWorld 官方开发团队的建议，我将为大家介绍在新版本创建项目的新流程。

注意：你将会看到我在 macOS 上演示步骤，但在 Windows 上的操作是完全一致（甚至更简）的；我的 IDE 是 Rider，但步骤在 Visual Studio 上也是类似的。

## 配置环境

![新建解决方案主界面](https://oss-1259210922.cos.ap-nanjing.myqcloud.com/RimWorld-Mod-Project/新建解决方案主界面.avif)

打开 Rider，点击左下角的“配置”，再点击“设置”：

<img style="height: 400px" src="https://oss-1259210922.cos.ap-nanjing.myqcloud.com/RimWorld-Mod-Project/配置浮动菜单项目.avif" alt="配置浮动菜单项目" />

在侧边栏中点击“环境”，你会看到：

![环境面板](https://oss-1259210922.cos.ap-nanjing.myqcloud.com/RimWorld-Mod-Project/环境面板.avif)

需要确保 `.NET` 已经安装（不显示 Install 按钮）；如果你与我一样使用 macOS，需要一并安装 [`Mono`](https://www.mono-project.com)。检查无误后，点击右下角“保存”关闭界面。

## 新建解决方案

![新建解决方案](https://oss-1259210922.cos.ap-nanjing.myqcloud.com/RimWorld-Mod-Project/新建解决方案.avif)

点击“新建解决方案”，在配置面板，几个注意的地方：

- 建议**勾选**“将解决方案和项目放在同一目录中”；
- 目标框架暂时选择至最新版本；

确认无误后，点击右下角“创建”以新建工程。

## 引入依赖

我们将不再依赖于本地的 RimWorld `.dll` 文件，而是使用 [`Krafs.Rimworld.Ref`](https://www.nuget.org/packages/Krafs.Rimworld.Ref/) nuget 包导入，这将平台无关，且构建性能更佳。

![引入依赖](https://oss-1259210922.cos.ap-nanjing.myqcloud.com/RimWorld-Mod-Project/引入依赖.avif)

如果 Rider 左侧边栏中没有 Nuget 按钮，你可能需要手动显示它，或者使用命令行安装：

```sh
dotnet add package Krafs.Rimworld.Ref --version 1.6.4543
```

![安装依赖](https://oss-1259210922.cos.ap-nanjing.myqcloud.com/RimWorld-Mod-Project/安装依赖.avif)

确认无误后，点击右下角的“安装”以添加依赖到本地；如果你在上一步采用命令行，效果是一样的。

## 更改编译目标

Rimworld 1.6 版本利用了 Unity 的跨平台原生编译能力，例如，Rimworld 将会**原生运行**在 Apple Silicon 芯片上。

> Rimworld 本体的构建目标为 `framework 4.0`，这意味着 `4.x` 都是有效的。`net48` 等效于 `framework 4.8`。

![更改编译目标](https://oss-1259210922.cos.ap-nanjing.myqcloud.com/RimWorld-Mod-Project/更改编译目标.avif)

你可以自由选择 C# 的语言版本，只要不在代码中使用 Rimworld 不兼容的运行时 API。

在完成上述操作后，我们会在依赖项中看到所有需要的依赖。

![依赖成功导入](https://oss-1259210922.cos.ap-nanjing.myqcloud.com/RimWorld-Mod-Project/依赖成功导入.avif)

## 修改编译输出路径

我们还剩最后一步，将项目的构建路径定位到 `Mod/[YourMod]/Assembiles `中。右键项目（C# 图标），点击属性，在侧边栏中依次点击“Debug｜AnyCPU”，你将会看见：

![修改编译输出目录](https://oss-1259210922.cos.ap-nanjing.myqcloud.com/RimWorld-Mod-Project/修改编译输出目录.avif)

将“输出路径”修改到正确的地方，这跟过去是一样的。对于 “Debug”，请取消勾选“调试符号”，我们永远也用不到它。上述的路径修改在“Release｜AnyCPU”也重复一遍。

## 构建项目

确保前述所有步骤无误后，我们进行构建。你会在输出目录看见这样的目录结构：

![检查输出目录产物](https://oss-1259210922.cos.ap-nanjing.myqcloud.com/RimWorld-Mod-Project/检查输出目录产物.avif)

你会发现嵌套着一个 `net48` 文件夹，里面才是 .dll 文件。RimWorld 会自动读取，你无需做任何操作，这代表着一切顺利 🎉

以上便是 Rimworld 1.6 版本的新建模组工程的最佳实践。
