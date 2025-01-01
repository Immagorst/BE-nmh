const Appointment = require('../models/Appointment');
const {sendEmail} = require("../utils/emailService"); // Import hàm gửi email

// Thêm lịch hẹn mới
exports.createAppointment = async (req, res) => {
    try {
        const { spa, service, time, date, price, email } = req.body;

        // Kiểm tra các trường
        if (!spa || !service || !time || !date || !price || !email) {
            console.error("Dữ liệu không đầy đủ:", { spa, service, time, date, price, email });
            return res.status(400).json({ message: "Tất cả các trường là bắt buộc." });
        }

        const userId = req.user.id;

        // Tạo lịch hẹn mới
        const newAppointment = new Appointment({
            spa,
            service,
            time,
            date,
            price,
            email,
            userId,
            status: "pending",
        });

        await newAppointment.save();
        console.log("Lịch hẹn đã được lưu:", newAppointment);

        res.status(201).json({
            message: "Lịch hẹn đã được tạo thành công!",
            bookingId: newAppointment._id,
        });
    } catch (error) {
        console.error("Lỗi khi tạo lịch hẹn:", error);

        if (error.message.includes("Không thể gửi email")) {
            return res.status(201).json({
                message: "Lịch hẹn đã được tạo nhưng không thể gửi email xác nhận.",
                bookingId: newAppointment._id,
            });
        }

        res.status(500).json({ message: "Lỗi server.", error: error.message });
    }
};



// Xem tất cả lịch hẹn
exports.getAllAppointments = async (req, res) => {
    try {
        const userId = req.user.id; // Lấy ID người dùng từ token
        const userRole = req.user.role; // Lấy vai trò của người dùng

        let appointments;

        // Nếu là admin, lấy toàn bộ danh sách lịch hẹn
        if (userRole === 'admin') {
            appointments = await Appointment.find({});
        } else if (userRole === 'user') {
            // Nếu là khách hàng, chỉ lấy các lịch hẹn của chính họ
            appointments = await Appointment.find({ userId });
        } else {
            return res.status(403).json({ message: "Bạn không có quyền xem lịch hẹn." });
        }

        if (!appointments || appointments.length === 0) {
            return res.status(404).json({ message: "Không có lịch hẹn nào." });
        }

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
        console.error("Lỗi khi xóa lịch hẹn:", error);
        res.status(500).json({ message: "Lỗi server.", error: error.message });
    }
};
// Xác nhận lịch hẹn
exports.approveAppointment = async (req, res) => {
    try {
        const appointmentId = req.params.id;

        // Tìm lịch hẹn
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ message: "Lịch hẹn không tồn tại." });
        }

        // Cập nhật trạng thái lịch hẹn
        appointment.status = "approved";
        await appointment.save();

        // Gửi email xác nhận
        const subject = "Lịch hẹn đã được xác nhận";
        const text = `
            Chào bạn,
            Lịch hẹn của bạn đã được xác nhận:
            - Spa: ${appointment.spa}
            - Dịch vụ: ${appointment.service}
            - Ngày: ${appointment.date}
            - Giờ: ${appointment.time}
            - Giá: ${appointment.price} VNĐ
        `;
        await sendEmail(appointment.email, subject, text);

        res.status(200).json({ message: "Lịch hẹn đã được xác nhận và email đã được gửi." });
    } catch (error) {
        console.error("Lỗi khi xác nhận lịch hẹn:", error);
        res.status(500).json({ message: "Lỗi khi xác nhận lịch hẹn.", error });
    }
};

