window.addEventListener("load", () => {
  if (window.Telegram.WebApp) {
    Telegram.WebApp.expand();
    console.log("Пользователь:", Telegram.WebApp.initDataUnsafe.user);
  }

  const app = document.getElementById("app");
  const battle = document.getElementById("battle-screen");
  const attackContainer = document.getElementById("attack-artifacts");
  const defenseContainer = document.getElementById("defense-artifacts");

  const attackArtifacts = ["Меч", "Огненный шар", "Игла тьмы"];
  const defenseArtifacts = ["Щит", "Магический барьер", "Нейтрализатор"];

  let selectedAttack = null;
  let selectedDefense = null;

  let timer = null;
  let secondsLeft = 10;

  document.getElementById("start-btn").onclick = () => {
    app.style.display = "none";
    battle.style.display = "block";
    renderArtifacts();
    startTurnTimer();
  };

  function renderArtifacts() {
    attackContainer.innerHTML = "";
    defenseContainer.innerHTML = "";

    attackArtifacts.forEach((name, idx) => {
      const div = document.createElement("div");
      div.className = "artifact";
      div.innerText = name;
      div.onclick = () => {
        selectedAttack = idx;
        highlightSelection(attackContainer, idx);
      };
      attackContainer.appendChild(div);
    });

    defenseArtifacts.forEach((name, idx) => {
      const div = document.createElement("div");
      div.className = "artifact";
      div.innerText = name;
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

  function confirmSelection() {
    stopTurnTimer();

    const attack = attackArtifacts[selectedAttack];
    const defense = defenseArtifacts[selectedDefense];

    alert(`✅ Выбран ход:\n🗡 Атака: ${attack}\n🛡 Защита: ${defense}`);

    // Здесь будет отправка данных на сервер
  }

  document.getElementById("confirm-btn").onclick = () => {
    if (selectedAttack === null || selectedDefense === null) {
      alert("⛔ Выбери оба артефакта или дождись автохода!");
      return;
    }

    confirmSelection();
  };
});
