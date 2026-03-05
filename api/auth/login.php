<?php
require_once '../cors.php';
session_start();

$conn = require_once '../db_connect.php';

if (!($conn instanceof mysqli)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'DB Connection Failed']);
    exit();
}

$input = file_get_contents('php://input');
$data = json_decode($input, true);
$username = $data['username'] ?? '';
$password = $data['password'] ?? '';

if (empty($username) || empty($password)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing credentials']);
    exit();
}

$stmt = $conn->prepare("SELECT id, username, password FROM login WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($user = $result->fetch_assoc()) {
    if (password_verify($password, $user['password'])) {
        // IMPORTANT: Save the ID to the session
        $_SESSION['user_id'] = $user['id']; 
        
        echo json_encode([
            'success' => true,
            'user' => ['id' => $user['id'], 'username' => $user['username']]
        ]);
    } else {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Wrong password']);
    }
} else {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'User not found']);
}
$stmt->close();
$conn->close();