<?php
// api/dashboard/get_analytics_data.php
require_once '../cors.php';
$conn = require_once '../db_connect.php';

if (!($conn instanceof mysqli)) {
    echo json_encode(['success' => false, 'message' => 'Connection failed']);
    exit();
}

$response = [
    'success' => true,
    'budgetByDistrict' => [],
    'projectsByCategory' => [],
    'monthlyProgress' => [],
    'llgPerformance' => []
];

// 1. Budget & Project Count by LLG (District)
$sql1 = "SELECT location_llg as name, SUM(budget) as budget, COUNT(id) as projects, 
         SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) as completed 
         FROM projects GROUP BY location_llg";
$res1 = $conn->query($sql1);
while($row = $res1->fetch_assoc()) {
    $row['budget'] = (float)$row['budget'];
    $row['projects'] = (int)$row['projects'];
    $row['completed'] = (int)$row['completed'];
    $response['budgetByDistrict'][] = $row;
}

// 2. Projects by Category (Pie Chart)
$colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
$sql2 = "SELECT category as name, COUNT(id) as value FROM projects GROUP BY category";
$res2 = $conn->query($sql2);
$i = 0;
while($row = $res2->fetch_assoc()) {
    $row['value'] = (int)$row['value'];
    $row['color'] = $colors[$i % count($colors)];
    $response['projectsByCategory'][] = $row;
    $i++;
}

// 3. Monthly Trends (Last 6 Months)
$sql3 = "SELECT DATE_FORMAT(created_at, '%b') as month, SUM(budget) as budget, 
         SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) as completed,
         COUNT(id) as started
         FROM projects 
         WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
         GROUP BY month ORDER BY created_at ASC";
$res3 = $conn->query($sql3);
while($row = $res3->fetch_assoc()) {
    $row['budget'] = (float)$row['budget'];
    $row['completed'] = (int)$row['completed'];
    $row['started'] = (int)$row['started'];
    $response['monthlyProgress'][] = $row;
}

// 4. LLG Performance (Calculated Scores)
$sql4 = "SELECT location_llg as llg, 
         ROUND(AVG(progress_percentage)) as efficiency,
         ROUND((SUM(CASE WHEN status != 'Delayed' THEN 1 ELSE 0 END) / COUNT(id)) * 100) as onTime
         FROM projects GROUP BY location_llg";
$res4 = $conn->query($sql4);
while($row = $res4->fetch_assoc()) {
    $row['budget'] = 90; // Placeholder for budget management score
    $response['llgPerformance'][] = $row;
}

header('Content-Type: application/json');
echo json_encode($response);
$conn->close();