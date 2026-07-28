---
title: 为博客添加手动主题切换
pubDate: 2026-7-28
---

在现代浏览器中，让网页响应系统明暗主题很简单：

```css
:root {
  color-scheme: light dark;
}
```

这是原生层面的，例如，它会让你的浏览器默认滚动条也变色。

> 实际上，[用户代理样式](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascade/Introduction#user-agent_stylesheets)中就有深色模式下的样式。无需定制的话，这三行代码就能让整个网站支持深色模式了。

[`color-scheme`](https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/color-scheme) 在 2022 年就广泛可用了，`light dark` 声明网页同时提供浅色和深色模式。配合媒体查询，就能完整地定制：

```css
@media (prefers-color-scheme: dark) {
  :root {
    color: white;
  }
}
```

这已经是前端程序员们多年以来梦寐以求的了，过去还得写两套 CSS 来回切换。

考虑到通常情况下，只是需要修改颜色，2024 年广泛可用的 [`light-dark()`](https://developer.mozilla.org/docs/Web/CSS/Reference/Values/color_value/light-dark) 进一步简化了代码：

```css
:root {
  color-scheme: light dark;
  color: light-dark(black, white);
}
```

简洁、现代，一切都很美好，确实就是最完美的解决方案了。

## 被打破的完美

遗憾的是，尽管 Windows 原生有明暗主题，但一直不支持动态切换。要知道苹果设备甚至是支持以日出日落的时间来动态切换的。

对于一个随机 Windows 用户，它的系统永远是浅色模式。我们辛辛苦苦适配度深色模式他是享受不上的。

我高度怀疑这就是支持明暗主题的网站，基本都要提供“系统”“浅色”“深色”三个选项的原因。

无论出于什么原因，让网站支持用户手动切换明暗主题仍具有必要性，这篇文章就是我的开发经验总结。

## 手动设置明暗主题

想要手动设置明暗主题倒也简单，用 JavaScript 改变 `color-scheme` 的值即可，我的初版方案是这样的：

```html
<button data-theme="light dark">system</button>
<button data-theme="light">light</button>
<button data-theme="dark">dark</button>

<script>
  let userTheme = localStorage.getItem('user-theme') ?? 'light dark'
  document.documentElement.style.colorScheme = userTheme

  document.querySelectorAll('[data-theme]').forEach(btn => {
    btn.addEventListener('click', () => {
      userTheme = btn.dataset.theme
      document.documentElement.style.colorScheme = userTheme
      localStorage.setItem('user-theme', userTheme)
    })
  })
</script>
```

> `documentElement` 相当于 CSS 中的 `:root`。

需要保存选中的主题，所以将值存进 `localStorage`，当用户未曾设置时，默认 `light dark` 即跟随系统。

## 超级讨厌的页面闪烁

似乎静态页面一旦涉及逻辑，我就要花一半时间的去和抖动和闪烁做斗争。

真实开发是组件化的，脚本的加载晚于 HTML 结构，上述代码会产生时序问题：

1. 初始为 `light`
2. HTML 应用 `light`
3. JS 设置为 `dark`
4. HTML 应用 `dark`（页面闪烁）

解决方案是让脚本设置 `colorScheme` 早于 HTML 渲染的时间：

1. 初始为 `light`
2. JS 设置为 `dark`
3. HTML 应用 `dark`

对于本站采用的 Astro 框架，提取需要的部分设置为内联即可：

```html
<script is:inline>
  const userTheme = localStorage.getItem('user-theme') ?? 'light dark'
  document.documentElement.style.colorScheme = userTheme
</script>
```

## 主题选择器

功能实现后，顺手用 [Popover API](https://developer.mozilla.org/docs/Web/API/Popover_API) 写一个主题选择器：

```html
<button popovertarget="theme-select">system</button>

<div id="theme-select" popover>
  <button data-theme="light dark">system</button>
  <button data-theme="light">light</button>
  <button data-theme="dark">dark</button>
</div>

<p class="light">当前处于亮色模式</p>
<p class="dark">当前处于暗色模式</p>
```

用现代特性就都用，再上[锚点定位](https://developer.mozilla.org/docs/Web/CSS/Guides/Anchor_positioning)：

```css
[popovertarget] {
  anchor-name: --theme-button;
}

#theme-select {
  position-anchor: --theme-button;
  position-area: bottom span-right;
  top: 4px; /* 拉开间距 */

  /* 避免覆盖隐藏时默认的 display: none */
  &:popover-open {
    display: flex;
    flex-direction: column;
  }
}
```

不得不说锚点定位是真方便。

## 在明在暗？

开头提到的媒体查询 `prefers-color-scheme`，它查询的永远是系统的明暗状态。

当系统为 `light` 时，即使声明 `:root { color-scheme: dark }`，也不会让 `prefers-color-scheme: dark` 条件生效。

我们若仍想写条件样式，只能绕过媒体查询，自行维护一个能被 CSS 响应的状态。自然的想法是在 `documentElement` 上设置[自定义数据属性](https://developer.mozilla.org/docs/Web/HTML/Reference/Global_attributes/data-*)：

```js
const userTheme = localStorage.getItem('user-theme') ?? 'light dark'
const media = matchMedia('(prefers-color-scheme: light)')
const systemTheme = media.matches ? 'light' : 'dark'
const currentTheme = userTheme === 'light dark' ? systemTheme : userTheme

document.documentElement.style.colorScheme = userTheme
document.documentElement.dataset.currentTheme = currentTheme

document.querySelectorAll('[data-theme]').forEach(btn => {
  btn.addEventListener('click', () => {
    const userTheme = btn.dataset.theme
    const currentTheme = userTheme === 'light dark' ? systemTheme : userTheme

    document.documentElement.style.colorScheme = userTheme
    document.documentElement.dataset.currentTheme = currentTheme
    localStorage.setItem('user-theme', userTheme)
  })
})
```

这里的关键是用 `userTheme === 'light dark' ? systemTheme : userTheme` 确定页面呈现的主题，`systemTheme` 从 [`matchMedia`](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia) 取值，与媒体查询结果相同。

现在又可以写条件样式了：

```css
:root[data-current-theme='dark'] {
  color: white;
}
```

`light-dark()` 不受影响，因为它读取的就是 `color-scheme`。

## 大功告成前的最后一步

系统明暗状态可能会变化，因此需要处理 `media` 的 `change` 事件来更新状态：

```js
media.addEventListener('change', () => {
  if (userTheme !== 'light dark') return

  const currentTheme = media.matches ? 'light' : 'dark'
  document.documentElement.dataset.currentTheme = currentTheme
})
```

说起来，这篇文章我从深色模式写到了浅色模式……

## 写在最后

最后拼出来的东西并不复杂，但这条看似简单的路，沿途也藏着不少小坑。
