import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
  label: { type: String, required: true },
  checked: { type: Boolean, required: true },
  detail: { type: String, default: "" },
});

// const requestSchema = new mongoose.Schema({
//   contractorName: { type: String, required: true },  // ชื่อผู้รับเหมา
//   inspectionDate: { type: String, required: true },  // วันที่ (เก็บเป็น string "YYYY-MM-DD")
//   inspectionTime: { type: String, required: true },  // เวลา (เก็บเป็น string "HH:mm")
//   workItems: [workItemSchema],                        // รายการงาน
// }, { timestamps: true });

const Request = mongoose.model("Request", requestSchema);

export default Request;
