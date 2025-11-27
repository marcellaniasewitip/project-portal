<?php
// api/db_connect.php

// Define database connection parameters
define('DB_SERVER', 'localhost'); // Your database host (e.g., 'localhost' or '127.0.0.1')
define('DB_USERNAME', 'root');   // Your database username
define('DB_PASSWORD', '');       // Your database password
define('DB_NAME', 'project-tracking-portal'); // The name of your database

// Attempt to connect to MySQL database
$conn = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);

// Check connection
if ($conn->connect_error) {
    // Log the error (do not expose sensitive details in production)
    error_log("Failed to connect to MySQL: " . $conn->connect_error);

    // Return a generic error message to the client
    // Set HTTP response code
    http_response_code(500);
    // Ensure content type is JSON
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'Database connection failed. Please try again later.']);
    exit();
}

return $conn; // Return the connection object
?>