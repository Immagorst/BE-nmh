// Cấu hình transporter để gửi email
const nodemailer = require("nodemailer");

// Hàm gửi email
exports.sendEmail = async (to, subject, text) => {
    try {
        console.log("Bắt đầu gửi email...");
        console.log("Người nhận:", to);
        console.log("Tiêu đề:", subject);

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER, // Email gửi
                pass: process.env.EMAIL_PASS, // Mật khẩu ứng dụng
            },
        });

        // Định nghĩa nội dung email
        const mailOptions = {
            from: process.env.EMAIL_USER, // Email gửi
            to, // Email người nhận
            subject, // Tiêu đề email
            text, // Nội dung dạng text
        };

        // Gửi email
        const info = await transporter.sendMail(mailOptions);
        console.log("Email đã được gửi:", info.response);
    } catch (error) {
        console.error("Lỗi khi gửi email:", error);
        throw new Error("Không thể gửi email.");
    }
};
