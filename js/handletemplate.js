var TemplateNav = (function () {
  var clearLeftPanel = function () {
    $("div.deznav .deznav-scroll").text("");
  };

  var handleNavigation = function () {
    $(".tool-tab").on("click", function () {
      if ($(this).hasClass("active")) {
        // $("#main-wrapper").addClass("menu-toggle");
      } else {
        // $("#main-wrapper").removeClass("menu-toggle");
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
        case "templates":
          clearLeftPanel();
          $("#template-content").text("");

          $(".deznav .deznav-scroll").append(`
                <button type="button" class="btn btn-primary w-100">All templates</button>
            `);

          templates.forEach((template) => {
            $("#template-content").append(`
              <div class="col-xl-2 col-xxl-3 col-md-4 col-sm-6 template-item" data-type="template" data-id=${template.id}>
                <div class="card">
                  <div class="card-body product-grid-card">
                    <div class="new-arrival-product position-relative q-100">
                      <div class="new-arrivals-img-contnent">
                        <img
                          class="img-fluid"
                          src="${template.thumbnail}"
                          alt="template thumbnail"
                        />
                      </div>
                      <div style="background: #343a40a8; transform: translate(-50%, -50%);" class="d-flex flex-column justify-content-center align-items-center position-absolute top-50 start-50 w-100 h-100 d-none handle-template">
                        <a href="dashboard.php?id=${template.id}&type=template" class="w-50"><button class="btn btn-primary btn-xs my-1 w-100">Edit</button></a>
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

          $("#template-content").append(`
            <div class="row page-titles">
                <ol class="breadcrumb w-100 d-flex justify-content-end">
                    <li class="breadcrumb-item"><a href="javascript:void(0)"><button class="btn btn-primary">New Project</button></a></li>
                </ol>
            </div>
          `);

          projects.forEach((project) => {
            $("#template-content").append(`
                <div class="col-xl-2 col-xxl-3 col-md-4 col-sm-6 projcet-item" data-type="project" data-id=${project.id}>
                  <div class="card">
                    <div class="card-body product-grid-card">
                      <div class="new-arrival-product w-100">
                        <div class="new-arrivals-img-contnent position-relative">
                          <img
                            class="img-fluid"
                            src="${project.thumbnail}"
                            alt="project thumbnail"
                          />
                        </div>
                        <div style="background: #343a40a8; transform: translate(-50%, -50%);" class="d-flex flex-column justify-content-center align-items-center position-absolute top-50 start-50 w-100 h-100 d-none handle-project">
                          <a href="dashboard.php?id=${project.id}&type=project" class="w-50"><button class="btn btn-primary btn-xs my-1 w-100">Edit</button></a>
                          <button class="btn btn-danger sweet-success-cancel btn-xs w-50 my-1">Remove</button>
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

          $(".sweet-success-cancel").on("click", function () {
            const ele = $(this).parent().parent().parent().parent().parent();
            const id = ele.data("id");
            const type = ele.data("type");

            Swal.fire({
              title: "Are you sure to delete ?",
              text: "You will not be able to recover this project!",
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "Yes, delete it !",
              cancelButtonText: "No, cancel it !",
              showLoaderOnConfirm: true,
              preConfirm: () => {
                return $.ajax({
                  url: "delete.php",
                  type: "POST",
                  dataType: "JSON",
                  data: { id, type },
                  success: function (response) {
                    $(
                      `#template-content [data-id=${id}][data-type='${type}']`
                    ).remove();
                    return response;
                  },
                  error: function (xhr, status, error) {
                    Swal.showValidationMessage(`Request failed: ${error}`);
                  },
                });
              },
              allowOutsideClick: () => !Swal.isLoading(),
            }).then((result) => {
              if (result.value.status) {
                Swal.fire({
                  title: "Project removed successfully!",
                  text: result.value.message,
                  type: "success",
                });
              }
            });
          });
          break;
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
