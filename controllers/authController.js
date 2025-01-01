const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');
dotenv.config();
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
    try {
        const { email, password } = req.body;

        // Lấy thông tin tài khoản admin từ .env
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        // Kiểm tra nếu là admin
        if (email === adminEmail && password === adminPassword) {
            const token = jwt.sign({ email: adminEmail, role: 'admin' }, process.env.JWT_SECRET, {
                expiresIn: '1d',
            });

            return res.status(200).json({ message: 'Đăng nhập thành công (Admin)', token });
        }

        // Nếu không phải admin, kiểm tra tài khoản trong database
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
        }

        // Kiểm tra mật khẩu người dùng
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
        }

        // Tạo JWT token cho người dùng
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });

        return res.status(200).json({
            message: 'Đăng nhập thành công',
            token,
            user: { name: user.name, email: user.email, role: user.role },
        });
    } catch (error) {
        console.error('Lỗi khi đăng nhập:', error);
        return res.status(500).json({ message: 'Đã xảy ra lỗi trong quá trình đăng nhập' });
    }
};