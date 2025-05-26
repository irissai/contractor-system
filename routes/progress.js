const express = require('express');
const multer = require('multer');
const path = require('path');
const authenticateToken = require('../middleware/auth');
const Progress = require('../models/Progress');

const router = express.Router();

// ✅ ตั้งค่า multer storage สำหรับ pdf และ image
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'pdf') {
      cb(null, 'public/uploads/pdf/');
    } else if (file.fieldname === 'images') {
      cb(null, 'public/uploads/images/');
    }
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB max
});

// ✅ POST /api/progress - เพิ่ม progress ใหม่
router.post(
  '/',
  authenticateToken,
  upload.fields([
    { name: 'pdf', maxCount: 1 },
    { name: 'images', maxCount: 10 }
  ]),
  async (req, res) => {
    try {
      const { project, plotNumber, checklist, phase } = req.body;

      const pdf = req.files['pdf']?.[0];
      const images = req.files['images'] || [];

      const progress = new Progress({
        contractorId: req.user._id,
        project,
        plotNumber,
        phase,
        checklist: JSON.parse(checklist),
        pdfPath: pdf ? path.join('public/uploads/pdf/', pdf.filename) : null,
        imagePaths: images.map(img => path.join('public/uploads/images/', img.filename))
      });

      await progress.save();
      res.status(201).json({ message: 'Progress saved', progress });
    } catch (err) {
      res.status(500).json({ error: 'Failed to save progress', details: err.message });
    }
  }
);

// POST /api/progress/:id/precheck
router.post('/:id/precheck', async (req, res) => {
  try {
    const progress = await Progress.findById(req.params.id);
    if (!progress) return res.status(404).send('Not found');

    progress.precheck = req.body.precheckData;
    await progress.save();
    res.status(200).send({ message: 'Precheck saved' });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// POST /api/progress/:id/inspection-request
router.post('/:id/inspection-request', async (req, res) => {
  try {
    const progress = await Progress.findById(req.params.id);
    if (!progress) return res.status(404).send('Not found');

    progress.inspectionRequest = req.body;
    await progress.save();
    res.status(200).send({ message: 'Inspection request saved' });
  } catch (err) {
    res.status(500).send('Server error');
  }
});


// ✅ GET /api/progress - ดึง progress ทั้งหมดของ contractor คนนั้น
router.get('/', authenticateToken, async (req, res) => {
  try {
    const progresses = await Progress.find({ contractorId: req.user._id }).sort({ createdAt: -1 });
    res.json(progresses);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch progress', details: err.message });
  }
});

module.exports = router;
