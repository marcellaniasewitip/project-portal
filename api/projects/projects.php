<?php
// api/projects/projects.php
require_once '../cors.php';
session_start(); // Important for secure access
$conn = require_once '../db_connect.php';

$method = $_SERVER['REQUEST_METHOD'];

// --- FETCH PROJECTS (GET) ---
if ($method === 'GET') {
    $sql = "SELECT * FROM projects ORDER BY created_at DESC";
    $result = $conn->query($sql);
    
    $projects = [];
    while($row = $result->fetch_assoc()) {
        // Map database fields to the React interface exactly
        $projects[] = [
            'id' => $row['id'],
            'title' => $row['title'],
            'description' => $row['description'],
            'location_general' => $row['location_general'], // Match DB column
            'location_llg' => $row['location_llg'],
            'location_district' => $row['location_district'],
            'contractor' => $row['contractor'],             // Match DB column
            'budget' => (string)$row['budget'],
            'amount_used' => (string)($row['amount_used'] ?? '0'), // Match DB column
            'start_date' => $row['start_date'],
            'end_date' => $row['end_date'],
            'status' => strtolower($row['status']),
            'category' => $row['category'],
            'priority' => strtolower($row['priority'] ?? 'medium'),
            'progress_percentage' => (int)$row['progress_percentage']
        ];
    }
    header('Content-Type: application/json');
    echo json_encode(['success' => true, 'data' => $projects]);
}

// --- DELETE PROJECT (DELETE) ---
if ($method === 'DELETE') {
    // Check session before deleting
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Unauthorized']);
        exit;
    }

    $id = $_GET['id'] ?? null;
    if (!$id) {
        echo json_encode(['success' => false, 'message' => 'No ID provided']);
        exit;
    }

    $stmt = $conn->prepare("DELETE FROM projects WHERE id = ?");
    $stmt->bind_param("i", $id);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Project deleted']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Delete failed: ' . $conn->error]);
    }
    $stmt->close();
}

$conn->close();