# pnpm 使用
> pnpm 是一种 JavaScript 包管理器（与 npm、yarn 类似），用于管理 Node.js 项目的依赖。
名字来自于 “Performant npm”，它最大的特点是 速度快、磁盘占用小。

## 使用优势
|**特性**	|  **说明**|
|-------|----|
|🪶节省磁盘空间| 使用“内容寻址存储”（Content Addressable Storage），不同项目共用相同的依赖包副本，而不是重复安装。|
|⚙️ 安装速度快| 因为依赖被缓存，后续项目安装相同包时只需创建硬链接。|
|🧱 严格的依赖隔离| 默认启用严格模式，不允许隐式依赖（防止“幽灵依赖”问题）。|
|🔒 安全| 每个包的依赖都被明确隔离，避免冲突和污染。|
|🧑‍🤝‍🧑 Monorepo 支持强| 内置 workspace 支持，轻松管理多包仓库|

pnpm 通过符号链接 (symlink) 将依赖映射到全局的存储区（store）
```bash
# 查看当前 pnpm store 位置
pnpm store path
```

**对比优势**

| 比较项         | npm  | yarn | pnpm     |
| ----------- | ---- | ---- | -------- |
| 安装速度        | 慢    | 较快   | 🚀 非常快   |
| 磁盘占用        | 高    | 中    | 🚀 最低    |
| 依赖隔离        | 宽松   | 一般   | 🚀 严格    |
| Monorepo 支持 | 无    | 有    | 🚀 内置支持  |
| 安全性         | 一般   | 一般   | 🚀 高     |
| 架构原理        | 扁平安装 | 缓存优化 | 内容寻址+硬链接 |


## 安装
```bash
npm install -g pnpm
```
## 常用命令
| 操作     | npm 命令                      | pnpm 命令                  |
| ------ | --------------------------- | ------------------------ |
| 初始化项目  | `npm init`                  | `pnpm init`              |
| 安装依赖   | `npm install`               | `pnpm install`           |
| 安装单个包  | `npm install react`         | `pnpm add react`         |
| 安装开发依赖 | `npm install -D typescript` | `pnpm add -D typescript` |
| 卸载包    | `npm uninstall react`       | `pnpm remove react`      |
| 更新依赖   | `npm update`                | `pnpm update`            |
| 运行脚本   | `npm run build`             | `pnpm build`             |
| 查看过期包  | `npm outdated`              | `pnpm outdated`          |
| 清理缓存   | `npm cache clean --force`   | `pnpm store prune`       |

## 工作区（Monorepo）
pnpm 支持多包仓库管理（workspaces）：

***示例：***
```bash
pnpm-workspace.yaml
packages/
  ├─ app/
  └─ ui/
```
***pnpm-workspace.yaml：***
```yaml
packages:
  - 'packages/*'
```
***然后在根目录运行：***
```bash
pnpm install
```
pnpm 会自动识别子包之间的依赖关系，实现本地互联。
[Demo 地址](https://github.com/wwELi/pnpm-demo.git)
