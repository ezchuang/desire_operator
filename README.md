# MySQL Speaker

### 透過圖形化介面減低操作 MySQL 的門檻

### 網址: https://mysqlspeaker.online/

## 主結構圖示：

![Structure](./readmePics/structure.png)
![ConnPoolFlowChart](./readmePics/flowChart.png)

## 功能說明：

- 創建新群組：

  - 輸入群組邀請碼加入群組。另外也可以用此系統登入您自身的資料庫（前提是該資料庫從網路到資料庫設定都有開放權限）。

- 相同權限控制同一群資料庫：

  - 以圖形化介面操作資料庫的增刪修改；並在其他人對資料庫資料異動時，刷新同時在線的同群組使用者的顯示資料。並會留存歷史紀錄，方便確認修改狀況。

- 資料庫連接池關閉流程：
  - 利用 Socket.io 持續監聽 Client 連線的狀況，控管 MySQL 連接池；當同群組內的所有使用者皆斷線的時候，結束該群組連接池，避免資源占用。

## 技術應用：

- 後端：

  - TypeScript
  - Node.js
    - Express.js
  - Socket.io

- 雲端 (AWS)

  - EC2
  - RDS
  - S3 & CloudFront

- 佈署：

  - Docker
  - Ubuntu

- 資料庫：

  - MySQL (RDS)

- 連線：

  - HTTPS
  - Nginx
  - JWT

- 前端：

  - TypeScript
  - React
    - TSX / useState / useEffect / useContext
    - Material-UI
  - Tailwind CSS

- 開發工具：
  - Git & GitHub
  - Webpack
  - Eslint
  - Prettier
