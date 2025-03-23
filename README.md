
<p align="center" style="padding: 16px;">
  <img src=".github/assets/logo.webp" alt="Vue-scan logo" width="200">
</p>

# vue-scan

![GitHub Release](https://img.shields.io/github/v/release/Razz21/vue-scan)
![GitHub License](https://img.shields.io/github/license/Razz21/vue-scan)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/Razz21/vue-scan/ci.yml)
![GitHub Issues or Pull Requests](https://img.shields.io/github/issues/Razz21/vue-scan)

## What?

`Vue-scan` is a lightweight utility tool that may help you to identify bottlenecks in your Vue application by tracking and visualising component renders and re-renders with minimal performance impact.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/Razz21/vue-scan/tree/main/examples/vue-spa)

## Why?

To address a critical gap in Vue development: the need for immediate, visual feedback when components mount and update. While Vue DevTools provides comprehensive debugging capabilities, it lacks direct visual indication of component rendering activity within the application UI itself.

## How It Works
The tool leverages Vue's internal mechanisms to track component lifecycle events without modifying your components or DOM elements directly.

## Demo

https://github.com/user-attachments/assets/021e0d70-d7e3-447e-943d-788e9a0f37ce


## Installation

```bash
npm install @razz21/vue-scan
```

## Usage

### Vue 3 Plugin

```ts
import { VueScanPlugin } from '@razz21/vue-scan';

const app = createApp(App);
app.use(VueScanPlugin, {
  // options
});
app.mount('#app');

```

**Options**

| Option              | Type       | Default                    | Description                                         |
| ------------------- | ---------- | -------------------------- | --------------------------------------------------- |
| `color`             | `string`   | `rgba(65, 184, 131, 0.35)` | Highlight effect color                              |
| `duration`          | `number`   | `600`                      | Highlight effect fade-out time in milliseconds      |
| `enabled`           | `boolean`  | `true`                     | Enable or disable the plugin globally               |
| `logToConsole`      | `boolean`  | `false`                    | Log component debug information to the console      |
| `excludeComponents` | `string[]` | `[]`                       | Array of component names to exclude from tracking   |
| `includeComponents` | `string[]` | `[]`                       | If provided, only track components with these names |

## FAQ

1. *Does `vue-scan` support production mode?*

Currently, `vue-scan` is designed for development build only. However, I may plan to explore production build support in the future.

2. *What are supported Vue versions?*

This tool is built and tested using Vue v3.5.13+. Some features may not work with older versions.

## References and inspiration
- [vue-devtool-flash-updates](https://github.com/yuichkun/vue-devtool-flash-updates) - A Vue DevTools plugin that flashes components when they update
- [react-scan](https://github.com/aidenybai/react-scan) - Ultimate tool for debugging React applications

# License

MIT © Razz21
