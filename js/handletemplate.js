var TemplateNav = (function () {
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
          case "templates":
            clearLeftPanel();
            $("#template-content").text("");

            $(".deznav .deznav-scroll").append(`
                <button type="button" class="btn btn-primary w-100">All templates</button>
            `);

            templates.forEach((template) => {
              $("#template-content").append(`
              <div class="col-xl-2 col-xxl-3 col-md-4 col-sm-6 template-item" data-id=${template.id}>
                <div class="card">
                  <div class="card-body product-grid-card">
                    <div class="new-arrival-product position-relative">
                      <div class="new-arrivals-img-contnent">
                        <img
                          class="img-fluid"
                          src="${template.thumbnail}"
                          alt="template thumbnail"
                        />
                      </div>
                      <div style="transform: translate(-50%, -50%);"  class="d-flex flex-column justify-content-center align-items-center position-absolute top-50 start-50 w-50 d-none handle-template">
                        <a href="dashboard.php?id=${template.id}&type=template" class="w-100"><button class="btn btn-primary btn-xs my-1 w-100">Edit</button></a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            `);
            });

            $(".template-item").hover(
              function () {
                $(this).find(".handle-template").removeClass("d-none");
              },
              function () {
                $(this).find(".handle-template").addClass("d-none");
              }
            );
            break;

          case "projects":
            clearLeftPanel();
            $("#template-content").text("");

            $(".deznav .deznav-scroll").append(`
                <button type="button" class="btn btn-primary w-100">Create New</button>
                <button id="loadprojects" type="button" class="btn btn-primary w-100">All projects</button>
            `);

            projects.forEach((project) => {
              $("#template-content").append(`
                <div class="col-xl-2 col-xxl-3 col-md-4 col-sm-6 projcet-item" data-id=${project.id}>
                  <div class="card">
                    <div class="card-body product-grid-card">
                      <div class="new-arrival-product">
                        <div class="new-arrivals-img-contnent position-relative">
                          <img
                            class="img-fluid"
                            src="${project.thumbnail}"
                            alt="project thumbnail"
                          />
                        </div>
                        <div style="transform: translate(-50%, -50%);"  class="d-flex flex-column justify-content-center align-items-center position-absolute top-50 start-50 w-50 d-none handle-project">
                          <a href="dashboard.php?id=${project.id}&type=project" class="w-100"><button class="btn btn-primary btn-xs my-1 w-100">Edit</button></a>
                          <a href="dashboard.php" class="w-100"><button class="btn btn-danger btn-xs w-100 my-1">Remove</button></a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              `);
            });

            $(".projcet-item").hover(
              function () {
                $(this).find(".handle-project").removeClass("d-none");
              },
              function () {
                $(this).find(".handle-project").addClass("d-none");
              }
            );
            break;
          case "text":
            // clearLeftPanel();
            break;
        }
      }
    });
  };

  return {
    init: function () {
      handleNavigation();
      $(".tool-tab[data-tab='project']").trigger("click");
    },
  };
})();

/* Document.ready Start */
jQuery(document).ready(function () {
  $('[data-toggle="popover"]').popover();
  ("use strict");
  TemplateNav.init();
});
