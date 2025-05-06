# Cart Service

Cart Service là một microservice trong hệ thống ShopMan, chịu trách nhiệm quản lý giỏ hàng của người dùng (thêm, sửa, xóa, xem sản phẩm trong giỏ hàng).

## Tính năng

- Thêm sản phẩm vào giỏ hàng
- Xem giỏ hàng hiện tại của user
- Cập nhật số lượng sản phẩm trong giỏ hàng
- Xóa sản phẩm khỏi giỏ hàng
- Xóa toàn bộ giỏ hàng

## API Specs

Xem chi tiết [API specification tại đây](../../docs/api-specs/cart-service.yaml)

## Cấu hình môi trường

Tạo file `.env` dựa trên mẫu `.env.example` và điền các thông tin kết nối cần thiết (Redis, Database, JWT...).

## Khởi động service

### Chạy bằng Docker

```sh
docker build -t cart-service .
docker run --env-file .env -p 3003:3003 cart-service
```

### Chạy thủ công

```sh
npm install
npm start
```

## Các endpoint chính

| HTTP Method | Endpoint           | Mô tả                         |
|-------------|--------------------|-------------------------------|
| GET         | `/api/cart`        | Lấy giỏ hàng của user         |
| POST        | `/api/cart`        | Thêm sản phẩm vào giỏ hàng    |
| PUT         | `/api/cart/item`   | Cập nhật số lượng sản phẩm    |
| DELETE      | `/api/cart/item`   | Xóa một sản phẩm khỏi giỏ     |
| DELETE      | `/api/cart`        | Xóa toàn bộ giỏ hàng          |

> Mọi endpoint đều yêu cầu xác thực bằng JWT (Bearer Token).

## Kiến trúc – Công nghệ sử dụng

- Node.js (Alpine)
- Express.js
- Redis (dùng làm storage hoặc cache cho cart)
- JWT Authentication

## Đóng góp & phát triển

- Fork repo, tạo branch mới cho feature/bugfix.
- Pull request kèm mô tả rõ ràng.
- Tuân thủ cấu trúc code và quy ước lint của dự án.

## Liên hệ & hỗ trợ

- Tham khảo tài liệu tổng thể trong thư mục `/docs`
- Vấn đề kỹ thuật: mở issue hoặc liên hệ team phát triển.

---