<?php
$host = 'localhost'; // или IP-адрес сервера базы данных
$dbname = 'pvp_arena';
$username = 'root'; // замените на ваш логин
$password = ''; // замените на ваш пароль

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo "Ошибка подключения: " . $e->getMessage();
}
?>
