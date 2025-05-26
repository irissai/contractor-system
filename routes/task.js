const express = require('express');
const multer = require("multer");
const router = express.Router();
const path = require("path");
const Task = require('../models/Task');
const fs = require("fs");


// ตั้งค่า storage ของ multer (เก็บไฟล์ในโฟลเดอร์ uploads)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // เก็บชื่อไฟล์เป็น timestamp + originalname
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });
router.post('/upload-documents', upload.array('documents'), async (req, res) => {
  try {
    const phase = Number(req.body.phase);
    let labels = req.body.labels;

    if (typeof labels === "string") {
      labels = [labels];
    }

    const files = req.files;

    for (let i = 0; i < files.length; i++) {
      const label = labels[i] || "ไม่มีชื่อเอกสาร";
      const file = files[i];

      // หา document ใน Task ที่ phase และ label ตรงกัน
      const task = await Task.findOne({ phase, "documents.label": label });

      if (task) {
        // ถ้าเจอ phase และ label document อยู่แล้ว ให้เพิ่มไฟล์เข้า documents.files array
        await Task.updateOne(
          { phase, "documents.label": label },
          { 
            $push: { 
              "documents.$.files": {
                filename: file.filename,
                originalname: file.originalname,
                filepath: file.path,
                uploadedAt: new Date(),
              }
            }
          }
        );
      } else {
        // ถ้าไม่เจอ document นั้นใน phase นี้ ให้สร้าง document ใหม่ใน phase นั้น
        await Task.updateOne(
          { phase },
          {
            $push: {
              documents: {
                type: "pdf", // หรือ type อื่น ๆ ถ้ามีข้อมูล
                label: label,
                multiple: false,
                files: [{
                  filename: file.filename,
                  originalname: file.originalname,
                  filepath: file.path,
                  uploadedAt: new Date(),
                }]
              }
            }
          },
          { upsert: true }  // ถ้า phase ยังไม่มีเลย จะสร้าง document ใหม่พร้อม phase
        );
      }
    }

    res.json({ message: "Upload and save documents successful" });
  } catch (error) {
    console.error("Error saving documents:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// POST /phases - เพิ่มหลาย phase พร้อม tasks
router.post('/', async (req, res) => {
  try {
    const data = req.body;

    if (!Array.isArray(data)) {
      return res.status(400).json({ message: 'ข้อมูลต้องเป็น array ของ phase objects' });
    }

    const newPhases = await Task.insertMany(data);
    res.status(201).json({ message: 'เพิ่มหลายเฟสสำเร็จ', data: newPhases });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error });
  }
});

// PATCH /api/task/update-percent
router.patch('/update-percent', async (req, res) => {
  try {
    const { phase, taskName, percent } = req.body;

    if (typeof percent !== 'number' || percent < 0 || percent > 100) {
      return res.status(400).json({ message: 'เปอร์เซ็นต์ไม่ถูกต้อง' });
    }

    const taskDoc = await Task.findOne({ phase });

    if (!taskDoc) return res.status(404).json({ message: 'ไม่พบ phase' });

    const task = taskDoc.tasks.find(t => t.name === taskName);
    if (!task) return res.status(404).json({ message: 'ไม่พบ task' });

    task.percent = percent;
    task.calculatedValue = (task.weight * percent) / 100;

    await taskDoc.save();

    res.json({ message: 'อัปเดตสำเร็จ', task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err });
  }
});



// ดึง tasks ทั้งหมด (ใช้ได้อยู่แล้ว)
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err });
  }
});

// ✅ ดึงเฉพาะ documents ของ phase ที่ระบุ
router.get("/documents/:phase", async (req, res) => {
  try {
    const phaseNum = Number(req.params.phase);
    const taskDoc = await Task.findOne({ phase: phaseNum });

    if (!taskDoc) {
      return res.status(404).json({ message: "ไม่พบ phase ที่ต้องการ" });
    }

    res.status(200).json({ documents: taskDoc.documents || [] });
  } catch (err) {
    console.error("Error loading documents:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err });
  }
});


router.put('/update-status', async (req, res) => {
  const { phase, name, newStatus } = req.body;
  try {
    const taskDoc = await Task.findOne({ phase });
    if (!taskDoc) return res.status(404).json({ message: 'ไม่พบ phase' });

    // ถ้า taskName เป็น object ให้เปรียบเทียบตามชื่อ
    let task;
    if (typeof name === 'object') {
      task = taskDoc.tasks.find(t => t.name === name.name);
    } else {
      task = taskDoc.tasks.find(t => t.name === name);
    }

    if (!task) return res.status(404).json({ message: 'ไม่พบ task' });

    task.status = newStatus;
    taskDoc.markModified('tasks');
    await taskDoc.save();

    res.status(200).json({ message: 'อัปเดตสถานะสำเร็จ', updatedTask: task });
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error });
  }
});


module.exports = router;
