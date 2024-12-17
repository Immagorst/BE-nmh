const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Đăng ký người dùng
exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin" });
    }

    try {
        // Kiểm tra email đã tồn tại chưa
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email đã được sử dụng" });
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tạo người dùng mới
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });

        // Lưu vào cơ sở dữ liệu
        await newUser.save();

        // Tạo token JWT
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({ message: "Đăng ký thành công", data: newUser, token });
    } catch (error) {
        res.status(500).json({ message: "Đã xảy ra lỗi khi đăng ký", error: error.message });
    }
};

// Đăng nhập người dùng
exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin" });
    }

    try {
        // Tìm người dùng trong cơ sở dữ liệu
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Email không tồn tại" });
        }

        // Kiểm tra mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Mật khẩu không đúng" });
        }

        // Tạo token JWT
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({ message: "Đăng nhập thành công", token, user });
    } catch (error) {
        res.status(500).json({ message: "Đã xảy ra lỗi khi đăng nhập", error: error.message });
    }
};
