const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Đăng ký người dùng
exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    // Kiểm tra thông tin đầu vào
    if (!name || !email || !password) {
        return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin" });
    }

    try {
        // Kiểm tra email đã tồn tại
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email đã được sử dụng. Vui lòng thử email khác." });
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tạo người dùng mới
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });

        // Lưu người dùng vào cơ sở dữ liệu
        await newUser.save();

        // Tạo token JWT
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET không được cấu hình trong môi trường");
        }
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        // Phản hồi thành công
        res.status(201).json({
            message: "Đăng ký thành công",
            data: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
            },
            token,
        });
    } catch (error) {
        console.error("Lỗi khi đăng ký:", error.message);
        res.status(500).json({ message: "Đã xảy ra lỗi khi đăng ký", error: error.message });
    }
};

// Đăng nhập người dùng
exports.login = async (req, res) => {
    const { email, password } = req.body;

    // Kiểm tra thông tin đầu vào
    if (!email || !password) {
        return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin" });
    }

    try {
        // Tìm người dùng trong cơ sở dữ liệu
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Email không tồn tại. Vui lòng kiểm tra lại." });
        }

        // Kiểm tra mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Mật khẩu không đúng. Vui lòng thử lại." });
        }

        // Tạo token JWT
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET không được cấu hình trong môi trường");
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // Phản hồi thành công
        res.status(200).json({
            message: "Đăng nhập thành công",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("Lỗi khi đăng nhập:", error.message);
        res.status(500).json({ message: "Đã xảy ra lỗi khi đăng nhập", error: error.message });
    }
};
