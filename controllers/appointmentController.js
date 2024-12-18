const Appointment = require('../models/Appointment');

// Thêm lịch hẹn mới
exports.createAppointment = async (req, res) => {
    try {
        const { spa, service, time, date, price } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!spa || !service || !time || !date || !price) {
            return res.status(400).json({ message: "Tất cả các trường là bắt buộc." });
        }

        // Lấy userId từ token
        const userId = req.user.id;

        // Tạo lịch hẹn mới
        const newAppointment = new Appointment({
            spa,
            service,
            time,
            date,
            price,
            userId,
        });

        await newAppointment.save();
        res.status(201).json({ message: "Đặt lịch thành công!", bookingId: newAppointment._id });
    } catch (err) {
        console.error("Lỗi khi tạo lịch hẹn:", err);
        res.status(500).json({ message: "Lỗi server." });
    }
};

// Xem tất cả lịch hẹn
exports.getAllAppointments = async (req, res) => {
    try {
        const userId = req.user.id; // Lấy ID người dùng từ token
        const appointments = await Appointment.find({ userId }); // Lấy lịch hẹn dựa trên userId
        res.status(200).json({ appointments });
    } catch (err) {
        console.error("Lỗi khi lấy lịch hẹn:", err);
        res.status(500).json({ message: "Không thể lấy dữ liệu lịch hẹn." });
    }
};

// Xóa lịch hẹn

exports.deleteAppointment = async (req, res) => {
    try {
        const appointmentId = req.params.id;

        // Kiểm tra xem lịch hẹn có tồn tại hay không
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ message: "Lịch hẹn không tồn tại." });
        }

        // Xóa lịch hẹn
        await Appointment.findByIdAndDelete(appointmentId);

        res.status(200).json({ message: "Xóa lịch hẹn thành công." });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server.", error: error.message });
    }
};

