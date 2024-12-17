const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

// Load biến môi trường
dotenv.config();

// Kết nối MongoDB
connectDB();

// Khởi tạo ứng dụng Express
const app = express();

// Middleware để xử lý dữ liệu JSON
app.use(express.json());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Cấu hình CORS
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Định nghĩa các route
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
// Backend: Endpoint để lấy danh sách lịch hẹn
app.get('/api/appointments', async (req, res) => {
    try {
        const appointments = await Appointment.find(); // Lấy tất cả lịch hẹn từ DB

        // Đảm bảo rằng 'appointments' là một mảng hợp lệ
        if (appointments && Array.isArray(appointments)) {
            return res.status(200).json({ appointments }); // Trả về mảng lịch hẹn
        } else {
            return res.status(400).json({ message: 'Dữ liệu lịch hẹn không hợp lệ' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Không thể tải lịch hẹn từ server' });
    }
});

// Lắng nghe cổng
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
