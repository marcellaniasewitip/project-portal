<?php
// api/auth/register.php

header('Access-Control-Allow-Origin: *'); // Or specify your frontend origin
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$conn = require_once '../db_connect.php';

if (!($conn instanceof mysqli)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection could not be established.']);
    exit();
}

$input = file_get_contents('php://input');
$data = json_decode($input, true);

$username = $data['username'] ?? '';
$password = $data['password'] ?? '';

if (empty($username) || empty($password)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Username and password are required.']);
    exit();
}

// Check if username already exists
$stmt_check = $conn->prepare("SELECT id FROM login WHERE username = ?");
if ($stmt_check === false) {
    error_log('Failed to prepare statement for checking username: ' . $conn->error);
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'An internal server error occurred.']);
    exit();
}
$stmt_check->bind_param("s", $username);
$stmt_check->execute();
$stmt_check->store_result();

if ($stmt_check->num_rows > 0) {
    http_response_code(409); // Conflict
    echo json_encode(['success' => false, 'message' => 'Username already exists.']);
    $stmt_check->close();
    $conn->close();
    exit();
}
$stmt_check->close();

// Hash the password securely
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

// Insert new user
$stmt = $conn->prepare("INSERT INTO login (username, password) VALUES (?, ?)");

if ($stmt === false) {
    error_log('Failed to prepare statement for registration: ' . $conn->error);
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'An internal server error occurred.']);
    exit();
}

$stmt->bind_param("ss", $username, $hashed_password);

if ($stmt->execute()) {
    http_response_code(201); // Created
    echo json_encode(['success' => true, 'message' => 'User registered successfully!']);
} else {
    error_log('Failed to execute registration statement: ' . $stmt->error);
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Registration failed.']);
}

$stmt->close();
$conn->close();
?>