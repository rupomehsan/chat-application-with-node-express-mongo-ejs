const fs = require("fs-extra");

const imageUploader = async (files, folderName, multiple = false) => {
  try {
    // console.log("controller", files, multiple);

    if (multiple) {
      let paths = [];
      files.forEach((file) => {
        let file_name = parseInt(Math.random() * 100000000) + file.name;
        const path = "uploads/" + folderName + "/" + file_name;
        const imagePath = process.cwd() + "/public/" + path;
        fs.move(file.path, imagePath, function (err) {
          if (err) return console.error(err);
          console.log("success!");
        });
        paths.push(path);
      });
      return paths;
    } else {
      let file_name = parseInt(Math.random() * 100000000) + files.name;
      const path = "uploads/" + folderName + "/" + file_name;
      const imagePath = process.cwd() + "/public/" + path;
      fs.move(files.path, imagePath, function (err) {
        if (err) return console.error(err);
        console.log("success!");
      });
      return path;
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = imageUploader;
