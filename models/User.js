// models/User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  hashedPassword: { type: String, required: true }, // تغيير الحقل ليطابق استخدام الكود
  role: { type: String, enum: ["admin", "employee"], required: true },
});

module.exports = mongoose.model("User", UserSchema);
