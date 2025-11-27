<?php
// api/dashboard/get_dashboard_stats.php

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

$stats = [
    'total_projects' => 0,
    'total_budget' => 0.00,
    'total_feedback' => 0,
    // Add more stats as needed, e.g., projects in progress, completed, etc.
];

// 1. Total Projects
$sql_total_projects = "SELECT COUNT(id) AS count FROM projects";
$result_total_projects = $conn->query($sql_total_projects);
if ($result_total_projects) {
    $row = $result_total_projects->fetch_assoc();
    $stats['total_projects'] = (int)$row['count'];
} else {
    error_log('Error fetching total projects: ' . $conn->error);
}

// 2. Total Budget (sum of all projects' budgets)
$sql_total_budget = "SELECT SUM(budget) AS total FROM projects";
$result_total_budget = $conn->query($sql_total_budget);
if ($result_total_budget) {
    $row = $result_total_budget->fetch_assoc();
    $stats['total_budget'] = (float)$row['total'];
} else {
    error_log('Error fetching total budget: ' . $conn->error);
}

// 3. Total Public Feedback
$sql_total_feedback = "SELECT COUNT(id) AS count FROM feedback";
$result_total_feedback = $conn->query($sql_total_feedback);
if ($result_total_feedback) {
    $row = $result_total_feedback->fetch_assoc();
    $stats['total_feedback'] = (int)$row['count'];
} else {
    error_log('Error fetching total feedback: ' . $conn->error);
}

// You can add more complex queries here for trends, e.g.,
// - Projects started this month vs last month
// - Feedback received this week vs last week
// These would require additional date filtering in SQL and logic in PHP.

http_response_code(200);
echo json_encode(['success' => true, 'stats' => $stats]);

$conn->close();
?>