const BOT_TOKEN = '8796581956:AAHsovDFSw-vH0P2IQAYCwVXuPE29aL7w6o';
const MY_ID = '7565907631';

window.onTelegramAuth = function(user) {
    localStorage.setItem('khasanov_user', JSON.stringify(user));
    activateSite(user);
    fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${MY_ID}&text=${encodeURIComponent("🚀 Login: " + user.first_name)}`);
};

function activateSite(user) {
    document.getElementById('auth-overlay').style.display = 'none';
    document.getElementById('main-content').classList.add('active');
    const isMaster = String(user.id) === MY_ID;
    document.getElementById('user-info-bar').innerHTML = `<span style="color:#00ff41;">● ${user.first_name} ${isMaster ? '[ADMIN]' : ''}</span>`;
}

window.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem('khasanov_user');
    if(saved) activateSite(JSON.parse(saved));
});

function openSection(type) {
    const modal = document.getElementById('modal');
    const content = document.getElementById('modal-content');
    modal.style.display = 'flex';
    const user = JSON.parse(localStorage.getItem('khasanov_user') || '{}');

    if(type === 'games') {
        const gList = ['math','guess','react','binary','type','logic','reverse','emoji','colors','capital','code','iq'];
        content.innerHTML = `<h2 style="color:#00ff41">🎮 12 GAMES HUB</h2>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
            ${gList.map(g => `<button class="game-btn" onclick="play('${g}')">${g.toUpperCase()}</button>`).join('')}
        </div>`;
    } else if(type === 'leaderboard') {
        showLeaderboard();
    } else if(type === 'admin' && String(user.id) === MY_ID) {
        content.innerHTML = `<h2>ADMIN</h2><button class="admin-btn" onclick="localStorage.removeItem('leaderboard'); location.reload();">RESET ALL</button>`;
    }
}

function play(game) {
    const user = JSON.parse(localStorage.getItem('khasanov_user'));
    let s = Date.now(), score = 0, q = "";

    if(game==='math') { let a=Math.floor(Math.random()*50), b=Math.floor(Math.random()*50); if(prompt(`${a}+${b}=?`) == a+b) score=10; }
    else if(game==='guess') { let n=Math.floor(Math.random()*10)+1; if(prompt("1-10 son?") == n) score=10; }
    else if(game==='iq') { if(prompt("2,4,8,16...?") == "32") score=20; }
    else if(game==='reverse') { if(prompt("OLMA teskarisi?") == "AMLO") score=10; }
    else if(game==='binary') { if(prompt("5 ning binary kodi (101)?") == "101") score=15; }
    else if(game==='type') { let w="KHASANOV"; if(prompt(`Yozing: ${w}`) === w) score=10; }
    else if(game==='logic') { if(prompt("Qaysi oyda 28 kun bor? (Hamma/Fevral)").toLowerCase().includes("hamma")) score=20; }
    else if(game==='emoji') { if(prompt("🍎+🍌=? (meva/ovqat)").toLowerCase() === "meva") score=5; }
    else if(game==='colors') { if(prompt("Qizil + Sariq = ? (Olovrang/Yashil)").toLowerCase() === "olovrang") score=15; }
    else if(game==='capital') { if(prompt("O'zbekiston poytaxti?").toLowerCase() === "toshkent") score=10; }
    else if(game==='code') { if(prompt("HTML nima? (Til/Dastur)").toLowerCase() === "til") score=10; }
    else if(game==='react') { alert("Tayyor turing!"); setTimeout(()=> { alert("BOSING!"); score=10; finish(user,game,score,s); }, 1000); return; }

    finish(user, game, score, s);
}

function finish(u, g, sc, s) {
    const t = ((Date.now()-s)/1000).toFixed(2);
    if(sc>0) {
        alert(`Yutdingiz! Ball: ${sc}`);
        let lb = JSON.parse(localStorage.getItem('leaderboard')||'[]');
        lb.push({name:u.first_name, game:g, score:sc, time:t});
        localStorage.setItem('leaderboard', JSON.stringify(lb));
        fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${MY_ID}&text=${encodeURIComponent(`🎮 ${g}\n👤 ${u.first_name}\n📊 ${sc}\n⏱ ${t}s`)}`);
    } else alert("Xato yoki vaqt tugadi!");
}

function showLeaderboard() {
    let lb = JSON.parse(localStorage.getItem('leaderboard')||'[]');
    lb.sort((a,b)=>b.score-a.score);
    document.getElementById('modal-content').innerHTML = `<h2>🏆 TOP</h2><table>${lb.slice(0,5).map(i=>`<tr><td>${i.name}</td><td>${i.score}</td></tr>`).join('')}</table>`;
}

function closeModal() { document.getElementById('modal').style.display='none'; }
function logout() { localStorage.removeItem('khasanov_user'); location.reload(); }
