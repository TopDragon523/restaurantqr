$(function () {
  const paper = { width: 499, height: 709 };
  let step = 1;
  let logoUrl;
  let menuDescription;
  let x1, y1, x2, y2;
  let templateId = templates.length === 0 ? 0 : templates[0].id;
  let nodeList = { Text: 1, Image: 2 };
  let width = $("#stage").width();
  let height = $("#stage").height();
  let screenScale = { x: 1, y: 1 };
  let relativeScale = 1;
  let relativeScaleTemp = 1;

  relativeScaleTemp = Math.max(
    Math.max(paper.width / width, 1),
    Math.max(paper.height / height, 1)
  );

  if (relativeScaleTemp > 1) {
    if (paper.width / width > paper.height / height) {
      relativeScale = width / paper.width;
    } else {
      relativeScale = height / paper.height;
    }
  } else {
    relativeScale = 1;
  }

  // create stage
  let stage = new Konva.Stage({
    container: "stage",
    width,
    height,
  });

  // create layers
  let layer = new Konva.Layer({ listening: true });

  // create white rectangle at most bootom of layer
  let whiteRect = new Konva.Image({
    x: (width * screenScale.x) / 2 - (paper.width * relativeScale) / 2,
    y: (height * screenScale.y) / 2 - (paper.height * relativeScale) / 2,
    width: paper.width * relativeScale,
    height: paper.height * relativeScale,
    fill: "white",
    image: null,
    listening: false,
  });

  // create the group including all shapes
  let shapeGroup = new Konva.Group({
    x: width / 2 - (paper.width * relativeScale) / 2,
    y: height / 2 - (paper.height * relativeScale) / 2,
    width: paper.width * relativeScale,
    height: paper.height * relativeScale,
  });

  //create mask rectangle with rectanlge hole
  let maskRect = new Konva.Shape({
    x: 0,
    y: 0,
    listening: false,
    sceneFunc: function (context) {
      let scaledWidth = width * screenScale.x;
      let scaledHeight = height * screenScale.y;
      let scaledPaper = {
        width: paper.width * relativeScale,
        height: paper.height * relativeScale,
      };

      context.beginPath();
      context.rect(0, 0, scaledWidth, scaledHeight);

      context.moveTo(
        scaledWidth / 2 - scaledPaper.width / 2,
        scaledHeight / 2 - scaledPaper.height / 2
      );
      context.lineTo(
        scaledWidth / 2 - scaledPaper.width / 2,
        scaledHeight / 2 + scaledPaper.height / 2
      );
      context.lineTo(
        scaledWidth / 2 + scaledPaper.width / 2,
        scaledHeight / 2 + scaledPaper.height / 2
      );
      context.lineTo(
        scaledWidth / 2 + scaledPaper.width / 2,
        scaledHeight / 2 - scaledPaper.height / 2
      );
      context.closePath();
      context.fillStrokeShape(this);
    },
    fill: "lightgrey",
    opacity: 0.8,
  });

  // create selection transformer
  let selectionTr = new Konva.Transformer({
    borderStroke: "#00a1ff",
    borderStrokeWidth: 2,
    anchorStroke: "#00a1ff",
    anchorStrokeWidth: 2,
    rotationSnaps: [0, 45, 90, 135, 180, -45, -90, -135],
    flipEnabled: false,
  });

  // create rectangle to select shapes
  let selectionRectangle = new Konva.Rect({
    x: -1,
    y: -1,
    width: 0,
    height: 0,
    fill: "#9ad1e7",
    stroke: "#1071ea",
    opacity: 0.5,
    visible: false,
  });

  // set ordering layer
  stage.add(layer);
  layer.add(whiteRect);
  layer.add(shapeGroup);
  layer.add(maskRect);
  layer.add(selectionRectangle);
  layer.add(selectionTr);

  // load saved stage  from php
  if (id !== undefined && id !== null && type !== undefined && type !== null) {
    loadStage();
  }

  function loadStage() {
    let selectedTemplate;
    templateId = id; // from dashboard.php file
    switch (type) {
      case "template":
        [selectedTemplate] = templates.filter((template) => {
          return template.id === templateId;
        });
        break;
      case "project":
        [selectedTemplate] = projects.filter((project) => {
          return project.id === templateId;
        });
        break;
    }
    let savedStage = JSON.parse(selectedTemplate.save_stage_as_json);
    initStage();

    savedStage.shapeGroup.forEach((node) => {
      switch (node.className) {
        case "Text":
          let textNode = Konva.Node.create(JSON.stringify(node), shapeGroup);
          createTextNode(textNode);
          break;
        case "Image":
          let imageObj = new Image();
          imageObj.setAttribute("crossOrigin", "anonymous");
          imageObj.src = node.src;
          let imageNode = new Konva.Image({
            ...node.attrs,
            image: imageObj,
          });
          createImageNode(imageNode);
          break;
        default:
          break;
      }
    });

    whiteRect.fill(savedStage.whiteRect.fill);
    if (
      savedStage.backgroundUrl !== null &&
      savedStage.backgroundUrl !== undefined
    ) {
      let bgImageObj = new Image();
      bgImageObj.setAttribute("crossOrigin", "anonymous");
      bgImageObj.src = savedStage.backgroundUrl;
      whiteRect.image(bgImageObj);
    }
    layer.batchDraw();
  }

  // clicks should select/deselect shapes
  stage.on("mousedown touchstart", (e) => {
    // do nothing if we mousedown on any shape
    if (e.target !== stage) {
      return;
    }
    e.evt.preventDefault();
    x1 = stage.getPointerPosition().x;
    y1 = stage.getPointerPosition().y;
    x2 = stage.getPointerPosition().x;
    y2 = stage.getPointerPosition().y;

    selectionRectangle.visible(true);
    selectionRectangle.width(0);
    selectionRectangle.height(0);
  });

  stage.on("mousemove touchmove", (e) => {
    // do nothing if we didn't start selection
    if (!selectionRectangle.visible()) {
      return;
    }
    e.evt.preventDefault();
    x2 = stage.getPointerPosition().x;
    y2 = stage.getPointerPosition().y;

    selectionRectangle.setAttrs({
      x: Math.min(x1, x2),
      y: Math.min(y1, y2),
      width: Math.abs(x2 - x1),
      height: Math.abs(y2 - y1),
    });
    layer.batchDraw();
  });

  stage.on("mouseup touchend", (e) => {
    if (!selectionRectangle.visible()) {
      return;
    }

    e.evt.preventDefault();

    setTimeout(() => {
      selectionRectangle.visible(false);
    });

    let shapes = shapeGroup.getChildren();
    let box = selectionRectangle.getClientRect();

    // reset selectioni rectangle
    selectionRectangle.x(-1);
    selectionRectangle.y(-1);

    // only check selected  shapes  when mousemove event only
    if (box.x !== -2 && box.y !== -2) {
      let selected = shapes.filter((shape) =>
        Konva.Util.haveIntersection(box, shape.getClientRect())
      );

      if (selected.length === 1) {
        const nodeType = selected[0].getClassName();
        handleTransformer(nodeList[nodeType]);
      } else {
        handleTransformer(0);
      }
      selectionTr.nodes(selected);
      selectionTr.show();
    }
  });

  stage.on("click touchstart", function (e) {
    console.log("click target event ", e.target.getClassName());
    if (selectionRectangle.width() !== 0 || selectionRectangle.height() !== 0) {
      return;
    }

    if (e.target.getClassName() == "Stage") {
      deselectAllComponents();
      return;
    }
    // // do we pressed shift or ctrl?
    // const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
    // const isSelected = selectionTr.nodes().indexOf(e.target) >= 0;
  });

  // handle the transformer
  selectionTr.on("transform dragmove", function () {
    if (this.nodes().length === 1) {
      const selectedNode = this.nodes()[0];
      const nodeType = selectedNode.getClassName();

      switch (nodeType) {
        case "Text":
          // showControlPanel();
          // console.log("transformer listis changed  ", selectedNode.attrs);
          break;
        default:
          break;
      }
    }
  });

  // handle the toolbox tab
  $("body").delegate(".project-component img", "click", function () {
    let savedStage = $(this).data("config");
    initStage();

    savedStage.shapeGroup.forEach((node) => {
      switch (node.className) {
        case "Text":
          let textNode = Konva.Node.create(JSON.stringify(node), shapeGroup);
          createTextNode(textNode);
          break;
        case "Image":
          let imageObj = new Image();
          imageObj.setAttribute("crossOrigin", "anonymous");
          imageObj.src = node.src;
          let imageNode = new Konva.Image({
            ...node.attrs,
            image: imageObj,
          });
          createImageNode(imageNode);
          break;
        default:
          break;
      }
    });

    whiteRect.fill(savedStage.whiteRect.fill);

    if (
      savedStage.backgroundUrl !== null &&
      savedStage.backgroundUrl !== undefined
    ) {
      let bgImageObj = new Image();
      bgImageObj.setAttribute("crossOrigin", "anonymous");
      bgImageObj.src = savedStage.backgroundUrl;
      whiteRect.image(bgImageObj);
    }
    layer.batchDraw();
  });

  $("body").delegate(".demo-component img", "click", function () {
    let savedStage = $(this).data("config");
    templateId = $(this).data("index");
    initStage();

    savedStage.shapeGroup.forEach((node) => {
      switch (node.className) {
        case "Text":
          let textNode = Konva.Node.create(JSON.stringify(node), shapeGroup);
          createTextNode(textNode);
          break;
        case "Image":
          let imageObj = new Image();
          imageObj.setAttribute("crossOrigin", "anonymous");
          imageObj.src = node.src;
          let imageNode = new Konva.Image({
            ...node.attrs,
            image: imageObj,
          });
          createImageNode(imageNode);
          break;
        default:
          break;
      }
    });

    whiteRect.fill(savedStage.whiteRect.fill);

    if (
      savedStage.backgroundUrl !== null &&
      savedStage.backgroundUrl !== undefined
    ) {
      let bgImageObj = new Image();
      bgImageObj.setAttribute("crossOrigin", "anonymous");
      bgImageObj.src = savedStage.backgroundUrl;
      whiteRect.image(bgImageObj);
    }
    layer.batchDraw();
  });

  $("body").delegate(".text-component", "click", function () {
    const index = $(this).data("size");

    const component = textComponents[index];

    let textNode = new Konva.Text({
      text: component.label,
      x: (paper.width / 2 - 200) * relativeScale,
      y: (paper.height / 2 - component.fontSize) * relativeScale,
      fontSize: component.fontSize * relativeScale,
      fontFamily: component.fontFamily,
      draggable: true,
      width: 400 * relativeScale,
      fill: component.color,
    });
    textNode.align("center");

    deselectAllComponents();
    handleTransformer(1);
    selectionTr.nodes([textNode]);
    selectionTr.show();
    showControlPanel();

    createTextNode(textNode);
  });

  $("body").delegate(".photo-component img", "click", function () {
    const index = parseInt($(this).data("index"));
    const [img] = photos.filter(function (item) {
      return item.id === index;
    });

    let imageObj = new Image();
    imageObj.setAttribute("crossOrigin", "anonymous");
    imageObj.src = img.url;
    imageObj.onload = function () {
      imageObj.width = this.width;
      imageObj.height = this.height;

      let imageNode = new Konva.Image({
        x:
          (paper.width * relativeScale) / 2 -
          (imageObj.width * relativeScale) / 2,
        y:
          (paper.height * relativeScale) / 2 -
          (imageObj.height * relativeScale) / 2,
        image: imageObj,
        scale: { x: relativeScale, y: relativeScale },
        draggable: true,
      });

      handleTransformer(2);
      selectionTr.nodes([imageNode]);
      selectionTr.show();

      createImageNode(imageNode);
    };
  });

  $("body").delegate(".upload-image-component img", "click", function () {
    const index = parseInt($(this).data("index"));
    const [img] = uploads.filter(function (item) {
      return item.id === index;
    });

    let imageObj = new Image();
    imageObj.setAttribute("crossOrigin", "anonymous");
    imageObj.src = img.url;
    imageObj.onload = function () {
      imageObj.width = this.width;
      imageObj.height = this.height;

      let imageNode = new Konva.Image({
        x:
          (paper.width * relativeScale) / 2 -
          (imageObj.width * relativeScale) / 2,
        y:
          (paper.height * relativeScale) / 2 -
          (imageObj.height * relativeScale) / 2,
        image: imageObj,
        scale: { x: relativeScale, y: relativeScale },
        draggable: true,
      });

      handleTransformer(2);
      selectionTr.nodes([imageNode]);
      selectionTr.show();

      createImageNode(imageNode);
    };
  });

  $("body").delegate(".background-component img", "click", function () {
    const index = parseInt($(this).data("index"));
    const [img] = backgroundImages.filter(function (item) {
      return item.id == index;
    }); // from init-component file

    let bgImageObj = new Image();
    bgImageObj.setAttribute("crossOrigin", "anonymous");
    bgImageObj.src = img.url;
    whiteRect.image(bgImageObj);
  });

  $("body").delegate(".sample-color", "click", function () {
    const whiteRectBackColor = $(this)
      .children()
      .first()
      .css("background-color");
    $("#backcolorpicker").asColorPicker("set", whiteRectBackColor);

    whiteRect.setAttrs({
      fill: whiteRectBackColor,
      image: null,
    });
  });

  $("body").delegate("#backcolorpicker", "asColorPicker::init", function (e) {
    // if (whiteRect.image() == null) {
    const backColor = whiteRect.fill();
    console.log("asdfasdf", backColor);
    $("#backcolorpicker").asColorPicker("set", "red");
    // }
  });

  $("body").delegate("#backcolorpicker", "asColorPicker::change", function (e) {
    const whiteRectBackColor = $("#backcolorpicker").asColorPicker("get");

    whiteRect.setAttrs({
      fill: whiteRectBackColor,
      image: null,
    });
  });

  // resize window screen
  $(window).on("resize", function () {
    redraw();
  });

  // publish the template adn project
  $("body").delegate("#savetemplate", "click", function () {
    publish($(this).attr("id"));
  });

  // save as image
  $("body").delegate("#saveimage", "click", function () {
    saveAsImage();
  });

  // save as pdf file
  $("body").delegate("#savepdf", "click", function () {
    saveAsPDF();
  });

  // save as  qrcode
  $("body").delegate("#saveqr", "click", function () {
    step = 1;
    selectLogo();
    step++;
  });

  $("body").delegate("#selectlogo", "click", function () {
    switch (step) {
      case 2:
        saveAsQR();
        step++;
        break;
      case 3:
        downloadQR();
        break;
    }
  });

  // pervent the default  browser zooming by mouse wheel
  stage.container().addEventListener("wheel", function (e) {
    if (e.shiftKey) {
      return;
    }
    e.preventDefault();
  });

  // remove selected  nodes
  document.addEventListener("keydown", function (event) {
    const keyCode = event.keyCode;
    if (keyCode === 46 && selectionTr.nodes().length > 0) {
      selectionTr.nodes().map(function (node) {
        node.destroy();
      });
      selectionTr.hide();
    }
  });

  $("body").delegate(".tool-tab", "click", function () {
    redraw();
  });

  function handleTransformer(index) {
    // selectionnode : 0
    // textnode : 1
    // imagenode : 2
    switch (index) {
      case 0:
        selectionTr.setAttrs({
          enabledAnchors: [
            "top-left",
            "top-right",
            "bottom-left",
            "bottom-right",
          ],
        });
        break;
      case 1:
        selectionTr.setAttrs({
          enabledAnchors: [
            "top-left",
            "top-right",
            "bottom-left",
            "bottom-right",
            "middle-left",
            "middle-right",
          ],
        });
        break;
      case 2:
        selectionTr.setAttrs({
          enabledAnchors: [
            "top-left",
            "top-right",
            "bottom-left",
            "bottom-right",
            "middle-left",
            "middle-right",
            "top-center",
            "bottom-center",
          ],
        });
        break;
    }
  }

  function deselectAllComponents() {
    selected = [];
    selectionTr.hide();
    selectionTr.nodes([]);
    selectionTr.forceUpdate();
    hideControlPanel();
  }

  function createTextNode(textNode) {
    let textarea;
    shapeGroup.add(textNode);
    if (selectionTr.nodes().length > 0) {
      showControlPanel();
    }

    function handleOutsideClick(e) {
      if (e.target !== textarea) {
        removeTextarea(textarea);
      }
    }

    function removeTextarea(textarea) {
      textarea.parentNode.removeChild(textarea);
      window.removeEventListener("click", handleOutsideClick);
      textNode.show();
    }

    textNode.on("dragmove touchmove", function (e) {
      selectionTr.show();
      if (!selectionTr.nodes().includes(this)) {
        handleTransformer(1);
        selectionTr.nodes([this]);
      }
      selectionTr.fire("dragmove");
      layer.batchDraw(); //prevent redrawing too much
    });

    textNode.on("transform", function () {
      const activeAnchor = selectionTr.getActiveAnchor();
      const changedWidth = this.width() * this.scaleX();
      const changedFontSize = this.fontSize() * this.scaleX();

      switch (activeAnchor) {
        case "top-left":
        case "top-right":
        case "bottom-left":
        case "bottom-right":
          textNode.setAttrs({
            width: changedWidth,
            fontSize: changedFontSize,
          });
          $("#fontsizecontrol").val(parseInt(changedFontSize));
          break;
        case "middle-left":
        case "middle-right":
          this.width(Math.max(this.fontSize(), this.width() * this.scaleX()));
          break;
        case "rotator":
          break;
      }
      this.scaleX(1);
      this.scaleY(1);
      selectionTr.forceUpdate();
      layer.batchDraw();
    });

    textNode.on("click touchstart", function (e) {
      console.log("Text node is clicked ", this);
      handleTransformer(1);
      selectionTr.forceUpdate();
      const isSelected = selectionTr.nodes().includes(e.target);
      if (!isSelected) {
        deselectAllComponents();
        selectionTr.nodes([this]);
        selectionTr.show();
        showControlPanel();
      } else {
        textNode.hide();

        let textPosition = textNode.absolutePosition();
        let areaPosition = {
          x: textPosition.x * relativeScale,
          y: textPosition.y * relativeScale,
        };

        textarea = document.createElement("textarea");
        document.getElementById("stage").appendChild(textarea);

        textarea.id = "editkonvatext";
        textarea.value = textNode.text();
        textarea.style.position = "absolute";
        textarea.style.top = areaPosition.y + "px";
        textarea.style.left = areaPosition.x + "px";
        textarea.style.width =
          (textNode.width() - textNode.padding() * 2) * relativeScale + "px";
        textarea.style.height =
          (textNode.height() - textNode.padding() * 2 + 5) * relativeScale +
          "px";
        textarea.style.fontSize = textNode.fontSize() * relativeScale + "px";
        textarea.style.border = "none";
        textarea.style.padding = "0px";
        textarea.style.margin = "0px";
        textarea.style.overflow = "hidden";
        textarea.style.background = "none";
        textarea.style.outline = "none";
        textarea.style.resize = "none";
        textarea.style.lineHeight = textNode.lineHeight();
        textarea.style.fontFamily = textNode.fontFamily();
        textarea.style.transformOrigin = "left top";
        textarea.style.textAlign = textNode.align();
        textarea.style.color = textNode.fill();
        rotation = textNode.rotation();
        let transform = "";
        if (rotation) {
          transform += "rotateZ(" + rotation + "deg)";
        }

        let px = 0;
        let isFirefox =
          navigator.userAgent.toLowerCase().indexOf("firefox") > -1;

        if (isFirefox) {
          px += 2 + Math.round(textNode.fontSize() / 20);
        }
        transform += "translateY(-" + px + "px)";

        textarea.style.transform = transform;
        textarea.focus();

        textarea.addEventListener("input", function (e) {
          e.preventDefault();
          textarea.style.height = "auto";
          if (textarea.clientHeight >= textarea.scrollHeight) {
            textarea.style.height =
              textarea.scrollHeight - textNode.fontSize() + "px";
          } else {
            textarea.style.height = textarea.scrollHeight + "px";
          }

          textNode.text(textarea.value);
          selectionTr.forceUpdate();
        });

        setTimeout(() => {
          window.addEventListener("click", handleOutsideClick);
        });
      }
    });
  }

  function createImageNode(imageNode) {
    shapeGroup.add(imageNode);

    imageNode.on("dragmove", function () {
      selectionTr.show();
      if (!selectionTr.nodes().includes(this)) {
        handleTransformer(2);
        selectionTr.nodes([this]);
      }
      selectionTr.fire("dragmove");
      layer.batchDraw(); //prevent redrawing too much
    });

    imageNode.on("transform", function () {});

    imageNode.on("click touchend", function (e) {
      console.log("image node is clicked ", this);
      handleTransformer(2);
      deselectAllComponents();
      selectionTr.nodes([this]);
      selectionTr.show();
      imageNode.show();
      selectionTr.forceUpdate();
    });
  }

  function initStage() {
    selectionTr.hide();
    shapeGroup.destroyChildren();
    whiteRect.setAttrs({ image: null });
  }

  function publish(flag) {
    const destination = `${flag}.php`;
    // get current status and thumbnail image
    let data = getCurrentStatusJson();
    let dataUrl = getThumbnail();

    //save stage on db
    $.ajax({
      url: destination,
      type: "POST",
      dataType: "JSON",
      data: { data: JSON.stringify(data), thumbnail: dataUrl },
      success: function (response) {
        let newDemo = response.newDemo;

        templates.push({
          id: JSON.parse(newDemo.id),
          createdAt: newDemo.createdAt,
          if_free: newDemo.is_free,
          save_stage_as_json: newDemo.save_stage_as_json,
          thumbnail: newDemo.thumbnail,
        });

        let currentTab = $(".left-panel")
          .find("div.tool-tab.active")
          .first()
          .text()
          .trim()
          .toLowerCase();

        if (currentTab === "demo") {
          const $demoItemContainer = $("<div>");
          const $demoItem = $("<img>");
          $demoItemContainer.attr("class", "demo-component");
          $demoItem.attr("data-index", parseInt(newDemo.id));
          $demoItem.attr("src", newDemo.thumbnail);
          $demoItem.attr("data-config", newDemo.save_stage_as_json);

          $demoItem.appendTo($demoItemContainer);
          $demoItemContainer.appendTo("div.deznav .deznav-scroll");
        }
      },
      error: function (xhr, status, error) {
        console.log("Save stage on db error ", error);
      },
    });
  }

  function saveAsImage() {
    // download  image
    let dataUrl = stage.toDataURL({
      x: (width * screenScale.x) / 2 - (paper.width * relativeScale) / 2,
      y: (height * screenScale.y) / 2 - (paper.height * relativeScale) / 2,
      width: paper.width * relativeScale,
      height: paper.height * relativeScale,
      imageSmoothingEnabled: true,
      pixelRatio: 10,
    });

    let link = document.createElement("a");
    link.download = "stage_" + new Date() + ".png";
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    delete link;
  }

  function saveAsPDF() {
    let dataUrl = stage.toDataURL({
      x: (width * screenScale.x) / 2 - (paper.width * relativeScale) / 2,
      y: (height * screenScale.y) / 2 - (paper.height * relativeScale) / 2,
      width: paper.width * relativeScale,
      height: paper.height * relativeScale,
      imageSmoothingEnabled: true,
      pixelRatio: 5,
    });

    // download pdf file
    let pdf = new jsPDF("p", "px", [paper.width, paper.height]);
    pdf.addImage(dataUrl, "JPG", 0, 0, paper.width, paper.height);
    pdf.save(`stage-${new Date()}.pdf`);
  }

  function selectLogo() {
    $("#exampleModalCenter .modal-body #qrcode").text("");
    $("#exampleModalCenter .modal-body #menulogo").html(`
      <div class="row">
        <label class="col-lg-4 col-form-label" for="validationCustom04">Add Logo <span class="text-danger">*</span>
        </label>
        <label class="label m-auto w-auto btn btn-primary mb-2">
          <input id="imgInp" type="file" required />
          <span>Add</span>
        </label>
      </div>
      <img id="blah" src="#" class="w-50 m-auto" hidden />
      <div class="row">
        <label class="col-lg-4 col-form-label" for="menudescription">Description <span class="text-danger">*</span>
        </label>
        <div class="col-lg-6">
          <textarea class="form-control" id="menudescription" rows="5" placeholder="What would you like to see?" required></textarea>
          <div class="invalid-feedback">
            Please enter a description.
          </div>
        </div>
      </div>
    `);
    $("#imgInp").change(function () {
      readURL(this);
    });

    $("#menudescription").on("input", function () {
      console.log("Hello worldasdfasdf");
      menuDescription = $(this).val();
    });

    function readURL(input) {
      if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
          $("#blah").removeAttr("hidden");
          $("#blah").attr("src", e.target.result);
          logoUrl = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
        $("#exampleModalCenter .label span").text("Change");
      }
    }
  }

  function saveAsQR() {
    $("#qrcode").html(`
      <div id="qrloading"></div>
    `);
    const sn = generateToken(8);

    // get current status and thumbnail image
    let data = getCurrentStatusJson();
    let dataUrl = getThumbnail();
    //save stage on db
    $.ajax({
      url: "saveqrcode.php",
      type: "POST",
      dataType: "JSON",
      data: { data: JSON.stringify(data), thumbnail: dataUrl, sn, templateId },
      success: function (response) {
        console.log("response", response);
        // add new project on project list
        let newDemo = response.newProject;
        projects.push({
          id: JSON.parse(newDemo.id),
          createdBy: newDemo.is_free,
          createdAt: newDemo.createdAt,
          save_stage_as_json: newDemo.save_stage_as_json,
          thumbnail: newDemo.thumbnail,
        });
        let currentTab = $(".left-panel")
          .find("div.tool-tab.active")
          .first()
          .text()
          .trim()
          .toLowerCase();
        if (currentTab === "project") {
          const $demoItemContainer = $("<div>");
          const $demoItem = $("<img>");
          $demoItemContainer.attr("class", "project-component");
          $demoItem.attr("data-index", parseInt(newDemo.id));
          $demoItem.attr("src", newDemo.thumbnail);
          $demoItem.attr("data-config", newDemo.save_stage_as_json);
          $demoItem.appendTo($demoItemContainer);
          $demoItemContainer.appendTo("div.deznav .deznav-scroll");
        }
        // generate QR code
        $("#qrcode").text("");
        $("#exampleModalCenter .modal-body #menulogo").text("");

        // generateQR(`https://restaurantqrmenu.ddns.net/guest.php?id=${sn}`);
        generateQR(`http://192.168.121.13/restaurantqr/guest.php?id=${sn}`);

        $("#exampleModalCenter .modal-body #menulogo").prepend(
          `<h4 class="mb-5 mx-auto text-center">to veiw our menu<br>Scan this QR Code</h4>`
        );
        $("#exampleModalCenter .modal-body #menulogo").prepend(
          `<h2 class="mt-5 mx-auto text-warning">${menuDescription}</h2>`
        );
        $("#exampleModalCenter .modal-body #menulogo").prepend(
          `<img src=${logoUrl} class="w-50 m-auto" alt="your logo"/>`
        );
      },
      error: function (xhr, status, error) {
        console.log("Save stage on db error ", error);
      },
    });
  }

  function downloadQR() {
    let qrUrl = $("#qrcode img").attr("src");

    const logoWidth = 100;
    const logoHeight = 100;
    const centerLogoX = parseInt(paper.width / 2 - logoWidth / 2);
    const centerLogoY = 50;
    const qrWidth = 255;
    const qrHeight = 255;
    const centerQRX = paper.width / 2 - qrWidth / 2;
    const centerQRY = paper.height / 2 - qrHeight / 2;

    // download pdf include qrcode file
    let pdf = new jsPDF("p", "px", [paper.width, paper.height]);
    pdf.addImage(
      logoUrl,
      "JPG",
      centerLogoX,
      centerLogoY,
      logoWidth,
      logoHeight
    );
    pdf.addImage(qrUrl, "JPG", centerQRX, centerQRY, qrWidth, qrHeight);
    pdf.save(`stage-${new Date()}.pdf`);
  }

  function generateQR(content) {
    $("#qrcode").html("");
    let qr = new QRCode("qrcode", {
      text: content,
      width: 256,
      height: 256,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H,
    });
  }

  function redraw() {
    const newWidth = parseInt($("#stage").css("width"));
    const newHeight = parseInt($("#stage").css("height"));

    screenScale = { x: newWidth / width, y: newHeight / height };
    relativeScaleTemp = Math.max(
      Math.max(paper.width / newWidth, 1),
      Math.max(paper.height / newHeight, 1)
    );

    if (relativeScaleTemp > 1) {
      if (paper.width / newWidth > paper.height / newHeight) {
        relativeScale = newWidth / paper.width;
      } else {
        relativeScale = newHeight / paper.height;
      }
    } else {
      relativeScale = relativeScale;
    }

    paperScale = { x: relativeScale, y: relativeScale };

    stage.width(newWidth);
    stage.height(newHeight);

    // whiteRect.scale({ x: scaleX, y: scaleY });
    whiteRect.setAttrs({
      x: (width * screenScale.x) / 2 - (paper.width * relativeScale) / 2,
      y: (height * screenScale.y) / 2 - (paper.height * relativeScale) / 2,
      width: paper.width * relativeScale,
      height: paper.height * relativeScale,
    });

    // change the absolute position on group9
    shapeGroup.x(newWidth / 2 - (paper.width * relativeScale) / 2);
    shapeGroup.y(newHeight / 2 - (paper.height * relativeScale) / 2);
    shapeGroup.width(paper.width * relativeScale);
    shapeGroup.height(paper.height * relativeScale);
    shapeGroup.scale(paperScale);

    if ($("body").find("#editkonvatext").length !== 0) {
      let textarea = document.getElementById("editkonvatext");
      let [textNode] = selectionTr.nodes();
      let textPosition = textNode.absolutePosition();
      let areaPosition = {
        x: textPosition.x,
        y: textPosition.y,
      };
      console.log("adsfadsfasd", textarea, textNode);
      textarea.value = textNode.text();
      textarea.style.position = "absolute";
      textarea.style.top = areaPosition.y * relativeScale + "px";
      textarea.style.left = areaPosition.x * relativeScale + "px";
      textarea.style.width =
        (textNode.width() - textNode.padding() * 2) * relativeScale + "px";
      textarea.style.height =
        (textNode.height() - textNode.padding() * 2 + 5) * relativeScale + "px";
      textarea.style.fontSize = textNode.fontSize() * relativeScale + "px";
      textarea.style.border = "none";
      textarea.style.padding = "0px";
      textarea.style.margin = "0px";
      textarea.style.overflow = "hidden";
      textarea.style.background = "none";
      textarea.style.outline = "none";
      textarea.style.resize = "none";
      textarea.style.lineHeight = textNode.lineHeight();
      textarea.style.fontFamily = textNode.fontFamily();
      textarea.style.transformOrigin = "left top";
      textarea.style.textAlign = textNode.align();
      textarea.style.color = textNode.fill();
      rotation = textNode.rotation();
      let transform = "";
      if (rotation) {
        transform += "rotateZ(" + rotation + "deg)";
      }

      let px = 0;
      let isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;

      if (isFirefox) {
        px += 2 + Math.round(textNode.fontSize() / 20);
      }
      transform += "translateY(-" + px + "px)";

      textarea.style.transform = transform;
      textarea.focus();
    }

    layer.batchDraw();
    // stage.batchDraw();
  }

  function generateToken(length) {
    var chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var token = "";
    for (var i = 0; i < length; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
  }

  function getCurrentStatusJson() {
    let data = {
      stage: { width, height },
      paper,
      backgroundUrl: undefined,
      whiteRect: whiteRect.attrs,
      shapeGroup: [],
    };

    deselectAllComponents();

    // save all nodes on shape group
    shapeGroup.getChildren(function (node) {
      switch (node.getClassName()) {
        case "Text":
          delete node.attrs.container;
          data.shapeGroup.push({ attrs: node.attrs, className: "Text" });
          break;
        case "Image":
          data.shapeGroup.push({
            attrs: node.attrs,
            src: node.image().src,
            className: "Image",
          });
          break;
        default:
          break;
      }
    });

    //save background iamge
    if (whiteRect.image() !== null && whiteRect.image() !== undefined) {
      data.backgroundUrl = whiteRect.image().src;
    }

    return data;
  }

  function getThumbnail() {
    // download  thumbnail image
    let dataUrl = stage.toDataURL({
      x: (width * screenScale.x) / 2 - (paper.width * relativeScale) / 2,
      y: (height * screenScale.y) / 2 - (paper.height * relativeScale) / 2,
      width: paper.width * relativeScale,
      height: paper.height * relativeScale,
      imageSmoothingEnabled: true,
      pixelRatio: 8,
    });

    return dataUrl;
  }

  function showControlPanel() {
    if ($(".header").find("#textcontrol").length === 0) {
      const selectedTextNode = selectionTr.nodes()[0];
      const YOUR_API_KEY = "AIzaSyBAKR45ng8gEgjUD7NPVxBpOvVeVajHb7U";

      $(".header-left").append(`
        <div id="textcontrol" class="d-flex align-items-center">
          <div style="width: 2rem; height:2rem;" id="fontcolorpicker"></div>

          <div style="width: 4rem; height:2rem" class="d-flex align-items-center mx-1">
            <input id="fontsizecontrol" class="w-100 h-100 text-center" type="number" id="fontsize" value="32" min="0">
          </div>

          <select id="fontfailyselect" class="single-select">
          </select>
         
          <i style="font-size:2rem;" class="konva-text-align lni lni-text-align-${selectedTextNode.align()} mx-1" data-align="${selectedTextNode.align()}"></i>
        </div>
      `);

      const alignList = ["left", "center", "right"];
      let conunt = alignList.indexOf(selectedTextNode.align());
      let fonts;

      // font color
      $("#fontcolorpicker").asColorPicker({
        onChange: function (color) {
          selectedTextNode.setAttrs({
            fill: color,
          });
        },
        hideInput: false,
        mode: "complex",
      });
      $("#fontcolorpicker").asColorPicker("set", selectedTextNode.fill());

      // font size
      $("#fontsizecontrol").val(parseInt(selectedTextNode.fontSize()));
      $("body").delegate("#fontsizecontrol", "change", function () {
        const selectedTextNode = selectionTr.nodes()[0];
        selectedTextNode.setAttrs({
          fontSize: $(this).val(),
        });
        selectionTr.forceUpdate();
      });

      // text align
      $("body").delegate("i.konva-text-align", "click", function () {
        const selectedTextNode = selectionTr.nodes()[0];
        conunt++;
        $(this).removeClass(`lni-text-align-${alignList[(conunt - 1) % 3]}`);
        $(this).addClass(`lni-text-align-${alignList[conunt % 3]}`);
        $(this).data("align", alignList[conunt % 3]);
        selectedTextNode.align(alignList[conunt % 3]);
      });

      //font family
      $.ajax({
        url: `https://www.googleapis.com/webfonts/v1/webfonts?key=${YOUR_API_KEY}`,
        type: "GET",
        success: function (response) {
          fonts = response.items;
          let fontsNameList = [];

          $.each(fonts, function (index, font) {
            fontsNameList.push(font.family);
          });

          $("#fontfailyselect").select2({
            data: fontsNameList,
          });

          $("#fontfailyselect")
            .val(selectedTextNode.fontFamily())
            .trigger("change");
        },
      });

      $("#fontfailyselect").on("change", function () {
        const selectedTextNode = selectionTr.nodes()[0];
        const selectedFontName = $(this).val();
        const [selectedFont] = fonts.filter(function (font) {
          return font.family === selectedFontName;
        });

        const newFont = new FontFace(
          selectedFontName,
          `url(${selectedFont.files.regular})`
        );

        document.fonts.add(newFont);

        Promise.all([newFont.load()]).then(function (font) {
          selectedTextNode.fontFamily(selectedFontName);
          selectionTr.forceUpdate();
          layer.batchDraw();
        });
      });
    }
  }

  function hideControlPanel() {
    $(".header .header-left").text("");
  }

  function undo() {}

  function redo() {}
});
