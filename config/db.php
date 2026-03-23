<?php

function getDbConnection() {

    // fallback pro lokál
    $dbServer = getenv("DB_SERVER") ?: "blatna-apps-db.database.windows.net";
    $dbName   = getenv("DB_NAME") ?: "SAPR";
    $dbUser   = getenv("DB_USER") ?: "app_user";
    $dbPass   = getenv("DB_PASS") ?: "SilneHeslo123!";

    $serverName = "tcp:" . $dbServer . ",1433";

    $connectionOptions = [
        "Database" => $dbName,
        "Uid" => $dbUser,
        "PWD" => $dbPass,
        "CharacterSet" => "UTF-8",
        "Encrypt" => true,
        "TrustServerCertificate" => false
    ];

    $conn = sqlsrv_connect($serverName, $connectionOptions);

    if ($conn === false) {
        die(json_encode([
            "error" => "DB connection failed",
            "details" => sqlsrv_errors()
        ]));
    }

    return $conn;
}