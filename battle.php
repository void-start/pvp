<?php
header('Content-Type: application/json');
include('db.php');

// Начало новой битвы
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['player1_id']) && isset($_POST['player2_id'])) {
    $player1_id = $_POST['player1_id'];
    $player2_id = $_POST['player2_id'];

    // Вставляем новую битву в таблицу battles
    $stmt = $pdo->prepare("INSERT INTO battles (player1_id, player2_id, player1_hp, player2_hp) VALUES (?, ?, 100, 100)");
    $stmt->execute([$player1_id, $player2_id]);

    $battle_id = $pdo->lastInsertId();
    echo json_encode(['status' => 'battle_started', 'battle_id' => $battle_id]);
}

// Получение информации о текущей битве
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['battle_id'])) {
    $battle_id = $_GET['battle_id'];

    $stmt = $pdo->prepare("SELECT * FROM battles WHERE id = ?");
    $stmt->execute([$battle_id]);
    $battle = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode($battle);
}

// Обновление состояния битвы после хода
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['battle_id']) && isset($_POST['player1_hp']) && isset($_POST['player2_hp']) && isset($_POST['current_turn'])) {
    $battle_id = $_POST['battle_id'];
    $player1_hp = $_POST['player1_hp'];
    $player2_hp = $_POST['player2_hp'];
    $current_turn = $_POST['current_turn'];

    $stmt = $pdo->prepare("UPDATE battles SET player1_hp = ?, player2_hp = ?, current_turn = ? WHERE id = ?");
    $stmt->execute([$player1_hp, $player2_hp, $current_turn, $battle_id]);

    echo json_encode(['status' => 'battle_updated']);
}

// Завершение битвы
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['battle_id']) && isset($_POST['winner_id'])) {
    $battle_id = $_POST['battle_id'];
    $winner_id = $_POST['winner_id'];

    $stmt = $pdo->prepare("UPDATE battles SET status = 'finished', winner_id = ? WHERE id = ?");
    $stmt->execute([$winner_id, $battle_id]);

    echo json_encode(['status' => 'battle_finished']);
}
?>
