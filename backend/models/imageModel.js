const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
  originalBuffer: Buffer,
  cleanedBuffer: Buffer,
  originalUrl: String,
  cleanedUrl: String,
  uploadedAt: { type: Date, default: Date.now },

   // 👇 New: store which user this image belongs to
  userEmail: {
    type: String,
    required: false,  // for old images; new ones we will set
    index: true,
  },
});

module.exports = mongoose.model("Image", ImageSchema);
