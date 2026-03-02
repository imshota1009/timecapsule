// ===========================
// Time Capsule - App Logic
// Firebase Firestore Version
// ===========================

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

// --- Initialize ---
document.addEventListener('DOMContentLoaded', () => {
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
    if (!name) { showToast('⚠️ Please enter your name'); return; }
    if (!email) { showToast('⚠️ Please enter your email address'); return; }
    if (!validateEmail(email)) { showToast('⚠️ Please enter a valid email address'); return; }
    if (!date) { showToast('⚠️ Please select a delivery date'); return; }
    if (!subject) { showToast('⚠️ Please enter a subject'); return; }
    if (!body) { showToast('⚠️ Please write your letter'); return; }

    // Disable button during save
    const sendBtn = document.getElementById('send-btn');
    sendBtn.disabled = true;
    sendBtn.querySelector('span:last-child').textContent = 'Saving...';

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
            status: 'waiting',  // waiting → delivered
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
        showToast('✨ Capsule sealed successfully!');

    } catch (error) {
        console.error('Error saving capsule:', error);
        showToast('❌ Failed to save. Please try again.');
    } finally {
        sendBtn.disabled = false;
        sendBtn.querySelector('span:last-child').textContent = 'Seal the Capsule';
    }
}

// --- Show Success Page ---
function showSuccessPage(capsule) {
    const deliveryDate = new Date(capsule.deliveryDate + 'T00:00:00');
    const dateText = deliveryDate.toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });
    document.getElementById('success-date-text').textContent = `📅 Arriving on ${dateText}`;
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
        document.getElementById('countdown-timer').textContent = '🎉 Already delivered!';
        clearInterval(countdownInterval);
        return;
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    let text = '';
    if (days > 0) text += `${days}d `;
    text += `${hours}h ${minutes}m ${seconds}s`;
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

    listEl.innerHTML = capsules.map(capsule => {
        const deliveryDate = new Date(capsule.deliveryDate + 'T00:00:00');
        const now = new Date();
        const isDelivered = deliveryDate <= now;
        const status = isDelivered ? 'delivered' : 'waiting';
        const statusText = isDelivered ? 'Delivered' : 'Waiting';

        const dateStr = deliveryDate.toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        });

        const createdDate = capsule.createdAt ? new Date(capsule.createdAt) : new Date();
        const createdStr = createdDate.toLocaleDateString('en-US', {
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

    const deliveryDate = new Date(capsule.deliveryDate + 'T00:00:00');
    const dateStr = deliveryDate.toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });
    const createdDate = capsule.createdAt ? new Date(capsule.createdAt) : new Date();
    const createdStr = createdDate.toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close" onclick="closeModal()">&times;</button>
            <div class="modal-subject">${moodToEmoji(capsule.mood)} ${escapeHtml(capsule.subject)}</div>
            <div class="modal-meta">
                <span>📝 Created: ${createdStr}</span>
                <span>📬 Delivery: ${dateStr}</span>
                <span>👤 ${escapeHtml(capsule.name)}</span>
            </div>
            <div class="modal-body">${escapeHtml(capsule.body)}</div>
            <button class="modal-delete-btn" onclick="deleteCapsule('${capsule.id}')">🗑️ Delete this capsule</button>
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
    if (!confirm('Delete this capsule?\nThis action cannot be undone.')) return;

    try {
        await db.collection('capsules').doc(id).delete();
        capsules = capsules.filter(c => c.id !== id);
        saveLocalCapsules();
        closeModal();
        renderCapsuleList();
        showToast('🗑️ Capsule deleted');
    } catch (error) {
        console.error('Error deleting capsule:', error);
        showToast('❌ Failed to delete');
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
