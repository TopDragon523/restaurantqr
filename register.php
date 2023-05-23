<?php

include 'db.php';

if (isset($_POST["username"]) && isset($_POST['email']) && isset($_POST['password'])) {
	$username = $_POST['username'];
	$email = $_POST['email'];
	$password = md5($_POST['password']);


	$query = "INSERT INTO users (username, email, password, createdAt) 
	VALUES ('" . $username . "', '" . $email . "', '" . $password . "', NOW());";

	if (mysqli_query($conn, $query)) {
		$result  = array("status" => true, "message" => "Successfully registered!");
		echo json_encode($result);
		die;
	} else {
		$result  = array("status" => false, "message" => mysqli_error($conn));
		echo json_encode($result);
		die;
	}

	mysqli_close($conn);
}
?>

<!DOCTYPE html>
<html lang="en" class="h-100">

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
	<title>Davur | Sign Up</title>

	<!-- Favicon icon -->
	<link rel="icon" type="image/png" sizes="16x16" href="./images/favicon.png">
	<link href="css/style.css" rel="stylesheet">

</head>

<body class="h-100">
	<div class="authincation h-100">
		<div class="container h-100">
			<div id="parent" class="row justify-content-center h-100 align-items-center position-relative">
				<div class="col-xl-12">

					<div class="row">

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
											<h3 class="text-start mb-4 font-w600">Register to Davur</h3>
											<form action="#" method="post">
												<div class="form-group">
													<label class="mb-1 text-black">Username<span class="required">*</span></label>
													<span id="error_username" class="text-danger"></span>
													<input id="username" type="text" name="username" class="form-control" placeholder="username" novalidate>
												</div>
												<div class="form-group">
													<label class="mb-1 text-black">Email<span class="required">*</span></label>
													<span id="error_email" class="text-danger"></span>
													<input id="email" type="text" name="email" class="form-control" placeholder="hello@example.com" novalidate>
												</div>
												<div class="form-group">
													<label class="mb-1 text-black">Password<span class="required">*</span></label>
													<span id="error_password" class="text-danger"></span>
													<input id="password" type="password" name="password" class="form-control" novalidate>
												</div>
												<div class="form-group">
													<label class="mb-1 text-black">Confirm Password<span class="required">*</span></label>
													<span id="error_confirmpass" class="text-danger"></span>
													<input id="confirmpass" type="password" class="form-control" novalidate disabled>
												</div>
												<div class="form-row d-flex justify-content-between mt-4 mb-2">
													<div class="form-group">
														<div class=" form-check ms-1 mb-2">
															<input type="checkbox" class="form-check-input" id="tems">
															<label class="custom-control-label ms-1" for="tems">I agree with Davur <a href="javascript:void(0);">Terms & Conditions</a></label>
														</div>
													</div>
												</div>
												<div class="text-center">
													<button id="submit" class="btn btn-primary btn-block">Sign Up</button>
												</div>
											</form>
											<div class="new-account mt-3 d-flex align-items-center justify-content-between flex-wrap">
												<small class="mb-0">Don't have an account? <a class="text-primary" href="login.php">Sign In</a></small>
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

	<!--**********************************	Scripts ***********************************-->
	<!-- Required vendors -->
	<script src="vendor/global/global.min.js"></script>
	<script src="vendor/bootstrap-select/dist/js/bootstrap-select.min.js"></script>
	<script src=" js/custom.min.js"></script>
	<script src="js/deznav-init.js"></script>
	<script>
		function emptyForm() {
			$('#username').val('').removeAttr('style');
			$('#email').val('').removeAttr('style');
			$('#password').val('').removeAttr('style');
			$('#confirmpass').val('').removeAttr('style');
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
			// validate username
			$("#username").on("input focusout", function() {
				if ($(this).val() == '') {
					handleFormChild($(this), "error_username", "You have to enter your first name!", false);
				} else {
					handleFormChild($(this), "error_username");
				}
			})
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
			$("#password").on("focusout input ", function() {
				if ($(this).val() == '') {
					handleFormChild($(this), "error_password", "You have to enter your Password!", false);
					handleFormChild($("#confirmpass"), "error_confirmpass", "", false);
					$("#confirmpass").attr('disabled', true);
					$("#confirmpass").removeAttr('style');
					$("#confirmpass").val("");
				} else {
					handleFormChild($(this), "error_password");
					$("#confirmpass").removeAttr('disabled');
				}
			});
			$("#confirmpass").on("focusout input", function() {
				if ($(this).val() != $("#password").val()) {
					handleFormChild($(this), "error_confirmpass", "Password and confirm password fields do not match!", false);
				} else {
					handleFormChild($(this), "error_confirmpass");
				}
			});
			// submit
			$("form").submit(function(event) {
				let validated = true;
				event.preventDefault();
				if ($("#username").val() == '') {
					validated = false
					handleFormChild($(this), "error_username", "You have to enter your first name!", false);
				}
				if ($("#email").val() == '') {
					validated = false
					handleFormChild($(this), "error_email", "You have to enter your Email!", false);
				}
				if ($("#password").val() == '') {
					validated = false
					handleFormChild($(this), "error_password", "You have to enter your Password!", false);
					handleFormChild($("#confirmpass"), "error_confirmpass", "", false);
					$("#confirmpass").removeAttr('style');
					$("#confirmpass").val("");
				}
				if (($("#confirmpass").val() != '') && ($("#password").val() != $("#confirmpass").val())) {
					validated = false
					handleFormChild($(this), "error_confirmpass", "Password and confirm password fields do not match!", false);
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
							emptyForm();
							const timeout = setTimeout(() => {
								$(`${resJson.status?".alert-success":".alert-danger"}`).removeClass('show');
								$(`${resJson.status?".alert-success":".alert-danger"}`).addClass('hide');
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
								$(".alert-error").removeClass('show');
								$(".alert-error").addClass('hide');
							}, 2000);
						}
					});
				}
			})
		})
	</script>
</body>

</html>