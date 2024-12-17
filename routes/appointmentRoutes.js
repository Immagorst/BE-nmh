const express = require('express');
const Appointment = require('../models/Appointment');
const verifyToken = require("../middleware/authMiddleware");
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
// Tạo lịch hẹn
router.post('/', verifyToken,appointmentController.createAppointment,async (req, res) => {
    const { spa, service, time, date, price } = req.body;

    if (!spa || !service || !time || !date || !price) {
        return res.status(400).json({ message: 'Tất cả các trường là bắt buộc' });
    }

    try {
        const newAppointment = new Appointment({
            spa,
            service,
            time,
            date,
            price,
        });

        await newAppointment.save();
        res.status(201).json({ message: 'Đặt lịch thành công!', bookingId: newAppointment._id });
    } catch (err) {
        console.error('Lỗi khi tạo lịch hẹn:', err);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

// Lấy tất cả lịch hẹn
router.get('/', verifyToken ,appointmentController.getAllAppointments,async (req, res) => {
    try {
        const appointments = await Appointment.find();
        res.status(200).json({ appointments });
    } catch (err) {
        console.error('Lỗi khi lấy lịch hẹn:', err);
        res.status(500).json({ message: 'Lỗi server' });
    }
});
router.delete('/:id', verifyToken ,appointmentController.deleteAppointment);

module.exports = router;
