<?php
include "db.php";
if (isset($_GET["id"])) {
    $id = $_GET['id'];
    $query = "SELECT * FROM qrcodes WHERE url LIKE '%" . $id . "%'";

    $result = mysqli_query($conn, $query);

    if ($result) {
        if (mysqli_num_rows($result) > 0) {
            $qrcode = mysqli_fetch_assoc($result);
            $menuUrl = $qrcode["url"];
        } else {
            $result = array("status" => false, "message" => "Email or password is incorrect");
            echo (json_encode($result));
            die;
        }
    } else {
        die('Query failed');
    }
}
mysqli_close($conn);

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <!-- All Meta -->
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="author" content="DexignZone">
    <meta name="robots" content="">
    <meta name="keywords" content="admin dashboard, admin template, administration, analytics, bootstrap, cafe admin, elegant, food, health, kitchen, modern, responsive admin dashboard, restaurant dashboard">
    <meta name="description" content="Discover Davur - the ultimate admin dashboard and Bootstrap 5 template. Specially designed for professionals, and for business. Davur provides advanced features and an easy-to-use interface for creating a top-quality website with frontend">
    <meta property="og:title" content="Davur : Restaurant Admin Dashboard + FrontEnd">
    <meta property="og:description" content="Discover Davur - the ultimate admin dashboard and Bootstrap 5 template. Specially designed for professionals, and for business. Davur provides advanced features and an easy-to-use interface for creating a top-quality website with frontend">
    <meta property="og:image" content="https://davur.dexignzone.com/dashboard/social-image.png">
    <meta name="format-detection" content="telephone=no">

    <!-- Mobile Specific -->
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- Title -->
    <title>Davur</title>

    <!-- Favicon icon -->
    <link rel="icon" type="image/png" sizes="16x16" href="./images/favicon.png">
    <link href="./vendor/jqvmap/css/jqvmap.min.css" rel="stylesheet">
    <link href="vendor/bootstrap-select/dist/css/bootstrap-select.min.css" rel="stylesheet">
    <!-- <link href="css/style.css" rel="stylesheet"> -->
    <link href="css/customstyle.css" rel="stylesheet">

</head>

<body>
    <style>
        .img-container {
            width: 100vw;
            height: 100vh;
            position: relative;
            overflow: auto;
        }

        .img-container img {
            height: 100%;
        }
    </style>
    <div class="img-container d-flex justify-content-center">
        <img src="<?php echo $menuUrl; ?>" class="img" alt="Your restaurant menu">
    </div>
</body>

</html>