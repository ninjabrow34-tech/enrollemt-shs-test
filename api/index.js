import express from "express";
import multer from "multer";
import mongoose from "mongoose";

const app = express();
const upload = multer({ dest: "uploads/" });

mongoose.connect(process.env.MONGO_URI);

const Enrollment = mongoose.model("Enrollment", new mongoose.Schema({
  fullName: String,
  email: String,
  phone: String,
  gender: String,
  gradeLevel: String,
  strand: String,
  files: {
    form138: String,
    birthCert: String
  },
  accepted: { type: Boolean, default: false }
}));

// Submit enrollment
app.post("/api/enroll", upload.fields([
  { name: "form138" },
  { name: "birthCert" }
]), async (req, res) => {

  const enrollment = new Enrollment({
    ...req.body,
    files: {
      form138: req.files.form138[0].filename,
      birthCert: req.files.birthCert[0].filename
    }
  });

  await enrollment.save();
  res.send("Enrollment submitted successfully.");
});

// Registrar access
app.post("/api/registrar/login", (req, res) => {
  if (req.body.code === "SHS-REG-2026") {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false });
  }
});

export default app;
