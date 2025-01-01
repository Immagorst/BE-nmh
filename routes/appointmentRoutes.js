const express = require('express');
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const  verifyAdmin  = require("../middleware/authMiddleware");
const appointmentController = require('../controllers/appointmentController');

// Tạo lịch hẹn
router.post('/', verifyToken, appointmentController.createAppointment);

// Lấy tất cả lịch hẹn
router.get('/', verifyToken, verifyAdmin, appointmentController.getAllAppointments);

// Xóa lịch hẹn
router.delete('/:id', verifyToken, appointmentController.deleteAppointment);

// Xác nhận lịch hẹn (update route này)
router.put('/approve/:id', verifyToken, verifyAdmin, appointmentController.approveAppointment);

module.exports = router;
