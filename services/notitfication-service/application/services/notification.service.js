const EmailService = require("../../infratructure/mailer/emailService.js")
const RepositoryFactory = require("../../infratructure/repository/RepositoryFactory.js")
class NotificationService{
    static async NotiToUser(message){
        await RepositoryFactory.initialize()
        const NotitficationRepository = RepositoryFactory.getRepository("NotificationRepository")
        const {userId, orderId, orderTotal, orderItems = [], createAt, paymentMethod} = message
        let user 
        try {
            const notification = await NotitficationRepository.createNotification({
                type:"order",
                options:"success",
                content:`Don hang ${orderId} cua ban da duoc thanh toan thanh cong`,
                userId
                
            })
        } catch (error) {
            console.log("Notification Error::", error)
            throw new Error(error)
        }
        try {
            const emailService = new EmailService(user, null)
            emailService.sendInvoice("invoice", "Xac nhan mua hang cua shopman",{
                orderId,
                orderDate:new Date().toLocaleDateString("vi-VN"),
                paymentMethod:"Stripe",
                orderItems,
                orderTotal
            })
        } catch (error) {
            console.log("Email Notification Error:::",error)
            throw new Error(error)
        }

        console.log(`📧 Đã gửi email xác nhận cho đơn hàng ${orderId} → ${user.email}`);

    }
}

module.exports = NotificationService