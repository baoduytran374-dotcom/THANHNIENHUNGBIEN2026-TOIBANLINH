# Vòng chung kết – Thử thách lật 8 ô

Website tĩnh, chạy trực tiếp trên GitHub Pages.

## Đăng lên GitHub Pages
1. Tạo repository mới trên GitHub (ví dụ `lat-8-o`).
2. Upload **toàn bộ nội dung** thư mục này (gồm `index.html`, thư mục `assets`, `.nojekyll`) lên nhánh `main`.
3. Vào **Settings → Pages**, mục *Build and deployment* chọn **Deploy from a branch**, nhánh `main`, thư mục `/ (root)` rồi Save.
4. Sau 1–2 phút, trang chạy tại `https://<tên-github>.github.io/<tên-repo>/`.

## Thay hình ảnh / logo
Thay file cùng tên trong thư mục `assets/` (giữ đúng tên):
- `anh-01.jpg` … `anh-08.jpg`: hình của ô 01–08 (nên là JPG, rộng tối đa 1920px).
- `logo-1.png` … `logo-5.png`: cụm logo theo thứ tự trái → phải (IUH, Đoàn TNCS HCM, Hội Sinh viên VN, CLB Lý luận trẻ, Thanh niên Hùng Biện).

## Admin
- Bấm biểu tượng ⚙ mờ ở góc dưới bên phải màn hình.
- Mật khẩu hiện tại: `1111` (muốn đổi: tạo mã SHA-256 của mật khẩu mới rồi thay giá trị `PW_HASH` trong `index.html`).
- Chức năng: xem số ô đã mở/chưa mở, **đổi hình từng ô** (chọn ảnh → xem trước → Lưu hình ảnh; có nút Khôi phục ảnh gốc) và **RESET GAME**.
- Ảnh đổi trong Admin được lưu trong trình duyệt của máy đang dùng (IndexedDB), không ghi vào repo và không mất khi reset game. Muốn đổi cho mọi máy thì thay file trong `assets/`.

## Lưu ý quan trọng
- Trạng thái các ô lưu trong **trình duyệt của máy đang chiếu** (localStorage): refresh không mất, các tab cùng trình duyệt tự đồng bộ. **Không đồng bộ giữa các thiết bị khác nhau** – hãy dùng một máy duy nhất để điều khiển và trình chiếu.
- Mật khẩu Admin kiểm tra ngay trên trình duyệt nên chỉ ngăn thao tác nhầm, không phải bảo mật cao. Cần đồng bộ nhiều thiết bị thật sự thì phải dùng thêm backend (Supabase/Firebase).
