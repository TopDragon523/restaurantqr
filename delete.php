<?php
session_start();
if (!isset($_SESSION["username"]) || !isset($_SESSION["email"])) {
    header("location: login.php");
    exit();
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    include "db.php";
    $id = $_POST["id"];
    $type = $_POST["type"];

    $query = "DELETE FROM projects WHERE id=$id";

    if (mysqli_query($conn, $query)) {
        $result  = array("status" => true, "message" => "Successfully removed!");
        echo json_encode($result);
        die;
    } else {
        $result  = array("status" => false, "message" => mysqli_error($conn));
        echo json_encode($result);
        die;
    }

    mysqli_close($conn);
}
