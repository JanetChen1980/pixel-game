# Pixel Art Quiz Game 實作完成

所有的程式碼檔案與結構都已經順利為你建立在 `d:\Code\pixel-game` 中了。

## 完成的檔案項目

### 前端專案 (React + Vite)
- **設定檔**：`package.json`, `vite.config.js`, `index.html`, `.env`
- **主要程式碼**：`src/main.jsx`, `src/App.jsx`, `src/index.css`
- **元件**：
  - `src/components/Home.jsx` (輸入 ID 畫面)
  - `src/components/Game.jsx` (接收 GAS 題目、顯示 Pixel Art Boss 並進行作答)
  - `src/components/Result.jsx` (向 GAS 送出分數並顯示結果)

### 後端服務 (Google Apps Script)
- `gas_backend.js`

## 後續手動操作步驟

> [!IMPORTANT]
> 因為你的系統中尚未安裝 Node.js，請先至 [Node.js 官網](https://nodejs.org/) 下載並安裝。安裝完成後，才能開啟終端機執行下方指令。

1. **部署 Google Apps Script：**
   - 請複製 `d:\Code\pixel-game\gas_backend.js` 中的程式碼。
   - 貼上至你的 Google Sheets 擴充功能「Apps Script」專案中。
   - 右上角點選 **部署 -> 新增部署作業**，選擇 **網頁應用程式**，權限設為 **所有人**，部署後複製產生的 **網頁應用程式網址**。
   
2. **設定環境變數：**
   - 打開 `d:\Code\pixel-game\.env`，將剛剛複製的 GAS 網址填入 `VITE_GOOGLE_APP_SCRIPT_URL=` 的後方。
   - （可選）你可以依需求調整 `VITE_PASS_THRESHOLD` 與 `VITE_QUESTION_COUNT` 的數值。

3. **安裝依賴並啟動：**
   - 開啟終端機 (命令提示字元 / PowerShell)，切換路徑至 `d:\Code\pixel-game`：
     ```bash
     cd d:\Code\pixel-game
     npm install
     npm run dev
     ```
   - 啟動後，依畫面的本機網址 (通常是 `http://localhost:5173`) 即可開始遊戲。
