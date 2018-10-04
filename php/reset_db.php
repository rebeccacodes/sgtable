<?php

require_once('mysql_connect.php');

$query = "TRUNCATE TABLE `student_data`";
$result = mysqli_query($conn, $query);

$output = [
    'success' => false,
    'error' => []
    ];

if (mysqli_errno($conn)){
    $output['success'] = false;
    $output['error'] = mysqli_error($conn);
} else if (mysqli_affected_rows($conn)) {
    $output['success'] = true;
    $output['affected_rows'] = mysqli_affected_rows($conn);
}
else {
    $error = mysqli_error($conn);
    $output['error'] = "Database Error! + $error";
}

require_once('default_db.php');

?>