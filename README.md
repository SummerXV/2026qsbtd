## 生日贺卡网站

这是一个使用 Vite + React + TypeScript + Tailwind 构建的翻页式生日贺卡。

### 本地运行

- **安装依赖**:

```bash
npm install
```

- **启动开发服务器**:

```bash
npm run dev
```

### 发布到 GitHub Pages

1. 在 GitHub 仓库打开 **Settings → Pages**。
2. **Build and deployment** 选择 **Source: GitHub Actions**。
3. 推送到 `main` 分支后会自动触发部署，部署地址通常是：
   - `https://SummerXV.github.io/2026qsbtd/`

### 添加/替换照片

推荐把图片放到 `public/images/`，然后在 `src/data/images.ts` 里把链接改成本地路径，例如：

- `"/images/IMG_5043.jpg"`
- `"/images/IMG_5035.jpg"`

你也可以继续使用外链，或用 base64（`data:image/...;base64,...`）写进 `src/data/images.ts`。

### 添加/替换音乐与音效

浏览器通常禁止“自动播放”，所以背景音乐需要在用户第一次交互（例如翻页）后才能开始播放。

当前代码默认会尝试加载以下文件：

- **翻页音效**: `public/audio/page-flip.mp3`
- **背景音乐**: `public/music/bgm.mp3`

把你的 mp3 放到对应位置即可生效（翻页音效若不存在会自动回退到一个远程音效；背景音乐不存在则会静默跳过）。
