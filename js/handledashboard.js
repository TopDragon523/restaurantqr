var DashboardNav = (function () {
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

      var isClosedLeftPanel = $("#main-wrapper").hasClass("menu-toggle");
      if (isClosedLeftPanel) {
        clearLeftPanel();
      } else {
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
            $("div.deznav .deznav-scroll").append(`
            <div
              class="p-2 position-sticky sticky-top"
              style="background: var(--hovertab);"
            >
              <button
                type="button"
                class="text-component w-100 btn btn-outline-dark btn-lg mb-2"
                data-size="0"
              >
                Create header
              </button>
              <button
                type="button"
                class="text-component w-100 btn btn-outline-dark btn-sm mb-2"
                data-size="1"
              >
                Create subheader
              </button>
              <button
                type="button"
                class="text-component w-100 btn btn-outline-dark btn-xs"
                data-size="2"
              >
                Create bodytext
              </button>
            </div>
          `);

            // textComponents.map(function (item) {
            //   const $textItem = $("<div>");
            //   $textItem.attr("class", "text-component");
            //   $textItem.attr("data-index", item.id);
            //   $textItem.css({
            //     color: item.color,
            //     fontSize: item.fontSize,
            //     fontFamily: item.fontFamily,
            //   });

            //   $textItem.html(item.label);
            //   $textItem.appendTo("div.deznav .deznav-scroll");
            // });
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
                  class="w-100 btn btn-outline-dark"
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
                    let res = JSON.parse(response);

                    if (res.status) {
                      let uploadedFile = res.uploadedFile;
                      uploads.push({
                        ...uploadedFile,
                        id: parseInt(uploadedFile.id),
                      });
                      const $uploadImageWrapper = $("<div>");
                      const $uploadImage = $("<img>");
                      $uploadImageWrapper.attr(
                        "class",
                        "upload-image-component"
                      );
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
            $("div.deznav .deznav-scroll").append(`
            <div style="background-color: var(--hovertab);" class="d-flex justify-content-around align-items-center py-2 position-sticky sticky-top">
              <div id="backcolorpicker" class="bg-white" value="#ffffff" style="width:1.5rem; height:1.5rem; border:none"></div>
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
      }
    });
  };

  var clearLeftPanel = function () {
    $("div.deznav .deznav-scroll").text("");
  };

  return {
    init: function () {
      handleNavigation();
    },
  };
})();

/* Document.ready Start */
jQuery(document).ready(function () {
  $('[data-toggle="popover"]').popover();
  ("use strict");
  DashboardNav.init();
});
