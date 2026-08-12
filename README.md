# 福岡 8/13–18 行程

互動地圖行程 Web App（`trip/`）。

## 本機預覽

```bash
cd trip && python3 -m http.server 8765
# http://localhost:8765
```

## GitHub Pages（手機可開）

推送 `main` 後，GitHub Actions 會自動部署 `trip/` 資料夾。

1. 在 GitHub 建立 repo（例：`fukuoka-trip`）
2. 推送本 repo 的 `main` branch
3. Repo → **Settings → Pages → Build and deployment → Source** 選 **GitHub Actions**
4. 等 Actions 跑完，網址通常是：
   `https://<你的帳號>.github.io/<repo名>/`

### 首次推送

```bash
git remote add origin git@github.com:<你的帳號>/<repo名>.git
git push -u origin main
```

### 加入手機主畫面

Safari 開啟 Pages 網址 → 分享 → **加入主畫面**。
