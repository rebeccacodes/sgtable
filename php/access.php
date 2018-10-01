<?php

$LOCAL_ACCESS = true;

$output = [
'success' => false,
'errors' => []
];

if(empty($_POST['action'])) {
    $output[errors][] = 'No action specified';
    print(json_encode($output));
    exit();
}
require_once('mysql_connect.php');

switch($_POST['action']) {
    case 'read': 
        include('read.php');
         break;
    case 'create':
        include('create.php');
        break;
    case 'delete':
        include('delete.php');
        break;
    case 'edit_data':
    include('edit_data.php');
        break;
    case 'update':
    include('update.php');
            break;
    default:
        $output['errors'][] = 'Invalid action';
}

$json_output = json_encode($output);
print($json_output);

?>