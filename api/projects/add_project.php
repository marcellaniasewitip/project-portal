<?php
// api/projects/add_project.php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
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

// Extract and validate data
$title = $data['title'] ?? '';
$description = $data['description'] ?? null; // Nullable
$location_general = $data['location_general'] ?? null; // Nullable
$location_province = $data['location_province'] ?? '';
$location_district = $data['location_district'] ?? '';
$contractor = $data['contractor'] ?? '';
$budget = $data['budget'] ?? 0;
$amount_used = $data['amount_used'] ?? 0;
$start_date = $data['start_date'] ?? '';
$end_date = $data['end_date'] ?? '';
$status = $data['status'] ?? 'planning'; // Default
$category = $data['category'] ?? null; // Nullable
$priority = $data['priority'] ?? 'medium'; // Default
$progress_percentage = $data['progress_percentage'] ?? 0;

// Basic validation (add more as needed)
if (empty($title) || empty($location_province) || empty($location_district) || empty($contractor) || empty($start_date) || empty($end_date)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Required fields are missing.']);
    exit();
}

// Ensure budget and amount_used are numeric
if (!is_numeric($budget) || !is_numeric($amount_used)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Budget and amount used must be numeric.']);
    exit();
}

// Enforce progress_percentage range (0-100) at application level
$progress_percentage = max(0, min(100, (int)$progress_percentage));

$sql = "INSERT INTO projects (
            title, description, location_general, location_province, location_district, 
            contractor, budget, amount_used, start_date, end_date, 
            status, category, priority, progress_percentage
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);

if ($stmt === false) {
    error_log('Failed to prepare statement for adding project: ' . $conn->error);
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'An internal server error occurred.']);
    exit();
}

// 's' for string, 'd' for double/decimal, 'i' for integer
$stmt->bind_param("ssssssddsssiis", 
    $title, $description, $location_general, $location_province, $location_district, 
    $contractor, $budget, $amount_used, $start_date, $end_date, 
    $status, $category, $priority, $progress_percentage
);

if ($stmt->execute()) {
    http_response_code(201); // Created
    echo json_encode(['success' => true, 'message' => 'Project added successfully!', 'id' => $conn->insert_id]);
} else {
    error_log('Failed to execute add project statement: ' . $stmt->error);
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to add project.']);
}

$stmt->close();
$conn->close();
?>