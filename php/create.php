<?php

if(empty($LOCAL_ACCESS)) {
    die('Direct access not allowed');
}

$name = $_POST['name'];
$grade = $_POST['grade'];
$course_name = $_POST['course_name'];

$query = "INSERT INTO `student_data`(`name`, `grade`, `course_name`) VALUES ( '$name', '$grade', '$course_name')";

$result = mysqli_query($conn, $query);

$output = [
'success' => false,
'error' => []
];

if(!empty($result)) {
    if(mysqli_affected_rows($conn)) {
        $output['success'] = true;
        $output['id'] = mysqli_insert_id($conn);  
    } else {
        $output['errors'][] = "Unable to insert data";
    }
} else {
    $output['errors'][] = "Invalid query";
}

?>