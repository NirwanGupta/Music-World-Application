const { upload } = require(`../utils/multerConfig`);

const uploadFile = upload.single("audioFile"); // Assuming 'audioFile' is the name attribute of your file input field in the form

const uploadHandler = (req, res, next) => {
  uploadFile(req, res, function (err) {
    console.log("In upload Handler");
    if (err) {
      // Handle Multer errors (e.g., file size exceeded, file type not allowed)
      return res.status(400).json({ error: err.message });
    }
    // File uploaded successfully
    console.log("File uploaded successfully");
    next();
  });
};

module.exports = uploadHandler;