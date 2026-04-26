// ============================================
//   XINN AI - Main Script
//   Halaman Utama & Navigasi
// ============================================

// STARFIELD GENERATOR
function createStarfield() {
    const container = document.getElementById('starfield');
    const starCount = 80;
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.width = Math.random() * 2 + 1 + 'px';
        star.style.height = star.style.width;
        star.style.animationDelay = Math.random() * 5 + 's';
        star.style.animationDuration = Math.random() * 3 + 2 + 's';
        container.appendChild(star);
    }
}

document.addEventListener('DOMContentLoaded', createStarfield);

// CHAT FUNCTIONS
function startChat(prompt) {
    const chatData = {
        id: Date.now().toString(),
        title: prompt.length > 40 ? prompt.substring(0, 40) + '...' : prompt,
        messages: [
            { role: 'user', content: prompt },
            { role: 'assistant', content: 'Sedang memproses...' }
        ],
        createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('xinn_current_chat', JSON.stringify(chatData));
    window.location.href = 'chat.html';
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    if (!message) return;
    startChat(message);
}

function handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

// FEATURE SOON
function featureSoon(feature) {
    showToast(`🚧 Fitur "${feature}" segera tersedia!`);
}

// TOAST
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
}

// EXPORT FUNCTIONS
function exportAllChats() {
    const allChats = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('xinn_chat_')) {
            allChats.push(JSON.parse(localStorage.getItem(key)));
        }
    }
    
    if (allChats.length === 0) {
        showToast('📭 Belum ada chat untuk diexport');
        return;
    }
    
    let exportText = '=== XINN AI - EXPORT CHAT ===\n\n';
    allChats.forEach((chat, index) => {
        exportText += `--- Chat ${index + 1}: ${chat.title} ---\n`;
        exportText += `Tanggal: ${new Date(chat.createdAt).toLocaleString()}\n\n`;
        chat.messages.forEach(msg => {
            exportText += `${msg.role === 'user' ? '👤 User' : '🤖 XINN AI'}:\n${msg.content}\n\n`;
        });
        exportText += '\n\n';
    });
    
    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `xinn-ai-chat-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    showToast('✅ Chat berhasil diexport!');
    hideMoreMenu();
}

function deleteAllChats() {
    if (confirm('Yakin mau hapus semua chat? Ini nggak bisa di-undo, Bos.')) {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('xinn_chat_') || key === 'xinn_current_chat') {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
        showToast('🗑️ Semua chat dihapus!');
        loadHistory();
        hideMoreMenu();
    }
}

function showAbout() {
    hideMoreMenu();
    showToast('🤖 XINN AI v2060.1 — Dibuat oleh BARR. Asisten AI premium tanpa batasan.');
}

function showHelp() {
    hideMoreMenu();
    showToast('❓ FAQ: XINN AI bisa bantu coding, desain, ide, debug, dan banyak lagi. Chat aja!');
}

function showSettings() {
    toggleSidebar();
    showToast('⚙️ Pengaturan akan segera tersedia');
}
