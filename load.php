<?php
include "db.php";

$query = "SELECT * FROM templates";

$result = mysqli_query($conn, $query);
if ($result) {
    if (mysqli_num_rows($result) > 0) {

        $templates = mysqli_fetch_all($result, MYSQLI_ASSOC);

        echo (json_encode($templates));
        die;
    } else {
        $result = array("status" => false, "message" => "Email or password is incorrect");
        echo (json_encode($result));
        die;
    }
} else {
    die('Query failed');
}

mysqli_close($conn);
