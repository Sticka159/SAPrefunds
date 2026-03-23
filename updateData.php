<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json; charset=utf-8');
date_default_timezone_set('Europe/Prague');

require_once __DIR__ . '/config/db.php';

$response = ['success' => false, 'message' => '', 'details' => []];

// ===== CONNECT =====
$conn = getDbConnection();

// ===== INPUT =====
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    $response['message'] = "Nebyla přijata data nebo nejsou ve formátu JSON.";
    echo json_encode($response);
    exit;
}

$id          = $input['id'] ?? null;
$PersonalNum = $input['PersonalNum'] ?? null;
$MaterialNum = $input['MaterialNum'] ?? null;
$amount      = $input['amount'] ?? null;
$reason      = $input['reason'] ?? null;
$state       = $input['state'] ?? null;
$target      = $input['target'] ?? null;
$type        = $input['type'] ?? null;

if (!$id) {
    $response['message'] = "Chybí identifikátor záznamu (id).";
    echo json_encode($response);
    exit;
}

$repDate = date('Y-m-d');

// ===== QUERY =====
if (count($input) === 2 && isset($state)) {
    $sql = "UPDATE SAPR 
            SET state = ?, repDate = ? 
            WHERE id = ?";
    $params = [$state, $repDate, $id];
} else {
    $sql = "UPDATE SAPR SET 
                PersonalNum = ?, 
                MaterialNum = ?, 
                amount = ?, 
                reason = ?, 
                state = ?, 
                target = ?, 
                type = ?, 
                repDate = ?
            WHERE id = ?";

    $params = [
        $PersonalNum,
        $MaterialNum,
        (int)$amount,
        $reason,
        $state,
        $target,
        $type,
        $repDate,
        $id
    ];
}

$stmt = sqlsrv_query($conn, $sql, $params);

if ($stmt === false) {
    $response['message'] = "Chyba při aktualizaci.";
    $response['details'] = sqlsrv_errors();
    echo json_encode($response);
    exit;
}

$response['success'] = true;
$response['message'] = "Záznam byl úspěšně aktualizován.";

sqlsrv_close($conn);

echo json_encode($response);