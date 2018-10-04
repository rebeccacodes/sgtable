<?php

require_once('mysql_connect.php');

$query = "INSERT INTO `student_data` SELECT * FROM `default_data`";
$result = mysqli_query($conn, $query);


?>