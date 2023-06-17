var Davur = (function () {
  /* Search Bar ============ */
  var screenWidth = $(window).width();

  var handleSelectPicker = function () {
    if (jQuery(".default-select").length > 0) {
      jQuery(".default-select").selectpicker();
    }
  };

  var handleTheme = function () {
    $("#preloader").fadeOut(100);
    $("#main-wrapper").addClass("show menu-toggle");
  };

  var handleMetisMenu = function () {
    if (jQuery("#menu").length > 0) {
      $("#menu").metisMenu();
    }
    jQuery(".metismenu > .mm-active ").each(function () {
      if (!jQuery(this).children("ul").length > 0) {
        jQuery(this).addClass("active-no-child");
      }
    });
  };

  var handleAllChecked = function () {
    $("#checkAll").on("change", function () {
      $("td input:checkbox, .email-list .custom-checkbox input:checkbox").prop(
        "checked",
        $(this).prop("checked")
      );
    });
    $(".checkAllInput").on("click", function () {
      jQuery(this)
        .closest(".ItemsCheckboxSec")
        .find('input[type="checkbox"]')
        .prop("checked", true);
    });
    $(".unCheckAllInput").on("click", function () {
      jQuery(this)
        .closest(".ItemsCheckboxSec")
        .find('input[type="checkbox"]')
        .prop("checked", false);
    });
  };

  var clearLeftPanel = function () {
    $("div.deznav .deznav-scroll").text("");
  };

  var handleNavigation = function () {
    $(".tool-tab").on("click", function () {
      if ($(this).hasClass("active")) {
        $("#main-wrapper").addClass("menu-toggle");
      } else {
        $("#main-wrapper").removeClass("menu-toggle");
      }
      if ($(this).hasClass("active")) {
        $(".tool-tab").removeClass("active");
      } else {
        $(".tool-tab").removeClass("active");
        $(this).addClass("active");
      }

      var tabName = $(this)
        .children()
        .first()
        .children()
        .last()
        .text()
        .toLowerCase();

      switch (tabName) {
        case "project":
          clearLeftPanel();
          projects.map(function (item) {
            const $demoItemContainer = $("<div>");
            const $demoItem = $("<img>");
            $demoItemContainer.attr("class", "project-component");
            $demoItem.attr("data-index", item.id);
            $demoItem.attr("src", item.thumbnail);
            $demoItem.attr("data-config", item.save_stage_as_json);

            $demoItem.appendTo($demoItemContainer);
            $demoItemContainer.appendTo("div.deznav .deznav-scroll");
          });
          break;
        case "demo":
          clearLeftPanel();
          demos.map(function (item) {
            const $demoItemContainer = $("<div>");
            const $demoItem = $("<img>");
            $demoItemContainer.attr("class", "demo-component");
            $demoItem.attr("data-index", item.id);
            $demoItem.attr("src", item.thumbnail);
            $demoItem.attr("data-config", item.save_stage_as_json);

            $demoItem.appendTo($demoItemContainer);
            $demoItemContainer.appendTo("div.deznav .deznav-scroll");
          });
          break;
        case "text":
          clearLeftPanel();
          textComponents.map(function (item) {
            const $textItem = $("<div>");
            $textItem.attr("class", "text-component");
            $textItem.attr("data-index", item.id);
            $textItem.css({
              color: item.color,
              fontSize: item.fontSize,
              fontFamily: item.fontFamily,
            });

            $textItem.html(item.label);
            $textItem.appendTo("div.deznav .deznav-scroll");
          });
          break;
        case "photo":
          clearLeftPanel();
          photos.map(function (item) {
            const $photoContainer = $("<div>");
            const $photoItem = $("<img>");
            $photoContainer.attr("class", "photo-component");
            $photoItem.attr("data-index", item.id);

            $photoItem.attr("src", item.url);
            $photoItem.appendTo($photoContainer);
            $photoContainer.appendTo("div.deznav .deznav-scroll");
          });
          break;
        case "upload":
          clearLeftPanel();
          $("div.deznav .deznav-scroll").append(`
            <div class="p-2 position-sticky sticky-top" style="background: var(--hovertab);">
                <input type="file" id="imgaeSelect" name="userimage" hidden />
                <button
                  type="button"
                  class="w-100 btn btn-primary"
                  onclick="$('#imgaeSelect').trigger('click'); return true;"
                >
                  Upload Image
                </button>
            </div>   
          `);
          uploads.map(function (item) {
            const $uploadImageWrapper = $("<div>");
            const $uploadImage = $("<img>");
            $uploadImageWrapper.attr("class", "upload-image-component");
            $uploadImage.attr("data-index", item.id);

            $uploadImage.attr("src", item.url);
            $uploadImage.appendTo($uploadImageWrapper);
            $uploadImageWrapper.appendTo("div.deznav .deznav-scroll");
          });
          $("#imgaeSelect").change(function () {
            let fileInput = $.trim($(this).val());
            if (fileInput && fileInput !== "") {
              let fileName = "";
              fileName = $(this).val();

              let imageData = new FormData();
              imageData.append("userimage", $(this)[0].files[0]);
              $.ajax({
                url: "upload.php",
                type: "POST",
                processData: false,
                contentType: false,
                data: imageData,
                success: function (response) {
                  console.log(response);
                  let res = JSON.parse(response);

                  if (res.status) {
                    let uploadedFile = res.uploadedFile;
                    const $uploadImageWrapper = $("<div>");
                    const $uploadImage = $("<img>");
                    $uploadImageWrapper.attr("class", "upload-image-component");
                    $uploadImage.attr("data-index", uploadedFile.id);

                    $uploadImage.attr("src", uploadedFile.url);
                    $uploadImage.appendTo($uploadImageWrapper);
                    $uploadImageWrapper.appendTo("div.deznav .deznav-scroll");
                  } else {
                    console.log("Uuload image error: ", res.message);
                  }
                },
                error: function (xhr, status, error) {
                  console.log("Upload image error ", error);
                },
              });
            }
          });
          break;
        case "background":
          clearLeftPanel();
          // <div class="w-100 h-100">
          //   <svg
          //     stroke="currentColor"
          //     fill="currentColor"
          //     stroke-width="0"
          //     viewBox="0 0 512 512"
          //     height="1em"
          //     width="1em"
          //     xmlns="http://www.w3.org/2000/svg"
          //     style="width:100%; height:100%; mix-blend-mode: difference;"
          //   >
          //     <path d="M430.1 347.9c-6.6-6.1-16.3-7.6-24.6-9-11.5-1.9-15.9-4-22.6-10-14.3-12.7-14.3-31.1 0-43.8l30.3-26.9c46.4-41 46.4-108.2 0-149.2-34.2-30.1-80.1-45-127.8-45-55.7 0-113.9 20.3-158.8 60.1-83.5 73.8-83.5 194.7 0 268.5 41.5 36.7 97.5 55 152.9 55.4h1.7c55.4 0 110-17.9 148.8-52.4 14.4-12.7 12-36.6.1-47.7zM120 216c0-17.7 14.3-32 32-32s32 14.3 32 32-14.3 32-32 32-32-14.3-32-32zm40 126c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm64-161c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm72 219c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm24-208c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32z"></path>
          //   </svg>
          // </div>;
          $("div.deznav .deznav-scroll").append(`
            <div style="background-color: var(--hovertab);" class="d-flex justify-content-around align-items-center py-2 position-sticky sticky-top">
              <input id="backcolorpicker" class="bg-white" value="#ffffff" style="width:1.5rem; height:1.5rem; border:none"/>
              <div class="sample-color">
                <div class="w-100 h-100" style="background-color:white;"></div>
              </div>
              <div class="sample-color">
                <div class="w-100 h-100" style="background-color:var(--primary);"></div>
              </div>
              <div class="sample-color">
                <div class="w-100 h-100" style="background-color:rgb(255, 145, 77);"></div>
              </div>
              <div class="sample-color">
                <div class="w-100 h-100" style="background-color:rgb(126, 217, 87);"></div>
              </div>
              <div class="sample-color">
                <div class="w-100 h-100" style="background-color:rgb(255, 222, 89);"></div>
              </div>
              <div class="sample-color">
                <div class="w-100 h-100" style="background-color:rgb(203, 108, 230);"></div>
              </div>
              <div class="sample-color">
                <div class="w-100 h-100" style="background-color:rgba(0, 0, 0, 0);"></div>
              </div>
            </div>
          `);

          $("#backcolorpicker").asColorPicker({
            onChange: function (color) {
              $("#backcolorpicker").trigger("change", { color });
            },
            // color: "#00ff00",
            mode: "complex",
          });

          backgroundImages.map(function (item) {
            const $backgroundContainer = $("<div>");
            const $backgroundItem = $("<img>");
            $backgroundContainer.attr("class", "background-component");
            $backgroundItem.attr("data-index", item.id);

            $backgroundItem.attr("src", item.url);
            $backgroundItem.appendTo($backgroundContainer);
            $backgroundContainer.appendTo("div.deznav .deznav-scroll");
          });
          break;
      }
    });
  };

  var handleCurrentActive = function () {
    for (
      var nk = window.location,
        o = $("ul#menu a")
          .filter(function () {
            return this.href == nk;
          })
          .addClass("mm-active")
          .parent()
          .addClass("mm-active");
      ;

    ) {
      if (!o.is("li")) break;

      o = o.parent().addClass("mm-show").parent().addClass("mm-active");
    }
  };

  var handleCkEditor = function () {
    if (jQuery("#ckeditor").length > 0) {
      ClassicEditor.create(document.querySelector("#ckeditor"), {
        // toolbar: [ 'heading', '|', 'bold', 'italic', 'link' ]
      })
        .then((editor) => {
          window.editor = editor;
        })
        .catch((err) => {
          console.error(err.stack);
        });
    }
  };

  var handleMiniSidebar = function () {
    $("ul#menu>li").on("click", function () {
      const sidebarStyle = $("body").attr("data-sidebar-style");
      if (sidebarStyle === "mini") {
        console.log($(this).find("ul"));
        $(this).find("ul").stop();
      }
    });
  };

  var handleMinHeight = function () {
    var win_h = window.outerHeight;
    var win_h = window.outerHeight;
    if (win_h > 0 ? win_h : screen.height) {
      $(".content-body").css("min-height", win_h + 60 + "px");
    }
  };

  var handleDataAction = function () {
    $('a[data-action="collapse"]').on("click", function (i) {
      i.preventDefault(),
        $(this)
          .closest(".card")
          .find('[data-action="collapse"] i')
          .toggleClass("mdi-arrow-down mdi-arrow-up"),
        $(this).closest(".card").children(".card-body").collapse("toggle");
    });

    $('a[data-action="expand"]').on("click", function (i) {
      i.preventDefault(),
        $(this)
          .closest(".card")
          .find('[data-action="expand"] i')
          .toggleClass("icon-size-actual icon-size-fullscreen"),
        $(this).closest(".card").toggleClass("card-fullscreen");
    });

    $('[data-action="close"]').on("click", function () {
      $(this).closest(".card").removeClass().slideUp("fast");
    });

    $('[data-action="reload"]').on("click", function () {
      var e = $(this);
      e.parents(".card").addClass("card-load"),
        e
          .parents(".card")
          .append(
            '<div class="card-loader"><i class=" ti-reload rotate-refresh"></div>'
          ),
        setTimeout(function () {
          e.parents(".card").children(".card-loader").remove(),
            e.parents(".card").removeClass("card-load");
        }, 2000);
    });
  };

  var handleHeaderHight = function () {
    const headerHight = $(".header").innerHeight();
    $(window).scroll(function () {
      if (
        $("body").attr("data-layout") === "horizontal" &&
        $("body").attr("data-header-position") === "static" &&
        $("body").attr("data-sidebar-position") === "fixed"
      )
        $(this.window).scrollTop() >= headerHight
          ? $(".deznav").addClass("fixed")
          : $(".deznav").removeClass("fixed");
    });
  };

  var handleDzScroll = function () {
    jQuery(".dz-scroll").each(function () {
      var scroolWidgetId = jQuery(this).attr("id");
      const ps = new PerfectScrollbar("#" + scroolWidgetId, {
        wheelSpeed: 2,
        wheelPropagation: true,
        minScrollbarLength: 20,
      });
    });
  };

  var handleMenuTabs = function () {
    if (screenWidth <= 991) {
      jQuery(".menu-tabs .nav-link").on("click", function () {
        if (jQuery(this).hasClass("open")) {
          jQuery(this).removeClass("open");
          jQuery(".fixed-content-box").removeClass("active");
          jQuery(".hamburger").show();
        } else {
          jQuery(".menu-tabs .nav-link").removeClass("open");
          jQuery(this).addClass("open");
          jQuery(".fixed-content-box").addClass("active");
          jQuery(".hamburger").hide();
        }
        //jQuery('.fixed-content-box').toggleClass('active');
      });
      jQuery(".close-fixed-content").on("click", function () {
        jQuery(".fixed-content-box").removeClass("active");
        jQuery(".hamburger").removeClass("is-active");
        jQuery("#main-wrapper").removeClass("menu-toggle");
        jQuery(".hamburger").show();
      });
    }
  };

  var handleChatbox = function () {
    jQuery(".bell-link").on("click", function () {
      jQuery(".chatbox").addClass("active");
    });
    jQuery(".chatbox-close").on("click", function () {
      jQuery(".chatbox").removeClass("active");
    });
  };

  var handlePerfectScrollbar = function () {
    if (jQuery(".deznav-scroll").length > 0) {
      const qs = new PerfectScrollbar(".deznav-scroll");
    }
  };

  var handleBtnNumber = function () {
    $(".btn-number").on("click", function (e) {
      e.preventDefault();

      fieldName = $(this).attr("data-field");
      type = $(this).attr("data-type");
      var input = $("input[name='" + fieldName + "']");
      var currentVal = parseInt(input.val());
      if (!isNaN(currentVal)) {
        if (type == "minus") input.val(currentVal - 1);
        else if (type == "plus") input.val(currentVal + 1);
      } else {
        input.val(0);
      }
    });
  };

  var handleDzChatUser = function () {
    jQuery(".dz-chat-user-box .dz-chat-user").on("click", function () {
      jQuery(".dz-chat-user-box").addClass("d-none");
      jQuery(".dz-chat-history-box").removeClass("d-none");
    });

    jQuery(".dz-chat-history-back").on("click", function () {
      jQuery(".dz-chat-user-box").removeClass("d-none");
      jQuery(".dz-chat-history-box").addClass("d-none");
    });

    jQuery(".dz-fullscreen").on("click", function () {
      jQuery(".dz-fullscreen").toggleClass("active");
    });
  };

  var handleDzFullScreen = function () {
    jQuery(".dz-fullscreen").on("click", function (e) {
      if (
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      ) {
        /* Enter fullscreen */
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen(); /* IE/Edge */
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen(); /* Firefox */
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen(); /* Chrome, Safari & Opera */
        }
      } else {
        /* exit fullscreen */
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
          document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
          document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.msRequestFullscreen) {
          document.documentElement.msRequestFullscreen();
        }
      }
    });
  };

  var heartBlast = function () {
    $(".heart").on("click", function () {
      $(this).toggleClass("heart-blast");
    });
  };

  var handleshowPass = function () {
    jQuery(".show-pass").on("click", function () {
      jQuery(this).toggleClass("active");
      if (jQuery("#dlab-password").attr("type") == "password") {
        jQuery("#dlab-password").attr("type", "text");
      } else if (jQuery("#dlab-password").attr("type") == "text") {
        jQuery("#dlab-password").attr("type", "password");
      }
    });
  };

  var handleCustomFileInput = function () {
    $(".custom-file-input").on("change", function () {
      var fileName = $(this).val().split("\\").pop();
      $(this)
        .siblings(".custom-file-label")
        .addClass("selected")
        .html(fileName);
    });
  };

  var handleDzLoadMore = function () {
    $(".dz-load-more").on("click", function (e) {
      e.preventDefault(); //STOP default action
      $(this).append(' <i class="fa fa-refresh"></i>');

      var dzLoadMoreUrl = $(this).attr("rel");
      var dzLoadMoreId = $(this).attr("id");

      $.ajax({
        method: "POST",
        url: dzLoadMoreUrl,
        dataType: "html",
        success: function (data) {
          $("#" + dzLoadMoreId + "Content").append(data);
          $(".dz-load-more i").remove();
        },
      });
    });
  };
  var handleThemeMode = function () {
    jQuery(".dz-theme-mode").on("click", function () {
      jQuery(this).toggleClass("active");

      if (jQuery(this).hasClass("active")) {
        jQuery("body").attr("data-theme-version", "dark");
      } else {
        jQuery("body").attr("data-theme-version", "light");
      }
    });
  };

  /* Function ============ */
  return {
    init: function () {
      handleTheme();
      handleMetisMenu();
      handleAllChecked();
      handleNavigation();
      handleMiniSidebar();
      // handleMinHeight();
      handleDataAction();
      handleHeaderHight();
      handleDzScroll();
      handleMenuTabs();
      handleChatbox();
      handlePerfectScrollbar();
      handleBtnNumber();
      handleDzChatUser();
      handleDzFullScreen();
      heartBlast();
      handleshowPass();
      handleSelectPicker();
      handleCustomFileInput();
      handleDzLoadMore();
      handleCurrentActive();
      handleCkEditor();
      handleThemeMode();
    },

    load: function () {
      handleTheme();
      handleSelectPicker();
    },

    resize: function () {},
  };
})();

/* Document.ready Start */
jQuery(document).ready(function () {
  $('[data-toggle="popover"]').popover();
  ("use strict");
  Davur.init();

  var popoverTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="popover"]')
  );
  var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl);
  });
});
/* Document.ready END */

/* Window Load START */
jQuery(window).on("load", function () {
  "use strict";
  Davur.load();
});
/*  Window Load END */
/* Window Resize START */
jQuery(window).on("resize", function () {
  "use strict";
  Davur.resize();
});
/*  Window Resize END */
