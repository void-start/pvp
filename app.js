window.addEventListener("load", () => {
  if (window.Telegram.WebApp) {
    Telegram.WebApp.expand(); // разворачиваем WebApp на весь экран
    console.log("Пользователь:", Telegram.WebApp.initDataUnsafe.user);
  }

  document.getElementById("start-btn").onclick = () => {
    alert("Переход к поиску соперника (заглушка)");
  };

  document.getElementById("inventory-btn").onclick = () => {
    alert("Переход в инвентарь (заглушка)");
  };

  document.getElementById("shop-btn").onclick = () => {
    alert("Переход в магазин (заглушка)");
  };
});
