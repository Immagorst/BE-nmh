const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Không có token, vui lòng đăng nhập." });
    }

    const token = authHeader.split(" ")[1]; // Lấy token từ header

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Xác thực token
        req.user = decoded; // Lưu thông tin user vào request
        next(); // Cho phép thực hiện tiếp
    } catch (err) {
        return res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn." });
    }
};

module.exports = verifyToken;
