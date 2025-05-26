const mongoose = require('mongoose');

const nameSchema = new mongoose.Schema({
 name: { type: String, required: true },
  weight: { type: Number, required: true },
  percent: { type: Number, default: 0 }, // ✅ ใหม่
  status: { type: String, default: '' },
  calculatedValue: { type: Number, default: 0 } // ✅ (weight * percent) / 100
});

const documentSchema = new mongoose.Schema({
  type: { type: String, required: true },       // pdf หรือ images
  label: { type: String, required: true },      // เช่น "แบบแปลน"
  multiple: { type: Boolean, default: false },
  files: [
    {
      filename: { type: String, required: true }, // ชื่อไฟล์ในระบบ
      originalname: { type: String },             // ชื่อไฟล์ที่อัปโหลดมา
      filepath: { type: String },                 // path เก็บไฟล์
      uploadedAt: { type: Date, default: Date.now }
    }
  ]
});


const taskSchema = new mongoose.Schema({
  phase: { type: Number, required: true },
  tasks: [nameSchema],
  documents: [documentSchema] // ✅ เพิ่มเอกสารในแต่ละ phase
});

module.exports = mongoose.model('Task', taskSchema);
