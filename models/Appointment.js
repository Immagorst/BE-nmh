const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    spa: { type: String, required: true },
    service: { type: String, required: true },
    time: { type: String, required: true },
    date: { type: String, required: true },
    price: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
