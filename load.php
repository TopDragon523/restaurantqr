<?php
session_start();
include "db.php";
$tabs = array("projects", "templates", "texts", "photos", "uploads", "bgimages");
$user_id = $_SESSION["userid"];

global $resources;
$resources = array();


foreach ($tabs  as $tab) {
    if ($tab === "projects" || $tab === "uploads") {
        $query = "SELECT * FROM " . $tab . " WHERE createdBy = $user_id";
    } else {
        $query = "SELECT * FROM " . $tab . " WHERE is_free = 1";
    }

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
