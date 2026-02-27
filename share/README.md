## 朋友如何打开

- **macOS**：双击 `share/START_MAC.command`，然后在浏览器打开提示的地址（默认 `http://localhost:4173/`）
- 如果提示 **“could not be executed… appropriate access privileges”**：
  - 在终端进入你解压后的文件夹，执行一次：

```bash
chmod +x share/START_MAC.command
```

  - 如果仍然被 macOS 拦截（隔离属性/“来自不明开发者”），再执行：

```bash
xattr -dr com.apple.quarantine share/START_MAC.command
```

- **Windows**：双击 `share/START_WINDOWS.bat`，然后在浏览器打开提示的地址（默认 `http://localhost:4173/`）


## 发给朋友离线打开（推荐方式）

由于现代浏览器对 `file://` 直接打开的前端工程有限制（尤其是 ES Module），**最稳妥的方法**是用一个本地静态服务器打开 `dist/`。

### 你（制作者）需要做一次

在项目根目录运行：

```bash
npm install
npm run build:share
```

然后把下面两个东西一起打包发给朋友：

- `dist/`
- `share/`（里面有启动脚本）

### 照片/音乐文件也要一起发

如果你使用的是本地素材路径（例如 `/images/...`、`/music/...`），请确保这些文件存在于：

- `dist/` 同级的构建输出中会包含打包后的资源
- 或者你用的是 `public/` 方式：把 `public/images`、`public/music` 的素材在打包前放好，`npm run build:share` 会把它们带进 `dist/`。

本项目用到的音乐文件（放到 `public/music/`）：

- `happy_birthday.mp3`（背景音乐）
- `ding.mp3`（翻页音效）
- `firework.mp3`（礼花音效）
- `car.mp3`（房车音效）

