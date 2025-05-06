# Phân tích & Thiết kế hệ thống ShopMan Microservice

## 1. Phân tích nghiệp vụ

### Quy trình đặt hàng tổng quát

1. **Đăng ký tài khoản (Sign Up):**
   - Người dùng cung cấp email, mật khẩu, thông tin cá nhân để đăng ký.
   - Hệ thống kiểm tra trùng lặp và lưu trữ thông tin người dùng mới.
   - Gửi email xác thực (nếu cần).

2. **Đăng nhập (Sign In):**
   - Người dùng nhập email và mật khẩu.
   - Hệ thống xác thực thông tin, cấp JWT access token và refresh token.

3. **Quản lý người dùng:**
   - Cập nhật thông tin cá nhân, thay đổi mật khẩu, quên mật khẩu, phân quyền (user, admin…).

4. **Quản lý sản phẩm:**
   - Admin thêm, sửa, xóa sản phẩm.
   - Người dùng xem danh sách, chi tiết sản phẩm.

5. **Quản lý giỏ hàng:**
   - Người dùng thêm, sửa, xóa sản phẩm trong giỏ hàng.
   - Xem tổng giá trị, số lượng mặt hàng.

6. **Đặt hàng (Order):**
   - Người dùng xác nhận đơn hàng từ giỏ.
   - Hệ thống kiểm tra đăng nhập, xác minh quyền hạn.
   - Hệ thống nhận thông tin cá nhân và địa chỉ giao hàng.
   - Nhận thông tin sản phẩm, số lượng đặt hàng.
   - Kiểm tra tính hợp lệ của yêu cầu (số lượng, thời gian giao hàng…).
   - Kiểm tra kho đáp ứng đủ số lượng không.
   - Nếu không đủ, thông báo lỗi cho người dùng.
   - Nếu đủ:
     - Lưu đơn hàng vào database.
     - Cập nhật lại số lượng tồn kho.
     - Xóa sản phẩm khỏi giỏ hàng.
     - Gửi email xác nhận đặt hàng thành công.

7. **Thanh toán và Xử lý giao dịch:**
   - Tích hợp thanh toán (Stripe, Momo, v.v…) khi cần.
   - Xác nhận trạng thái thanh toán.

8. **Lịch sử đơn hàng & Quản lý đơn hàng:**
   - Người dùng xem lịch sử đơn hàng.
   - Admin xem và cập nhật trạng thái đơn hàng (chờ xác nhận, đang giao, hoàn thành, huỷ…).

---

## 2. Thiết kế chức năng theo microservices

### Các service chính đề xuất:

- **User Service:** Quản lý đăng ký, đăng nhập, thông tin người dùng, xác thực, phân quyền.
- **Product Service:** Quản lý sản phẩm, tồn kho.
- **Cart Service:** Quản lý giỏ hàng của từng người dùng.
- **Order Service:** Xử lý nghiệp vụ đặt hàng, lưu đơn hàng, kiểm tra kho, cập nhật tồn kho.
- **Notification Service:** Gửi email xác nhận, thông báo hệ thống.
- **Payment Service:** (Tùy chọn) Xử lý thanh toán online.
- **API Gateway:** Tiếp nhận request, phân phối đến các service phù hợp, xác thực JWT.

### Giao tiếp

- **RESTful API** qua API Gateway cho các thao tác đồng bộ.
- **RabbitMQ** cho các sự kiện bất đồng bộ, ví dụ: gửi mail, cập nhật tồn kho, giao dịch thanh toán.

---

## 3. Lưu đồ quy trình đặt hàng (Dạng mô tả)

1. Khách hàng đăng nhập/đăng ký tài khoản.
2. Chọn sản phẩm ➔ thêm vào giỏ hàng.
3. Kiểm tra và xác nhận giỏ hàng.
4. Gửi yêu cầu đặt hàng.
5. Gateway xác thực người dùng → chuyển đến Order Service.
6. Order Service nhận thông tin order, kiểm tra hợp lệ, kiểm tra kho qua Product Service.
7. Nếu kho đủ:
   - Lưu đơn order vào DB.
   - Product Service cập nhật tồn kho.
   - Cart Service xóa sản phẩm khỏi giỏ.
   - Notification Service gửi email xác nhận.
   - (Nếu có) Payment Service xử lý thanh toán.
8. Nếu không đủ kho: trả về lỗi cho khách hàng.

---

## 4. Phân tích mở rộng & an toàn

- **Xác thực & phân quyền:** Dùng JWT cho mọi request cần bảo vệ. Admin có thể thực hiện các thao tác quản trị.
- **Kiểm tra lỗi & rollback:** Nếu lỗi ở bất kỳ bước nào (ví dụ, cập nhật kho thất bại), phải rollback các thao tác trước đó.
- **Tính nhất quán dữ liệu:** Sử dụng transaction hoặc event sourcing cho các nghiệp vụ phức tạp (như đặt hàng).
- **Khả năng mở rộng:** Từng service có thể scale độc lập, ví dụ khi lượng đặt hàng tăng đột biến.

---

## 5. Tài liệu tham khảo

- Đặc tả API trong docs/api-specs/
- Kiến trúc tổng thể xem trong docs/architecture.md

---

*File này cung cấp góc nhìn tổng quan về nghiệp vụ, chức năng và thiết kế hệ thống microservices cho ShopMan.*