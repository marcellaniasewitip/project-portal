<?php
require_once 'cors.php';
session_start();

$conn = require_once 'db_connect.php';

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Not logged in']);
    exit;
}

$user_id = $_SESSION['user_id'];
$stmt = $conn->prepare("SELECT username FROM login WHERE id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$res = $stmt->get_result();

if ($user = $res->fetch_assoc()) {
    $parts = explode('@', $user['username']);
    echo json_encode([
        'success' => true,
        'email' => $user['username'],
        'display_name' => ucfirst($parts[0])
    ]);
}