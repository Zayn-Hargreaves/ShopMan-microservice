
class OtpRepository {
    constructor(models) {
        this.Otp = models.Otp;
    }

    async findByValue(otpValue) {
        return await this.Otp.findOne({ where: { otp_value: otpValue } });
    }

    async deleteOtp(otpValue) {
        return await this.Otp.destroy({ where: { otp_value: otpValue } });
    }

    async createOtp({ otp_value, UserId, expire }) {
        return await this.Otp.create({ otp_value, UserId, expire });
    }
}

// Export factory function để khởi tạo repository bất đồng bộ
module.exports = OtpRepository