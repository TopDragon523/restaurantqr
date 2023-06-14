let deoms = [];
let textComponents = [];
let backgroundImages = [];
let photos = [];

$.ajax({
  url: "load.php",
  type: "GET",
  success: function (response) {
    let resoures = JSON.parse(response);

    console.log("All templates are fetched  ", JSON.parse(response));
    deoms = resoures.templates.map(function (item) {
      item.id = parseInt(item.id);
      return item;
    });

    textComponents = resoures.texts.map(function (item) {
      item.id = parseInt(item.id);
      item.fontSize = parseInt(item.fontSize);
      return item;
    });

    photos = resoures.photos.map(function (item) {
      item.id = parseInt(item.id);
      item.width = parseInt(item.width);
      item.height = parseInt(item.height);
      return item;
    });

    backgroundImages = resoures.bgimages.map(function (item) {
      item.id = parseInt(item.id);
      return item;
    });

    console.log(textComponents);
  },
  error: function (xhr, status, error) {
    console.log("Fetching templates error ", error);
  },
});
