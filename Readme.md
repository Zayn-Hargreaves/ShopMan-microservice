# ShopMan Microservice

## Giới thiệu

Đây là dự án microservices cho hệ thống ShopMan, được xây dựng với kiến trúc microservices, sử dụng Docker, API Gateway, và dễ dàng mở rộng.

- **Monorepo** quản lý nhiều microservice độc lập
- **Docker Compose** để phối hợp và triển khai toàn bộ hệ thống
- **API Gateway** tập trung hóa truy cập các dịch vụ

## Cấu trúc thư mục

```
.
├── README.md
├── .env.example
├── docker-compose.yml
├── docs/
│   ├── architecture.md
│   ├── analysis-and-design.md
│   └── api-specs/
├── scripts/
│   └── init.sh
├── services/
│   ├── service-a/
│   └── service-b/
└── gateway/
```

**Giải thích:**
- `docs/`: Tài liệu phân tích, thiết kế, kiến trúc, OpenAPI specs cho các service.
- `scripts/`: Script phục vụ khởi tạo và triển khai.
- `services/`: Mỗi thư mục là một microservice độc lập (A, B, ...)
- `gateway/`: API Gateway hoặc reverse proxy.

## Yêu cầu

- Docker & Docker Compose
- Node.js (nếu muốn chạy dịch vụ ngoài container)
- Các biến môi trường trong `.env.example`

## Hướng dẫn khởi chạy

1. **Copy biến môi trường:**
   ```bash
   cp .env.example .env
   ```
   Chỉnh sửa giá trị biến môi trường cho phù hợp.

2. **Khởi động toàn bộ hệ thống bằng Docker Compose:**
   ```bash
   docker-compose up --build
   ```

3. **Truy cập API Gateway** tại địa chỉ:
   ```
   http://localhost:<gateway_port>
   ```

## Tài liệu & đặc tả API

- Xem chi tiết tại thư mục `docs/`
- OpenAPI specs cho từng service nằm ở `docs/api-specs/`

## Đóng góp

1. Fork/Pull Request với mô tả thay đổi rõ ràng
2. Đảm bảo code tuân thủ cấu trúc repo và tài liệu API
3. Thêm tài liệu nếu bổ sung/chỉnh sửa tính năng

## Thông tin liên hệ

- Chủ repo: @Zayn-Hargreaves
- Vui lòng tạo issue nếu gặp lỗi hoặc cần hỗ trợ.

---

*Repo này tuân theo kiến trúc microservices, thuận tiện cho việc mở rộng và maintain lâu dài.*