<?php
require_once '../cors.php';
$conn = require_once '../db_connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    // Validate required fields
    if (empty($data['project_id']) || empty($data['message'])) {
        echo json_encode(['success' => false, 'message' => 'Missing data']);
        exit;
    }

    $project_id = $data['project_id'];
    $project_name = $data['project_name'];
    $feedback_type = $data['feedback_type'];
    $message = $data['message'];
    $llg = $data['llg'];
    $is_anonymous = $data['is_anonymous']; // 1 or 0
    $author_email = $data['author_email'] ?? '';
    
    // Logic: If anonymous is true, hide the name in the record
    $author_name = ($is_anonymous == 1) ? 'Anonymous Resident' : ($data['author_name'] ?? 'Guest');

    $sql = "INSERT INTO feedback (
                project_id, project_name, feedback_type, message, 
                llg, is_anonymous, author_name, author_email, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("isssisss", 
        $project_id, 
        $project_name, 
        $feedback_type, 
        $message, 
        $llg, 
        $is_anonymous, 
        $author_name, 
        $author_email
    );

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => $stmt->error]);
    }
    $stmt->close();
}
$conn->close();