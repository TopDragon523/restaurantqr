<?php
include "db.php";

$tabs = array("photos", "bgimages", "texts", "templates");
global $resources;
$resources = array();


foreach ($tabs  as $tab) {
    $query = "SELECT * FROM " . $tab . " WHERE is_free = 1";

    $result = mysqli_query($conn, $query);
    if ($result) {
        if (mysqli_num_rows($result) > 0) {

            $table = mysqli_fetch_all($result, MYSQLI_ASSOC);

            $resources[$tab] = $table;
        } else {
            $resources[$tab] = array();
        }
    } else {
        die('Query failed');
    }
}

echo (json_encode($resources));

mysqli_close($conn);
