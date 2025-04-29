<?php
header('Content-Type: application/json');
include('db.php');

// Создание новой битвы
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['user_id'])) {
    $user_id = $_POST['user_id'];
    $stmt = $pdo->prepare("INSERT INTO battles (user_id_1, user_id_2, player1_hp, player2_hp) VALUES (?, ?, 100, 100)");
    $stmt->execute([$user_id, null]);  // Заполнение пустого места для второго игрока
    $battle_id = $pdo->lastInsertId();
    echo json_encode(['battle_id' => $battle_id]);
}

// Логика для обработки урона
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['battle_id']) && isset($_POST['attack']) && isset($_POST['defense'])) {
    $battle_id = $_POST['battle_id'];
    $attack = $_POST['attack'];
    $defense = $_POST['defense'];
    $player1_hp = $_POST['player1_hp'];
    $player2_hp = $_POST['player2_hp'];

    $damage1 = calculateDamage($attack, $defense);
    $damage2 = calculateDamage($attack, $defense);

    $stmt = $pdo->prepare("UPDATE battles SET player1_hp = ?, player2_hp = ? WHERE id = ?");
    $stmt->execute([$player1_hp - $damage1, $player2_hp - $damage2, $battle_id]);

    echo json_encode([
        'damage1' => $damage1,
        'damage2' => $damage2
    ]);
}

function calculateDamage($attack, $defense) {
    if ($attack === 'physical' && $defense === 'physical') {
        return 10;
    } elseif ($attack === 'magical' && $defense === 'magical') {
        return 10;
    } elseif ($attack === 'pure' && $defense === 'pure') {
        return 10;
    } else {
        return 30;
    }
}
?>
