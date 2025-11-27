<?php
// api/feedback/get_recent_feedback.php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
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

// Fetch all necessary feedback fields
$sql = "SELECT 
            id, feedback_type AS type, project_name AS project, message, 
            DATE_FORMAT(submitted_at, '%Y-%m-%d') AS date, 
            status, district, is_anonymous AS anonymous, author_name AS author
        FROM feedback
        ORDER BY submitted_at DESC"; // Order by most recent

// Optionally limit for "recent" display (e.g., 4 or 5 recent ones)
$limit = $_GET['limit'] ?? null;
if ($limit !== null && is_numeric($limit)) {
    $sql .= " LIMIT " . (int)$limit;
}

$result = $conn->query($sql);

$feedback_list = [];
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $feedback_list[] = $row;
    }
}

http_response_code(200);
echo json_encode(['success' => true, 'feedback' => $feedback_list]);

$conn->close();
?>