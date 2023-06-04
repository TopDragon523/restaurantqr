<?php
$hostname = "192.168.121.13";
$username = "root";
$password = "";
$dbname = "restaurant-qr";


$conn = mysqli_connect($hostname, $username, $password, $dbname);

if (!$conn) {
    die("Connection failed: " .  mysqli_connect_error());
}
