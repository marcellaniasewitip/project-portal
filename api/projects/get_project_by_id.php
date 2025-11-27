<?php
// api/projects/get_project_by_id.php

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

$project_id = $_GET['id'] ?? null;

if (empty($project_id)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Project ID is required.']);
    exit();
}

$sql = "SELECT 
            id, title, description, location_general, location_province, 
            location_district, contractor, budget, amount_used, 
            DATE_FORMAT(start_date, '%Y-%m-%d') AS startDate, 
            DATE_FORMAT(end_date, '%Y-%m-%d') AS endDate, 
            status, category, priority, progress_percentage AS progress 
        FROM projects 
        WHERE id = ?";

$stmt = $conn->prepare($sql);

if ($stmt === false) {
    error_log('Failed to prepare statement for getting project by ID: ' . $conn->error);
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'An internal server error occurred.']);
    exit();
}

$stmt->bind_param("i", $project_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $project = $result->fetch_assoc();
    // Format budget and amount_used as strings
    $project['budget'] = number_format($project['budget'], 0, '.', '');
    $project['amount_used'] = number_format($project['amount_used'], 0, '.', '');
    $project['id'] = (string)$project['id'];

    http_response_code(200);
    echo json_encode(['success' => true, 'project' => $project]);
} else {
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Project not found.']);
}

$stmt->close();
$conn->close();
?>