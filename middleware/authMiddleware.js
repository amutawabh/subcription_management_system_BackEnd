//middleware/authMiddleware.js

const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Access Denied" });
    }

    const token = authHeader.split(" ")[1];
    const verified = jwt.verify(token, process.env.JWT_SECRET); // تحقق من صحة التوكن باستخدام المفتاح السري
    
    // التحقق من أن التوكن يحتوي على البيانات الضرورية
    if (!verified || !verified.role) {
      return res.status(403).json({ message: "Invalid Token Data: Role is missing" });
    }
    
    req.user = verified; // إضافة بيانات المستخدم إلى الطلب
    next(); // الانتقال إلى الوظيفة التالية
  } catch (error) {
    console.error("Authentication Error:", error); // تسجيل الخطأ للمراجعة
    res.status(401).json({ message: "Invalid Token" });
  }
};

module.exports = authMiddleware;
