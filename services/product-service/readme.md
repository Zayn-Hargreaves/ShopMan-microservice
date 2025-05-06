# Product Service

Product Service là một microservice trong hệ thống ShopMan, chịu trách nhiệm quản lý thông tin và tồn kho sản phẩm.

## Tính năng

- Thêm, sửa, xóa sản phẩm (dành cho admin)
- Lấy danh sách sản phẩm
- Xem chi tiết sản phẩm
- Kiểm tra tồn kho sản phẩm

## API Specs

Tham khảo chi tiết API tại [API specification](../../docs/api-specs/product-service.yaml)

## Cấu hình môi trường

Tạo file `.env` dựa trên mẫu `.env.example` và cấu hình các biến môi trường cần thiết (kết nối CSDL, JWT secret, v.v.)

## Khởi động service

### Chạy bằng Docker

```sh
docker build -t product-service .
docker run --env-file .env -p 3005:3005 product-service
```

### Chạy thủ công

```sh
npm install
npm start
```

## Các endpoint chính

| HTTP Method | Endpoint                 | Mô tả                              |
|-------------|--------------------------|------------------------------------|
| GET         | `/api/products`          | Lấy danh sách sản phẩm             |
| POST        | `/api/products`          | Thêm sản phẩm mới (admin)          |
| GET         | `/api/products/{id}`     | Xem chi tiết sản phẩm              |
| PUT         | `/api/products/{id}`     | Cập nhật thông tin sản phẩm (admin)|
| DELETE      | `/api/products/{id}`     | Xóa sản phẩm (admin)               |
| GET         | `/api/products/{id}/stock` | Kiểm tra tồn kho sản phẩm         |

> Các endpoint thay đổi dữ liệu yêu cầu xác thực bằng JWT (Bearer Token) và phân quyền admin.

## Công nghệ sử dụng

- Node.js (Alpine)
- Express.js
- Database (MongoDB/Postgres/MySQL tuỳ cấu hình)
- JWT Authentication

## Đóng góp & phát triển

- Fork repo, tạo branch mới cho feature/bugfix.
- Pull request kèm mô tả rõ ràng.
- Tuân thủ cấu trúc code và quy ước lint của dự án.

## Liên hệ & hỗ trợ

- Tham khảo tài liệu tổng thể trong thư mục `/docs`
- Vấn đề kỹ thuật: mở issue hoặc liên hệ team phát triển.

---