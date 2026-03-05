<?php
// api/get_hero_stats.php
require_once '../cors.php';
$conn = require_once '../db_connect.php';

header('Content-Type: application/json');

try {
    // 1. Get Count of Active Projects
    $activeQuery = "SELECT COUNT(*) as count FROM projects WHERE status = 'Ongoing' OR status = 'Planning'";
    $activeResult = $conn->query($activeQuery);
    $activeCount = $activeResult->fetch_assoc()['count'];

    // 2. Get Count of Distinct LLGs
    // Assuming your column is location_llg
    $llgQuery = "SELECT COUNT(DISTINCT location_llg) as count FROM projects";
    $llgResult = $conn->query($llgQuery);
    $llgCount = $llgResult->fetch_assoc()['count'];

    // 3. Get Count of Completed Projects
    $completedQuery = "SELECT COUNT(*) as count FROM projects WHERE status = 'Completed'";
    $completedResult = $conn->query($completedQuery);
    $completedCount = $completedResult->fetch_assoc()['count'];

    echo json_encode([
        "active" => (string)$activeCount,
        "llgs" => (string)$llgCount,
        "completed" => (string)$completedCount
    ]);

} catch (Exception $e) {
    echo json_encode([
        "active" => "0",
        "llgs" => "0",
        "completed" => "0",
        "error" => $e->getMessage()
    ]);
}

$conn->close();
?>