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

    $query = "INSERT INTO templates (thumbnail, save_stage_as_json, is_free, createdAt) 
	VALUES ('" . $filename . "', '" . $data .  "', 1, NOW());";

    if (mysqli_query($conn, $query)) {
        $last_id = mysqli_insert_id($conn);

        $select_query  = "SELECT *  from  templates WHERE id = $last_id";
        $select_result = mysqli_query($conn, $select_query);

        $inserted_record = mysqli_fetch_assoc($select_result);
        $result  = array("status" => true, "newDemo" => $inserted_record, "message" => "Successfully saved!");
        echo json_encode($result);
        die;
    } else {
        $result  = array("status" => false, "message" => mysqli_error($conn));
        echo json_encode($result);
        die;
    }

    mysqli_close($conn);
}
