$(function () {
  let id = 0;
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

  // create three layers
  let layer = new Konva.Layer({ id: "layer", listening: true });

  let whiteRect = new Konva.Image({
    x: width / 2 - paper.width / 2,
    y: height / 2 - paper.height / 2,
    width: paper.width,
    height: paper.height,
    image: null,
    listening: false,
  });

  let shapeGroup = new Konva.Group();

  var maskRect = new Konva.Shape({
    x: 0,
    y: 0,
    listening: false,
    sceneFunc: function (context) {
      context.beginPath();
      context.rect(0, 0, width, height);

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

  let selectionTr = new Konva.Transformer({
    rotationSnaps: [0, 45, 90, 135, 180, -45, -90, -135],
  });

  let selectionRectangle = new Konva.Rect({
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
  });

  stage.on("click tap", function (e) {
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

    // if (!metaPressed && !isSelected) {
    //   // if no key pressed and the node is not selected
    //   // select just one
    //   console.log("is selected this target ", isSelected);
    //   deselectAllComponents();
    //   selectionTr.nodes([e.target]);
    // } else if (metaPressed && isSelected) {
    //   // if we pressed keys and node was selected
    //   // we need to remove it from selection:
    //   const nodes = selectionTr.nodes().slice(); // use slice to have new copy of array
    //   // remove node from array
    //   nodes.splice(nodes.indexOf(e.target), 1);
    //   selectionTr.nodes(nodes);
    // } else if (metaPressed && !isSelected) {
    //   // add the node into selection
    //   const nodes = selectionTr.nodes().concat([e.target]);
    //   selectionTr.nodes(nodes);
    // }
  });

  // handle the toolbox tab
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
    shapeGroup.add(textNode);

    console.log(textNode);
    id++;

    handleTransformer(1);
    selectionTr.nodes([textNode]);
    selectionTr.show();

    // textNode.on("dragmove", function () {
    //   selectionTr.nodes([this]);
    //   // if (selectionTr.nodes().indexOf(this) > -1) {
    //   //   textTr.hide();
    //   // } else {
    //   selectionTr.show();
    //   // }
    // });

    textNode.on("transform", function () {
      console.log("Selected  active anchor is ", selectionTr.getActiveAnchor());
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

    textNode.on("click touchend", function (e) {
      console.log("Text node is clicked ", this);
      handleTransformer(1);
      selectionTr.show();
      selectionTr.forceUpdate();

      const isSelected = selectionTr.nodes().indexOf(e.target) >= 0;
      if (!isSelected) {
        selectionTr.nodes([this]);
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
          console.log("aaaaaaaaaaaaaaaa");
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

    document.addEventListener("keydown", function (event) {
      const keyCode = event.keyCode;
      if (keyCode === 46 && selectionTr.nodes().length > 0) {
        let selectedNode = selectionTr.nodes()[0];
        selectedNode.destroy();
        selectionTr.nodes([]);
      }
    });
  });

  $("body").delegate(".photo-component img", "click", function () {
    const index = parseInt($(this).data("index"));
    const imgUrl = photos[index];

    deselectAllComponents();

    let imageObj = new Image();
    imageObj.src = imgUrl;

    let imageNode = new Konva.Image({
      x: 80,
      y: 100,
      image: imageObj,
      draggable: true,
    });
    shapeGroup.add(imageNode);

    handleTransformer(2);
    selectionTr.nodes([imageNode]);
    selectionTr.show();

    // deselectAllComponents(tr);
    // imageNode.on("dragmove", function () {
    //   selectionTr.nodes([this]);
    //   // if (selectionTr.nodes().indexOf(this) > -1) {
    //   //   selectionTr.hide();
    //   // } else {
    //   selectionTr.show();
    //   // }
    // });

    imageNode.on("transform", function () {
      console.log(
        "Image transformer active anchor is ",
        selectionTr.getActiveAnchor()
      );
      // reset scale on transform
      imageNode.setAttrs({
        scaleX: 1,
        scaleY: 1,
        width: imageNode.width() * imageNode.scaleX(),
        height: imageNode.height() * imageNode.scaleY(),
      });
    });

    imageNode.on("click touchend", function (e) {
      console.log("image node is clicked ", this);
      handleTransformer(2);
      deselectAllComponents();
      selectionTr.nodes([this]);
      selectionTr.show();
      imageNode.show();
      selectionTr.forceUpdate();
    });

    document.addEventListener("keydown", function (e) {
      const keyCode = e.keyCode;
      if (keyCode === 46 && selectionTr.nodes().length > 0) {
        let selectedNode = selectionTr.nodes()[0];
        selectedNode.destroy();
        selectionTr.nodes([]);
      }
    });
  });

  $("body").delegate(".background-component img", "click", function () {
    const index = parseInt($(this).data("index"));
    const imgUrl = backgroundImages[index]; // from init-component file

    let bgImageObj = new Image();
    bgImageObj.src = imgUrl;
    whiteRect.image(bgImageObj);
  });

  // pervent the default  browser zooming by mouse wheel
  stage.container().addEventListener("wheel", function (e) {
    if (e.shiftKey) {
      return;
    }
    e.preventDefault();
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
    console.log("this is desel");
    selected = [];
    selectionTr.hide();
    selectionTr.nodes([]);
    selectionTr.forceUpdate();
  }
});
