// ============================================
//   XINN AI - Sidebar & Menu Logic
// ============================================

// SIDEBAR
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    if (sidebar.classList.contains('active')) {
        loadHistory();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('sidebarOverlay').addEventListener('click', toggleSidebar);
    loadHistory();
});

// LOAD HISTORY
function loadHistory() {
    const historyList = document.getElementById('historyList');
    if (!historyList) return;
    
    const chats = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('xinn_chat_')) {
            chats.push(JSON.parse(localStorage.getItem(key)));
        }
    }
    
    chats.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    historyList.innerHTML = '';
    
    if (chats.length === 0) {
        historyList.innerHTML = '<p style="color: var(--text-muted); font-size: 13px; text-align: center; padding: 20px;">Belum ada riwayat chat</p>';
        return;
    }
    
    chats.forEach(chat => {
        const item = document.createElement('div');
        item.className = 'history-item';
        item.textContent = chat.title;
        item.onclick = () => {
            localStorage.setItem('xinn_current_chat', JSON.stringify(chat));
            window.location.href = 'chat.html';
        };
        historyList.appendChild(item);
    });
}

// NEW CHAT
function newChat() {
    localStorage.removeItem('xinn_current_chat');
    window.location.href = 'index.html';
}

// MENU PLUS
function showPlusMenu() {
    document.getElementById('plusMenu').classList.add('active');
    document.getElementById('plusOverlay').classList.add('active');
}

function hidePlusMenu() {
    document.getElementById('plusMenu').classList.remove('active');
    document.getElementById('plusOverlay').classList.remove('active');
}

// MENU TITIK TIGA
function showMoreMenu() {
    document.getElementById('moreMenu').classList.add('active');
    document.getElementById('moreOverlay').classList.add('active');
}

function hideMoreMenu() {
    document.getElementById('moreMenu').classList.remove('active');
    document.getElementById('moreOverlay').classList.remove('active');
          }
