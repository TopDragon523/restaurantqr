<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    include "db.php";
    $data  = addslashes($_POST["data"]);
    $thumbnail = $_POST['thumbnail'];
    // var_dump($_POST['thumbnail']); die;

    // upload template thumbnail
    $base64string = $thumbnail;
    $uploadpath   = 'upload/template/thumbnail/';
    $parts        = explode(";base64,", $base64string);
    $imageparts   = explode("image/", @$parts[0]);
    $imagetype    = $imageparts[1];
    $imagebase64  = base64_decode($parts[1]);
    $filename         = $uploadpath . uniqid() . '.png';
    file_put_contents($filename, $imagebase64);

    $query = "INSERT INTO templates (thumbnail, save_stage_as_json, createdAt) 
	VALUES ('" . $filename . "', '" . $data .  "', NOW());";

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
