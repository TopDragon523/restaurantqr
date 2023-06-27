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
    $templateId = $_POST["templateId"];
    $projectId = $_POST["projectId"];
    $sn = $_POST["sn"];
    $user_id = $_SESSION["userid"];
    global $project;

    $query = "SELECT thumbnail from projects where id = $projectId";
    $result = mysqli_query($conn, $query);
    if ($result) {
        $project = mysqli_fetch_object($result);
    }

    // upload template thumbnail
    unlink($project->thumbnail);

    $base64string = $thumbnail;
    $uploadpath   = 'upload/project/';
    $parts        = explode(";base64,", $base64string);
    $imageparts   = explode("image/", @$parts[0]);
    $imagetype    = $imageparts[1];
    $imagebase64  = base64_decode($parts[1]);
    $filename         = $project->thumbnail;
    file_put_contents($filename, $imagebase64);

    $query = "UPDATE projects SET thumbnail='$filename', save_stage_as_json= '$data' WHERE id = $projectId";

    if (mysqli_query($conn, $query)) {
        $qrcodefilename = "upload/qrcode/" . $sn . "png";

        $qr_query  = "INSERT INTO  qrcodes (url, createdBy, templateId, createdAt) VALUES ('" . $qrcodefilename . "', " . $user_id . ", " . $templateId . ", Now());";
        $project_query = "SELECT *  from  projects WHERE id = " . $projectId;

        $qr_result = mysqli_query($conn, $qr_query);
        $project_result = mysqli_query($conn, $project_query);

        if ($qr_result && $project_result) {
            $inserted_project = mysqli_fetch_assoc($project_result);
            $result  = array("status" => true,  "message" => "Successfully saved!");
            echo json_encode($result);
            die;
        }
    } else {
        $result  = array("status" => false, "message" => mysqli_error($conn));
        echo json_encode($result);
        die;
    }

    mysqli_close($conn);
}
