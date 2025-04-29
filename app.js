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

  // Показ битвы
  document.getElementById("start-btn").onclick = () => {
    app.style.display = "none";
    battle.style.display = "block";
    renderArtifacts();
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

  document.getElementById("confirm-btn").onclick = () => {
    if (selectedAttack === null || selectedDefense === null) {
      alert("Выбери оба артефакта!");
      return;
    }

    const attack = attackArtifacts[selectedAttack];
    const defense = defenseArtifacts[selectedDefense];

    alert(`Вы выбрали: \n🗡 Атака: ${attack}\n🛡 Защита: ${defense}`);

    // Здесь позже будет отправка на сервер
  };
});
