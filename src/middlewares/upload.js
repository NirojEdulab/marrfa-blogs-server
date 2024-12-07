const multer = require("multer");
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join('public', 'temp');
    fs.mkdirSync(dir, { recursive: true });
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

module.exports = multer({ storage });
