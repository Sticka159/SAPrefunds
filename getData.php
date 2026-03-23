<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/config/db.php';

// ===== CONNECT =====
$conn = getDbConnection();

// ===== QUERY =====
$sql = "SELECT * FROM SAPR.dbo.SAPR ORDER BY [timestamp] DESC";
$query = sqlsrv_query($conn, $sql);

if (!$query) {
    echo json_encode([
        "error" => "Chyba v dotazu.",
        "details" => sqlsrv_errors()
    ]);
    exit;
}

// ===== FETCH =====
$results = [];

while ($row = sqlsrv_fetch_array($query, SQLSRV_FETCH_ASSOC)) {
    $results[] = array_map(function ($value) {
        return ($value instanceof DateTime)
            ? $value->format('Y-m-d H:i:s')
            : $value;
    }, $row);
}

echo json_encode($results);

sqlsrv_close($conn);