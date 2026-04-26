// ============================================
//   XINN AI — Main JS
// ============================================

// Starfield generator
(function() {
    const c = document.getElementById('starfield');
    if (!c) return;
    for (let i = 0; i < 90; i++) {
        const s = document.createElement('div');
        s.className = 'star';
        s.style.cssText = `
            left:${Math.random()*100}%;top:${Math.random()*100}%;
            width:${Math.random()*2+1}px;height:${s.style.width};
            --dur:${Math.random()*3+2}s;--delay:${Math.random()*4}s
        `;
        c.appendChild(s);
    }
})();

// Sidebar
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('show');
    document.getElementById('sidebarOverlay').classList.toggle('show');
    if (document.getElementById('sidebar').classList.contains('show')) loadHistory();
}
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('sidebarOverlay').addEventListener('click', toggleSidebar);
});

function loadHistory() {
    const list = document.getElementById('historyList');
    if (!list) return;
    const chats = [];
    for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k.startsWith('xinn_chat_')) chats.push(JSON.parse(localStorage.getItem(k)));
    }
    chats.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    list.innerHTML = chats.length ? '' : '<p style="color:var(--text-muted);font-size:12px;text-align:center;padding:18px;">Belum ada riwayat</p>';
    chats.forEach(c => {
        const d = document.createElement('div');
        d.className = 'history-item';
        d.textContent = c.title || 'Obrolan';
        d.onclick = () => { localStorage.setItem('xinn_current_chat', JSON.stringify(c)); location.href = 'chat.html'; };
        list.appendChild(d);
    });
}

function newChat() { localStorage.removeItem('xinn_current_chat'); location.href = 'chat.html'; }
function showSettings() { toggleSidebar(); showToast('⚙️ Pengaturan segera tersedia'); }

// Quick Actions
function startChat(prompt) {
    const chat = {
        id: Date.now().toString(),
        title: prompt.substring(0, 50),
        messages: [{ role: 'user', content: prompt }],
        createdAt: new Date().toISOString()
    };
    localStorage.setItem('xinn_current_chat', JSON.stringify(chat));
    location.href = 'chat.html';
}
function sendHomeMessage() {
    const inp = document.getElementById('homeInput');
    const msg = inp.value.trim();
    if (msg) startChat(msg);
}

// Bottom Sheets
function showPlusMenu() { document.getElementById('plusSheet').classList.add('show'); document.getElementById('plusOverlay').classList.add('show'); }
function hidePlusMenu() { document.getElementById('plusSheet').classList.remove('show'); document.getElementById('plusOverlay').classList.remove('show'); }
function showMoreMenu() { document.getElementById('moreSheet').classList.add('show'); document.getElementById('moreOverlay').classList.add('show'); }
function hideMoreMenu() { document.getElementById('moreSheet').classList.remove('show'); document.getElementById('moreOverlay').classList.remove('show'); }

// Actions
function deleteAllChats() {
    if (confirm('Hapus semua chat?')) {
        for (let i = localStorage.length-1; i >= 0; i--) {
            const k = localStorage.key(i);
            if (k.startsWith('xinn_chat_') || k === 'xinn_current_chat') localStorage.removeItem(k);
        }
        showToast('🗑️ Semua chat dihapus');
        hideMoreMenu(); loadHistory();
    }
}
function exportAllChats() {
    const chats = [];
    for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k.startsWith('xinn_chat_')) chats.push(JSON.parse(localStorage.getItem(k)));
    }
    if (!chats.length) return showToast('📭 Belum ada chat');
    let t = '=== XINN AI — Export ===\n\n';
    chats.forEach((c, i) => {
        t += `--- Chat ${i+1}: ${c.title} ---\n${new Date(c.createdAt).toLocaleString()}\n\n`;
        c.messages.forEach(m => { t += `${m.role==='user'?'👤':'🤖'}: ${m.content}\n\n`; });
    });
    const b = new Blob([t], {type:'text/plain'});
    const a = document.createElement('a'); a.href = URL.createObjectURL(b);
    a.download = `xinn-export-${new Date().toISOString().slice(0,10)}.txt`; a.click();
    showToast('✅ Chat diexport'); hideMoreMenu();
}
function featureSoon(f) { showToast(`🚧 ${f} segera tersedia!`); }
function showAbout() { hideMoreMenu(); showToast('🤖 XINN AI v2.0 — Asisten AI Premium oleh BARR'); }
function showHelp() { hideMoreMenu(); showToast('❓ FAQ: Chat aja, XINN AI bantu coding, ide, debug, dll.'); }

// Toast
function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg; t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2200);
}
