$(function () {
  let id = 0;
  let nodeList = [];
  let width = $("#stage").width();
  let height = $("#stage").height();
  let paper = { width: 499, height: 709 };

  console.log("width and height is ", width, height);
  let stage = new Konva.Stage({
    container: "stage",
    width,
    height,
  });

  // create three layers
  let bgLayer = new Konva.Layer({ id: "bgLayer", listening: false });
  let maskLayer = new Konva.Layer({ id: "maskLayer", listening: false });
  let trLayer = new Konva.Layer({ id: "trLayer", listening: true });
  let shapeLayer = new Konva.Layer({ id: "shapeLayer", listening: true });

  stage.add(bgLayer);
  stage.add(shapeLayer);
  stage.add(maskLayer);
  stage.add(trLayer);
  trLayer.moveToTop();
  bgLayer.moveToBottom();

  let maskRect = new Konva.Rect({
    x: 0,
    y: 0,
    width,
    height,
    fill: "lightgrey",
    opacity: 0.8,
  });
  let hole = new Konva.Rect({
    x: width / 2 - paper.width / 2,
    y: height / 2 - paper.height / 2,
    width: paper.width,
    height: paper.height,
    fill: "white",
  });

  maskLayer.add(maskRect);
  hole.globalCompositeOperation("destination-out");
  maskLayer.add(hole);

  // pervent the default  browser zooming by mouse wheel
  stage.container().addEventListener("wheel", function (e) {
    if (e.shiftKey) {
      return;
    }
    e.preventDefault();
  });

  // Selection Part
  let selectionTr = new Konva.Transformer({
    rotationSnaps: [0, 45, 90, 135, 180, -45, -90, -135],
    rotateAnchorOffset: 60,
  });
  let textTr = new Konva.Transformer({
    enabledAnchors: [
      "top-left",
      "top-right",
      "bottom-left",
      "bottom-right",
      "middle-left",
      "middle-right",
    ],
    keepRatio: true,
  });
  let imageTr = new Konva.Transformer({
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
    boundBoxFunc: (oldBox, newBox) => {
      if (newBox.width < 10 || newBox.height < 10) {
        return oldBox;
      }
      return newBox;
    },
  });
  trLayer.add(selectionTr);
  trLayer.add(textTr);
  trLayer.add(imageTr);
  console.log("textTr ", textTr);
  selectionTr.nodes(nodeList);

  let selectionRectangle = new Konva.Rect({
    fill: "#9ad1e7",
    stroke: "#20abe2",
    opacity: 0.5,
    visible: false,
  });
  trLayer.add(selectionRectangle);

  // clicks should select/deselect shapes
  stage.on("click", function (e) {
    console.log("click target event ", e.target.getClassName());
    // if we are selecting with rect, do nothing
    if (selectionRectangle.width() !== 0 && selectionRectangle.height() !== 0) {
      return;
    }
    // if click on empty area - remove all selections
    if (e.target.getClassName() == "Stage") {
      deselectAllComponents();
      return;
    }

    // do nothing if clicked NOT on our rectangles
    if (!e.target.hasName("rect")) {
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
    // do nothing if we didn't start selection
    if (!selectionRectangle.visible()) {
      return;
    }
    e.evt.preventDefault();
    // update visibility in timeout, so we can check it in click event
    setTimeout(() => {
      selectionRectangle.visible(false);
    });

    let shapes = shapeLayer.getChildren(function (node) {
      if (
        node.getClassName() !== "Transformer" &&
        node.getClassName() !== "Stage" &&
        node.getClassName() !== "Rect"
      ) {
        return node;
      }
    });

    let trList = shapeLayer.getChildren(function (node) {
      if (node.getClassName() === "Transformer") {
        return node;
      }
    });

    let box = selectionRectangle.getClientRect();

    let selected = shapes.filter((shape) =>
      Konva.Util.haveIntersection(box, shape.getClientRect())
    );
    let selectedTrs = trList.filter((tr) =>
      Konva.Util.haveIntersection(box, tr.getClientRect())
    );
    selectedTrs.map((tr) => {
      tr.show();
      tr.forceUpdate();
    });
    selectionTr.nodes(selected);
  });

  function deselectOtherComponents(currentTransformer) {
    trLayer.getChildren(function (node) {
      if (
        node.getClassName() === "Transformer" &&
        node !== currentTransformer
      ) {
        node.nodes([]);
        node.hide();
        node.forceUpdate();
      }
    });
  }

  function deselectAllComponents() {
    selectionTr.nodes([]);
    textTr.nodes([]);
    imageTr.nodes([]);
    trLayer.getChildren(function (node) {
      if (node.getClassName() === "Transformer") {
        node.hide();
        node.forceUpdate();
      }
    });
  }

  // handle the toolbox tab
  $("body").delegate(".text-component", "click", function () {
    const index = parseInt($(this).data("index"));
    const component = textComponents[index];

    deselectOtherComponents(textTr);

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
    shapeLayer.add(textNode);

    console.log(textNode);
    nodeList.push(textNode);
    id++;

    textTr.nodes([textNode]);
    textTr.show();

    textNode.on("dragmove", function () {
      textTr.nodes([this]);
      textTr.show();
    });

    textNode.on("transform", function () {
      console.log("hello", textTr.getActiveAnchor());

      const activeAnchor = textTr.getActiveAnchor();
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
          console.log("Transformer", textTr.scaleX(), textTr.scaleY());
          this.width(Math.max(200, this.width() * this.scaleX()));
          break;
        case "rotator":
          break;
      }
      this.scaleX(1);
      this.scaleY(1);
      textTr.forceUpdate();
    });

    textNode.on("click", function (e) {
      console.log("Text node is clicked ", this);
      textTr.show();
      textTr.forceUpdate();
      deselectOtherComponents(textTr);
      const isSelected = textTr.nodes().indexOf(e.target) >= 0;
      if (!isSelected) {
        textTr.nodes([this]);
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

        // reset height
        textarea.style.height = "auto";
        textarea.style.height = textarea.scrollHeight + 3 + "px";

        textarea.focus();

        textarea.addEventListener("input", function (e) {
          textarea.style.height =
            textarea.scrollHeight + textNode.fontSize() + "px";

          textNode.text(textarea.value);
          textTr.forceUpdate();
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
          textTr.hide();
          textTr.forceUpdate();
        }

        setTimeout(() => {
          window.addEventListener("click", handleOutsideClick);
        });
      }
    });

    document.addEventListener("keydown", function (event) {
      const keyCode = event.keyCode;
      if (keyCode === 46 && textTr.nodes().length > 0) {
        let selectedNode = textTr.nodes()[0];
        selectedNode.destroy();
        textTr.nodes([]);
      }
    });
  });

  $("body").delegate(".background-component img", "click", function () {
    const index = parseInt($(this).data("index"));
    const imgUrl = backgroundImages[index]; // from init-component file
    let bgImageObj = new Image();
    bgImageObj.src = imgUrl;
    let bgImage = new Konva.Image({
      x: width / 2 - paper.width / 2,
      y: height / 2 - paper.height / 2,
      width: paper.width,
      height: paper.height,
      image: bgImageObj,
    });
    bgLayer.add(bgImage);
    // let container = stage.container();
    // container.style.backgroundImage = `url(${imgUrl})`;
    // container.style.backgroundSize = "cover";
    // container.style.backgroundRepeat = "no-repeat";
    // container.style.backgroundPosition = "center center";
  });

  $("body").delegate(".photo-component img", "click", function () {
    const index = parseInt($(this).data("index"));
    const imgUrl = photos[index];

    deselectOtherComponents(imageTr);

    let imageObj = new Image();
    imageObj.src = imgUrl;

    let imageNode = new Konva.Image({
      x: 80,
      y: 100,
      image: imageObj,
      draggable: true,
    });
    shapeLayer.add(imageNode);

    imageTr.nodes([imageNode]);
    imageTr.show();

    // deselectOtherComponents(tr);
    imageNode.on("dragmove", function () {
      imageTr.nodes([this]);
      imageTr.show();
    });

    imageNode.on("transform", function () {
      console.log(
        "Image transformer active anchor is ",
        imageTr.getActiveAnchor()
      );
      // reset scale on transform
      imageNode.setAttrs({
        scaleX: 1,
        scaleY: 1,
        width: imageNode.width() * imageNode.scaleX(),
        height: imageNode.height() * imageNode.scaleY(),
      });
    });

    imageNode.on("click", function (e) {
      console.log("image node is clicked ", this);
      deselectOtherComponents(imageTr);
      imageTr.show();
      imageNode.show();
      imageTr.forceUpdate();
      imageTr.nodes([this]);
    });

    document.addEventListener("keydown", function (e) {
      const keyCode = e.keyCode;
      if (keyCode === 46 && imageTr.nodes().length > 0) {
        let selectedNode = imageTr.nodes()[0];
        selectedNode.destroy();
        imageTr.nodes([]);
      }
    });
    //   imageNode.setAttrs({
    //     x: 80,
    //     y: 100,
    //     name: "image",
    //     draggable: true,
    //   });
    //   shapeLayer.add(imageNode);

    //   // const tr = new Konva.Transformer({
    //   //   nodes: [imageNode],
    //   //   keepRatio: false,
    //   //   boundBoxFunc: (oldBox, newBox) => {
    //   //     if (newBox.width < 10 || newBox.height < 10) {
    //   //       return oldBox;
    //   //     }
    //   //     return newBox;
    //   //   },
    //   // });

    //   // trLayer.add(tr);
    //   imageTr.nodes([imageNode]);
    //   imageTr.show();

    //   // deselectOtherComponents(tr);
    //   imageNode.on("dragmove", function () {
    //     imageTr.nodes([this]);
    //     imageTr.show();
    //   });

    //   imageNode.on("transform", function () {
    //     console.log(
    //       "Image transformer active anchor is ",
    //       imageTr.getActiveAnchor()
    //     );
    //     // reset scale on transform
    //     imageNode.setAttrs({
    //       scaleX: 1,
    //       scaleY: 1,
    //       width: imageNode.width() * imageNode.scaleX(),
    //       height: imageNode.height() * imageNode.scaleY(),
    //     });
    //   });

    //   imageNode.on("click", function (e) {
    //     console.log("image node is clicked ", this);
    //     imageTr.show();
    //     imageNode.show();
    //     imageTr.forceUpdate();
    //     imageTr.nodes([this]);
    //   });`

    //   document.addEventListener("keydown", function (event) {
    //     let keyCode = event.keyCode;
    //     if (keyCode === 46 && tr.nodes().length > 0) {
    //       tr.destroy();
    //       imageNode.destroy();
    //     }
    //   });
    // });
  });
});
