# Order Service

Order Service là một microservice trong hệ thống ShopMan, chịu trách nhiệm xử lý các hoạt động liên quan đến đơn đặt hàng.

## Tính năng

- Tạo đơn hàng mới từ giỏ hàng của người dùng
- Kiểm tra tính hợp lệ của đơn hàng và tồn kho
- Lưu trữ thông tin đơn hàng
- Cập nhật trạng thái đơn hàng (chờ xác nhận, đang giao, hoàn thành, huỷ)
- Lấy danh sách và chi tiết đơn hàng của người dùng
- Giao tiếp với Notification Service để gửi email xác nhận đơn hàng

## API Specs

Chi tiết API tham khảo tại [API specification](../../docs/api-specs/order-service.yaml)

## Cấu hình môi trường

Tạo file `.env` dựa trên mẫu `.env.example` và cung cấp các thông tin kết nối như:
- Kết nối cơ sở dữ liệu (PostgreSQL/MongoDB/MySQL, v.v.)
- Thông tin kết nối tới các service khác (Product, Cart, Notification)
- Các secret dùng cho xác thực JWT

## Khởi động service

### Chạy bằng Docker

```sh
docker build -t order-service .
docker run --env-file .env -p 3002:3002 order-service
```

### Chạy thủ công

```sh
npm install
npm start
```

## Các endpoint chính

| HTTP Method | Endpoint           | Mô tả                                 |
|-------------|--------------------|---------------------------------------|
| POST        | `/api/orders`      | Tạo đơn hàng mới                      |
| GET         | `/api/orders`      | Lấy danh sách đơn hàng của người dùng |
| GET         | `/api/orders/{id}` | Lấy chi tiết một đơn hàng             |

> Các endpoint đặt hàng đều yêu cầu xác thực bằng JWT (Bearer Token).

## Công nghệ sử dụng

- Node.js (Alpine)
- Express.js
- Kết nối Database (Postgres/Mongo/Mysql tuỳ cấu hình)
- JWT Authentication
- Giao tiếp với các service khác qua RESTful API hoặc message queue (nếu có)

## Đóng góp & phát triển

- Fork repo, tạo branch mới cho feature/bugfix.
- Pull request kèm mô tả rõ ràng.
- Tuân thủ cấu trúc code và quy ước lint của dự án.

## Liên hệ & hỗ trợ

- Tham khảo tài liệu tổng thể trong thư mục `/docs`
- Vấn đề kỹ thuật: mở issue hoặc liên hệ team phát triển.

---