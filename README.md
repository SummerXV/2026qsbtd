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

- **背景音乐（循环）**: `public/music/happy_birthday.mp3`
- **翻页音效**: `public/music/ding.mp3`
- **礼花音效（吹蜡烛触发彩带时）**: `public/music/firework.mp3`
- **房车音效（点击“房车旅行”时）**: `public/music/car.mp3`

把你的 mp3 放到对应位置即可生效（浏览器通常禁止无交互自动播放，所以背景音乐会在首次翻页或点击 `Open Card` 后开始播放）。
