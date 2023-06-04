$(function () {
  // const B5_DIEMENSION = { width: 499, height: 709 };
  let id = 0;
  let nodeList = [];
  var width = $("#container").width();
  var height = $("#container").height();

  console.log("width and height is ", width, height);
  var stage = new Konva.Stage({
    container: "container",
    width,
    height,
  });
  console.log("stage diemenstion ", stage.width(), stage.height());

  stage.container().addEventListener("wheel", function (e) {
    if (e.shiftKey) {
      return;
    }
    e.preventDefault();
  });

  var workingArea = new Konva.Layer();

  workingArea.clip(true);
  stage.add(workingArea);

  // Selection Part
  var selectionTr = new Konva.Transformer();
  workingArea.add(selectionTr);

  // by default select all shapes
  selectionTr.nodes(nodeList);
  // add a new feature, lets add ability to draw selection rectangle
  var selectionRectangle = new Konva.Rect({
    fill: 'rgba(0,0,255,0.5)',
    visible: false,
  });
  workingArea.add(selectionRectangle);

  var x1, y1, x2, y2;
  stage.on('mousedown touchstart', (e) => {
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

  stage.on('mousemove touchmove', (e) => {
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

  stage.on('mouseup touchend', (e) => {
    // do nothing if we didn't start selection
    if (!selectionRectangle.visible()) {
      return;
    }
    e.evt.preventDefault();
    // update visibility in timeout, so we can check it in click event
    setTimeout(() => {
      selectionRectangle.visible(false);
    });

    var shapes = stage.find('.rect');
    var box = selectionRectangle.getClientRect();
    var selected = shapes.filter((shape) =>
      Konva.Util.haveIntersection(box, shape.getClientRect())
    );
    selectionTr.nodes(selected);
  });

  // clicks should select/deselect shapes
  stage.on('click tap', function (e) {
    // if we are selecting with rect, do nothing
    if (selectionRectangle.visible()) {
      return;
    }

    // if click on empty area - remove all selections
    if (e.target === stage) {
      selectionTr.nodes([]);
      return;
    }

    // do nothing if clicked NOT on our rectangles
    if (!e.target.hasName('rect')) {
      return;
    }

    // do we pressed shift or ctrl?
    const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
    const isSelected = selectionTr.nodes().indexOf(e.target) >= 0;

    if (!metaPressed && !isSelected) {
      // if no key pressed and the node is not selected
      // select just one
      selectionTr.nodes([e.target]);
    } else if (metaPressed && isSelected) {
      // if we pressed keys and node was selected
      // we need to remove it from selection:
      const nodes = selectionTr.nodes().slice(); // use slice to have new copy of array
      // remove node from array
      nodes.splice(nodes.indexOf(e.target), 1);
      selectionTr.nodes(nodes);
    } else if (metaPressed && !isSelected) {
      // add the node into selection
      const nodes = selectionTr.nodes().concat([e.target]);
      selectionTr.nodes(nodes);
    }
  });
  // Selection Part

  function deselectOtherComponents(currentTransformer) {
    workingArea.getChildren(function (node) {
      if (node.getClassName() === 'Transformer' && node !== currentTransformer) {
        node.hide();
        node.forceUpdate();
      }
    });
  }

  function deselectAllComponents() {
    workingArea.getChildren(function (node) {
      if (node.getClassName() === 'Transformer') {
        node.hide();
        node.forceUpdate();
      }
    });
  }

  stage.on('click', function (evt) {
    var shape = evt.target;
    if (shape.getClassName() == 'Stage') {
      deselectAllComponents();
    }
  });

  $("body").delegate(".text-component", "click", function () {
    const index = parseInt($(this).data("index"));
    const component = textComponents[index];
    var textNode = new Konva.Text({
      text: component.label,
      x: width / 2 - 100,
      y: (height - component.style.fontSize) / 2,
      fontSize: component.style.fontSize,
      fontFamily: component.style.fontFamily,
      draggable: true,
      width: 200,
      fill: component.style.color,
      id: 'text-' + id
    });

    nodeList.push(textNode);
    id++;

    workingArea.add(textNode);
    var tr = new Konva.Transformer({
      node: textNode,
      boundBoxFunc: function (oldBox, newBox) {
        newBox.width = Math.max(30, newBox.width);
        return newBox;
      },
    });

    textNode.on("transform", function () {
      textNode.setAttrs({
        width: textNode.width() * textNode.scaleX(),
        height: textNode.height() * textNode.scaleY(),
      });
      var currentScale = textNode.scaleX();

      textNode.fontSize(textNode.fontSize() * currentScale);
    });

    tr.show();

    workingArea.add(tr);

    deselectOtherComponents(tr);

    textNode.on("click", function (e) {
      textNode.show();
      tr.show();

      deselectOtherComponents(tr);
    });

    textNode.on("dblclick dbltap", function (e) {
      textNode.hide();
      tr.show();

      var textPosition = textNode.absolutePosition();

      var areaPosition = {
        x: stage.container().offsetLeft + textPosition.x,
        y: stage.container().offsetTop + textPosition.y,
      };

      var textarea = document.createElement("textarea");
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
      var transform = "";
      if (rotation) {
        transform += "rotateZ(" + rotation + "deg)";
      }

      var px = 0;
      var isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;

      if (isFirefox) {
        px += 2 + Math.round(textNode.fontSize() / 20);
      }
      transform += "translateY(-" + px + "px)";

      textarea.style.transform = transform;

      // reset height
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + 3 + "px";

      textarea.focus();

      function removeTextarea() {
        textarea.parentNode.removeChild(textarea);
        window.removeEventListener("click", handleOutsideClick);
        textNode.show();
        tr.hide();
        tr.forceUpdate();
      }

      function setTextareaWidth(newWidth) {
        if (!newWidth) {
          newWidth = textNode.placeholder.length * textNode.fontSize();
        }

        var isSafari = /^((?!chrome|android).)*safari/i.test(
          navigator.userAgent
        );
        var isFirefox =
          navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
        if (isSafari || isFirefox) {
          newWidth = Math.ceil(newWidth);
        }

        var isEdge = document.documentMode || /Edge/.test(navigator.userAgent);
        if (isEdge) {
          newWidth += 1;
        }
        textarea.style.width = newWidth + "px";
      }

      textarea.addEventListener("keydown", function (e) {
        if (e.keyCode === 13 && !e.shiftKey) {
          textNode.text(textarea.value);
          removeTextarea();
        }
        if (e.keyCode === 27) {
          removeTextarea();
        }
      });

      textarea.addEventListener("keydown", function (e) {
        scale = textNode.getAbsoluteScale().x;
        setTextareaWidth(textNode.width() * scale);
        textarea.style.height = "auto";
        textarea.style.height =
          textarea.scrollHeight + textNode.fontSize() + "px";
      });

      textarea.addEventListener("input", function (e) {
        textNode.height(textarea.offsetHeight);
        tr.forceUpdate();
      });

      function handleOutsideClick(e) {
        if (e.target !== textarea) {
          textNode.text(textarea.value);
          removeTextarea();
        }
      }
      setTimeout(() => {
        window.addEventListener("click", handleOutsideClick);
      });
    });
  });
});
