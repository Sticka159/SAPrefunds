<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json; charset=utf-8');
date_default_timezone_set('Europe/Prague');

require_once __DIR__ . '/config/db.php';

$response = ['success' => false, 'message' => '', 'details' => []];

// ===== CONNECT =====
$conn = getDbConnection();

// ===== INPUT (JSON + POST fallback) =====
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    $input = $_POST;
}

// ===== MAP INPUT =====
$PersonalNum = $input['PersonalNum'] ?? null;
$MaterialNum = $input['MaterialNum'] ?? null;
$amount      = $input['amount'] ?? null;
$reason      = $input['reason'] ?? null;
$state       = $input['state'] ?? null;
$target      = $input['target'] ?? null;
$type        = $input['type'] ?? null;

// ===== VALIDATION =====
if (
    $PersonalNum === null ||
    $MaterialNum === null ||
    $amount === null ||
    $reason === null ||
    $state === null ||
    $target === null ||
    $type === null
) {
    $response['message'] = "Chybí některý povinný údaj.";
    $response['details'] = $input;
    echo json_encode($response);
    exit;
}

// ===== DATA =====
$timestamp = date('Y-m-d H:i:s');
$repDate = null;

// ===== QUERY =====
$sql = "INSERT INTO SAPR (
            PersonalNum, 
            state, 
            MaterialNum, 
            amount, 
            type, 
            target, 
            reason, 
            createdAt,
            repDate
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

$params = [
    $PersonalNum,
    $state,
    $MaterialNum,
    (int)$amount,
    $type,
    $target,
    $reason,
    $timestamp,
    $repDate
];

// ===== EXEC =====
$stmt = sqlsrv_query($conn, $sql, $params);

if ($stmt === false) {
    $response['message'] = "Chyba při ukládání.";
    $response['details'] = sqlsrv_errors();
    echo json_encode($response);
    exit;
}

// ===== SUCCESS =====
$response['success'] = true;
$response['message'] = "Vratka byla uložena.";

sqlsrv_close($conn);

echo json_encode($response);