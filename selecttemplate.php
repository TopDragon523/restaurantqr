<?php
session_start();
if (!isset($_SESSION["username"]) || !isset($_SESSION["email"])) {
    header("location: login.php");
    exit();
}
try {
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        include "db.php";

        global $templateId;
        global $selectTemplateQuery;
        $flag = filter_var($_POST["flag"], FILTER_VALIDATE_BOOLEAN);

        if ($flag) {
            $selectTemplateQuery = "SELECT * from templates  where is_blank = 1";
        } else {
            $templateId = $_POST["templateId"];
            $selectTemplateQuery = "SELECT * from templates  where id = $templateId";
        }

        $selectTemplateResult = mysqli_query($conn, $selectTemplateQuery);

        if ($selectTemplateResult) {
            $template = $selectTemplateResult->fetch_object();
            $templateThumbnail = $template->thumbnail;
            $templateThumbnaiParseUrl = parse_url($templateThumbnail);
            $filePath = $templateThumbnaiParseUrl["path"];
            $pathInfo = pathinfo($filePath);
            $templateThumbnaiExtenstion = $pathInfo['extension'];
            $projectThumbnail = 'upload/project/' . uniqid() . '.' . $templateThumbnaiExtenstion;
            $projectData = $template->save_stage_as_json;
            $userId = $_SESSION["userid"];

            copy($templateThumbnail, $projectThumbnail);

            $query = "INSERT INTO projects (thumbnail, save_stage_as_json, createdBy, templateId, createdAt) 
        VALUES ('" . $projectThumbnail . "', '" . $projectData .  "', "  . $userId . "," . $template->id . ", NOW());";

            if (mysqli_query($conn, $query)) {
                $last_created_project_id = mysqli_insert_id($conn);
                $result = array("status" => true, "projectId" => $last_created_project_id,  "message" => "new project successfully created!");
                echo json_encode($result);
                mysqli_close($conn);
                die;
            } else {
                $result  = array("status" => false, "message" => mysqli_error($conn));
                echo json_encode($result);
                mysqli_close($conn);
                die;
            }
        }
    }
} catch (Exception $e) {
    $result  = array("status" => false, "message" => $e->getMessage());
    echo json_encode($result);
}
mysqli_close($conn);
