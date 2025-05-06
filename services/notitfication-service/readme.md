# Notification Service

Notification Service là một microservice trong hệ thống ShopMan, chịu trách nhiệm gửi email thông báo cho người dùng (xác nhận đơn hàng, thông báo hệ thống, v.v.).

## Tính năng

- Gửi email xác nhận đơn hàng đến khách hàng
- Gửi các thông báo hệ thống khác qua email
- Dễ dàng mở rộng để gửi SMS, push notification trong tương lai

## API Specs

Chi tiết API tham khảo tại [API specification](../../docs/api-specs/notification-service.yaml)

## Cấu hình môi trường

Tạo file `.env` dựa theo mẫu `.env.example` và cấu hình các biến như:
- SMTP host, port, user, password (dùng để gửi email)
- Các cài đặt liên quan đến provider email nếu có

## Khởi động service

### Chạy bằng Docker

```sh
docker build -t notification-service .
docker run --env-file .env -p 3004:3004 notification-service
```

### Chạy thủ công

```sh
npm install
npm start
```

## Các endpoint chính

| HTTP Method | Endpoint           | Mô tả                          |
|-------------|--------------------|--------------------------------|
| POST        | `/api/notify/email`| Gửi email cho người dùng       |
| GET         | `/api/notify/test` | Kiểm tra trạng thái service    |

> Các endpoint sẽ được sử dụng chủ yếu bởi các service khác (Order Service, User Service, v.v.)

## Công nghệ sử dụng

- Node.js (Alpine)
- Express.js
- Nodemailer (hoặc provider khác cho email)

## Đóng góp & phát triển

- Fork repo, tạo branch mới cho feature/bugfix.
- Pull request kèm mô tả rõ ràng.
- Tuân thủ cấu trúc code và quy ước lint của dự án.

## Liên hệ & hỗ trợ

- Tham khảo tài liệu tổng thể trong thư mục `/docs`
- Vấn đề kỹ thuật: mở issue hoặc liên hệ team phát triển.

---