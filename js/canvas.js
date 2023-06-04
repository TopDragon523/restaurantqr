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

  $("body").delegate(".text-component", "click", function () {
    console.log("helwo");
    const index = parseInt($(this).data("index"));
    const component = textComponents[index];
    var textNode = new Konva.Text({
      text: component.label,
      x: 50,
      y: 80,
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
      enabledAnchors: ["top-left", "top-right", "bottom-left", "bottom-right"],
      // set minimum width of text
      boundBoxFunc: function (oldBox, newBox) {
        newBox.width = Math.max(30, newBox.width);
        return newBox;
      },
    });

    textNode.on("transform", function () {
      // reset scale, so only with is changing by transformer
      textNode.setAttrs({
        width: textNode.width() * textNode.scaleX(),
        scaleX: 1,
      });
    });

    tr.hide();

    workingArea.add(tr);

    textNode.on("click tap", () => {
      textNode.show();
      tr.show();

      // var textPosition = textNode.absolutePosition();

      // var areaPosition = {
      //   x: stage.container().offsetLeft + textPosition.x,
      //   y: stage.container().offsetTop + textPosition.y,
      // };

      // var textarea = document.createElement("p");
      // document.body.appendChild(textarea);
      // textarea.id = textNode.attrs.id;

      // textarea.value = textNode.text();
      // textarea.style.position = "absolute";
      // textarea.style.top = areaPosition.y + "px";
      // textarea.style.left = areaPosition.x + "px";
      // textarea.style.width = textNode.width() - textNode.padding() * 2 + "px";
      // textarea.style.height =
      //   textNode.height() - textNode.padding() * 2 + 5 + "px";
      // textarea.style.fontSize = textNode.fontSize() + "px";
      // textarea.style.border = "none";
      // textarea.style.padding = "0px";
      // textarea.style.margin = "0px";
      // textarea.style.overflow = "hidden";
      // textarea.style.background = "none";
      // textarea.style.outline = "none";
      // textarea.style.resize = "none";
      // textarea.style.lineHeight = textNode.lineHeight();
      // textarea.style.fontFamily = textNode.fontFamily();
      // textarea.style.transformOrigin = "left top";
      // textarea.style.textAlign = textNode.align();
      // textarea.style.color = textNode.fill();
      // rotation = textNode.rotation();
      // var transform = "";
      // if (rotation) {
      //   transform += "rotateZ(" + rotation + "deg)";
      // }

      // var px = 0;
      // var isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;

      // if (isFirefox) {
      //   px += 2 + Math.round(textNode.fontSize() / 20);
      // }
      // transform += "translateY(-" + px + "px)";

      // textarea.style.transform = transform;

      // // reset height
      // textarea.style.height = "auto";
      // textarea.style.height = textarea.scrollHeight + 3 + "px";

      // // textarea.focus();

      // function removeTextarea() {
      //   textarea.parentNode.removeChild(textarea);
      //   window.removeEventListener("click", handleOutsideClick);
      //   textNode.show();
      //   tr.hide();
      //   tr.forceUpdate();
      // }

      function handleOutsideClick(e) {
        textNode.show();
        tr.hide();
        tr.forceUpdate();
      }

      setTimeout(() => {
        window.addEventListener("click", handleOutsideClick);
      });
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
