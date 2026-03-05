<?php
require_once '../cors.php';
$conn = require_once '../db_connect.php';

// Public can view recent feedback without logging in
$sql = "SELECT id, feedback_type, project_name, message, submitted_at, status, llg, is_anonymous, author_name 
        FROM feedback 
        ORDER BY submitted_at DESC LIMIT 10";

$result = $conn->query($sql);
$feedback = [];

while($row = $result->fetch_assoc()) {
    // Convert TINYINT (0/1) back to Boolean for React
    $row['is_anonymous'] = (bool)$row['is_anonymous'];
    $feedback[] = $row;
}

echo json_encode($feedback); // Matches the component's fetch
$conn->close();