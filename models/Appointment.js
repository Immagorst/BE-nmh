const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    spa: { type: String, required: true },
    service: { type: String, required: true },
    time: { type: String, required: true },
    date: { type: String, required: true },
    price: { type: Number, required: true },
    email: { type: String, required: true }, // Thêm trường email
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, default: "pending" }, // Thêm trường status
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
