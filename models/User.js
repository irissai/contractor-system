const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'contractor'], required: true },

  // ข้อมูลเพิ่มเติม
  projectName: { type: String },              // ชื่อโครงการ
  plotNumber: { type: String },               // เลขแปลง
  contractStart: { type: Date },              // วันที่เริ่มสัญญา
  contractEnd: { type: Date },                // วันที่สิ้นสุดสัญญา
  houseDetail: { type: String },              // รายละเอียดบ้าน
  mainContractor: { type: String },           // ผู้รับเหมาหลัก
});

module.exports = mongoose.model('User', userSchema);
