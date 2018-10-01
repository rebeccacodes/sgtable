<?php

if(empty($LOCAL_ACCESS)) {
    die('Direct access not allowed');
}
$id  = $_POST['id'];
$name = $_POST['name'];
$grade = $_POST['grade'];
$course_name = $_POST['course_name'];

$query = "UPDATE `student_data` SET `name` = \"$name\", `grade` = \"$grade\", `course_name` = \"$course_name\" WHERE `id` = '$id'";

$result = mysqli_query($conn, $query);

$output = [
'success' => false,
'error' => []
];

if(!empty($result)) {
    if(mysqli_affected_rows($conn)) {
        $output['success'] = true;
         
    } else {
        $output['errors'][] = "Unable to update data";
    }
} else {
    $output['errors'][] = "Invalid query";
}

?>