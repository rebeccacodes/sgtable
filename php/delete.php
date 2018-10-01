<?php

if(empty($LOCAL_ACCESS)) {
    die('Direct access not allowed');
}

$deletedID = $_POST['student_id'];

$query = "DELETE FROM `student_data` WHERE `id` = $deletedID";    

$result = mysqli_query($conn, $query);

$output = [
    'success' => false,
    'error' => []
    ];

if(!empty($result)) {
    if(mysqli_affected_rows($conn)) {
        $output['success'] = true;
        
    } else {
        $output['errors'][] = "Unable to insert data";
    }
} else {
    $output['errors'][] = "Invalid query";
}

?>