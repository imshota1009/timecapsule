// ===========================
// Time Capsule - App Logic
// Firebase Firestore Version
// With i18n (EN / JP) Support
// ===========================

// --- i18n Translation Data ---
const translations = {
    en: {
        // Page title & meta
        pageTitle: 'Time Capsule - Send a Letter to Your Future Self',
        // Loading
        loading: 'Loading...',
        // Landing
        appTitle: 'Time Capsule',
        appSubtitle: 'Send a letter to your future self',
        appDescription: 'Write down your thoughts and feelings, and deliver them to your future self.<br>Your letter will arrive by email on the date you choose.',
        writeLetter: 'Write a Letter',
        viewCapsules: 'View Sent Capsules',
        // Write page
        back: '← Back',
        toFutureSelf: 'To My Future Self',
        yourName: 'Your Name',
        namePlaceholder: 'Enter your name...',
        emailAddress: 'Email Address',
        emailHint: 'Your letter will be delivered to this address',
        deliveryDate: 'Delivery Date',
        dateHint: 'Your email will arrive on this date',
        subject: 'Subject',
        subjectPlaceholder: 'e.g. To me, one year from now',
        letterContent: 'Letter Content',
        bodyPlaceholder: 'Write what you want to tell your future self...\n\nYour current feelings, goals, dreams, things you cherish...\nFeel free to write anything.',
        currentMood: 'Current Mood',
        sealCapsule: 'Seal the Capsule',
        saving: 'Saving...',
        // Success page
        capsuleSealed: 'Capsule Sealed!',
        successDetail: 'Your letter will be delivered by email on the date you selected.',
        timeUntilDelivery: 'Time until delivery',
        backToHome: 'Back to Home',
        writeAnother: 'Write Another Letter',
        alreadyDelivered: '🎉 Already delivered!',
        // List page
        sentCapsules: '📦 Sent Capsules',
        listSubtitle: "Letters you've sent to your future self",
        noCapsules: 'No capsules yet',
        writeFirst: 'Write your first letter',
        statusDelivered: 'Delivered',
        statusWaiting: 'Waiting',
        // Modal
        createdLabel: '📝 Created:',
        deliveryLabel: '📬 Delivery:',
        deleteCapsule: '🗑️ Delete this capsule',
        confirmDelete: 'Delete this capsule?\nThis action cannot be undone.',
        // Toast messages
        toastNameRequired: '⚠️ Please enter your name',
        toastEmailRequired: '⚠️ Please enter your email address',
        toastEmailInvalid: '⚠️ Please enter a valid email address',
        toastDateRequired: '⚠️ Please select a delivery date',
        toastSubjectRequired: '⚠️ Please enter a subject',
        toastBodyRequired: '⚠️ Please write your letter',
        toastSealed: '✨ Capsule sealed successfully!',
        toastSaveFailed: '❌ Failed to save. Please try again.',
        toastDeleted: '🗑️ Capsule deleted',
        toastDeleteFailed: '❌ Failed to delete',
        // Date format
        dateLocale: 'en-US',
        // Countdown
        dayUnit: 'd',
        hourUnit: 'h',
        minuteUnit: 'm',
        secondUnit: 's',
        arrivingOn: '📅 Arriving on ',
    },
    ja: {
        // Page title & meta
        pageTitle: 'タイムカプセル - 未来の自分へ手紙を送ろう',
        // Loading
        loading: '読み込み中...',
        // Landing
        appTitle: 'タイムカプセル',
        appSubtitle: '未来の自分へ、手紙を送ろう',
        appDescription: '今の気持ちや想いを書いて、未来の自分に届けよう。<br>指定した日になると、メールであなたの手紙が届きます。',
        writeLetter: '手紙を書く',
        viewCapsules: '送ったカプセルを見る',
        // Write page
        back: '← もどる',
        toFutureSelf: '未来の自分へ',
        yourName: 'あなたの名前',
        namePlaceholder: '名前を入力...',
        emailAddress: 'メールアドレス',
        emailHint: 'この宛先に手紙が届きます',
        deliveryDate: '届ける日',
        dateHint: 'この日にメールが届きます',
        subject: '件名',
        subjectPlaceholder: '例: 1年後の私へ',
        letterContent: '手紙の内容',
        bodyPlaceholder: '未来の自分に伝えたいことを書いてください...\n\n今の気持ち、目標、夢、大切にしていること...\nなんでも自由に書いてください。',
        currentMood: '今の気分',
        sealCapsule: 'カプセルを封印する',
        saving: '保存中...',
        // Success page
        capsuleSealed: 'カプセル、封印完了！',
        successDetail: '指定した日になると、メールであなたの手紙が届きます。',
        timeUntilDelivery: '届くまであと',
        backToHome: 'ホームに戻る',
        writeAnother: 'もう一通書く',
        alreadyDelivered: '🎉 もう届いています！',
        // List page
        sentCapsules: '📦 送ったカプセル',
        listSubtitle: 'あなたが未来の自分に送った手紙たち',
        noCapsules: 'まだカプセルがありません',
        writeFirst: '最初の手紙を書く',
        statusDelivered: '配達済み',
        statusWaiting: '待機中',
        // Modal
        createdLabel: '📝 作成:',
        deliveryLabel: '📬 届く日:',
        deleteCapsule: '🗑️ このカプセルを削除',
        confirmDelete: 'このカプセルを削除しますか？\nこの操作は取り消せません。',
        // Toast messages
        toastNameRequired: '⚠️ 名前を入力してください',
        toastEmailRequired: '⚠️ メールアドレスを入力してください',
        toastEmailInvalid: '⚠️ 正しいメールアドレスを入力してください',
        toastDateRequired: '⚠️ 届ける日を選んでください',
        toastSubjectRequired: '⚠️ 件名を入力してください',
        toastBodyRequired: '⚠️ 手紙の内容を書いてください',
        toastSealed: '✨ カプセルを封印しました！',
        toastSaveFailed: '❌ 保存に失敗しました。もう一度お試しください。',
        toastDeleted: '🗑️ カプセルを削除しました',
        toastDeleteFailed: '❌ 削除に失敗しました',
        // Date format
        dateLocale: 'ja-JP',
        // Countdown
        dayUnit: '日',
        hourUnit: '時間',
        minuteUnit: '分',
        secondUnit: '秒',
        arrivingOn: '📅 届く日: ',
    }
};

// Current language
let currentLang = 'en';

// Get translation string
function t(key) {
    return translations[currentLang][key] || translations['en'][key] || key;
}

// --- i18n: Apply translations to DOM ---
function applyTranslations() {
    // Update page title
    document.title = t('pageTitle');

    // Update html lang attribute
    document.documentElement.lang = currentLang === 'ja' ? 'ja' : 'en';

    // Update font based on language
    if (currentLang === 'ja') {
        document.documentElement.style.setProperty('--font-main', "'Zen Maru Gothic', 'Inter', sans-serif");
    } else {
        document.documentElement.style.setProperty('--font-main', "'Inter', 'Outfit', sans-serif");
    }

    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const isHtml = el.getAttribute('data-i18n-html') === 'true';
        if (isHtml) {
            el.innerHTML = t(key);
        } else {
            el.textContent = t(key);
        }
    });

    // Update all elements with data-i18n-placeholder attribute
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        el.placeholder = t(key);
    });

    // Update toggle label styles
    const enLabel = document.getElementById('lang-label-en');
    const jaLabel = document.getElementById('lang-label-ja');
    if (enLabel && jaLabel) {
        enLabel.classList.toggle('active', currentLang === 'en');
        jaLabel.classList.toggle('active', currentLang === 'ja');
    }

    // Update toggle knob position
    const knob = document.getElementById('lang-knob');
    if (knob) {
        knob.classList.toggle('ja', currentLang === 'ja');
    }
}

// --- Language Toggle ---
function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'ja' : 'en';
    localStorage.setItem('timecapsule_lang', currentLang);
    applyTranslations();

    // Re-render dynamic content if on list page
    const listPage = document.getElementById('list-page');
    if (listPage && listPage.classList.contains('active')) {
        renderCapsuleList();
    }

    // Re-render countdown if on success page
    const successPage = document.getElementById('success-page');
    if (successPage && successPage.classList.contains('active') && lastDeliveryDate) {
        const dateText = lastDeliveryDate.toLocaleDateString(t('dateLocale'), {
            year: 'numeric', month: 'long', day: 'numeric'
        });
        document.getElementById('success-date-text').textContent = t('arrivingOn') + dateText;
    }
}

// --- Firebase Config ---
const firebaseConfig = {
    apiKey: "AIzaSyDSi11qNmO53kQASC0HEsFx7QboEJhqrfM",
    authDomain: "timecapsule-app-shota.firebaseapp.com",
    projectId: "timecapsule-app-shota",
    storageBucket: "timecapsule-app-shota.firebasestorage.app",
    messagingSenderId: "25442134585",
    appId: "1:25442134585:web:192ca8475195fbbf56fbe8"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// --- State ---
let selectedMood = null;
let capsules = [];
let countdownInterval = null;
let lastDeliveryDate = null;

// --- Initialize ---
document.addEventListener('DOMContentLoaded', () => {
    // Load saved language preference
    const savedLang = localStorage.getItem('timecapsule_lang');
    if (savedLang && (savedLang === 'en' || savedLang === 'ja')) {
        currentLang = savedLang;
    } else {
        // Auto-detect from browser
        const browserLang = navigator.language || navigator.userLanguage || '';
        currentLang = browserLang.startsWith('ja') ? 'ja' : 'en';
    }

    applyTranslations();
    createStars();
    createParticles();
    loadCapsules();
    setMinDate();
    hideLoading();
});

// --- Hide Loading ---
function hideLoading() {
    setTimeout(() => {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => overlay.style.display = 'none', 500);
        }
    }, 800);
}

// --- Star Background ---
function createStars() {
    const container = document.getElementById('stars-container');
    const starCount = 120;
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.setProperty('--duration', (2 + Math.random() * 4) + 's');
        star.style.setProperty('--max-opacity', (0.3 + Math.random() * 0.7));
        star.style.animationDelay = Math.random() * 5 + 's';
        if (Math.random() > 0.85) {
            star.style.width = '3px';
            star.style.height = '3px';
            star.style.boxShadow = '0 0 6px 1px rgba(255,255,255,0.3)';
        }
        container.appendChild(star);
    }
}

// --- Floating Particles ---
function createParticles() {
    const container = document.getElementById('particles-container');
    const colors = [
        'rgba(124, 91, 245, 0.4)',
        'rgba(167, 139, 250, 0.3)',
        'rgba(244, 114, 182, 0.3)',
        'rgba(52, 211, 153, 0.2)',
    ];
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.width = (4 + Math.random() * 8) + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.setProperty('--duration', (8 + Math.random() * 12) + 's');
        particle.style.animationDelay = Math.random() * 10 + 's';
        container.appendChild(particle);
    }
}

// --- Page Navigation ---
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const page = document.getElementById(pageId);
    if (page) page.classList.add('active');

    if (pageId === 'list-page') renderCapsuleList();
    if (pageId === 'write-page') resetForm();
}

// --- Set Minimum Date ---
function setMinDate() {
    const dateInput = document.getElementById('delivery-date');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.min = tomorrow.toISOString().split('T')[0];
}

// --- Mood Selector ---
function selectMood(btn) {
    document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedMood = btn.dataset.mood;
}

// --- Mood to Emoji ---
function moodToEmoji(mood) {
    const map = {
        happy: '😊', excited: '🤩', peaceful: '😌',
        hopeful: '🌟', nostalgic: '🥹', determined: '💪',
    };
    return map[mood] || '💌';
}

// --- Seal Capsule (Save to Firestore) ---
async function sealCapsule() {
    const name = document.getElementById('sender-name').value.trim();
    const email = document.getElementById('sender-email').value.trim();
    const date = document.getElementById('delivery-date').value;
    const subject = document.getElementById('letter-subject').value.trim();
    const body = document.getElementById('letter-body').value.trim();

    // Validation
    if (!name) { showToast(t('toastNameRequired')); return; }
    if (!email) { showToast(t('toastEmailRequired')); return; }
    if (!validateEmail(email)) { showToast(t('toastEmailInvalid')); return; }
    if (!date) { showToast(t('toastDateRequired')); return; }
    if (!subject) { showToast(t('toastSubjectRequired')); return; }
    if (!body) { showToast(t('toastBodyRequired')); return; }

    // Disable button during save
    const sendBtn = document.getElementById('send-btn');
    sendBtn.disabled = true;
    sendBtn.querySelector('span:last-child').textContent = t('saving');

    try {
        // Create capsule data
        const capsuleData = {
            name: name,
            email: email,
            deliveryDate: date,
            subject: subject,
            body: body,
            mood: selectedMood || 'happy',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            status: 'waiting',
            emailSent: false
        };

        // Save to Firestore
        const docRef = await db.collection('capsules').add(capsuleData);
        console.log('Capsule saved with ID:', docRef.id);

        // Also save locally for viewing
        const localCapsule = {
            id: docRef.id,
            ...capsuleData,
            createdAt: new Date().toISOString()
        };
        capsules.push(localCapsule);
        saveLocalCapsules();

        // Show success
        showSuccessPage(localCapsule);
        showToast(t('toastSealed'));

    } catch (error) {
        console.error('Error saving capsule:', error);
        showToast(t('toastSaveFailed'));
    } finally {
        sendBtn.disabled = false;
        sendBtn.querySelector('span:last-child').textContent = t('sealCapsule');
    }
}

// --- Show Success Page ---
function showSuccessPage(capsule) {
    const deliveryDate = new Date(capsule.deliveryDate + 'T00:00:00');
    lastDeliveryDate = deliveryDate;
    const dateText = deliveryDate.toLocaleDateString(t('dateLocale'), {
        year: 'numeric', month: 'long', day: 'numeric'
    });
    document.getElementById('success-date-text').textContent = t('arrivingOn') + dateText;
    updateCountdown(deliveryDate);
    clearInterval(countdownInterval);
    countdownInterval = setInterval(() => updateCountdown(deliveryDate), 1000);
    showPage('success-page');
}

// --- Update Countdown ---
function updateCountdown(targetDate) {
    const now = new Date();
    const diff = targetDate - now;
    if (diff <= 0) {
        document.getElementById('countdown-timer').textContent = t('alreadyDelivered');
        clearInterval(countdownInterval);
        return;
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    let text = '';
    if (days > 0) text += `${days}${t('dayUnit')} `;
    text += `${hours}${t('hourUnit')} ${minutes}${t('minuteUnit')} ${seconds}${t('secondUnit')}`;
    document.getElementById('countdown-timer').textContent = text;
}

// --- Render Capsule List ---
async function renderCapsuleList() {
    const listEl = document.getElementById('capsule-list');
    const emptyEl = document.getElementById('empty-state');

    // Try to load from Firestore first
    try {
        const snapshot = await db.collection('capsules')
            .orderBy('deliveryDate', 'asc')
            .get();

        capsules = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            capsules.push({
                id: doc.id,
                ...data,
                createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : new Date().toISOString()
            });
        });
        saveLocalCapsules();
    } catch (error) {
        console.warn('Firestore read failed, using local data:', error);
        loadLocalCapsules();
    }

    if (capsules.length === 0) {
        listEl.innerHTML = '';
        emptyEl.classList.add('visible');
        return;
    }

    emptyEl.classList.remove('visible');

    const locale = t('dateLocale');

    listEl.innerHTML = capsules.map(capsule => {
        const deliveryDate = new Date(capsule.deliveryDate + 'T00:00:00');
        const now = new Date();
        const isDelivered = deliveryDate <= now;
        const status = isDelivered ? 'delivered' : 'waiting';
        const statusText = isDelivered ? t('statusDelivered') : t('statusWaiting');

        const dateStr = deliveryDate.toLocaleDateString(locale, {
            year: 'numeric', month: 'short', day: 'numeric'
        });

        const createdDate = capsule.createdAt ? new Date(capsule.createdAt) : new Date();
        const createdStr = createdDate.toLocaleDateString(locale, {
            year: 'numeric', month: 'short', day: 'numeric'
        });

        const preview = capsule.body.substring(0, 80) + (capsule.body.length > 80 ? '...' : '');

        return `
            <div class="capsule-card" onclick="openCapsuleDetail('${capsule.id}')">
                <div class="capsule-card-header">
                    <span class="capsule-card-subject">${escapeHtml(capsule.subject)}</span>
                    <span class="capsule-card-mood">${moodToEmoji(capsule.mood)}</span>
                </div>
                <div class="capsule-card-date">
                    <span class="capsule-status ${status}">${statusText}</span>
                    <span>📝 ${createdStr} → 📬 ${dateStr}</span>
                </div>
                <div class="capsule-card-preview">${escapeHtml(preview)}</div>
            </div>
        `;
    }).join('');
}

// --- Open Capsule Detail ---
function openCapsuleDetail(id) {
    const capsule = capsules.find(c => c.id === id);
    if (!capsule) return;

    const existing = document.querySelector('.modal-overlay');
    if (existing) existing.remove();

    const locale = t('dateLocale');

    const deliveryDate = new Date(capsule.deliveryDate + 'T00:00:00');
    const dateStr = deliveryDate.toLocaleDateString(locale, {
        year: 'numeric', month: 'long', day: 'numeric'
    });
    const createdDate = capsule.createdAt ? new Date(capsule.createdAt) : new Date();
    const createdStr = createdDate.toLocaleDateString(locale, {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close" onclick="closeModal()">&times;</button>
            <div class="modal-subject">${moodToEmoji(capsule.mood)} ${escapeHtml(capsule.subject)}</div>
            <div class="modal-meta">
                <span>${t('createdLabel')} ${createdStr}</span>
                <span>${t('deliveryLabel')} ${dateStr}</span>
                <span>👤 ${escapeHtml(capsule.name)}</span>
            </div>
            <div class="modal-body">${escapeHtml(capsule.body)}</div>
            <button class="modal-delete-btn" onclick="deleteCapsule('${capsule.id}')">${t('deleteCapsule')}</button>
        </div>
    `;

    document.body.appendChild(modal);
    requestAnimationFrame(() => modal.classList.add('active'));
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
}

// --- Close Modal ---
function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }
}

// --- Delete Capsule ---
async function deleteCapsule(id) {
    if (!confirm(t('confirmDelete'))) return;

    try {
        await db.collection('capsules').doc(id).delete();
        capsules = capsules.filter(c => c.id !== id);
        saveLocalCapsules();
        closeModal();
        renderCapsuleList();
        showToast(t('toastDeleted'));
    } catch (error) {
        console.error('Error deleting capsule:', error);
        showToast(t('toastDeleteFailed'));
    }
}

// --- Reset Form ---
function resetForm() {
    document.getElementById('letter-subject').value = '';
    document.getElementById('letter-body').value = '';
    document.getElementById('delivery-date').value = '';
    document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('selected'));
    selectedMood = null;
}

// --- Local Storage (backup) ---
function saveLocalCapsules() {
    localStorage.setItem('timecapsule_data', JSON.stringify(capsules));
}

function loadLocalCapsules() {
    const data = localStorage.getItem('timecapsule_data');
    if (data) {
        try { capsules = JSON.parse(data); } catch (e) { capsules = []; }
    }
}

function loadCapsules() {
    loadLocalCapsules();
}

// --- Toast Notification ---
function showToast(message) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

// --- Utility ---
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}
