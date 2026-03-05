<?php
// api/projects/create_project.php
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

    if (!$data) {
        echo json_encode(['success' => false, 'message' => 'Invalid data']);
        exit;
    }

    // UPDATED SQL: Using your exact table column names
   $sql = "INSERT INTO projects (
            title, description, location_general, location_llg, location_district, 
            contractor, budget, amount_used, start_date, end_date, 
            status, category, priority, progress_percentage
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?, 0)";

    $stmt = $conn->prepare($sql);
    
    if (!$stmt) {
        echo json_encode(['success' => false, 'message' => 'Prepare failed: ' . $conn->error]);
        exit;
    }

    // Bind parameters: 
    // 7 strings (s), 1 double (d) for budget, 4 strings (s)
    // Note: amount_used and progress_percentage are handled as constants (0) in the SQL above
 $stmt->bind_param(
    "sssssssdssss", 
    $data['title'], 
    $data['description'], 
    $data['location'], 
    $data['llg'], 
    $data['district'], 
    $data['contractor'], 
    $data['budget'], 
    $data['startDate'], 
    $data['endDate'], 
    $data['status'], 
    $data['category'], 
    $data['priority']
);

    if ($stmt->execute()) {
        echo json_encode([
            'success' => true, 
            'message' => 'Project created successfully',
            'id' => $conn->insert_id
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Execute error: ' . $stmt->error]);
    }

    $stmt->close();
}
$conn->close();
?>