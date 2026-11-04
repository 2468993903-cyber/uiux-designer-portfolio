# 2026 UI / UX 设计作品集

基于 React + Vite 的个人作品集网站，采用黑色电影感、编辑式排版与橙红视觉线索。

## 本地运行

需要 Node.js 18 或更高版本：

```bash
npm install
npm run dev
```

生产构建：

```bash
npm run build
```

## 发布与跨设备修改

- 线上网址：https://wuhuohuo.top
- GitHub 仓库：git@github.com:2468993903-cyber/uiux-designer-portfolio.git
- `main` 分支连接 Vercel；推送到 `main` 会触发线上部署。
- 网站内容由 `src/main.jsx` 和 `src/styles.css` 驱动，项目图片位于 `public/assets/`。
- `src/main.jsx` 中的 `PUBLIC_PAUSED` 控制公开页面：`false` 正常显示，`true` 暂时显示空白页。

在另一台电脑安装 Node.js 18 或更高版本后，在项目目录运行 `npm install`、`npm run dev` 开始修改；确认后提交并推送到 `main` 发布。需要 GitHub 写入权限；不要复制本机凭据或 `.vercel` 本地登录信息。

## 当前页面结构

1. 首页 Hero、0–100% 加载效果与典型项目横向卡片
2. 个人生活照、个人介绍与项目数据
3. 纵向工作经历时间线
4. 按全部、可视化、PC、移动端、AI 分类的叠压作品卡片
5. 面试联系与简历下载收尾页

## 下一步替换

目前人物图、项目图、公司名称和联系方式均为占位内容。收到真实材料后，主要在 `src/main.jsx` 顶部的数据数组中替换：

- `heroProjects`：首页典型项目
- `experiences`：工作经历
- `projects`：完整作品数据
- `About`：个人介绍与生活照
- `Ending`：邮箱、社交平台和简历地址

远程占位图片需要联网加载。正式发布前应下载并压缩为本地 WebP / AVIF 资源。
