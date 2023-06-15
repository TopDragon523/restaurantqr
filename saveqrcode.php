<?php
session_start();
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    include "db.php";
    $data  = addslashes($_POST["data"]);
    $thumbnail = $_POST['thumbnail'];
    $templateId = $_POST["templateId"];
    $sn = $_POST["sn"];
    $user_id = $_SESSION["userid"];

    // upload template thumbnail
    $base64string = $thumbnail;
    $uploadpath   = 'upload/template/qrcode/';
    $parts        = explode(";base64,", $base64string);
    $imageparts   = explode("image/", @$parts[0]);
    $imagetype    = $imageparts[1];
    $imagebase64  = base64_decode($parts[1]);
    $filename         = $uploadpath . $sn . '.png';
    file_put_contents($filename, $imagebase64);

    $query = "INSERT INTO projects (thumbnail, save_stage_as_json, createdBy, createdAt) 
	VALUES ('" . $filename . "', '" . $data .  "', "  . $user_id . ", NOW());";

    if (mysqli_query($conn, $query)) {
        $last_created_project_id = mysqli_insert_id($conn);

        $qr_query  = "INSERT INTO  qrcodes (url, createdBy, templateId, projectId, createdAt) VALUES ('" . $filename . "', " . $user_id . ", " . $templateId . ", " . $last_created_project_id . ", Now());";
        $project_query = "SELECT *  from  projects WHERE id = " . $last_created_project_id;

        $qr_result = mysqli_query($conn, $qr_query);
        $project_result = mysqli_query($conn, $project_query);

        if ($qr_result && $project_result) {
            $inserted_project = mysqli_fetch_assoc($project_result);
            $result  = array("status" => true, "newProject" => $inserted_project, "message" => "Successfully saved!");
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
