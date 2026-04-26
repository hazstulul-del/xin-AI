// ============================================
//   XINN AI - Chat Logic
//   API Integration & Markdown Rendering
// ============================================

const API_URL = '/api/chat';
let currentChat = null;

// INIT
document.addEventListener('DOMContentLoaded', () => {
    createStarfield();
    loadCurrentChat();
    scrollToBottom();
});

// LOAD CHAT
function loadCurrentChat() {
    const saved = localStorage.getItem('xinn_current_chat');
    if (saved) {
        currentChat = JSON.parse(saved);
        renderMessages();
    } else {
        // Empty state
        currentChat = {
            id: Date.now().toString(),
            title: 'Obrolan Baru',
            messages: [],
            createdAt: new Date().toISOString()
        };
    }
}

// RENDER ALL MESSAGES
function renderMessages() {
    const container = document.getElementById('chatMessages');
    container.innerHTML = '';
    
    currentChat.messages.forEach((msg, index) => {
        if (msg.content !== 'Sedang memproses...') {
            container.appendChild(createBubble(msg, index));
        }
    });
    
    scrollToBottom();
}

// CREATE BUBBLE
function createBubble(msg, index) {
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${msg.role}`;
    
    if (msg.role === 'assistant') {
        bubble.innerHTML = `
            <div class="bubble-avatar">
                <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdHh3eXl6eGd0eGJzMmJzMmJzMmJzMmJzMmJzMmJzMmJzMmJzMmJzMiZlcD12MV9pbnRlcm5hbF9naWZzX2dpZklkJmN0PXM/3o7abB06u9bNzA8lu8/giphy.gif" alt="AI">
            </div>
            <div class="bubble-content">${renderMarkdown(msg.content)}</div>
        `;
    } else {
        bubble.innerHTML = `
            <div class="bubble-content">${escapeHtml(msg.content)}</div>
        `;
    }
    
    return bubble;
}

// SIMPLE MARKDOWN RENDERER
function renderMarkdown(text) {
    let html = escapeHtml(text);
    
    // Code blocks with copy button
    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
        const codeId = 'code-' + Math.random().toString(36).substr(2, 9);
        return `<div class="code-block-wrapper">
            <pre><code id="${codeId}">${escapeHtml(code.trim())}</code></pre>
            <button class="copy-btn" onclick="copyCode('${codeId}', this)">📋 Copy</button>
        </div>`;
    });
    
    // Headings
    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
    
    // Bold & Italic
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    
    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
    
    // Lists
    html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
    
    // Numbered lists
    html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');
    
    // Line breaks
    html = html.replace(/\n/g, '<br>');
    
    return html;
}

// ESCAPE HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// COPY CODE
function copyCode(codeId, btn) {
    const code = document.getElementById(codeId).textContent;
    navigator.clipboard.writeText(code).then(() => {
        btn.textContent = '✅ Tersalin!';
        btn.classList.add('copied');
        setTimeout(() => {
            btn.textContent = '📋 Copy';
            btn.classList.remove('copied');
        }, 2000);
    });
}

// SEND MESSAGE
async function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    if (!message) return;
    
    // Add user message
    currentChat.messages.push({ role: 'user', content: message });
    currentChat.title = message.length > 40 ? message.substring(0, 40) + '...' : message;
    
    // Update UI
    const container = document.getElementById('chatMessages');
    container.appendChild(createBubble({ role: 'user', content: message }));
    input.value = '';
    scrollToBottom();
    
    // Show typing indicator
    showTyping();
    
    try {
        // Call API
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: currentChat.messages })
        });
        
        const data = await response.json();
        hideTyping();
        
        if (data.success) {
            // Add AI response
            currentChat.messages.push({ role: 'assistant', content: data.response });
            container.appendChild(createBubble({ role: 'assistant', content: data.response }));
        } else {
            throw new Error(data.message || 'Unknown error');
        }
    } catch (error) {
        hideTyping();
        const errorMsg = '😅 Waduh, server lagi rame nih Bos. Coba lagi ya.';
        currentChat.messages.push({ role: 'assistant', content: errorMsg });
        container.appendChild(createBubble({ role: 'assistant', content: errorMsg }));
    }
    
    // Save to localStorage
    saveChat();
    scrollToBottom();
}

// TYPING INDICATOR
function showTyping() {
    document.getElementById('typingIndicator').style.display = 'block';
}

function hideTyping() {
    document.getElementById('typingIndicator').style.display = 'none';
}

// SAVE CHAT
function saveChat() {
    localStorage.setItem('xinn_current_chat', JSON.stringify(currentChat));
    localStorage.setItem('xinn_chat_' + currentChat.id, JSON.stringify(currentChat));
}

// SCROLL
function scrollToBottom() {
    setTimeout(() => {
        const main = document.getElementById('chatMain');
        main.scrollTop = main.scrollHeight;
    }, 100);
}

// NAVIGATION
function goBack() {
    saveChat();
    window.location.href = 'index.html';
}

function handleChatKey(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendChatMessage();
    }
}

// CLEAR CHAT
function clearCurrentChat() {
    if (confirm('Hapus chat ini?')) {
        currentChat.messages = [];
        saveChat();
        renderMessages();
        hideMoreMenu();
    }
}

// EXPORT CHAT
function exportCurrentChat() {
    let text = `=== XINN AI - ${currentChat.title} ===\n\n`;
    currentChat.messages.forEach(msg => {
        text += `${msg.role === 'user' ? '👤 User' : '🤖 XINN AI'}:\n${msg.content}\n\n`;
    });
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `xinn-chat-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    hideMoreMenu();
}

// BACKWARD COMPATIBILITY
function showToast(msg) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
}

function createStarfield() {
    const container = document.getElementById('starfield');
    if (!container) return;
    for (let i = 0; i < 80; i++) {
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

function featureSoon(f) { showToast(`🚧 Fitur "${f}" segera tersedia!`); }
function showAbout() { hideMoreMenu(); showToast('🤖 XINN AI v2060.1 — Dibuat oleh BARR. Asisten AI premium tanpa batasan.'); }
