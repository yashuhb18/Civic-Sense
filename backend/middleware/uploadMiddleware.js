const multer = require('multer');

// Store files in memory so we can convert them to Base64
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Accept all files for now, or filter by mimetype
  cb(null, true);
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: fileFilter
});

module.exports = upload;
