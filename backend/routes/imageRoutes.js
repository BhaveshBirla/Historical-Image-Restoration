const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const imageController = require("../controllers/imageController");

// Multer setup
const storage = multer.diskStorage({
  destination: "static/uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});
const upload = multer({ storage });


// POST /upload -> restore & save image
router.post("/upload", upload.single("image"), imageController.uploadAndProcessImage);

// GET /gallery-images -> return images for a specific user (we'll filter by email)
router.get("/gallery-images", imageController.getGalleryImages);

router.post("/upload", upload.single("image"), imageController.uploadAndProcessImage);

module.exports = router;
