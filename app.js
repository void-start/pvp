window.addEventListener("load", () => {
  if (window.Telegram.WebApp) {
    Telegram.WebApp.expand();
    console.log("Пользователь:", Telegram.WebApp.initDataUnsafe.user);
  }

  const app = document.getElementById("app");
  const battle = document.getElementById("battle-screen");
  const attackContainer = document.getElementById("attack-artifacts");
  const defenseContainer = document.getElementById("defense-artifacts");

  let selectedAttack = null;
  let selectedDefense = null;

  let player1HP = 100;
  let player2HP = 100;

  let currentTurn = 1;
  let timer = null;
  let secondsLeft = 10;

  const telegramId = Telegram.WebApp.initDataUnsafe.user.id;

  // Загружаем данные игрока с сервера
  fetch(`api.php?telegram_id=${telegramId}`)
    .then(response => response.json())
    .then(data => {
      if (data.hp) {
        player1HP = data.hp;
        updateHP();
      }
    });

  // Начало игры
  document.getElementById("start-btn").onclick = () => {
    app.style.display = "none";
    battle.style.display = "block";
    renderArtifacts();
    startTurnTimer();
  };

  function renderArtifacts() {
    attackContainer.innerHTML = "";
    defenseContainer.innerHTML = "";

    // Ваши артефакты
    attackArtifacts.forEach((artifact, idx) => {
      const div = document.createElement("div");
      div.className = "artifact";
      div.innerText = artifact.name;
      div.onclick = () => {
        selectedAttack = idx;
        highlightSelection(attackContainer, idx);
      };
      attackContainer.appendChild(div);
    });

    defenseArtifacts.forEach((artifact, idx) => {
      const div = document.createElement("div");
      div.className = "artifact";
      div.innerText = artifact.name;
      div.onclick = () => {
        selectedDefense = idx;
        highlightSelection(defenseContainer, idx);
      };
      defenseContainer.appendChild(div);
    });
  }

  function highlightSelection(container, selectedIdx) {
    const children = container.children;
    for (let i = 0; i < children.length; i++) {
      children[i].classList.toggle("selected", i === selectedIdx);
    }
  }

  function startTurnTimer() {
    secondsLeft = 10;
    document.getElementById("timer-countdown").innerText = secondsLeft;

    timer = setInterval(() => {
      secondsLeft--;
      document.getElementById("timer-countdown").innerText = secondsLeft;

      if (secondsLeft <= 0) {
        clearInterval(timer);
        autoSelect();
      }
    }, 1000);
  }

  function stopTurnTimer() {
    if (timer) clearInterval(timer);
  }

  function autoSelect() {
    if (selectedAttack === null) {
      selectedAttack = Math.floor(Math.random() * attackArtifacts.length);
      highlightSelection(attackContainer, selectedAttack);
    }

    if (selectedDefense === null) {
      selectedDefense = Math.floor(Math.random() * defenseArtifacts.length);
      highlightSelection(defenseContainer, selectedDefense);
    }

    confirmSelection();
  }

  function updateHP() {
    document.getElementById("player1-hp").innerText = player1HP;
    document.getElementById("player2-hp").innerText = player2HP;
  }

  function confirmSelection() {
    stopTurnTimer();

    const attack = attackArtifacts[selectedAttack];
    const defense = defenseArtifacts[selectedDefense];

    let damage = calculateDamage(attack, defense);

    if (currentTurn === 1) {
      player2HP -= damage;
      alert(`Игрок 1 атакует: ${attack.name} наносит ${damage} урона`);
      currentTurn = 2;
    } else {
      player1HP -= damage;
      alert(`Игрок 2 атакует: ${attack.name} наносит ${damage} урона`);
      currentTurn = 1;
    }

    updateHP();

    if (player1HP <= 0 || player2HP <= 0) {
      setTimeout(() => {
        alert(player1HP <= 0 ? "Игрок 2 Победил!" : "Игрок 1 Победил!");
        resetGame();
      }, 500);
    } else {
      startTurnTimer();
    }
  }

  function resetGame() {
    player1HP = 100;
    player2HP = 100;
    currentTurn = 1;
    updateHP();
    renderArtifacts();
    startTurnTimer();
  }

  function calculateDamage(attack, defense) {
    let damage = attack.damage;
    if (attack.type === defense.type) {
      damage *= 0.1;
    } else {
      damage *= 0.9;
    }
    return damage;
  }
});
