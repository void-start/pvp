<?php
header('Content-Type: application/json');
include('db.php');

// Получение данных о пользователе
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['telegram_id'])) {
    $telegram_id = $_GET['telegram_id'];

    $stmt = $pdo->prepare("SELECT * FROM users WHERE telegram_id = ?");
    $stmt->execute([$telegram_id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        echo json_encode($user);
    } else {
        echo json_encode(['error' => 'User not found']);
    }
}

// Обновление HP игрока
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['telegram_id']) && isset($_POST['hp'])) {
    $telegram_id = $_POST['telegram_id'];
    $hp = $_POST['hp'];

    $stmt = $pdo->prepare("UPDATE users SET hp = ? WHERE telegram_id = ?");
    $stmt->execute([$hp, $telegram_id]);

    echo json_encode(['status' => 'success']);
}

// Создание новой битвы
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['player1_id']) && isset($_POST['player2_id'])) {
    $player1_id = $_POST['player1_id'];
    $player2_id = $_POST['player2_id'];

    $stmt = $pdo->prepare("INSERT INTO battles (player1_id, player2_id) VALUES (?, ?)");
    $stmt->execute([$player1_id, $player2_id]);

    echo json_encode(['status' => 'battle_created']);
}

// Получение информации о текущей битве
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['battle_id'])) {
    $battle_id = $_GET['battle_id'];

    $stmt = $pdo->prepare("SELECT * FROM battles WHERE id = ?");
    $stmt->execute([$battle_id]);
    $battle = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode($battle);
}
?>
