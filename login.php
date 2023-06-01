<?php
session_start();
if (isset($_POST["email"]) && isset($_POST["password"])) {
	include("db.php");
	$email = $_POST["email"];
	$password = md5($_POST["password"]);

	$query = "SELECT * FROM users WHERE email = '$email' AND password = '$password'";
	$result = mysqli_query($conn, $query);
	if ($result) {
		if (mysqli_num_rows($result) > 0) {
			session_regenerate_id();
			$user = mysqli_fetch_assoc($result);

			$_SESSION["username"] = $user['username'];
			$_SESSION["email"] = $user['email'];

			$id = $user['id'];
			$setLastLoginQuery = "UPDATE users SET lastLoginAt=Now() WHERE id=" . $user["id"];
			mysqli_query($conn, $setLastLoginQuery);

			$result = array("status" => true, "message" => "Log in success.");
			echo (json_encode($result));
			die;
		} else {
			$result = array("status" => false, "message" => "Eamil or password is incorrect");
			echo (json_encode($result));
			die;
		}
	} else {
		die('Query failed');
	}
}
?>
<!DOCTYPE html>
<html lang="en" class="h-100">

<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="keywords" content="" />
	<meta name="author" content="" />
	<meta name="robots" content="" />
	<meta name="description" content="Davur - Restaurant Bootstrap Admin Dashboard + FrontEnd" />
	<meta property="og:title" content="Davur - Restaurant Bootstrap Admin Dashboard + FrontEnd" />
	<meta property="og:description" content="Davur - Restaurant Bootstrap Admin Dashboard + FrontEnd" />
	<meta property="og:image" content="https://davur.dexignzone.com/dashboard/social-image.png" />
	<meta name="format-detection" content="telephone=no">
	<title>Davur | Sign In </title>
	<!-- Favicon icon -->
	<link rel="icon" type="image/png" sizes="16x16" href="./images/favicon.png">
	<link href="./css/style.css" rel="stylesheet">

</head>

<body class="h-100">
	<div class="authincation h-100">
		<div class="container h-100">
			<div id="parent" class="row justify-content-center h-100 align-items-center position-relative">
				<div class="col-xl-12">
					<div class="row align-items-center ">
						<div class="card login-card">
							<div class="card-body">
								<div class="row align-items-center">
									<div class="col-xl-6">
										<div class="text-center my-5">
											<a href="/"><img src="images/logo-full.png" alt=""></a>
										</div>
										<div class="media-login">
											<img src="images/svg/student.svg" class="w-100" alt="">
										</div>
									</div>
									<div class="col-xl-6">
										<div class="auth-form">
											<h3 class="text-start mb-4 font-w600">Login to Davur</h3>
											<form action="login.php" method="post">
												<div class="form-group">
													<label class="mb-1 text-black">Email<span class="required">*</span></label>
													<span id="error_email" class="text-danger"></span>
													<input id="email" type="email" name="email" class="form-control" placeholder="user@mail.com">
												</div>
												<div class="form-group">
													<label class="mb-1 text-black">Password<span class="required">*</span></label>
													<span id="error_password" class="text-danger"></span>
													<input id="password" type="password" name="password" class="form-control" placeholder="*********">
												</div>
												<div class="text-center">
													<button id="submit" class="btn btn-primary btn-block">Sign In</button>
												</div>
											</form>
											<div class="new-account mt-3 d-flex align-items-center justify-content-between flex-wrap">
												<small class="mb-0">Don't have an account? <a class="text-primary" href="register.php">Sign up</a></small>
												<small><a href="forgotpassword.php">Forgot Password?</a></small>
											</div>

										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>


	<!--**********************************
        Scripts
    ***********************************-->
	<!-- Required vendors -->
	<script src="./vendor/global/global.min.js"></script>
	<script src="./vendor/bootstrap-select/dist/js/bootstrap-select.min.js"></script>
	<script src="./js/custom.min.js"></script>
	<script src="./js/deznav-init.js"></script>
	<script>
		function emptyForm() {
			$('#email').val('').removeAttr('style');
			$('#password').val('').removeAttr('style');
		}

		function handleFormChild(ele, errClass, errMsg = '', status = true) {
			ele.css("border-color", `${status? "#2eb82e":"#FF0000"}`);
			if (status) {
				$('#submit').removeAttr('disabled');
			} else {
				$('#submit').attr('disabled', true);
			}
			$(`#${errClass}`).text(errMsg);
		}

		$(document).ready(function() {
			const REG_EXP_IS_EMAIL = /^[a-zA-Z0-9.]+@[a-zA-Z0-9]+\.[A-Za-z]+$/;
			// validate email
			$("#email").on("focusout input", function() {
				if ($(this).val() == '') {
					handleFormChild($(this), "error_email", "You have to enter your Email!", false);
				} else if (!REG_EXP_IS_EMAIL.test($(this).val())) {
					handleFormChild($(this), "error_email", "Please enter valid Email!", false);
				} else {
					handleFormChild($(this), "error_email");
				}
			});
			// validate password
			$("#password").on("input focusout", function() {
				if ($(this).val() == '') {
					handleFormChild($(this), "error_password", "You have to enter your first name!", false);
				} else {
					handleFormChild($(this), "error_password");
				}
			})

			$("form").on('submit', function(event) {
				event.preventDefault();
				let validated = true;
				if ($("#email").val() == '') {
					validated = false
					handleFormChild($("#email"), "error_email", "You have to enter your first name!", false);
				}
				if ($("#password").val() == '') {
					validated = false
					handleFormChild($("#password"), "error_password", "You have to enter your first name!", false);
				}
				if (validated) {
					$.ajax({
						url: $(this).attr('action'),
						type: $(this).attr('method'),
						data: $(this).serialize(),
						success: function(response) {
							const resJson = JSON.parse(response);
							$("#parent").prepend(`
								<div class="position-absolute top-0 alert ${resJson.status? "alert-success":"alert-danger"} solid alert-end-icon alert-dismissible fade show" style="z-index: 1;">
									<span><i class="mdi mdi-check"></i></span>
									<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="btn-close">
									</button> ${resJson.message}
								</div>
							`);
							if (resJson.status) {
								window.location.href = "templates.php"
							}
							emptyForm();
							const timeout = setTimeout(() => {
								$(".alert-danger").removeClass('show');
								$(".alert-danger").addClass('hide');
							}, 2000);
						},
						error: function(xhr, status, error) {
							$("#parent").prepend(`
								<div class="position-absolute top-0 alert alert-danger solid alert-end-icon alert-dismissible fade show">
									<span><i class="mdi mdi-help"></i></span>
									<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="btn-close">
									</button>
									<strong>Error!</strong>Status: ${status} ${error.toString()}
								</div>
							`);

							const timeout = setTimeout(() => {
								$(".alert-danger").removeClass('show');
								$(".alert-danger").addClass('hide');
							}, 2000);
						}
					})
				}
			})
		})
	</script>
</body>

</html>