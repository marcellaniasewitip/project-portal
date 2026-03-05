<?php
require_once '../cors.php';
session_start();

// Set header so the frontend knows to expect JSON
header('Content-Type: application/json');

$conn = require_once '../db_connect.php';

// 1. Security check
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // 2. Read the JSON body sent by fetch()
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    if (!isset($data['id'])) {
        echo json_encode(['success' => false, 'message' => 'Feedback ID is required']);
        exit;
    }

    $status = $data['status'] ?? 'reviewed';
    $feedbackId = $data['id'];

    // 3. Prepare the query
    // Note: If your ID column in the DB is a VARCHAR/String, use "ss". 
    // If it is an AUTO_INCREMENT INT, keep it as "si".
    $sql = "UPDATE feedback SET status = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    
    // Changing to "si" assumes ID is integer. Change to "ss" if using UUIDs.
    $stmt->bind_param("si", $status, $feedbackId);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo json_encode(['success' => true, 'message' => 'Feedback status updated']);
        } else {
            // Success in query, but maybe ID didn't exist
            echo json_encode(['success' => false, 'message' => 'No record found with that ID']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Update failed: ' . $stmt->error]);
    }
    
    $stmt->close();
} else {
    // Handle non-POST requests
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
}

$conn->close();
?>