<?php
session_start();
if (!isset($_SESSION["username"]) || !isset($_SESSION["email"])) {
    header("location: login.php");
    exit();
}

include 'db.php';
$user_id = $_SESSION["userid"];

global $templates;
$templates = array();

$query = "SELECT * FROM templates";
$result = mysqli_query($conn, $query);
if ($result) {
    if (mysqli_num_rows($result) > 0) {
        $templates = mysqli_fetch_all($result, MYSQLI_ASSOC);
    }
} else {
    // die('Query failed');
}

mysqli_close($conn);
?>

<?php
include("header.php");
?>
 <link href="css/template.css" rel="stylesheet">

<!--**********************************Main wrapper start***********************************-->
<div id="main-wrapper" class="show menu-toggle">

    <!--**********************************Nav header start***********************************-->
    <div class="nav-header">
        <a href="index.html" class="brand-logo">
            <img class="logo-abbr" src="./images/logo.png" alt="">
            <img class="logo-compact" src="./images/logo-text.png" alt="">
            <img class="brand-title" src="./images/logo-text.png" alt="">
        </a>

        <!-- <div class="nav-control">
			<div class="hamburger">
				<span class="line"></span><span class="line"></span><span class="line"></span>
			</div>
		</div> -->
    </div>
    <!--**********************************Nav header end***********************************-->

    <!--**********************************Header start***********************************-->
    <div class="header">
        <div class="header-content">
            <nav class="navbar navbar-expand">
                <div class="collapse navbar-collapse justify-content-between">
                    <div class="header-left"></div>
                    <ul class="navbar-nav header-right">
                        <li id="savetemplate" class="nav-item dropdown notification_dropdown">
                            <div class="btn btn-outline-primary" role="button">
                                <span>Export Template</span>
                            </div>
                        </li>
                        <!-- <li class="nav-item dropdown notification_dropdown">
							<a class="nav-link bell bell-link primary" href="#">
								<svg width="24" height="24" viewBox="0 0 23 22" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M20.4604 0.848846H3.31682C2.64742 0.849582 2.00565 1.11583 1.53231 1.58916C1.05897 2.0625 0.792727 2.70427 0.791992 3.37367V15.1562C0.792727 15.8256 1.05897 16.4674 1.53231 16.9407C2.00565 17.414 2.64742 17.6803 3.31682 17.681C3.53999 17.6812 3.75398 17.7699 3.91178 17.9277C4.06958 18.0855 4.15829 18.2995 4.15843 18.5226V20.3168C4.15843 20.6214 4.24112 20.9204 4.39768 21.1817C4.55423 21.4431 4.77879 21.6571 5.04741 21.8008C5.31602 21.9446 5.61861 22.0127 5.92292 21.998C6.22723 21.9833 6.52183 21.8863 6.77533 21.7173L12.6173 17.8224C12.7554 17.7299 12.9179 17.6807 13.0841 17.681H17.187C17.7383 17.68 18.2742 17.4993 18.7136 17.1664C19.1531 16.8334 19.472 16.3664 19.6222 15.8359L22.8965 4.05007C22.9998 3.67478 23.0152 3.28071 22.9413 2.89853C22.8674 2.51634 22.7064 2.15636 22.4707 1.8466C22.2349 1.53684 21.9309 1.28565 21.5822 1.1126C21.2336 0.93954 20.8497 0.849282 20.4604 0.848846ZM21.2732 3.60301L18.0005 15.3847C17.9499 15.5614 17.8432 15.7168 17.6964 15.8274C17.5496 15.938 17.3708 15.9979 17.187 15.9978H13.0841C12.5855 15.9972 12.098 16.1448 11.6836 16.4219L5.84165 20.3168V18.5226C5.84091 17.8532 5.57467 17.2115 5.10133 16.7381C4.62799 16.2648 3.98622 15.9985 3.31682 15.9978C3.09365 15.9977 2.87966 15.909 2.72186 15.7512C2.56406 15.5934 2.47534 15.3794 2.47521 15.1562V3.37367C2.47534 3.15051 2.56406 2.93652 2.72186 2.77871C2.87966 2.62091 3.09365 2.5322 3.31682 2.53206H20.4604C20.5905 2.53239 20.7187 2.56274 20.8352 2.62073C20.9516 2.67872 21.0531 2.7628 21.1318 2.86643C21.2104 2.97005 21.2641 3.09042 21.2886 3.21818C21.3132 3.34594 21.3079 3.47763 21.2732 3.60301Z" fill="#000" />
									<path d="M5.84161 8.42333H10.0497C10.2729 8.42333 10.4869 8.33466 10.6448 8.17683C10.8026 8.019 10.8913 7.80493 10.8913 7.58172C10.8913 7.35851 10.8026 7.14445 10.6448 6.98661C10.4869 6.82878 10.2729 6.74011 10.0497 6.74011H5.84161C5.6184 6.74011 5.40433 6.82878 5.2465 6.98661C5.08867 7.14445 5 7.35851 5 7.58172C5 7.80493 5.08867 8.019 5.2465 8.17683C5.40433 8.33466 5.6184 8.42333 5.84161 8.42333Z" fill="#000" />
									<path d="M13.4161 10.1066H5.84161C5.6184 10.1066 5.40433 10.1952 5.2465 10.3531C5.08867 10.5109 5 10.725 5 10.9482C5 11.1714 5.08867 11.3854 5.2465 11.5433C5.40433 11.7011 5.6184 11.7898 5.84161 11.7898H13.4161C13.6393 11.7898 13.8534 11.7011 14.0112 11.5433C14.169 11.3854 14.2577 11.1714 14.2577 10.9482C14.2577 10.725 14.169 10.5109 14.0112 10.3531C13.8534 10.1952 13.6393 10.1066 13.4161 10.1066Z" fill="#000" />
								</svg>
							</a>
						</li>
						<li class="nav-item dropdown notification_dropdown">
							<a class="nav-link  ai-icon warning" href="#" role="button" data-bs-toggle="dropdown">
								<svg width="24" height="24" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M21.75 14.8385V12.0463C21.7471 9.88552 20.9385 7.80353 19.4821 6.20735C18.0258 4.61116 16.0264 3.61555 13.875 3.41516V1.625C13.875 1.39294 13.7828 1.17038 13.6187 1.00628C13.4546 0.842187 13.2321 0.75 13 0.75C12.7679 0.75 12.5454 0.842187 12.3813 1.00628C12.2172 1.17038 12.125 1.39294 12.125 1.625V3.41534C9.97361 3.61572 7.97429 4.61131 6.51794 6.20746C5.06159 7.80361 4.25291 9.88555 4.25 12.0463V14.8383C3.26257 15.0412 2.37529 15.5784 1.73774 16.3593C1.10019 17.1401 0.751339 18.1169 0.75 19.125C0.750764 19.821 1.02757 20.4882 1.51969 20.9803C2.01181 21.4724 2.67904 21.7492 3.375 21.75H8.71346C8.91521 22.738 9.45205 23.6259 10.2331 24.2636C11.0142 24.9013 11.9916 25.2497 13 25.2497C14.0084 25.2497 14.9858 24.9013 15.7669 24.2636C16.548 23.6259 17.0848 22.738 17.2865 21.75H22.625C23.321 21.7492 23.9882 21.4724 24.4803 20.9803C24.9724 20.4882 25.2492 19.821 25.25 19.125C25.2486 18.117 24.8998 17.1402 24.2622 16.3594C23.6247 15.5786 22.7374 15.0414 21.75 14.8385ZM6 12.0463C6.00232 10.2113 6.73226 8.45223 8.02974 7.15474C9.32723 5.85726 11.0863 5.12732 12.9212 5.125H13.0788C14.9137 5.12732 16.6728 5.85726 17.9703 7.15474C19.2677 8.45223 19.9977 10.2113 20 12.0463V14.75H6V12.0463ZM13 23.5C12.4589 23.4983 11.9316 23.3292 11.4905 23.0159C11.0493 22.7026 10.716 22.2604 10.5363 21.75H15.4637C15.284 22.2604 14.9507 22.7026 14.5095 23.0159C14.0684 23.3292 13.5411 23.4983 13 23.5ZM22.625 20H3.375C3.14298 19.9999 2.9205 19.9076 2.75644 19.7436C2.59237 19.5795 2.50014 19.357 2.5 19.125C2.50076 18.429 2.77757 17.7618 3.26969 17.2697C3.76181 16.7776 4.42904 16.5008 5.125 16.5H20.875C21.571 16.5008 22.2382 16.7776 22.7303 17.2697C23.2224 17.7618 23.4992 18.429 23.5 19.125C23.4999 19.357 23.4076 19.5795 23.2436 19.7436C23.0795 19.9076 22.857 19.9999 22.625 20Z" fill="#000" />
								</svg>
								<div class="pulse-css"></div>
							</a>
							<div class="dropdown-menu dropdown-menu-right">
								<div id="DZ_W_Notification1" class="widget-media dz-scroll p-3" style="height:380px;">
									<ul class="timeline">
										<li>
											<div class="timeline-panel">
												<div class="media me-2">
													<img alt="image" width="50" src="images/avatar/1.jpg">
												</div>
												<div class="media-body">
													<h6 class="mb-1">Dr sultads Send you Photo</h6>
													<small class="d-block">29 July 2020 - 02:26 PM</small>
												</div>
											</div>
										</li>
										<li>
											<div class="timeline-panel">
												<div class="media me-2 media-info">
													KG
												</div>
												<div class="media-body">
													<h6 class="mb-1">Resport created successfully</h6>
													<small class="d-block">29 July 2020 - 02:26 PM</small>
												</div>
											</div>
										</li>
										<li>
											<div class="timeline-panel">
												<div class="media me-2 media-success">
													<i class="fa fa-home"></i>
												</div>
												<div class="media-body">
													<h6 class="mb-1">Reminder : Treatment Time!</h6>
													<small class="d-block">29 July 2020 - 02:26 PM</small>
												</div>
											</div>
										</li>
										<li>
											<div class="timeline-panel">
												<div class="media me-2">
													<img alt="image" width="50" src="images/avatar/1.jpg">
												</div>
												<div class="media-body">
													<h6 class="mb-1">Dr sultads Send you Photo</h6>
													<small class="d-block">29 July 2020 - 02:26 PM</small>
												</div>
											</div>
										</li>
										<li>
											<div class="timeline-panel">
												<div class="media me-2 media-danger">
													KG
												</div>
												<div class="media-body">
													<h6 class="mb-1">Resport created successfully</h6>
													<small class="d-block">29 July 2020 - 02:26 PM</small>
												</div>
											</div>
										</li>
										<li>
											<div class="timeline-panel">
												<div class="media me-2 media-primary">
													<i class="fa fa-home"></i>
												</div>
												<div class="media-body">
													<h6 class="mb-1">Reminder : Treatment Time!</h6>
													<small class="d-block">29 July 2020 - 02:26 PM</small>
												</div>
											</div>
										</li>
									</ul>
								</div>
								<a class="all-notification" href="#">See all notifications <i class="ti-arrow-right"></i></a>
							</div>
						</li> -->
                        <li class="nav-item dropdown header-profile">
                            <div class="nav-link" href="#" role="button" data-bs-toggle="dropdown">
                                <div class="btn btn-primary">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20.444 21.298" class="my-files-file__round-button--icon">
                                        <g data-name="Group 3406" fill="none" stroke-linecap="round" stroke-width="2">
                                            <g data-name="Group 3405" stroke="#ffffff">
                                                <path data-name="Path 8173" d="M4.927 14.821l5.063 5.063 5.063-5.063"></path>
                                                <path data-name="Path 8174" d="M9.969 7.666v11.658"></path>
                                            </g>
                                            <path data-name="Path 8188" d="M1 10.655V2.871a2.373 2.373 0 012.244-1.835h13.654a2.081 2.081 0 012.53 2.165c.034 2.6 0 7.454 0 7.454" stroke="#ffffff"></path>
                                        </g>
                                    </svg>
                                    <span>Save</span>
                                </div>
                                <!-- <img src="images/profile/pic1.jpg" width="20" alt=""> -->
                            </div>
                            <div class="dropdown-menu dropdown-menu-right">
                                <div id="saveimage" class="dropdown-item ai-icon">
                                    <svg data-icon="media" width="16" height="16" viewBox="0 0 16 16" role="img">
                                        <path d="M11.99 6.99c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1zm3-5h-14c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h14c.55 0 1-.45 1-1v-10c0-.55-.45-1-1-1zm-1 9l-5-3-1 2-3-4-3 5v-7h12v7z" fill-rule="evenodd"></path>
                                    </svg>
                                    <span class="ms-2">Save as image </span>
                                </div>
                                <div id="savepdf" class="dropdown-item ai-icon">
                                    <svg data-icon="document" width="16" height="16" viewBox="0 0 16 16" role="img">
                                        <path d="M9 0H3c-.55 0-1 .45-1 1v14c0 .55.45 1 1 1h10c.55 0 1-.45 1-1V5L9 0zm3 14H4V2h4v4h4v8z" fill-rule="evenodd"></path>
                                    </svg>
                                    <span class="ms-2">Save as PDF </span>
                                </div>
                                <div id="saveqr" class="dropdown-item ai-icon" type="button" data-bs-toggle="modal" data-bs-target="#exampleModalCenter">
                                    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M5.88462 0H0.653846C0.292737 0 0 0.281895 0 0.62963V5.66667C0 6.0144 0.292737 6.2963 0.653846 6.2963H5.88462C6.24572 6.2963 6.53846 6.0144 6.53846 5.66667V0.62963C6.53846 0.281895 6.24572 0 5.88462 0Z" fill="#293745" />
                                        <path d="M16.3456 0H11.1148C10.7537 0 10.4609 0.281895 10.4609 0.62963V5.66667C10.4609 6.0144 10.7537 6.2963 11.1148 6.2963H16.3456C16.7067 6.2963 16.9994 6.0144 16.9994 5.66667V0.62963C16.9994 0.281895 16.7067 0 16.3456 0Z" fill="#293745" />
                                        <path d="M5.88462 10.074H0.653846C0.292737 10.074 0 10.3559 0 10.7036V15.7406C0 16.0884 0.292737 16.3703 0.653846 16.3703H5.88462C6.24572 16.3703 6.53846 16.0884 6.53846 15.7406V10.7036C6.53846 10.3559 6.24572 10.074 5.88462 10.074Z" fill="#293745" />
                                        <path d="M2.61523 2.51855H3.92293V3.77781H2.61523V2.51855Z" fill="#293745" />
                                        <path d="M13.0762 2.51855H14.3839V3.77781H13.0762V2.51855Z" fill="#293745" />
                                        <path d="M7.19141 1.25928H8.4991V2.51854H7.19141V1.25928Z" fill="#293745" />
                                        <path d="M7.19141 3.14819H8.4991V4.40745H7.19141V3.14819Z" fill="#293745" />
                                        <path d="M7.19141 5.03711H8.4991V6.29637H7.19141V5.03711Z" fill="#293745" />
                                        <path d="M8.5 3.77783H9.80769V5.03709H8.5V3.77783Z" fill="#293745" />
                                        <path d="M1.96094 6.92603H3.26863V8.18528H1.96094V6.92603Z" fill="#293745" />
                                        <path d="M2.61523 7.55566H5.23062V8.81492H2.61523V7.55566Z" fill="#293745" />
                                        <path d="M4.57617 6.92603H5.88386V8.18528H4.57617V6.92603Z" fill="#293745" />
                                        <path d="M5.88477 8.8147H7.19246V10.074H5.88477V8.8147Z" fill="#293745" />
                                        <path d="M7.19141 6.92603H8.4991V8.18528H7.19141V6.92603Z" fill="#293745" />
                                        <path d="M9.1543 8.8147H10.462V10.074H9.1543V8.8147Z" fill="#293745" />
                                        <path d="M9.1543 6.92603H10.462V8.18528H9.1543V6.92603Z" fill="#293745" />
                                        <path d="M9.80859 7.55566H12.424V8.81492H9.80859V7.55566Z" fill="#293745" />
                                        <path d="M12.4238 6.92603H13.7315V8.18528H12.4238V6.92603Z" fill="#293745" />
                                        <path d="M13.7305 7.55566H15.0382V8.81492H13.7305V7.55566Z" fill="#293745" />
                                        <path d="M15.0391 6.92603H16.3468V8.18528H15.0391V6.92603Z" fill="#293745" />
                                        <path d="M15.6914 7.55566H16.9991V10.0742H15.6914V7.55566Z" fill="#293745" />
                                        <path d="M15.0391 10.074H16.3468V11.3332H15.0391V10.074Z" fill="#293745" />
                                        <path d="M15.0391 11.9629H16.3468V13.2221H15.0391V11.9629Z" fill="#293745" />
                                        <path d="M15.0391 14.4814H16.3468V15.7407H15.0391V14.4814Z" fill="#293745" />
                                        <path d="M11.7695 10.074H13.7311V11.3332H11.7695V10.074Z" fill="#293745" />
                                        <path d="M10.4609 9.44434H11.7686V10.7036H10.4609V9.44434Z" fill="#293745" />
                                        <path d="M13.7305 11.3333H15.0382V12.5925H13.7305V11.3333Z" fill="#293745" />
                                        <path d="M9.80859 9.44434H11.1163V10.7036H9.80859V9.44434Z" fill="#293745" />
                                        <path d="M9.80859 10.7036H11.1163V11.9629H9.80859V10.7036Z" fill="#293745" />
                                        <path d="M9.1543 11.9629H10.462V13.2221H9.1543V11.9629Z" fill="#293745" />
                                        <path d="M9.80859 12.5925H11.1163V15.111H9.80859V12.5925Z" fill="#293745" />
                                        <path d="M12.4238 13.2222H15.0392V14.4814H12.4238V13.2222Z" fill="#293745" />
                                        <path d="M12.4238 14.4814H13.7315V15.7407H12.4238V14.4814Z" fill="#293745" />
                                        <path d="M11.1152 15.7407H12.4229V17H11.1152V15.7407Z" fill="#293745" />
                                        <path d="M9.1543 15.7407H10.462V17H9.1543V15.7407Z" fill="#293745" />
                                        <path d="M7.8457 13.2222H9.1534V15.7407H7.8457V13.2222Z" fill="#293745" />
                                        <path d="M7.19141 10.7036H8.4991V11.9629H7.19141V10.7036Z" fill="#293745" />
                                        <path d="M2.61523 12.5925H3.92293V13.8518H2.61523V12.5925Z" fill="#293745" />
                                        <path d="M4.57782 1.25928H1.96244C1.60133 1.25928 1.30859 1.54117 1.30859 1.88891V4.40743C1.30859 4.75516 1.60133 5.03706 1.96244 5.03706H4.57782C4.93893 5.03706 5.23167 4.75516 5.23167 4.40743V1.88891C5.23167 1.54117 4.93893 1.25928 4.57782 1.25928Z" fill="white" />
                                        <path d="M15.0388 1.25928H12.4234C12.0623 1.25928 11.7695 1.54117 11.7695 1.88891V4.40743C11.7695 4.75516 12.0623 5.03706 12.4234 5.03706H15.0388C15.3999 5.03706 15.6926 4.75516 15.6926 4.40743V1.88891C15.6926 1.54117 15.3999 1.25928 15.0388 1.25928Z" fill="white" />
                                        <path d="M4.57782 11.3333H1.96244C1.60133 11.3333 1.30859 11.6151 1.30859 11.9629V14.4814C1.30859 14.8291 1.60133 15.111 1.96244 15.111H4.57782C4.93893 15.111 5.23167 14.8291 5.23167 14.4814V11.9629C5.23167 11.6151 4.93893 11.3333 4.57782 11.3333Z" fill="white" />
                                        <path d="M3.92293 3.14818C3.92293 2.80045 3.63019 2.51855 3.26908 2.51855C2.90797 2.51855 2.61523 2.80045 2.61523 3.14818C2.61523 3.49592 2.90797 3.77781 3.26908 3.77781C3.63019 3.77781 3.92293 3.49592 3.92293 3.14818Z" fill="#293745" />
                                        <path d="M3.92293 13.2222C3.92293 12.8744 3.63019 12.5925 3.26908 12.5925C2.90797 12.5925 2.61523 12.8744 2.61523 13.2222C2.61523 13.5699 2.90797 13.8518 3.26908 13.8518C3.63019 13.8518 3.92293 13.5699 3.92293 13.2222Z" fill="#293745" />
                                        <path d="M14.3839 3.14818C14.3839 2.80045 14.0911 2.51855 13.73 2.51855C13.3689 2.51855 13.0762 2.80045 13.0762 3.14818C13.0762 3.49592 13.3689 3.77781 13.73 3.77781C14.0911 3.77781 14.3839 3.49592 14.3839 3.14818Z" fill="#293745" />
                                    </svg>

                                    <span class="ms-2">Save as QR </span>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    </div>
    <!--**********************************Header end ti-comment-alt***********************************-->

    <!--**********************************Sidebar start***********************************-->
    <div class="deznav">
        <div class="left-panel">
            <div class="tool-tab" data-tab="project">
                <div class="d-flex flex-column justify-content-center align-items-center">
                    <i class="lni lni-library"></i>
                    <span>Templates</span>
                </div>
            </div>
            <div class="tool-tab" data-tab="demo">
                <div class="d-flex flex-column justify-content-center align-items-center">
                    <i class="lni lni-layout"></i>
                    <span>Projects</span>
                </div>
            </div>
            <div class="tool-tab" data-tab="text">
                <div class="d-flex flex-column justify-content-center align-items-center">
                    <i class="lni lni-text-format"></i>
                    <span>Text</span>
                </div>
            </div>
        </div>
        <div class="deznav-scroll">

        </div>
    </div>
    <!--**********************************Sidebar end***********************************-->

    <!--**********************************Content body start***********************************-->
    <div class="content-body" style="background-color: #6f85931a;">
        <div class="container-fluid h-100 overflow-scroll">
            <div class="row page-titles">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><a href="javascript:void(0)">Apps</a></li>
                    <li class="breadcrumb-item active"><a href="javascript:void(0)">Product Grid</a></li>
                </ol>
            </div>

            <div id="template-content" class="row">
                <?php
                // foreach ($templates as $template) {
                //     echo ('
                //         <div class="col-xl-2 col-xxl-3 col-md-4 col-sm-6" data-id="' . $template["id"] . '">
                //             <div class="card">
                //                 <div class="card-body product-grid-card">
                //                     <div class="new-arrival-product">
                //                         <div class="new-arrivals-img-contnent">
                //                             <img class="img-fluid" src="' . $template['thumbnail'] . '" alt="template themubail"/>
                //                         </div>
                //                         <div style="transform: translate(-50%, -50%);"  class="d-flex flex-column justify-content-center align-items-center position-absolute top-50 start-50 w-50 d-none">
                //                             <button class="btn btn-primary btn-xs w-100 my-1">Edit</button>
                //                             <button class="btn btn-danger btn-xs w-100 my-1">Remove</button>
                //                         </div>
                //                     </div>
                //                 </div>
                //             </div>
                //         </div>
                //     ');
                // }
                ?>
            </div>
        </div>
    </div>
    <!--**********************************Content body end***********************************-->

    <!-- Modal -->
    <div class="modal fade" id="exampleModalCenter">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Download QR ocde for your menu</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal">
                    </button>
                </div>
                <div class="modal-body d-flex flex-column justify-content-center align-items-center">
                    <div id="menulogo" class="d-flex flex-column justify-content-around w-100"></div>
                    <div id="qrcode" class="d-flex flex-column justify-content-around">
                    </div>
                </div>
                <div class="modal-footer">
                    <!-- <button id="downloadqr" type="button" class="btn btn-primary">Download</button> -->
                    <button id="selectlogo" type="button" class="btn btn-primary">Download</button>
                </div>
            </div>
        </div>
    </div>
</div>

<?php
include("footer.php");
?>

<script src="js/handletemplate.js"></script>