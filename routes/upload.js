// routes/upload.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const AWS = require('aws-sdk');

// Set up AWS S3 client
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

// Set up multer middleware for handling file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      const error = new Error('Invalid file type');
      error.code = 'LIMIT_FILE_TYPES';
      return cb(error, false);
    }
    cb(null, true);
  }
});

// Define route for file upload
router.post('/', upload.single('file'), (req, res) => {
  const file = req.file;

  // Set up S3 upload parameters
  const folder = req.body.folder || '';
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: folder ? `${folder}/${file.originalname}` : file.originalname,
    Body: file.buffer,
    ACL: 'public-read'
  };
  console.log(params)
  // Upload file to S3 bucket
  s3.putObject(params, (err, data) => {
    if (err) {
      console.error("problem uploading",err);
      res.status(500).send('Error uploading file to S3 bucket');
    } else {
      console.log('File uploaded successfully to S3 bucket');
      const url = data.Location;
      res.send({ url });
    }
  });
});

module.exports = router;
