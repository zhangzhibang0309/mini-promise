const fs = require("fs");
const path = require("path");

// fileUrl
fs.readFile(path.resolve(__dirname, "fileUrl.txt"), "utf8", (err, data) => {
  if (err) {
    return console.log(err);
  }
  fs.readFile(path.resolve(__dirname, data), "utf8", (err, data) => {
    if (err) {
      return console.log(err);
    }
    console.log(data);
  });
});
