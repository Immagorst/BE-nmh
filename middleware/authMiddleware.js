const jwt = require("jsonwebtoken");//Nhập thư viện jsonwebtoken
const User = require('../models/User');

exports.verifyAdmin = async (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).json({ message: "Không có token, vui lòng đăng nhập." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ message: "Người dùng không tồn tại." });
        }

        req.user = user; // Gắn thông tin người dùng vào request
        next();
    } catch (error) {
        res.status(401).json({ message: "Token không hợp lệ." });
    }
};

exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Bạn không có quyền truy cập tài nguyên này." });
        }
        next();
    };
};
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;//lấy giá trị của header Authorization từ yêu cầu HTTP.
//Kiểm tra sự tồn tại của header Authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Không có token, vui lòng đăng nhập." });
    }
//Tách lấy token từ Bearer
    const token = authHeader.split(" ")[1]; // Lấy token từ header

    try {
        //Xác thực token
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Xác thực token
        req.user = decoded; // Lưu thông tin user vào request
        next(); // Cho phép thực hiện tiếp
    } catch (err) {
        return res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn." });
    }
};

module.exports = verifyToken;
