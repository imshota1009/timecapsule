/**
 * タイムカプセル - Cloud Functions
 * 
 * 毎日自動で実行され、届ける日が来たカプセルを
 * メールで送信するバックグラウンド処理です。
 */

const { onSchedule } = require("firebase-functions/v2/scheduler");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const nodemailer = require("nodemailer");

// Firebase初期化
initializeApp();
const db = getFirestore();

// ===================================
// メール送信の設定
// 注意: 本番環境ではGmailのアプリパスワードまたは
// SendGrid等のメールサービスを使ってください
// ===================================

// Gmail用のメール送信設定
// 環境変数から設定を読み込む
function getMailTransporter() {
    return nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.GMAIL_USER || "",
            pass: process.env.GMAIL_APP_PASSWORD || "",
        },
    });
}

// ===================================
// 1. 毎日のメール配信チェック（スケジュール関数）
// 毎朝9:00（日本時間）に実行
// ===================================
exports.dailyEmailDelivery = onSchedule({
    schedule: "0 9 * * *",  // 毎日9:00 UTC → 日本時間18:00
    timeZone: "Asia/Tokyo",
    region: "asia-northeast1",
}, async (event) => {
    console.log("Starting daily email delivery check...");

    const today = new Date();
    const todayStr = today.toISOString().split("T")[0]; // "YYYY-MM-DD"

    try {
        // 今日が届ける日で、まだメールを送っていないカプセルを取得
        const snapshot = await db.collection("capsules")
            .where("deliveryDate", "<=", todayStr)
            .where("emailSent", "==", false)
            .get();

        if (snapshot.empty) {
            console.log("No capsules to deliver today.");
            return;
        }

        console.log(`Found ${snapshot.size} capsule(s) to deliver.`);

        const transporter = getMailTransporter();

        // 各カプセルにメールを送信
        for (const doc of snapshot.docs) {
            const capsule = doc.data();

            try {
                await sendCapsuleEmail(transporter, capsule);

                // 送信済みに更新
                await doc.ref.update({
                    emailSent: true,
                    status: "delivered",
                    deliveredAt: new Date().toISOString(),
                });

                console.log(`✅ Delivered capsule to ${capsule.email}: "${capsule.subject}"`);
            } catch (emailError) {
                console.error(`❌ Failed to deliver capsule ${doc.id}:`, emailError);
            }
        }

        console.log("Daily email delivery completed.");

    } catch (error) {
        console.error("Error in daily email delivery:", error);
    }
});

// ===================================
// 2. カプセル作成時の確認メール
// ===================================
exports.onCapsuleCreated = onDocumentCreated({
    document: "capsules/{capsuleId}",
    region: "asia-northeast1",
}, async (event) => {
    const capsule = event.data.data();

    if (!capsule || !capsule.email) {
        console.log("No email found in capsule data.");
        return;
    }

    try {
        const transporter = getMailTransporter();

        const deliveryDate = new Date(capsule.deliveryDate + "T00:00:00+09:00");
        const dateStr = deliveryDate.toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });

        const moodEmoji = {
            happy: "😊", excited: "🤩", peaceful: "😌",
            hopeful: "🌟", nostalgic: "🥹", determined: "💪",
        }[capsule.mood] || "💌";

        // 確認メール送信
        await transporter.sendMail({
            from: `"タイムカプセル 💌" <${process.env.GMAIL_USER}>`,
            to: capsule.email,
            subject: `📦 カプセルが封印されました！「${capsule.subject}」`,
            html: `
                <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 500px; margin: 0 auto; background: #14142e; color: #f0eef6; border-radius: 16px; overflow: hidden;">
                    <div style="background: linear-gradient(135deg, #7c5bf5, #5b34d4); padding: 30px; text-align: center;">
                        <div style="font-size: 3rem;">${moodEmoji}</div>
                        <h1 style="color: white; font-size: 1.5rem; margin: 10px 0 0;">カプセル封印完了！</h1>
                    </div>
                    <div style="padding: 25px;">
                        <p style="color: #9d9bb8; font-size: 0.9rem;">${capsule.name}さん、手紙を封印しました。</p>
                        <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(124,91,245,0.2); border-radius: 12px; padding: 16px; margin: 16px 0;">
                            <p style="font-weight: bold; color: #a78bfa; margin-bottom: 8px;">📬 届く日: ${dateStr}</p>
                            <p style="font-weight: bold; color: #f0eef6;">件名: ${capsule.subject}</p>
                        </div>
                        <p style="color: #6b6890; font-size: 0.85rem; text-align: center; margin-top: 20px;">
                            その日が来るまで、楽しみに待っていてくださいね ✨
                        </p>
                    </div>
                </div>
            `,
        });

        console.log(`✅ Confirmation email sent to ${capsule.email}`);

    } catch (error) {
        console.error("Error sending confirmation email:", error);
    }
});

// ===================================
// メール送信ヘルパー関数
// ===================================
async function sendCapsuleEmail(transporter, capsule) {
    const moodEmoji = {
        happy: "😊", excited: "🤩", peaceful: "😌",
        hopeful: "🌟", nostalgic: "🥹", determined: "💪",
    }[capsule.mood] || "💌";

    const createdDate = capsule.createdAt
        ? new Date(capsule.createdAt.toDate ? capsule.createdAt.toDate() : capsule.createdAt)
        : new Date();

    const createdStr = createdDate.toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    // 手紙の内容を改行対応
    const bodyHtml = capsule.body.replace(/\n/g, "<br>");

    await transporter.sendMail({
        from: `"タイムカプセル 💌" <${process.env.GMAIL_USER}>`,
        to: capsule.email,
        subject: `💌 過去の自分からの手紙が届きました！「${capsule.subject}」`,
        html: `
            <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 500px; margin: 0 auto; background: #14142e; color: #f0eef6; border-radius: 16px; overflow: hidden;">
                <div style="background: linear-gradient(135deg, #f472b6, #7c5bf5); padding: 30px; text-align: center;">
                    <div style="font-size: 3rem;">💌</div>
                    <h1 style="color: white; font-size: 1.5rem; margin: 10px 0 0;">過去の自分からの手紙</h1>
                    <p style="color: rgba(255,255,255,0.8); font-size: 0.9rem; margin-top: 8px;">
                        ${createdStr} のあなたからのメッセージです
                    </p>
                </div>
                <div style="padding: 25px;">
                    <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(124,91,245,0.2); border-radius: 12px; padding: 20px; margin-bottom: 16px;">
                        <p style="color: #a78bfa; font-weight: bold; margin-bottom: 4px;">
                            ${moodEmoji} ${capsule.subject}
                        </p>
                        <p style="color: #6b6890; font-size: 0.8rem;">
                            ${capsule.name}より｜気分: ${moodEmoji}
                        </p>
                    </div>
                    <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 20px; line-height: 1.8; color: #d1d0e0; font-size: 0.95rem;">
                        ${bodyHtml}
                    </div>
                    <div style="text-align: center; margin-top: 24px; padding-top: 16px; border-top: 1px solid rgba(124,91,245,0.2);">
                        <p style="color: #6b6890; font-size: 0.8rem;">
                            🕰️ この手紙は ${createdStr} に書かれました
                        </p>
                        <p style="color: #a78bfa; font-size: 0.85rem; margin-top: 8px;">
                            タイムカプセル ✨ 未来の自分へ手紙を送ろう
                        </p>
                    </div>
                </div>
            </div>
        `,
    });
}
