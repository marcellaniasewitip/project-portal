<?php
// api/projects/delete_project.php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS'); // Use POST for delete for simplicity, or DELETE
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

$id = $data['id'] ?? null;

if (empty($id)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Project ID is required for deletion.']);
    exit();
}

$sql = "DELETE FROM projects WHERE id = ?";
$stmt = $conn->prepare($sql);

if ($stmt === false) {
    error_log('Failed to prepare statement for deleting project: ' . $conn->error);
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'An internal server error occurred.']);
    exit();
}

$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        http_response_code(200);
        echo json_encode(['success' => true, 'message' => 'Project deleted successfully!']);
    } else {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Project not found.']);
    }
} else {
    error_log('Failed to execute delete project statement: ' . $stmt->error);
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to delete project.']);
}

$stmt->close();
$conn->close();
?>