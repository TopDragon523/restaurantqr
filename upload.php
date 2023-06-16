<?php
session_start();

include "db.php";
$user_id = $_SESSION['userid'];

if (isset($_FILES['userimage'])) {
    $file_name = $_FILES['userimage']['name'];
    $temp_file_location = $_FILES['userimage']['tmp_name'];
    $target_file_location = 'upload/userupload/' . $file_name;
    $file_extension =  pathinfo($file_name, PATHINFO_EXTENSION);

    $allowed_mime_types = array('image/jpeg', 'image/png', 'image/gif');
    $allowed_extensions = array('jpg', 'jpeg', 'png', 'gif');


    if (
        in_array($_FILES['userimage']['type'], $allowed_mime_types)
        && in_array($file_extension, $allowed_extensions)
    ) {
        if (move_uploaded_file($temp_file_location, $target_file_location)) {
            $query  = "INSERT INTO uploads (url, fileType, createdBy, createdAt)
            VALUES ('" . $target_file_location . "', '" . $file_extension . "', " . $user_id . ", Now())";
            $result = mysqli_query($conn, $query);
            if ($result) {
                $last_id = mysqli_insert_id($conn);
                $query =  "SELECT * FROM uploads WHERE id = '$last_id'";
                $result = mysqli_query($conn, $query);
                if ($result && mysqli_num_rows($result) > 0) {
                    $record = mysqli_fetch_assoc($result);
                    $response  = array("status" => true, "uploadedFile" => $record, "message" => "Uploaded successfully.");
                    echo json_encode($response);
                    die;
                }
            } else {
                $response  = array("status" => false,  "message" => mysqli_error($conn));
                echo json_encode($response);
                die;
            }
        } else {
            $response  = array("status" => false,  "message" => "Error while saving image");
            echo json_encode($response);
            die;
        }
    } else {
        $response  = array("status" => false,  "message" => "This file type is not allowed. Please upload only JPEG, PNG, or GIF files");
        echo json_encode($response);
        die;
    }
}
