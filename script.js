let userId = null; // Идентификатор пользователя
let battleData = null; // Данные о битве

document.getElementById('auth-btn').addEventListener('click', async () => {
    // Здесь должна быть логика для авторизации через Telegram.
    // Временно генерируем случайный user_id
    userId = Math.floor(Math.random() * 10000);
    console.log("Пользователь авторизован с userId:", userId);

    // Показываем игровую секцию
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('game-section').style.display = 'block';

    // Создаем сессию битвы
    await startBattle(userId);
});

async function startBattle(userId) {
    const response = await fetch('/start_battle', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id: userId })
    });
    const data = await response.json();
    console.log("Сессия битвы создана с ID:", data.battle_id);
    battleData = data.battle_id; // Сохраняем ID сессии
}

async function makeMove(attack, defense) {
    if (!battleData) return;

    const response = await fetch('/make_move', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ attack, defense })
    });
    const data = await response.json();
    console.log("Результаты хода:", data);

    document.getElementById('player1-hp').textContent = data.player1_hp;
    document.getElementById('player2-hp').textContent = data.player2_hp;
}

// Обработчики для кнопок атак и защиты
document.getElementById('attack-physical').addEventListener('click', () => makeMove('physical', 'physical'));
document.getElementById('attack-magical').addEventListener('click', () => makeMove('magical', 'magical'));
document.getElementById('attack-pure').addEventListener('click', () => makeMove('pure', 'pure'));
document.getElementById('defense-physical').addEventListener('click', () => makeMove('physical', 'physical'));
document.getElementById('defense-magical').addEventListener('click', () => makeMove('magical', 'magical'));
document.getElementById('defense-pure').addEventListener('click', () => makeMove('pure', 'pure'));

// Таймер выбора хода
let timer = 10;
let timerInterval;

function startTimer() {
    timerInterval = setInterval(() => {
        if (timer <= 0) {
            clearInterval(timerInterval);
            // Если время вышло, отправляем случайный ход
            makeMove(randomAttack(), randomDefense());
        } else {
            document.getElementById('timer-count').textContent = timer;
            timer--;
        }
    }, 1000);
}

function randomAttack() {
    const attacks = ['physical', 'magical', 'pure'];
    return attacks[Math.floor(Math.random() * attacks.length)];
}

function randomDefense() {
    const defenses = ['physical', 'magical', 'pure'];
    return defenses[Math.floor(Math.random() * defenses.length)];
}

startTimer(); // Стартуем таймер сразу после загрузки страницы
