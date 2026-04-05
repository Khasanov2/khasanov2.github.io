const BOT_TOKEN = '8796581956:AAHsovDFSw-vH0P2IQAYCwVXuPE29aL7w6o';
const MY_ID = '7565907631';

// 1. TELEGRAM AUTH
window.onTelegramAuth = function(user) {
    localStorage.setItem('khasanov_user', JSON.stringify(user));
    activateSite(user);

    const text = `🚀 Kirish: ${user.first_name} (@${user.username || 'n/a'}) ID: ${user.id}`;
    fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${MY_ID}&text=${encodeURIComponent(text)}`);
};

// 2. SAYTNI ISHGA TUSHIRISH
function activateSite(user) {
    const overlay = document.getElementById('auth-overlay');
    const main = document.getElementById('main-content');
    
    if(overlay) overlay.style.display = 'none';
    if(main) main.classList.add('active');

    const info = document.getElementById('user-info-bar');
    const isMaster = String(user.id) === MY_ID;

    if(info) {
        info.innerHTML = `
            <div style="margin:20px 0; border-bottom:1px solid #333; padding-bottom:10px; display:flex; align-items:center;">
                <img src="${user.photo_url || ''}" style="width:30px; border-radius:50%; border:1px solid #00ff41;">
                <span style="color:#00ff41; margin-left:10px;">${user.first_name}</span>
                ${isMaster ? '<b style="color:gold; margin-left:10px;">[MASTER_ADMIN]</b>' : ''}
            </div>`;
    }
}

// 3. SAHIFA YUKLANGANDA
window.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem('khasanov_user');
    if(saved) activateSite(JSON.parse(saved));
});

// 4. O'YINLAR VA MODAL
function openSection(type) {
    const modal = document.getElementById('modal');
    const content = document.getElementById('modal-content');
    const user = JSON.parse(localStorage.getItem('khasanov_user') || '{}');
    modal.style.display = 'flex';

    if(type === 'games') {
        const games = ['math', 'guess', 'react', 'binary', 'type', 'logic', 'reverse', 'emoji', 'colors', 'capital', 'code', 'iq'];
        content.innerHTML = `<h2 style="color:#00ff41">🎮 12_GAMES_HUB</h2>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; max-height:350px; overflow-y:auto; padding:10px;">
            ${games.map(g => `<button class="game-btn" onclick="play('${g}')">${g.toUpperCase()}</button>`).join('')}
        </div>`;
    } else if(type === 'leaderboard') {
        showLeaderboard();
    } else if(type === 'admin' && String(user.id) === MY_ID) {
        content.innerHTML = `<h2 style="color:gold">ADMIN</h2><button class="admin-btn" onclick="clearLeaderboard()">CLEAR LEADERBOARD</button>`;
    } else {
        content.innerHTML = `<h2>INFO</h2><p>Bo'lim tayyorlanmoqda...</p>`;
    }
}

// 5. O'YIN LOGIKASI
function play(game) {
    const user = JSON.parse(localStorage.getItem('khasanov_user'));
    let start = Date.now();
    let score = 0;

    if(game === 'math') {
        let a = Math.floor(Math.random()*90)+10, b = Math.floor(Math.random()*90)+10;
        if(prompt(`${a} + ${b} = ?`) == (a+b)) score = 10;
    } else if(game === 'iq') {
        if(prompt("2, 4, 8, 16, ... keyingi son?") == "32") score = 15;
    } else if(game === 'reverse') {
        if(prompt("'GITHUB' so'zini teskari yozing:") === "BUHTIG") score = 10;
    } 
    // Boshqa o'yinlar mantiqi...

    finish(user, game, score, start);
}

function finish(user, game, score, start) {
    const time = ((Date.now() - start) / 1000).toFixed(2);
    alert(`Natija: ${score} ball | Vaqt: ${time}s`);

    fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${MY_ID}&text=${encodeURIComponent(`🎮 O'YIN: ${game}\n👤 User: ${user.first_name}\n📊 Ball: ${score}\n⏱ Vaqt: ${time}s`)}`);

    let lb = JSON.parse(localStorage.getItem('leaderboard') || '[]');
    lb.push({name: user.first_name, game, score, time});
    localStorage.setItem('leaderboard', JSON.stringify(lb));
}

function showLeaderboard() {
    const content = document.getElementById('modal-content');
    let lb = JSON.parse(localStorage.getItem('leaderboard') || '[]');
    lb.sort((a,b) => b.score - a.score);
    content.innerHTML = `<h2>🏆 TOP PLAYERS</h2>
    <table style="width:100%; font-size:12px;">
        <tr><th>User</th><th>Game</th><th>Score</th></tr>
        ${lb.slice(0,10).map(i => `<tr><td>${i.name}</td><td>${i.game}</td><td>${i.score}</td></tr>`).join('')}
    </table>`;
}

function closeModal() { document.getElementById('modal').style.display = 'none'; }
function logout() { localStorage.removeItem('khasanov_user'); location.reload(); }
function clearLeaderboard() { localStorage.removeItem('leaderboard'); alert("Tozalandi"); closeModal(); }
