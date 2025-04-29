<?php
header('Content-Type: application/json');
include('db.php');

// Получаем данные от Telegram WebApp
$data = json_decode($_POST['data'], true);

// Логирование полученных данных
file_put_contents('log.txt', "Данные от Telegram: " . print_r($data, true), FILE_APPEND);

// Проверяем подпись (важно для безопасности)
$token = "YOUR_BOT_TOKEN"; // Замените на ваш токен
$hash = $data['auth_date'] . $data['id'] . $data['first_name'] . $data['last_name'] . $data['username'];

$check_hash = hash_hmac('sha256', $hash, $token);

if ($check_hash !== $data['hash']) {
    echo json_encode(['error' => 'Invalid signature']);
    exit;
}

// Подключение к базе данных
include('db.php');

// Проверяем, есть ли уже пользователь в базе данных
$stmt = $pdo->prepare("SELECT * FROM users WHERE telegram_id = ?");
$stmt->execute([$data['id']]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user) {
    // Пользователь уже существует
    echo json_encode(['status' => 'user_exists', 'user' => $user]);
} else {
    // Добавляем нового пользователя
    $stmt = $pdo->prepare("INSERT INTO users (telegram_id, username) VALUES (?, ?)");
    $stmt->execute([$data['id'], $data['username']]);
    
    // Возвращаем информацию о пользователе
    echo json_encode(['status' => 'new_user', 'user' => ['id' => $data['id'], 'username' => $data['username']]]);
}
?>
