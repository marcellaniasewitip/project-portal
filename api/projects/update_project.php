<?php
require_once '../cors.php';
session_start();
$conn = require_once '../db_connect.php';

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    if (!isset($data['id'])) {
        echo json_encode(['success' => false, 'message' => 'Project ID is required']);
        exit;
    }

    $sql = "UPDATE projects SET 
                title = ?, 
                description = ?, 
                status = ?, 
                progress_percentage = ?, 
                amount_used = ?,
                priority = ?
            WHERE id = ?";

    $stmt = $conn->prepare($sql);
    
    // "sssidsi" -> string, string, string, int, double, string, int
    $stmt->bind_param(
        "sssidsi", 
        $data['title'],
        $data['description'],
        $data['status'],
        $data['progress_percentage'],
        $data['amount_used'],
        $data['priority'],
        $data['id']
    );

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Project updated']);
    } else {
        echo json_encode(['success' => false, 'message' => $stmt->error]);
    }
    $stmt->close();
}
$conn->close();