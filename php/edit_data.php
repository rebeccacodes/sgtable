<?php

if(empty($LOCAL_ACCESS)) {
    die('Direct access not allowed');
}

$editID = $_POST['student_id'];

$query = "SELECT * FROM `student_data` WHERE `id` = $editID";    

$result = mysqli_query($conn, $query);

$output = [
    'success' => false,
    'error' => []
    ];

if(!empty($result)) {
    if(mysqli_affected_rows($conn)) {
        while($row = mysqli_fetch_assoc($result)) {
            $output['success'] = true;
            $output['data'] [] = $row;       
        } 
    } else {
            $output['errors'][] = "Unable to get data";
    } 
    
} else {
    $output['errors'][] = "Invalid query";
}

?>