const BOT_TOKEN = '8796581956:AAHsovDFSw-vH0P2IQAYCwVXuPE29aL7w6o';
const MY_ID = '7565907631'; 

// TELEGRAM AUTH
window.onTelegramAuth = function(user) {
    localStorage.setItem('khasanov_user', JSON.stringify(user));
    activateSite(user);

    // Telegram xabar
    const text = `🚀 Kirish: ${user.first_name} (@${user.username||'n/a'}) ID: ${user.id}`;
    fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${MY_ID}&text=${encodeURIComponent(text)}`);
};

// SAYTNI ISHGA TUSHIRISH
function activateSite(user) {
    document.getElementById('auth-overlay').style.display = 'none';
    document.getElementById('main-content').classList.add('active');

    const info = document.getElementById('user-info-bar');
    const isMaster = String(user.id) === MY_ID;
    info.innerHTML = `
        <div style="margin:20px 0; border-bottom:1px solid #333; padding-bottom:10px;">
            <img src="${user.photo_url||''}" style="width:30px; border-radius:50%;">
            <span style="color:#00ff41; margin-left:10px;">${user.first_name}</span>
            ${isMaster?'<b style="color:gold; margin-left:10px;">[ADMIN]</b>':''}
        </div>`;
}

// LOCAL STORAGE CHECK
window.addEventListener('DOMContentLoaded', ()=>{
    const saved = localStorage.getItem('khasanov_user');
    if(saved) activateSite(JSON.parse(saved));
});

// MODAL
function openSection(type) {
    const modal = document.getElementById('modal');
    const content = document.getElementById('modal-content');
    modal.style.display = 'flex';

    const user = JSON.parse(localStorage.getItem('khasanov_user'));
    const isMaster = String(user.id) === MY_ID;

    if(type==='admin'){
        if(isMaster){
            content.innerHTML = `
                <h2 style="color:gold">MASTER_CONTROL</h2>
                <input type="text" id="admin-msg" placeholder="Xabar...">
                <button class="admin-btn" onclick="sendAdminMsg()">SEND</button>
                <button class="admin-btn" onclick="clearLeaderboard()">CLEAR LEADERBOARD</button>
            `;
        } else content.innerHTML = `<h2 style="color:red">ACCESS DENIED</h2>`;
    }
    else if(type==='games'){
        content.innerHTML = `
            <h2 style="color:var(--green)">🎮 GAMES_HUB</h2>
            ${['math','guess','react','binary','type','logic'].map(g=>`<button class="game-btn" onclick="play('${g}')">${g.toUpperCase()}</button>`).join('')}
        `;
    }
    else if(type==='leaderboard'){
        showLeaderboard();
    }
    else content.innerHTML = `<h2>INFO</h2><p>Bo‘lim tayyorlanmoqda...</p>`;
}

// ADMIN XABAR
function sendAdminMsg(){
    const val = document.getElementById('admin-msg').value;
    if(val) {
        fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${MY_ID}&text=${encodeURIComponent("📢 ADMIN: "+val)}`);
        alert("Yuborildi");
    }
}

// O‘YIN
function play(game){
    const user = JSON.parse(localStorage.getItem('khasanov_user'));
    let start = Date.now();
    let score = 0;

    if(game==='math'){
        let a=Math.floor(Math.random()*90)+10;
        let b=Math.floor(Math.random()*90)+10;
        let ans=prompt(`${a}+${b}=?`);
        if(ans==a+b) score=10; else score=0;
    }
    else if(game==='guess'){
        let n=Math.floor(Math.random()*20)+1;
        let ans=prompt("1-20 son toping:");
        if(ans==n) score=10; else alert("Xato: "+n);
    }
    else if(game==='react'){
        alert("Tayyor...");
        let s=Date.now();
        alert("BOSING!!!");
        score = Math.floor(Math.random()*10)+5;
    }

    finish(user, game, score, start);
}

// FINISH
function finish(user, game, score, start){
    const time = ((Date.now()-start)/1000).toFixed(2);
    alert(`Natija: ${score} (${time}s)`);

    // TELEGRAM
    fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${MY_ID}&text=${
        encodeURIComponent(`🎮 ${game}\n👤 ${user.first_name}\n📊 ${score}\n⏱ ${time}s`)
    }`);

    // LEADERBOARD
    let lb = JSON.parse(localStorage.getItem('leaderboard')||'[]');
    lb.push({name:user.first_name, game, score, time});
    localStorage.setItem('leaderboard', JSON.stringify(lb));
}

// LEADERBOARD
function showLeaderboard(){
    const content = document.getElementById('modal-content');
    let lb = JSON.parse(localStorage.getItem('leaderboard')||'[]');
    lb.sort((a,b)=>b.score-a.score);
    content.innerHTML = `<h2 style="color:var(--green)">LEADERBOARD</h2>`+
        `<table><tr><th>#</th><th>Name</th><th>Game</th><th>Score</th><th>Time(s)</th></tr>`+
        lb.map((u,i)=>`<tr><td>${i+1}</td><td>${u.name}</td><td>${u.game}</td><td>${u.score}</td><td>${u.time}</td></tr>`).join('')+
        `</table>`;
}

// CLEAR LEADERBOARD
function clearLeaderboard(){
    localStorage.removeItem('leaderboard');
    alert("Leaderboard tozalandi!");
    closeModal();
}

// MODAL & LOGOUT
function closeModal(){ document.getElementById('modal').style.display='none'; }
function logout(){ localStorage.removeItem('khasanov_user'); location.reload(); }