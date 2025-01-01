const Service = require("../models/Service");

// Thêm dịch vụ
exports.addService = async (req, res) => {
    const { spaName, name, description, price } = req.body;

    // Kiểm tra thông tin đầu vào
    if (!spaName || !name || !price) {
        return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin." });
    }

    try {
        // Tạo dịch vụ mới với trạng thái "approved"
        const newService = new Service({
            spaName,
            name,
            description,
            price,
            status: "approved", // Trạng thái mặc định là "approved"
        });

        await newService.save(); // Lưu dịch vụ vào cơ sở dữ liệu

        res.status(201).json({ message: "Dịch vụ đã được thêm thành công!", service: newService });
    } catch (error) {
        console.error("Lỗi khi thêm dịch vụ:", error.message);
        res.status(500).json({ message: "Đã xảy ra lỗi khi thêm dịch vụ.", error: error.message });
    }
};


// Xóa dịch vụ
exports.deleteService = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedService = await Service.findByIdAndDelete(id);

        if (!deletedService) {
            return res.status(404).json({ message: "Dịch vụ không tồn tại." });
        }

        res.status(200).json({ message: "Dịch vụ đã được xóa.", service: deletedService });
    } catch (error) {
        console.error("Lỗi khi xóa dịch vụ:", error.message);
        res.status(500).json({ message: "Đã xảy ra lỗi khi xóa dịch vụ.", error: error.message });
    }
};

// Cập nhật dịch vụ
exports.updateService = async (req, res) => {
    const { id } = req.params;
    const { spaName, name, description, price } = req.body;

    if (!spaName || !name || !price) {
        return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin." });
    }

    try {
        const updatedService = await Service.findByIdAndUpdate(
            id,
            { spaName, name, description, price },
            { new: true }
        );

        if (!updatedService) {
            return res.status(404).json({ message: "Dịch vụ không tồn tại." });
        }

        res.status(200).json({ message: "Dịch vụ đã được cập nhật.", service: updatedService });
    } catch (error) {
        console.error("Lỗi khi cập nhật dịch vụ:", error.message);
        res.status(500).json({ message: "Đã xảy ra lỗi khi cập nhật dịch vụ.", error: error.message });
    }
};


// Lấy danh sách dịch vụ
exports.getAllServices = async (req, res) => {
    try {
        const services = await Service.find({ status: "approved" });
        const pendingServices = await Service.find({ status: "pending" });
        res.status(200).json({ services, pendingServices });
    } catch (error) {
        console.error("Lỗi khi lấy danh sách dịch vụ:", error.message);
        res.status(500).json({ message: "Đã xảy ra lỗi khi lấy danh sách dịch vụ.", error: error.message });
    }
};


// Xác nhận dịch vụ
exports.approveService = async (req, res) => {
    const { id } = req.params;

    try {
        const approvedService = await Service.findByIdAndUpdate(
            id,
            { status: "approved" },
            { new: true }
        );

        if (!approvedService) {
            return res.status(404).json({ message: "Dịch vụ không tồn tại." });
        }

        res.status(200).json({ message: "Dịch vụ đã được xác nhận.", service: approvedService });
    } catch (error) {
        console.error("Lỗi khi xác nhận dịch vụ:", error.message);
        res.status(500).json({ message: "Đã xảy ra lỗi khi xác nhận dịch vụ.", error: error.message });
    }
};

