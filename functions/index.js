/**
 * Time Capsule - Cloud Functions
 * 
 * Runs automatically every day to check for capsules
 * whose delivery date has arrived, and sends them by email.
 */

const { onSchedule } = require("firebase-functions/v2/scheduler");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const nodemailer = require("nodemailer");

// Initialize Firebase
initializeApp();
const db = getFirestore();

// ===================================
// Email Configuration
// Note: For production, use Gmail App Password or
// a mail service like SendGrid
// ===================================

// Gmail mail transport configuration
// Reads settings from environment variables
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
// 1. Daily Email Delivery Check (Scheduled Function)
// Runs every day at 9:00 AM (Japan Time)
// ===================================
exports.dailyEmailDelivery = onSchedule({
    schedule: "0 9 * * *",  // Every day at 9:00 JST
    timeZone: "Asia/Tokyo",
    region: "asia-northeast1",
}, async (event) => {
    console.log("Starting daily email delivery check...");

    const today = new Date();
    const todayStr = today.toISOString().split("T")[0]; // "YYYY-MM-DD"

    try {
        // Get capsules whose delivery date has arrived and haven't been emailed yet
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

        // Send email for each capsule
        for (const doc of snapshot.docs) {
            const capsule = doc.data();

            try {
                await sendCapsuleEmail(transporter, capsule);

                // Mark as delivered
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
// 2. Confirmation Email on Capsule Creation
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
        const dateStr = deliveryDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });

        const moodEmoji = {
            happy: "😊", excited: "🤩", peaceful: "😌",
            hopeful: "🌟", nostalgic: "🥹", determined: "💪",
        }[capsule.mood] || "💌";

        // Send confirmation email
        await transporter.sendMail({
            from: `"Time Capsule 💌" <${process.env.GMAIL_USER}>`,
            to: capsule.email,
            subject: `📦 Your capsule has been sealed! "${capsule.subject}"`,
            html: `
                <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 500px; margin: 0 auto; background: #14142e; color: #f0eef6; border-radius: 16px; overflow: hidden;">
                    <div style="background: linear-gradient(135deg, #7c5bf5, #5b34d4); padding: 30px; text-align: center;">
                        <div style="font-size: 3rem;">${moodEmoji}</div>
                        <h1 style="color: white; font-size: 1.5rem; margin: 10px 0 0;">Capsule Sealed!</h1>
                    </div>
                    <div style="padding: 25px;">
                        <p style="color: #9d9bb8; font-size: 0.9rem;">Hi ${capsule.name}, your letter has been sealed.</p>
                        <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(124,91,245,0.2); border-radius: 12px; padding: 16px; margin: 16px 0;">
                            <p style="font-weight: bold; color: #a78bfa; margin-bottom: 8px;">📬 Delivery Date: ${dateStr}</p>
                            <p style="font-weight: bold; color: #f0eef6;">Subject: ${capsule.subject}</p>
                        </div>
                        <p style="color: #6b6890; font-size: 0.85rem; text-align: center; margin-top: 20px;">
                            Look forward to it until that day arrives ✨
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
// Email Sending Helper Function
// ===================================
async function sendCapsuleEmail(transporter, capsule) {
    const moodEmoji = {
        happy: "😊", excited: "🤩", peaceful: "😌",
        hopeful: "🌟", nostalgic: "🥹", determined: "💪",
    }[capsule.mood] || "💌";

    const createdDate = capsule.createdAt
        ? new Date(capsule.createdAt.toDate ? capsule.createdAt.toDate() : capsule.createdAt)
        : new Date();

    const createdStr = createdDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    // Convert newlines in letter body to HTML line breaks
    const bodyHtml = capsule.body.replace(/\n/g, "<br>");

    await transporter.sendMail({
        from: `"Time Capsule 💌" <${process.env.GMAIL_USER}>`,
        to: capsule.email,
        subject: `💌 A letter from your past self has arrived! "${capsule.subject}"`,
        html: `
            <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 500px; margin: 0 auto; background: #14142e; color: #f0eef6; border-radius: 16px; overflow: hidden;">
                <div style="background: linear-gradient(135deg, #f472b6, #7c5bf5); padding: 30px; text-align: center;">
                    <div style="font-size: 3rem;">💌</div>
                    <h1 style="color: white; font-size: 1.5rem; margin: 10px 0 0;">A Letter From Your Past Self</h1>
                    <p style="color: rgba(255,255,255,0.8); font-size: 0.9rem; margin-top: 8px;">
                        A message from you on ${createdStr}
                    </p>
                </div>
                <div style="padding: 25px;">
                    <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(124,91,245,0.2); border-radius: 12px; padding: 20px; margin-bottom: 16px;">
                        <p style="color: #a78bfa; font-weight: bold; margin-bottom: 4px;">
                            ${moodEmoji} ${capsule.subject}
                        </p>
                        <p style="color: #6b6890; font-size: 0.8rem;">
                            From ${capsule.name} | Mood: ${moodEmoji}
                        </p>
                    </div>
                    <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 20px; line-height: 1.8; color: #d1d0e0; font-size: 0.95rem;">
                        ${bodyHtml}
                    </div>
                    <div style="text-align: center; margin-top: 24px; padding-top: 16px; border-top: 1px solid rgba(124,91,245,0.2);">
                        <p style="color: #6b6890; font-size: 0.8rem;">
                            🕰️ This letter was written on ${createdStr}
                        </p>
                        <p style="color: #a78bfa; font-size: 0.85rem; margin-top: 8px;">
                            Time Capsule ✨ Send a letter to your future self
                        </p>
                    </div>
                </div>
            </div>
        `,
    });
}
