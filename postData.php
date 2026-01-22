<?php
header('Content-Type: application/json');

date_default_timezone_set('Europe/Prague');

$response = ['success' => false, 'message' => '', 'details' => []];

$serverName = "192.168.114.53";
$connectionOptions = [
    "Database" => "SAPR",
    "Uid" => "sa",
    "PWD" => "Veronika01",
    "CharacterSet" => "UTF-8"
];

$conn = sqlsrv_connect($serverName, $connectionOptions);

if ($conn === false) {
    $response['message'] = "Nelze se připojit k databázi.";
    echo json_encode($response);
    exit;
}

$PersonalNum = $_POST['PersonalNum'] ?? null;
$MaterialNum = $_POST['MaterialNum'] ?? null;
$amount = $_POST['amount'] ?? null;
$reason = $_POST['reason'] ?? null;
$state = $_POST['state'] ?? null;
$target = $_POST['target'] ?? null;
$type = $_POST['type'] ?? null;

// Kontrola povinných polí
if (!$PersonalNum || !$MaterialNum || !$amount || !$reason || !$state || !$target || !$type) {
    $response['message'] = "Chybí některý povinný údaj.";
    echo json_encode($response);
    exit;
}

$timestamp = date('Y-m-d H:i:s');

$sql = "INSERT INTO SAPR (PersonalNum, state, MaterialNum, amount, type, target, reason, timestamp, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

$params = [$PersonalNum, $state, $MaterialNum, (int)$amount, $type, $target, $reason, $timestamp, $timestamp];


$stmt = sqlsrv_query($conn, $sql, $params);

if ($stmt === false) {
    $response['message'] = "Chyba při ukládání.";
    $response['details'] = sqlsrv_errors();
    echo json_encode($response);
    exit;
}

$response['success'] = true;
$response['message'] = "Vratka byla uložena.";

sqlsrv_close($conn);

echo json_encode($response);
