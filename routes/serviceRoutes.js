const express = require("express");
const {
    addService,
    deleteService,
    updateService,
    getAllServices,
    approveService,
} = require("../controllers/serviceController");
const verifyToken = require ("../middleware/authMiddleware");
const router = express.Router();

// Thêm dịch vụ (có `spaName`)
router.post("/add", verifyToken ,addService);

// Xóa dịch vụ
router.delete("/delete/:id", verifyToken ,deleteService);

// Cập nhật dịch vụ
router.put("/update/:id", verifyToken,updateService);

// Lấy danh sách dịch vụ
router.get("/all",getAllServices);

// Xác nhận dịch vụ
router.put("/approve/:id", verifyToken,approveService);

module.exports = router;
