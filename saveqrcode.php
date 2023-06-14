<?php
session_start();
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    include "db.php";
    $data  = addslashes($_POST["data"]);
    $thumbnail = $_POST['thumbnail'];
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

    $query = "INSERT INTO templates (thumbnail, save_stage_as_json, is_free, createdAt) 
	VALUES ('" . $filename . "', '" . $data .  "', 1, NOW());";

    if (mysqli_query($conn, $query)) {
        $last_id = mysqli_insert_id($conn);

        $qr_query  = "INSERT INTO  qrcodes (url, createdBy, templateId, createdAt) VALUES ('" . $filename . "', '" . $user_id . "', '" . $last_id . "', Now());";
        // var_dump($qr_query);
        // die;

        $qr_result = mysqli_query($conn, $qr_query);

        if ($qr_result) {
            $result  = array("status" => true, "message" => "Successfully saved!");
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
