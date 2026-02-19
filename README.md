# 🕰️ タイムカプセル (Time Capsule)

未来の自分に手紙を送ろう。指定した日にメールで届くタイムカプセルアプリです。

<div align="center">
  <img src="https://via.placeholder.com/800x400/14142e/7c5bf5?text=Time+Capsule+Preview" alt="Time Capsule App Preview" width="100%">
  <br><br>
  <a href="https://timecapsule-app-shota.web.app">
    <img src="https://img.shields.io/badge/Demo-Live_App-7c5bf5?style=for-the-badge&logo=firebase" alt="Live Demo">
  </a>
</div>

## ✨ 特徴

- **💫 美しいデザイン** — 宇宙とオーロラをイメージした没入感のあるUI
- **💌 未来への手紙** — 今の気持ちを書いて、指定した日付に届けます
- **📬 自動メール配信** — 指定した日の朝9時に、過去の自分からのメールが届きます
- **🔒 安全な保管** — 手紙はクラウド（Firebase）に安全に封印されます
- **📱 レスポンシブ対応** — スマホでもPCでも快適に使えます

## 🛠️ 技術スタック

- **Frontend**: HTML5, CSS3 (Modern CSS), Vanilla JavaScript
- **Backend**: Firebase (Firestore, Cloud Functions, Hosting)
- **Deployment**: Firebase Hosting

## 🚀 使い方

1. **アプリを開く**: [https://timecapsule-app-shota.web.app](https://timecapsule-app-shota.web.app) にアクセス
2. **手紙を書く**: 「手紙を書く」ボタンを押し、内容と届ける日を入力
3. **封印する**: 送信ボタンを押すと、カプセルが封印されます
4. **待つ**: 指定した日が来るまで、手紙は開きません
5. **届く**: その日の朝、あなたのメールボックスに手紙が届きます 📩

## 💻 開発環境のセットアップ

このリポジトリをローカルで動かす場合の手順です。

### 前提条件

- Node.js (v18以上)
- Firebaseアカウント
- Gmailアカウント（メール送信用）

### インストール手順

1. **リポジトリをクローン**
   ```bash
   git clone https://github.com/imshota1009/timecapsule.git
   cd timecapsule
   ```

2. **依存関係のインストール**
   ```bash
   npm install -g firebase-tools
   cd functions
   npm install
   ```

3. **環境変数の設定**
   `functions/.env` ファイルを作成し、以下を設定します：
   ```env
   GMAIL_USER=your-email@gmail.com
   GMAIL_APP_PASSWORD=your-app-password
   ```

4. **Firebaseプロジェクトの設定**
   ```bash
   firebase login
   firebase use --add
   ```

5. **デプロイ**
   ```bash
   firebase deploy
   ```

## ⚠️ 注意事項

- Cloud Functions（メール自動送信）を利用するには、Firebaseの**Blazeプラン（従量課金）**が必要です（無料枠あり）。
- ローカルテストのみならSparkプラン（無料）でも動作しますが、メール送信機能は動きません。

## 🤝 Contributing

バグ報告や機能追加の提案は大歓迎です！Issueを作成するか、Pull Requestを送ってください。

## 📄 License

MIT License
