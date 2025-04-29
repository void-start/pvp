<?php
try {
    $pdo = new PDO('mysql:host=localhost;dbname=pvp_arena', 'root', '');  // Замените данные для подключения
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo 'Подключение не удалось: ' . $e->getMessage();
    exit;
}
?>


