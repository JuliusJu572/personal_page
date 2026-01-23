# Personal Page - JuliusJu572

使用 React + Vite 构建的个人主页，集成多个核心项目展示与工具模块。

## 🌟 核心模块

### 1. Cheating Buddy（作弊老铁）
AI 面试助手项目的展示与下载中心。
- **自动获取 Release**：实时拉取最新版本，提供 Windows/macOS 安装包直链。
- **环境检测工具**：内置切屏检测、屏幕共享可见性检测、键盘事件监测，帮助用户在使用前排查风险。
- **使用指南**：包含详细的安装步骤与快捷键说明。

### 2. Mystic AI Tarot
集成沉浸式 3D 塔罗牌预测应用。
- 独立部署在 `/tarot/` 子路径。
- 支持完整的洗牌、抽牌与 AI 解读流程。

## 🛠️ 技术栈

- **框架**：React 18 + TypeScript + Vite
- **样式**：CSS Modules + CSS Variables (支持浅色主题)
- **路由**：React Router v6
- **部署**：GitHub Actions + SCP 部署到阿里云

## 🚀 开发与构建

### 安装依赖

```bash
npm install
```

### 本地开发

启动主站开发服务器：

```bash
npm run dev
```

如需同时调试 Tarot 子应用，请确保 `../Mystic_AI_Tarot` 目录存在并已安装依赖。

### 生产构建

```bash
npm run build
```

构建流程会自动：
1. 构建 `../Mystic_AI_Tarot` 子应用。
2. 构建主站 `site`。
3. 将 Tarot 构建产物拷贝到 `dist/tarot` 目录。

### 预览构建结果

```bash
npm run preview
```

## 📦 部署

本项目配置了 GitHub Actions 自动部署流水线。

1. 推送代码到 `main` 分支。
2. CI/CD 自动构建并将 `dist/` 目录同步到阿里云服务器 `/var/www/my-react-app`。

需在 GitHub 仓库 Secrets 中配置：
- `HOST`: 服务器 IP
- `USERNAME`: SSH 用户名
- `KEY`: SSH 私钥
