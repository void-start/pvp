let player1HP = 100;
let player2HP = 100;
let selectedAttack = null;
let selectedDefense = null;
let secondsLeft = 10;
let battleId = null;
let timer = null;

// Авторизация через Telegram
document.getElementById('auth-button').addEventListener('click', () => {
    Telegram.WebApp.Login();
});

Telegram.WebApp.onEvent('auth', (user) => {
    console.log('Авторизован пользователь:', user);
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    // Создание битвы на сервере
    startNewBattle(user.id);
});

function startNewBattle(userId) {
    fetch('battle.php', {
        method: 'POST',
        body: JSON.stringify({ user_id: userId }),
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
        battleId = data.battle_id;
        console.log('Битва начата:', battleId);
    });
}

document.querySelectorAll('.choose-artifact').forEach(button => {
    button.addEventListener('click', () => {
        const type = button.dataset.type;
        const subtype = button.dataset.subtype;

        if (type === 'attack') {
            selectedAttack = subtype;
        } else if (type === 'defense') {
            selectedDefense = subtype;
        }

        updateBattleState();
        startTurnTimer();
    });
});

function startTurnTimer() {
    secondsLeft = 10;
    document.getElementById("timer-countdown").innerText = secondsLeft;

    if (timer) clearInterval(timer);

    timer = setInterval(() => {
        secondsLeft--;
        document.getElementById("timer-countdown").innerText = secondsLeft;

        if (secondsLeft <= 0) {
            clearInterval(timer);
            autoSelect();
        }
    }, 1000);
}

function autoSelect() {
    if (!selectedAttack) selectedAttack = 'physical';
    if (!selectedDefense) selectedDefense = 'physical';
    updateBattleState();
}

function updateBattleState() {
    fetch('battle.php', {
        method: 'POST',
        body: JSON.stringify({
            battle_id: battleId,
            attack: selectedAttack,
            defense: selectedDefense,
            player1_hp: player1HP,
            player2_hp: player2HP
        }),
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
        player1HP -= data.damage1;
        player2HP -= data.damage2;
        document.getElementById('player1_hp').innerText = player1HP;
        document.getElementById('player2_hp').innerText = player2HP;
        checkVictory();
    });
}

function checkVictory() {
    if (player1HP <= 0 || player2HP <= 0) {
        const winner = player1HP > 0 ? 'Игрок 1' : 'Игрок 2';
        alert(`${winner} победил!`);
        endBattle();
    }
}

function endBattle() {
    fetch('battle.php', {
        method: 'POST',
        body: JSON.stringify({ battle_id: battleId, winner: player1HP > 0 ? 1 : 2 }),
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
        console.log('Игра завершена.');
        document.getElementById('game-screen').style.display = 'none';
        document.getElementById('login-screen').style.display = 'block';
    });
}
