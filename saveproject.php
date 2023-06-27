<?php
session_start();
if (!isset($_SESSION["username"]) || !isset($_SESSION["email"])) {
    header("location: login.php");
    exit();
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    include "db.php";
    $data  = addslashes($_POST["data"]);
    $thumbnail = $_POST['thumbnail'];
    $projectId = $_POST["projectId"];
    $templateId = $_POST["templateId"];
    $user_id = $_SESSION["userid"];
    global $project;

    $query = "SELECT thumbnail from projects where id = $projectId";
    $result = mysqli_query($conn, $query);
    if ($result) {
        $project = mysqli_fetch_object($result);
    }
    // upload template thumbnail
    $base64string = $thumbnail;
    $uploadpath   = 'upload/projects/';
    $parts        = explode(";base64,", $base64string);
    $imageparts   = explode("image/", @$parts[0]);
    $imagetype    = $imageparts[1];
    $imagebase64  = base64_decode($parts[1]);
    $filename         = $project->thumbnail;
    file_put_contents($filename, $imagebase64);

    $query = "UPDATE projects SET thumbnail='$filename', save_stage_as_json= '$data' WHERE id = $projectId";

    if (mysqli_query($conn, $query)) {
        $result  = array("status" => true, "message" => "Successfully saved!");
        echo json_encode($result);
        die;
    } else {
        $result  = array("status" => false, "message" => mysqli_error($conn));
        echo json_encode($result);
        die;
    }

    mysqli_close($conn);
}
