<?php
// dashboard_api.php

// 1. Load CORS headers
require_once './cors.php';

// 2. Load Database Connection
require_once './db_connect.php';

// Ensure $conn is available
if (!isset($conn)) {
    $conn = include './db_connect.php';
}

// 3. CAPTURE THE ACTION
$action = $_GET['action'] ?? '';

// 4. DATABASE INTEGRITY CHECK
if (!$conn || $conn->connect_error) {
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit();
}

header('Content-Type: application/json');

// 5. EXECUTE ACTIONS
switch ($action) {
    case 'get_stats':
        // Get Total Projects
        $p = $conn->query("SELECT COUNT(*) as total FROM projects")->fetch_assoc();
        // Get Total Budget
        $b = $conn->query("SELECT SUM(budget) as total FROM projects")->fetch_assoc();
        // Get Public Feedback Count
        $f = $conn->query("SELECT COUNT(*) as total FROM feedback")->fetch_assoc();

        echo json_encode([
            'success' => true,
            'stats' => [
                'total_projects' => (int)($p['total'] ?? 0),
                'total_budget' => (float)($b['total'] ?? 0),
                'public_feedback' => (int)($f['total'] ?? 0)
            ]
        ]);
        break;

    case 'get_status_summary':
        // This groups projects by status and calculates average progress for the bars
        $result = $conn->query("SELECT status, AVG(progress_percentage) as progress FROM projects GROUP BY status");
        $summary = [];
        if ($result) {
            while ($row = $result->fetch_assoc()) {
                $summary[] = [
                    'status' => $row['status'],
                    'progress' => (int)round($row['progress'])
                ];
            }
        }
        echo json_encode(['success' => true, 'data' => $summary]);
        break;

    case 'get_user_info':
        // Fetches the logged in admin info
        $res = $conn->query("SELECT username, email FROM login LIMIT 1");
        $user = $res->fetch_assoc();
        
        // Fallback if email column doesn't exist yet or user not found
        if (!$user) {
            $user = ['username' => 'Admin', 'email' => 'admin@nuku.gov.pg'];
        }

        echo json_encode(['success' => true, 'user' => $user]);
        break;

    default:
        echo json_encode([
            'success' => false, 
            'message' => 'No valid action specified',
            'debug' => [
                'received_action' => $action,
                'method' => $_SERVER['REQUEST_METHOD']
            ]
        ]);
        break;
}

$conn->close();
?>