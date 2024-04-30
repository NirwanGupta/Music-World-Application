// multerConfig.js
const multer = require("multer");

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Specify the destination folder where files will be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Use a unique filename for each uploaded file
  },
});

// Create the Multer instance
const upload = multer({ storage: storage });

module.exports = {upload};
