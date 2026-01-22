<?php
header('Content-Type: application/json');

// Nastavení časové zóny
date_default_timezone_set('Europe/Prague');

$response = ['success' => false, 'message' => '', 'details' => []];

// Připojení k MSSQL
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

// Načtení JSON těla požadavku
$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    $response['message'] = "Nebyla přijata data nebo nejsou ve formátu JSON.";
    echo json_encode($response);
    exit;
}

// Očekávaná pole
$id          = $input['id'] ?? null;
$PersonalNum = $input['PersonalNum'] ?? null;
$MaterialNum = $input['MaterialNum'] ?? null;
$amount      = $input['amount'] ?? null;
$reason      = $input['reason'] ?? null;
$state       = $input['state'] ?? null;
$target      = $input['target'] ?? null;
$type        = $input['type'] ?? null;

// Kontrola povinných polí pro update
if (!$id) {
    $response['message'] = "Chybí identifikátor záznamu (id).";
    echo json_encode($response);
    exit;
}

// Timestamp aktuální čas ve formátu 'YYYY-MM-DD HH:MM:SS'
$timestamp = date('Y-m-d H:i:s');

// repDate jen jako datum (Y-m-d) pro MSSQL DATE typ
$repDate = date('Y-m-d');

if (count($input) === 2 && isset($state)) {
    // Aktualizace pouze stavu, timestampu a repDate
    $sql = "UPDATE SAPR 
            SET state = ?, timestamp = ?, repDate = ? 
            WHERE id = ?";
    $params = [
        $state,
        $timestamp,
        $repDate,
        $id
    ];
} else {
    // Aktualizace všech polí
    $sql = "UPDATE SAPR SET 
                PersonalNum = ?, 
                MaterialNum = ?, 
                amount = ?, 
                reason = ?, 
                state = ?, 
                target = ?, 
                type = ?, 
                timestamp = ?, 
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
        $timestamp,
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
