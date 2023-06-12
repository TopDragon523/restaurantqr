$(function () {
  let id = 0;
  let x1, y1, x2, y2;
  let nodeList = { Text: 1, Image: 2 };
  let width = $("#stage").width();
  let height = $("#stage").height();
  const paper = { width: 499, height: 709 };

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
    x: width / 2 - paper.width / 2,
    y: height / 2 - paper.height / 2,
    width: paper.width,
    height: paper.height,
    fill: "white",
    image: null,
    listening: false,
  });

  // create the group including all shapes
  let shapeGroup = new Konva.Group();

  //create mask rectangle with rectanlge hole
  let maskRect = new Konva.Shape({
    x: 0,
    y: 0,
    listening: false,
    sceneFunc: function (context) {
      context.beginPath();
      context.rect(0, 0, width, height);
      console.log(
        width / 2 - paper.width / 2,
        height / 2 - paper.height / 2,
        width / 2 + paper.width / 2,
        height / 2 + paper.height / 2
      );
      context.moveTo(
        width / 2 - paper.width / 2,
        height / 2 - paper.height / 2
      );
      context.lineTo(
        width / 2 - paper.width / 2,
        height / 2 + paper.height / 2
      );
      context.lineTo(
        width / 2 + paper.width / 2,
        height / 2 + paper.height / 2
      );
      context.lineTo(
        width / 2 + paper.width / 2,
        height / 2 - paper.height / 2
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
    // // inint rectanlge when the cursor reach edge of stage
    // if (x2 < 1 || x2 > stage.width() - 1 || y2 < 1 || y2 > stage.height() - 1) {
    //   setTimeout(() => {
    //     selectionRectangle.visible(false);
    //   });
    //   selectionRectangle.x(-1);
    //   selectionRectangle.y(-1);
    //   return;
    // }
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

  // handle the toolbox tab
  $("body").delegate(".demo-component", "click", function () {
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
    if (
      savedStage.backgroundUrl !== null &&
      savedStage.backgroundUrl !== undefined
    ) {
      let bgImageObj = new Image();
      bgImageObj.setAttribute("crossOrigin", "anonymous");
      bgImageObj.src = savedStage.backgroundUrl;
      whiteRect.image(bgImageObj);
    }
  });

  $("body").delegate(".text-component", "click", function () {
    const index = parseInt($(this).data("index"));
    const component = textComponents[index];

    let textNode = new Konva.Text({
      text: component.label,
      x: width / 2 - 100,
      y: (height - component.style.fontSize) / 2,
      fontSize: component.style.fontSize,
      fontFamily: component.style.fontFamily,
      scaleX: 1,
      scaleY: 1,
      draggable: true,
      width: 200,
      fill: component.style.color,
      id: "text-" + id,
    });

    console.log(textNode);
    id++;

    handleTransformer(1);
    selectionTr.nodes([textNode]);
    selectionTr.show();

    createTextNode(textNode);
  });

  $("body").delegate(".photo-component img", "click", function () {
    const index = parseInt($(this).data("index"));
    const imgUrl = photos[index];

    let imageObj = new Image();
    imageObj.setAttribute("crossOrigin", "anonymous");
    imageObj.src = imgUrl;

    let imageNode = new Konva.Image({
      x: 80,
      y: 100,
      image: imageObj,
      draggable: true,
    });

    handleTransformer(2);
    selectionTr.nodes([imageNode]);
    selectionTr.show();

    createImageNode(imageNode);
  });

  $("body").delegate(".background-component img", "click", function () {
    const index = parseInt($(this).data("index"));
    const imgUrl = backgroundImages[index]; // from init-component file

    let bgImageObj = new Image();
    bgImageObj.setAttribute("crossOrigin", "anonymous");
    bgImageObj.src = imgUrl;
    whiteRect.image(bgImageObj);
  });

  // save stage as json file on db
  $("body").delegate("#export", "click", function () {
    let data = {
      stage: { width, height },
      paper,
      backgroundUrl: undefined,
      shapeGroup: [],
    };

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

    // download  image
    let dataUrl = stage.toDataURL({
      x: width / 2 - paper.width / 2,
      y: height / 2 - paper.height / 2,
      width: paper.width,
      height: paper.height,
      imageSmoothingEnabled: true,
    });
    console.log("saved data is ", dataUrl);

    //save stage on db
    $.ajax({
      url: "savetemplate.php",
      type: "POST",
      dataType: "JSON",
      data: { data: JSON.stringify(data), thumbnail: dataUrl },
      success: function (response) {
        console.log("saved stage is ", response);
      },
      error: function (xhr, status, error) {
        console.log("Save stage on db error ", error);
      },
    });
  });

  // save as image
  $("body").delegate("#saveimage", "click", function () {
    saveAsImage();
  });

  // save as pdf file
  $("body").delegate("#savepdf", "click", function () {
    saveAsPDF();
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
  }

  function createTextNode(textNode) {
    shapeGroup.add(textNode);

    textNode.on("dragmove touchmove", function () {
      selectionTr.show();
      if (selectionTr.nodes().length < 2) {
        const nodeX = this.x();
        const nodeY = this.y();

        handleTransformer(1);
        selectionTr.nodes([this]);
        selectionTr.x(nodeX);
        selectionTr.y(nodeY);
      } else {
        handleTransformer(0);
      }
      layer.batchDraw(); //prevent redrawing too much
    });
    textNode.on("transform", function () {
      const activeAnchor = selectionTr.getActiveAnchor();
      switch (activeAnchor) {
        case "top-left":
        case "top-right":
        case "bottom-left":
        case "bottom-right":
          textNode.setAttrs({
            width: this.width() * this.scaleX(),
            fontSize: this.fontSize() * this.scaleX(),
          });
          break;
        case "middle-left":
        case "middle-right":
          this.width(Math.max(200, this.width() * this.scaleX()));
          break;
        case "rotator":
          break;
      }
      this.scaleX(1);
      this.scaleY(1);
      selectionTr.forceUpdate();
    });

    textNode.on("click touchstart", function (e) {
      console.log("Text node is clicked ", this);
      handleTransformer(1);
      selectionTr.forceUpdate();
      const isSelected = selectionTr.nodes().indexOf(e.target) >= 0;
      if (!isSelected) {
        deselectAllComponents();
        selectionTr.nodes([this]);
        selectionTr.show();
      } else {
        textNode.hide();

        let textPosition = textNode.absolutePosition();
        let areaPosition = {
          x: stage.container().offsetLeft + textPosition.x,
          y: stage.container().offsetTop + textPosition.y,
        };

        let textarea = document.createElement("textarea");
        document.body.appendChild(textarea);

        textarea.value = textNode.text();
        textarea.style.position = "absolute";
        textarea.style.top = areaPosition.y + "px";
        textarea.style.left = areaPosition.x + "px";
        textarea.style.width = textNode.width() - textNode.padding() * 2 + "px";
        textarea.style.height =
          textNode.height() - textNode.padding() * 2 + 5 + "px";
        textarea.style.fontSize = textNode.fontSize() + "px";
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

        function handleOutsideClick(e) {
          if (e.target !== textarea) {
            removeTextarea();
          }
        }

        function removeTextarea() {
          textarea.parentNode.removeChild(textarea);
          window.removeEventListener("click", handleOutsideClick);
          textNode.show();
          deselectAllComponents();
        }

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
      if (selectionTr.nodes().length < 2) {
        const nodeX = imageNode.x();
        const nodeY = imageNode.y();

        handleTransformer(2);
        selectionTr.nodes([this]);
        selectionTr.x(nodeX);
        selectionTr.y(nodeY);
      } else {
        handleTransformer(0);
      }
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
    shapeGroup.destroyChildren();
    whiteRect.setAttrs({ image: null });
  }

  function saveAsImage() {
    // download  image
    let dataUrl = stage.toDataURL({
      x: width / 2 - paper.width / 2,
      y: height / 2 - paper.height / 2,
      width: paper.width,
      height: paper.height,
      imageSmoothingEnabled: true,
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
      x: width / 2 - paper.width / 2,
      y: height / 2 - paper.height / 2,
      width: paper.width,
      height: paper.height,
      imageSmoothingEnabled: true,
    });

    // download pdf file
    let pdf = new jsPDF("p", "px", [paper.width, paper.height]);
    pdf.addImage(dataUrl, "JPG", 0, 0, paper.width, paper.height);
    pdf.save(`stage-${new Date()}.pdf`);
  }
});
