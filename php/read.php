<?php

if(empty($LOCAL_ACCESS)) {
    die('Direct access not allowed');
}

$query = "SELECT * FROM student_data";

$result = mysqli_query($conn, $query);

$output = [
'success' => false,
'error' => [],
'data' => []
];

if(!empty($result)) {
    if(mysqli_num_rows($result) !== 0) {
        while($row = mysqli_fetch_assoc($result)) {
            $output['success'] = true;
            $output['data'] [] = $row;
        }
    } else {
        $output['errors'][] = 'No data available';
    }
} else {
    $output['errors'][] = mysqli_error($conn);
}

?>