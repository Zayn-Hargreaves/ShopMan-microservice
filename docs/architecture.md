# Kiến trúc hệ thống ShopMan Microservice

## 1. Giới thiệu tổng quan

Hệ thống ShopMan được xây dựng theo kiến trúc microservices, đảm bảo khả năng mở rộng, dễ bảo trì, triển khai linh hoạt và tách biệt chức năng giữa các thành phần.

## 2. Thành phần chính

- **API Gateway:** Là điểm truy cập duy nhất cho client, thực hiện routing, xác thực, load balancing và chuyển tiếp request đến các service thành phần.
- **Service A, Service B, ...:** Mỗi service đảm nhiệm một chức năng nghiệp vụ riêng biệt (ví dụ: User Service, Order Service, Product Service). Các service giao tiếp với nhau qua HTTP (REST) hoặc message broker (RabbitMQ).
- **Database:** Mỗi service có thể có cơ sở dữ liệu riêng (database per service) để đảm bảo tính độc lập.
- **Message Broker (RabbitMQ):** Dùng cho giao tiếp bất đồng bộ và event-driven giữa các service.
- **Redis:** Sử dụng cho cache, session hoặc hàng đợi nhẹ.
- **External Services:** Tích hợp với bên thứ ba như Google OAuth, Stripe.

## 3. Sơ đồ kiến trúc tổng thể

```
+-----------+         +-------------+      +-------------+
|           |  HTTPS  |             |  --> |  Service A  | --> [DB A]
|  Client   +-------> | API Gateway |      +-------------+
| (browser, |         |             |  --> |  Service B  | --> [DB B]
|  mobile)  |         +-------------+      +-------------+
|           |               |                  ...
+-----------+               |              +-------------+
                            +------------> |  Service N  | --> [DB N]
                               REST/gRPC   +-------------+
                               /AMQP
                                  |
                               +------+
                               |Redis |
                               +------+
                                  |
                               +--------+
                               |RabbitMQ|
                               +--------+
```

## 4. Giao tiếp giữa các thành phần

- **Client <-> Gateway:** REST API/HTTP, Auth (JWT, OAuth)
- **Gateway <-> Service:** REST API/HTTP hoặc gRPC
- **Service <-> Service:** REST, gRPC hoặc message queue qua RabbitMQ
- **Service <-> Database:** Kết nối riêng biệt, không chia sẻ CSDL.
- **Service <-> Redis/RabbitMQ:** Cache, queue, pub/sub.

## 5. Lý do chọn kiến trúc microservices

- Dễ dàng mở rộng chức năng từng phần, phát triển độc lập.
- Triển khai, sửa lỗi, cập nhật từng dịch vụ mà không ảnh hưởng hệ thống tổng thể.
- Tăng tính sẵn sàng, chịu lỗi (một service lỗi không ảnh hưởng toàn bộ).
- Dễ tích hợp với các hệ thống bên ngoài qua gateway.

## 6. Công nghệ sử dụng

- **Node.js/Express:** cho các microservice.
- **Docker/Docker Compose:** đóng gói, triển khai service.
- **RabbitMQ:** message broker cho event-driven.
- **Redis:** caching, queue.
- **PostgreSQL:** hệ quản trị cơ sở dữ liệu quan hệ.
- **Nginx hoặc Express Gateway:** API Gateway.

## 7. Định hướng mở rộng

- Có thể bổ sung các service mới mà không ảnh hưởng code base cũ.
- Hỗ trợ CI/CD để tự động hoá kiểm thử và triển khai.
- Giám sát (monitoring), logging tập trung qua gateway hoặc các công cụ như ELK, Prometheus.

---

*Vui lòng xem thêm các tài liệu chi tiết trong thư mục `/docs` để hiểu rõ từng service và các đặc tả API.*