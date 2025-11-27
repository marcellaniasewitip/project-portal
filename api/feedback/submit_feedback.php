<?php
// api/feedback/submit_feedback.php

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

$feedback_type = $data['feedbackType'] ?? '';
$project_id = $data['project'] ?? null; // Assuming 'project' from frontend is ID or 'other'
$project_name = null; // Will fetch if project_id is valid
$message = $data['message'] ?? '';
$is_anonymous = $data['anonymous'] ?? true; // Boolean from frontend
$author_name = $data['author_name'] ?? null; // Optional
$author_email = $data['author_email'] ?? null; // Optional
$district = $data['district'] ?? null; // Optional, might be inferred or user-provided

// Basic validation
if (empty($feedback_type) || empty($message)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Feedback type and message are required.']);
    exit();
}

// Convert boolean from JS to MySQL TINYINT(1) (0 or 1)
$is_anonymous_db = $is_anonymous ? 1 : 0;

// If a project ID is provided (and not 'other'), try to get the project name
if ($project_id && $project_id !== 'other') {
    $stmt_project = $conn->prepare("SELECT title, location_district FROM projects WHERE id = ?");
    if ($stmt_project) {
        $stmt_project->bind_param("i", $project_id);
        $stmt_project->execute();
        $res_project = $stmt_project->get_result();
        if ($res_project->num_rows === 1) {
            $proj_row = $res_project->fetch_assoc();
            $project_name = $proj_row['title'];
            // If district isn't explicitly sent by frontend, use project's district
            if (empty($district)) {
                $district = $proj_row['location_district'];
            }
        }
        $stmt_project->close();
    }
} elseif ($project_id === 'other') {
    // If 'other' is selected, clear project_id and project_name, allow user to set district if not already.
    $project_id = null;
    $project_name = 'General/Other'; // Or leave null, depending on desired categorization
}


$sql = "INSERT INTO feedback (
            feedback_type, project_id, project_name, message, 
            is_anonymous, author_name, author_email, district
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);

if ($stmt === false) {
    error_log('Failed to prepare statement for submitting feedback: ' . $conn->error);
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'An internal server error occurred.']);
    exit();
}

// 's' for string, 'i' for int, 's' for string, 's' for string, 'i' for boolean, 's' for string, 's' for string, 's' for string
$stmt->bind_param("sisissii", 
    $feedback_type, $project_id, $project_name, $message, 
    $is_anonymous_db, $author_name, $author_email, $district
);

if ($stmt->execute()) {
    http_response_code(201); // Created
    echo json_encode(['success' => true, 'message' => 'Feedback submitted successfully!', 'id' => $conn->insert_id]);
} else {
    error_log('Failed to execute submit feedback statement: ' . $stmt->error);
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to submit feedback.']);
}

$stmt->close();
$conn->close();
?>