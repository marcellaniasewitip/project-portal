<?php
// api/get_projects.php
require_once '../cors.php';
$conn = require_once '../db_connect.php';

// Selecting columns exactly as they appear in your 'projects' table
$sql = "SELECT 
            id, 
            title, 
            description, 
            location_general as location, 
            location_llg as llg, 
            location_district as district,
            contractor, 
            budget, 
            amount_used as used, 
            status, 
            category,
            priority,
            progress_percentage as progress, 
            start_date as startDate, 
            end_date as endDate 
        FROM projects 
        ORDER BY created_at DESC";

$result = $conn->query($sql);
$projects = [];

if ($result && $result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        // Data Type Casting for Frontend Compatibility
        $row['id'] = (int)$row['id'];
        $row['budget'] = (float)$row['budget'];
        
        // If amount_used is NULL in DB, default to 0
        $row['used'] = $row['used'] !== null ? (float)$row['used'] : 0;
        
        $row['progress'] = (int)$row['progress'];
        
        $projects[] = $row;
    }
}

header('Content-Type: application/json');
echo json_encode($projects);
$conn->close();