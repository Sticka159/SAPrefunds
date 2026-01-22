<?php
$serverName = "192.168.114.53";
$connectionOptions = array(
    "Database" => "OOPP",
    "Uid" => "sa",
    "PWD" => "Veronika01",
    "CharacterSet" => "UTF-8"
);

try {
    $parameter = $_GET['parameter'];

    $conn = sqlsrv_connect($serverName, $connectionOptions);

    if ($conn === false) {
        throw new Exception("Failed to connect to the database. " . print_r(sqlsrv_errors(), true));
    }

    $sql = "SELECT FirstName, LastName, PersonalNum FROM View_ANET_Osoby_Cip WHERE kod = ? OR PersonalNum = ?";
    $params = array($parameter, $parameter, $parameter, $parameter);
    $query = sqlsrv_query($conn, $sql, $params);

    if ($query === false) {
        throw new Exception("Query failed: " . print_r(sqlsrv_errors(), true));
    }

    $data = "";
    while ($row = sqlsrv_fetch_array($query, SQLSRV_FETCH_ASSOC)) {
        $firstName = $row['FirstName'];
        $lastName = $row['LastName'];
        $PersonalNum = $row['PersonalNum'];
        $fullName = $firstName . ', ' . $lastName;
        $data .= $fullName . ', ' . $PersonalNum . ', ' . PHP_EOL;
    }

    header('Content-Type: text/plain; charset=utf-8');
    echo $data;

} catch (Exception $e) {
    header("HTTP/1.1 500 Internal Server Error");
    echo "Error: " . $e->getMessage();
}
