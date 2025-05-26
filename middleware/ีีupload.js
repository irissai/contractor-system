const multer = require('multer');
const path = require('path');
const fs = require('fs');

// กำหนดที่เก็บไฟล์

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.mimetype === 'application/pdf') {
      cb(null, 'uploads/pdfs/');
    } else {
      cb(null, 'uploads/images/');
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

// ฟิลเตอร์เฉพาะ pdf และรูปภาพ
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'application/pdf' ||
    file.mimetype.startsWith('image/')
  ) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF and image files are allowed!'), false);
  }
};

// ตัวจัดการ upload
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

module.exports = upload;
