const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema(
    {
        spaName: {
            type: String,
            required: true, // Yêu cầu phải có tên Spa khi thêm dịch vụ
        },
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            default: "",
        },
        price: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["approved", "pending"], // approved = đã duyệt, pending = chờ duyệt
            default: "pending",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Service", ServiceSchema);
