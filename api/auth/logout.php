<?php
// api/auth/logout.php

require_once './cors.php';

// 1. Initialize session
session_start();


// 2. Unset all session variables
$_SESSION = array();

// 3. If it's desired to kill the session, also delete the session cookie.
// This is what fully logs the user out from the browser side.
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

// 4. Finally, destroy the session on the server
session_destroy();

http_response_code(200);
echo json_encode([
    "success" => true,
    "message" => "Logged out successfully"
]);
?>