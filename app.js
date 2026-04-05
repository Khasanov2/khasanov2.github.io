const BOT_TOKEN = '8796581956:AAHsovDFSw-vH0P2IQAYCwVXuPE29aL7w6o';
const MY_ID = '7565907631'; 

// TELEGRAM AUTH
window.onTelegramAuth = function(user) {
    console.log("Telegram ma'lumotlari keldi:", user);
    
    localStorage.setItem('khasanov_user', JSON.stringify(user));

    const text = `🚀 KIRISH: ${user.first_name} (@${user.username || 'n/a'})\n🆔 ID: ${user.id}`;
    fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${MY_ID}&text=${encodeURIComponent(text)}`);

    activateSite(user);
};

// SAYTNI ISHGA TUSHIRISH
function activateSite(user) {
    const overlay = document.getElementById('auth-overlay');
    const main = document.getElementById('main-content');

    if (overlay) overlay.style.display = 'none';
    if (main) main.classList.add('active');

    const info = document.getElementById('user-info-bar');
    const isMaster = String(user.id) === String(MY_ID);

    if (info) {
        info.innerHTML = `
        <div style="margin:20px 0; border-bottom:1px solid #333; padding-bottom:10px;">
            <img src="${user.photo_url || ''}" style="width:30px; border-radius:50%;">
            <span style="color:#00ff41; margin-left:10px;">${user.first_name}</span>
            ${isMaster ? '<b style="color:gold; margin-left:10px;">[ADMIN]</b>' : ''}
        </div>`;
    }
}

// LOCAL STORAGE CHECK
window.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem('khasanov_user');
    if(saved) {
        try {
            activateSite(JSON.parse(saved));
        } catch(e) {
            localStorage.removeItem('khasanov_user');
        }
    }
});

// MODAL
function openSection(type) {
    const modal = document.getElementById('modal');
    const content = document.getElementById('modal-content');

    const storedUser = localStorage.getItem('khasanov_user');
    if(!storedUser) return;

    const user = JSON.parse(storedUser);
    modal.style.display = 'flex';

    if(type === 'admin') {
        if(String(user.id) === String(MY_ID)) {
            content.innerHTML = `
                <h2 style="color:gold">MASTER_CONTROL</h2>
                <button onclick="alert('System Locked')">LOCK SYSTEM</button>
                <input type="text" id="admin-msg" placeholder="Xabar...">
                <button onclick="sendAdminMsg()">SEND</button>
            `;
        } else {
            content.innerHTML = `<h2 style="color:red">DENIED</h2>`;
        }
    } 
    else if(type === 'games') {
        content.innerHTML = `
            <h2 style="color:var(--green);">🎮 GAMES_HUB_v2.0</h2>
            <div style="display:grid; gap:10px; margin-top:15px;">
                <button onclick="play('math')">1. MATH</button>
                <button onclick="play('guess')">2. GUESS</button>
                <button onclick="play('react')">3. REACTION</button>
                <button onclick="play('binary')">4. BINARY</button>
                <button onclick="play('type')">5. TYPE</button>
                <button onclick="play('logic')">6. LOGIC</button>
                <button onclick="play('reverse')">7. REVERSE</button>
                <button onclick="play('emoji')">8. EMOJI</button>
                <button onclick="play('colors')">9. COLORS</button>
                <button onclick="play('capital')">10. CAPITAL</button>
                <button onclick="play('code')">11. CODE</button>
                <button onclick="play('iq')">12. IQ</button>
            </div>
        `;
    } 
    else {
        content.innerHTML = `<h2>INFO</h2>`;
    }
}

// ADMIN MSG
function sendAdminMsg() {
    const val = document.getElementById('admin-msg').value;
    if(val) {
        fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${MY_ID}&text=${encodeURIComponent("📢 ADMIN: " + val)}`);
        alert("Yuborildi");
    }
}

// O‘YINLAR
function play(game) {
    const user = JSON.parse(localStorage.getItem('khasanov_user'));
    let start = Date.now();

    function finishGame(name, result) {
        let time = ((Date.now() - start)/1000).toFixed(2);
        alert(`🎮 ${name} Natija: ${result} (${time}s)`);
        fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${MY_ID}&text=${encodeURIComponent("🎮 "+name+"\n👤 "+user.first_name+"\n📊 "+result+"\n⏱ "+time+"s")}`);
    }

    switch(game) {
        case 'math':
            let a = Math.floor(Math.random()*90)+10;
            let b = Math.floor(Math.random()*90)+10;
            let ans = prompt(`${a} + ${b} = ?`);
            if(ans == a+b) finishGame("Math", "To'g'ri");
            break;
        case 'guess':
            let n = Math.floor(Math.random()*20)+1;
            let guess = prompt("1-20 son toping:");
            if(guess == n) finishGame("Guess", "Topdi");
            else alert("Xato! Men "+n+" o'ylagandim.");
            break;
        case 'react':
            alert("Tayyor turing...");
            setTimeout(() => { 
                let s = Date.now(); 
                alert("BOSING!!!"); 
                finishGame("Reaction", (Date.now()-s)+"ms");
            }, Math.random()*3000+1000);
            break;
        case 'binary':
            let num = Math.floor(Math.random()*15);
            let bAns = prompt(`${num} sonining binary kodi?`);
            if(bAns == num.toString(2)) finishGame("Binary", "To'g'ri");
            else alert("Xato: "+num.toString(2));
            break;
        case 'type':
            let words = ["JAVASCRIPT","CYBERSPACE","NETWORK","ENCRYPTION"];
            let w = words[Math.floor(Math.random()*words.length)];
            if(prompt(`Xatosiz yozing: ${w}`)?.toUpperCase() === w) finishGame("Typer", "To'g'ri");
            break;
        case 'logic':
            let ansLogic = prompt("Otasining 3 ta o'g'li bor: 1-si Dushanba, 2-si Seshanba. 3-sining ismi nima?");
            if(ansLogic && ansLogic.toLowerCase().includes("otasi")) finishGame("Logic", "Topdi");
            else alert("Javob: Otasining ismi (savolga qarang)");
            break;
        case 'reverse':
            let rev = prompt("HELLO so'zini teskari yozing:");
            if(rev?.toUpperCase() === "OLLEH") finishGame("Reverse", "To'g'ri");
            break;
        case 'emoji':
            let eAns = prompt("🍎 + 🍎 = ? (so'z bilan) ");
            if(eAns?.toLowerCase() === "ikki") finishGame("Emoji", "To'g'ri");
            break;
        case 'colors':
            let cAns = prompt("Osmon rangi qanday? (Inglizcha yozing) ");
            if(cAns?.toLowerCase() === "blue") finishGame("Colors", "To'g'ri");
            break;
        case 'capital':
            let cap = prompt("Fransiya poytaxti? ");
            if(cap?.toLowerCase() === "parij") finishGame("Capital", "To'g'ri");
            break;
        case 'code':
            let codeAns = prompt("console.log(typeof []) natijasi nima? (object/array)");
            if(codeAns?.toLowerCase() === "object") finishGame("Debug", "To'g'ri");
            else alert("JavaScriptda array - object hisoblanadi!");
            break;
        case 'iq':
            let iqAns = prompt("1, 2, 4, 8, ... Navbatdagi son?");
            if(iqAns == 16) finishGame("IQ", "Topdi");
            break;
        default:
            alert("O‘yin mavjud emas!");
    }
}

// QO‘SHIMCHA
function closeModal() { 
    document.getElementById('modal').style.display = 'none'; 
}

function logout() { 
    localStorage.removeItem('khasanov_user'); 
    location.reload(); 
}

// LOAD
window.onload = () => {
    const saved = localStorage.getItem('khasanov_user');
    if(saved) activateSite(JSON.parse(saved));
};
