<?php
header('Content-Type: application/json; charset=utf-8');

// ===== CONFIG =====
$serverName = "tcp:blatna-apps-db.database.windows.net,1433";

$connectionOptions = [
    "Database" => "SAPR",
    "Uid" => "app_user",
    "PWD" => "SilneHeslo123!",
    "CharacterSet" => "UTF-8",
    "Encrypt" => true,
    "TrustServerCertificate" => false,
    "LoginTimeout" => 5
];

// ===== CONNECT =====
$conn = sqlsrv_connect($serverName, $connectionOptions);

if ($conn === false) {
    echo json_encode([
        "success" => false,
        "message" => "Připojení selhalo",
        "errors" => sqlsrv_errors()
    ], JSON_PRETTY_PRINT);
    exit;
}

// ===== TEST QUERY =====
$sql = "SELECT GETDATE() as serverTime";
$stmt = sqlsrv_query($conn, $sql);

$row = null;
if ($stmt && ($data = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC))) {
    $row = [
        "serverTime" => $data["serverTime"]->format('Y-m-d H:i:s')
    ];
}

// ===== SUCCESS =====
echo json_encode([
    "success" => true,
    "message" => "Připojení OK",
    "data" => $row
], JSON_PRETTY_PRINT);

sqlsrv_close($conn);