<?php
// api/dashboard/get_dashboard_stats.php

require_once '../cors.php';
session_start(); // MUST be here

// CHECK: If not logged in, stop here
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized access.']);
    exit();
}

$conn = require_once '../db_connect.php';

if (!($conn instanceof mysqli)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection error.']);
    exit();
}

$stats = [
    'total_projects' => 0,
    'total_budget' => 0.00,
    'total_feedback' => 0,
];

// 1. Total Projects
$result = $conn->query("SELECT COUNT(id) AS count FROM projects");
if ($result) {
    $row = $result->fetch_assoc();
    $stats['total_projects'] = (int)$row['count'];
}

// 2. Total Budget
$result = $conn->query("SELECT SUM(budget) AS total FROM projects");
if ($result) {
    $row = $result->fetch_assoc();
    $stats['total_budget'] = (float)$row['total'];
}

// 3. Total Public Feedback
$result = $conn->query("SELECT COUNT(id) AS count FROM feedback");
if ($result) {
    $row = $result->fetch_assoc();
    $stats['total_feedback'] = (int)$row['count'];
}

echo json_encode(['success' => true, 'stats' => $stats]);
$conn->close();
?>