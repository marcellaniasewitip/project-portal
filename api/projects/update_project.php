<?php
// api/projects/update_project.php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS'); // Use POST for updates for simplicity, or PUT
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
    echo json_encode(['success' => false, 'message' => 'Project ID is required for update.']);
    exit();
}

// Extract and validate data (same as add_project.php)
$title = $data['title'] ?? '';
$description = $data['description'] ?? null;
$location_general = $data['location_general'] ?? null;
$location_province = $data['location_province'] ?? '';
$location_district = $data['location_district'] ?? '';
$contractor = $data['contractor'] ?? '';
$budget = $data['budget'] ?? 0;
$amount_used = $data['amount_used'] ?? 0;
$start_date = $data['start_date'] ?? '';
$end_date = $data['end_date'] ?? '';
$status = $data['status'] ?? 'planning';
$category = $data['category'] ?? null;
$priority = $data['priority'] ?? 'medium';
$progress_percentage = $data['progress_percentage'] ?? 0;

if (empty($title) || empty($location_province) || empty($location_district) || empty($contractor) || empty($start_date) || empty($end_date)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Required fields are missing.']);
    exit();
}

if (!is_numeric($budget) || !is_numeric($amount_used)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Budget and amount used must be numeric.']);
    exit();
}

$progress_percentage = max(0, min(100, (int)$progress_percentage));

$sql = "UPDATE projects SET
            title = ?, description = ?, location_general = ?, location_province = ?, location_district = ?, 
            contractor = ?, budget = ?, amount_used = ?, start_date = ?, end_date = ?, 
            status = ?, category = ?, priority = ?, progress_percentage = ?
        WHERE id = ?";

$stmt = $conn->prepare($sql);

if ($stmt === false) {
    error_log('Failed to prepare statement for updating project: ' . $conn->error);
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'An internal server error occurred.']);
    exit();
}

$stmt->bind_param("ssssssddsssiisi", 
    $title, $description, $location_general, $location_province, $location_district, 
    $contractor, $budget, $amount_used, $start_date, $end_date, 
    $status, $category, $priority, $progress_percentage,
    $id
);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        http_response_code(200);
        echo json_encode(['success' => true, 'message' => 'Project updated successfully!']);
    } else {
        http_response_code(404); // Or 200 if no change, depending on desired behavior
        echo json_encode(['success' => false, 'message' => 'Project not found or no changes made.']);
    }
} else {
    error_log('Failed to execute update project statement: ' . $stmt->error);
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to update project.']);
}

$stmt->close();
$conn->close();
?>