const express = require('express');
const multer = require('multer');
const imagekit = require("../imagekit");
const router = express.Router();

// Set up multer middleware to handle file uploads
const upload = multer()

// Create the upload route
router.post('/', upload.single('file'), function (req, res, next) {
  console.log(req.body.destination);
  const file = req.file;
  if (!file) {
    res.status(400).json({ message: "Missing file parameter for upload", help: "" });
    return;
  }

  // Use the ImageKit SDK to upload the file directly to ImageKit's servers
  imagekit
    .upload({
      file: file.buffer, // Use the file buffer instead of the file object
      fileName: file.originalname,
      folder: req.body.destination || "uploads",
    })
    .then((result) => {
      res.json({
        success: true,
        url: result.url,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error uploading image to ImageKit");
    });
});

module.exports = router;
