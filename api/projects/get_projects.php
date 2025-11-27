<?php
// api/projects/get_projects.php

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

// Optional: handle 'preview' parameter for limiting results
$limit = isset($_GET['preview']) && $_GET['preview'] === 'true' ? 3 : null;

$sql = "SELECT 
            id, title, description, location_general, location_province, 
            location_district, contractor, budget, amount_used, 
            DATE_FORMAT(start_date, '%Y-%m-%d') AS startDate, 
            DATE_FORMAT(end_date, '%Y-%m-%d') AS endDate, 
            status, category, priority, progress_percentage AS progress 
        FROM projects";

if ($limit !== null) {
    $sql .= " ORDER BY created_at DESC LIMIT ?"; // Order by latest projects
}

$stmt = $conn->prepare($sql);

if ($stmt === false) {
    error_log('Failed to prepare statement for getting projects: ' . $conn->error);
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'An internal server error occurred.']);
    exit();
}

if ($limit !== null) {
    $stmt->bind_param("i", $limit);
}

$stmt->execute();
$result = $stmt->get_result();

$projects = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        // Format budget and amount_used as strings on PHP side to match frontend expectation
        $row['budget'] = number_format($row['budget'], 0, '.', ''); // No decimals, no thousands separator
        $row['amount_used'] = number_format($row['amount_used'], 0, '.', ''); // No decimals, no thousands separator
        $row['id'] = (string)$row['id']; // Ensure ID is string to match Project interface if needed
        $projects[] = $row;
    }
}

http_response_code(200);
echo json_encode(['success' => true, 'projects' => $projects]);

$stmt->close();
$conn->close();
?>