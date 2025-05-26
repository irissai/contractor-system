const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  filename: String,
  originalname: String,
  mimetype: String,
  path: String,
  size: Number
});

const checklistItemSchema = new mongoose.Schema({
  item: String,
  passed: Boolean
});

const precheckItemSchema = new mongoose.Schema({
  item: String,
  result: { type: String, enum: ['pass', 'fail'] }
});

const inspectionRequestSchema = new mongoose.Schema({
  inspectorName: String,
  requestDate: Date,
  note: String
});

const progressSchema = new mongoose.Schema({
  contractorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  project: String,
  plotNumber: String,
  phase: String,
  checklist: [checklistItemSchema],
  precheck: [precheckItemSchema],
  inspectionRequest: inspectionRequestSchema,
  pdfPath: String,
  imagePaths: [String],
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Progress', progressSchema);
