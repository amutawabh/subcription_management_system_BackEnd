// models/User.js

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    hashedPassword: { type: String, required: true }, // كلمة المرور المُشفرة
    role: { type: String, enum: ["admin", "employee"], required: true }, // دور المستخدم
  },
  { timestamps: true } // يضيف الحقول createdAt و updatedAt تلقائيًا
);

module.exports = mongoose.model("User", UserSchema);
