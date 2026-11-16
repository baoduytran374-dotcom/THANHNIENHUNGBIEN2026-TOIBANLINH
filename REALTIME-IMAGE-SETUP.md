# Cấu hình đồng bộ ảnh thời gian thực

Nhánh thử nghiệm: `realtime-image-sync`

## 1. Cloudinary
- Mở Settings → Upload → Upload presets.
- Chọn preset `toi_ban_linh_2026`.
- Đổi Signing Mode thành **Signed** rồi Save.
- Giữ folder `toi-ban-linh-2026`.
- Không đưa API Secret vào website hoặc GitHub.

## 2. Tạo Cloudflare Worker
- Cloudflare Dashboard → Workers & Pages → Create → Worker.
- Đặt tên, ví dụ `toi-ban-linh-image-signer`.
- Mở Edit code, thay nội dung bằng file `cloudflare-worker.js` trong repository này rồi Deploy.
- Trong Worker → Settings → Variables and Secrets, thêm hai **Secret**:
  - `CLOUDINARY_API_KEY`: API Key từ Cloudinary.
  - `CLOUDINARY_API_SECRET`: API Secret từ Cloudinary.
- Không lưu các giá trị này trong GitHub, mã HTML hoặc gửi qua chat.
- Worker phải được triển khai với đường dẫn `/sign-upload`.

## 3. Cập nhật địa chỉ Worker trong website
Mở `index.html` và thay dòng:
```js
const CLOUDINARY_SIGNER_URL = "https://YOUR-WORKER-NAME.YOUR-SUBDOMAIN.workers.dev/sign-upload";
```
bằng URL Worker thực tế, ví dụ `https://toi-ban-linh-image-signer.<subdomain>.workers.dev/sign-upload`.

## 4. Firebase
- Bật Authentication → Sign-in method → Email/Password.
- Tạo tài khoản Admin trong Firebase Authentication. UID của tài khoản phải là:
  `D004TN6x8CM3CryRpiY6kfPjQyG2`.
- Realtime Database Rules cần cho phép đọc công khai và chỉ UID Admin được ghi:
```json
{
  "rules": {
    ".read": true,
    ".write": "auth != null && auth.uid == 'D004TN6x8CM3CryRpiY6kfPjQyG2'"
  }
}
```
Nếu đang có rules khác, hãy sao lưu và hợp nhất thay vì ghi đè mù quáng.

## 5. Cách hoạt động
Admin đăng nhập trên website bằng email/mật khẩu Firebase, chọn ảnh ở bất kỳ ô nào và bấm Lưu hình ảnh. Worker kiểm tra Firebase ID token và UID Admin, sau đó ký yêu cầu Cloudinary. Ảnh được tải lên Cloudinary; URL, public ID và thời điểm cập nhật được lưu ở `/game/images/{slot}` trong Firebase. Các trình duyệt đang mở nhận thay đổi qua Realtime Database listener.

## Lưu ý
- Không triển khai lên `main` cho đến khi cấu hình Worker URL, chuyển preset sang Signed và thử nghiệm thành công.
- Cloudinary preset unsigned không an toàn cho quy trình Admin-only.
- Chỉ các thay đổi ảnh được đồng bộ thời gian thực; trạng thái ô đã mở vẫn đang lưu cục bộ trong trình duyệt.
