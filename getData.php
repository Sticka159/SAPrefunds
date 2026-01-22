<?php
$serverName = "192.168.114.53";
$connectionOptions = [
    "Database" => "SAPR",
    "Uid" => "sa",
    "PWD" => "Veronika01",
    "CharacterSet" => "UTF-8"
];

header('Content-Type: application/json; charset=utf-8');

$conn = sqlsrv_connect($serverName, $connectionOptions);

if (!$conn) {
    echo json_encode(["error" => "Chyba připojení k databázi.", "details" => sqlsrv_errors()]);
    exit;
}

$sql = "SELECT * FROM SAPR.dbo.SAPR ORDER BY timestamp DESC";
$query = sqlsrv_query($conn, $sql);

if (!$query) {
    echo json_encode(["error" => "Chyba v dotazu.", "details" => sqlsrv_errors()]);
    exit;
}

$results = [];
while ($row = sqlsrv_fetch_array($query, SQLSRV_FETCH_ASSOC)) {
    $results[] = array_map(function ($value) {
        return is_a($value, 'DateTime') ? $value->format('Y-m-d H:i:s') : $value;
    }, $row);
}

echo json_encode($results);
sqlsrv_close($conn);
