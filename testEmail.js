require("dotenv").config();
const { sendEmail } = require("./utils/emailService");

(async () => {
    try {
        await sendEmail(
            "hiepzeronine@gmail.com", // Thay bằng email nhận
            "Test Email",
            "Đây là email kiểm tra từ hệ thống đặt lịch."
        );
        console.log("Email đã gửi thành công!");
    } catch (err) {
        console.error("Lỗi khi gửi email:", err.message);
    }
})();
