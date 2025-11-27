<?php
// api/auth/login.php

header('Access-Control-Allow-Origin: *'); // Or specify your frontend origin: 'http://localhost:8080'
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json'); // Set this AFTER CORS headers

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$conn = require_once '../db_connect.php'; // Correct path to db_connect.php

// Ensure $conn is a valid mysqli object
if (!($conn instanceof mysqli)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection could not be established.']);
    exit();
}

$input = file_get_contents('php://input');
$data = json_decode($input, true);

$username = $data['username'] ?? '';
$password = $data['password'] ?? '';

// Basic input validation
if (empty($username) || empty($password)) {
    http_response_code(400); // Bad Request
    echo json_encode(['success' => false, 'message' => 'Username and password are required.']);
    exit();
}

// Prepare SQL statement to prevent SQL injection
$stmt = $conn->prepare("SELECT id, username, password FROM login WHERE username = ?");

if ($stmt === false) {
    error_log('Failed to prepare statement for login: ' . $conn->error);
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'An internal server error occurred.']);
    exit();
}

$stmt->bind_param("s", $username); // 's' denotes string type
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $user = $result->fetch_assoc();
    if (password_verify($password, $user['password'])) {
        http_response_code(200); // Set status before echoing response
        echo json_encode([
            'success' => true,
            'message' => 'Login successful!',
            'user' => [
                'id' => $user['id'],
                'username' => $user['username'],
                'name' => 'Payroll User' // This could come from another table, or be a fixed value
            ]
        ]);
    } else {
        http_response_code(401); // Unauthorized
        echo json_encode([
            'success' => false,
            'message' => 'Invalid username or password.'
        ]);
    }
} else {
    http_response_code(401); // Unauthorized
    echo json_encode([
        'success' => false,
        'message' => 'Invalid username or password.'
    ]);
}

// Close statement and connection
$stmt->close();
$conn->close();
?>