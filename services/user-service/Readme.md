# User Service

User Service là một microservice trong hệ thống ShopMan, chịu trách nhiệm quản lý thông tin người dùng, xác thực và phân quyền.

## Tính năng

- Đăng ký tài khoản người dùng mới
- Đăng nhập, xác thực bằng JWT
- Lấy thông tin người dùng
- Cập nhật profile cá nhân
- Đổi mật khẩu, quên mật khẩu
- Phân quyền (user, admin)

## API Specs

Xem chi tiết tại [API specification](../../docs/api-specs/user-service.yaml)

## Cấu hình môi trường

Tạo file `.env` dựa trên mẫu `.env.example` và điền các biến cần thiết như:
- Thông tin kết nối Database
- JWT Secret
- Các cấu hình gửi email xác thực (nếu có)

## Khởi động service

### Chạy bằng Docker

```sh
docker build -t user-service .
docker run --env-file .env -p 3001:3001 user-service
```

### Chạy thủ công

```sh
npm install
npm start
```

## Các endpoint chính

| HTTP Method | Endpoint             | Mô tả                             |
|-------------|----------------------|-----------------------------------|
| POST        | `/api/users/register`| Đăng ký người dùng mới            |
| POST        | `/api/users/login`   | Đăng nhập                         |
| GET         | `/api/users/me`      | Lấy thông tin cá nhân             |
| PUT         | `/api/users/me`      | Cập nhật thông tin cá nhân        |
| POST        | `/api/users/forgot-password` | Quên mật khẩu             |
| POST        | `/api/users/reset-password`  | Đặt lại mật khẩu            |

> Một số endpoint yêu cầu xác thực bằng JWT (Bearer Token).

## Công nghệ sử dụng

- Node.js (Alpine)
- Express.js
- JWT Authentication
- Database (MongoDB/Postgres/MySQL tuỳ cấu hình)
- (Tùy chọn) Nodemailer cho xác thực email

## Đóng góp & phát triển

- Fork repo, tạo branch mới cho feature/bugfix.
- Pull request kèm mô tả rõ ràng.
- Tuân thủ cấu trúc code và quy ước lint của dự án.

## Liên hệ & hỗ trợ

- Tham khảo tài liệu tổng thể trong thư mục `/docs`
- Vấn đề kỹ thuật: mở issue hoặc liên hệ team phát triển.

---