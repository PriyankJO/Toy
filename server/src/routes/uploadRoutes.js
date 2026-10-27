const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { protect, admin } = require('../middleware/auth');

router.post('/', protect, admin, upload.array('images', 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'Please select an image file to upload' });
    }

    const fileUrls = req.files.map(file => `/uploads/${file.filename}`);

    res.status(200).json({
      success: true,
      message: 'Images uploaded successfully',
      urls: fileUrls
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
