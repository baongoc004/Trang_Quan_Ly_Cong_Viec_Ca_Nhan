Ứng dụng quản lý công việc cá nhân
Ứng dụng SPA (Single Page Application) quản lý công việc cá nhân xây dựng bằng React + TypeScript + TailwindCSS v4, hỗ trợ hai chế độ xem (List Grid & Kanban Board), tìm kiếm, lọc trạng thái, deadline có giờ cụ thể và thống kê tổng quan theo thời gian thực.
---
Cài đặt và chạy Local
Yêu cầu
Node.js >= 18.x
npm >= 9.x
Các bước
```bash
# 1. Clone repository
git clone https://github.com/baongoc004/Trang_Quan_Ly_Cong_Viec_Ca_Nhan

# 2. Cài đặt dependencies
npm install

# 3. Chạy môi trường development
npm run dev
```
Mở trình duyệt tại: `http://localhost:3000`
```bash
# Build production
npm run build

# Preview bản build production
npm run preview
```
---
Quyết định kỹ thuật
1. Lưu trữ bằng `localStorage` — không dùng backend
Đề bài không yêu cầu API hay database. Thay vì để dữ liệu mất sau mỗi lần reload, `useTasks` khởi tạo state từ `localStorage` (lazy initializer trong `useState`) và đồng bộ ngược lại qua `useEffect` mỗi khi danh sách thay đổi. Cách này đơn giản, không phụ thuộc network, phù hợp với scope ứng dụng cá nhân.
```ts
// Đọc khi khởi động — chỉ chạy 1 lần
const [tasks, setTasks] = useState<Task[]>(() => {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
});

// Ghi mỗi khi tasks thay đổi
useEffect(() => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}, [tasks]);
```
2. `deadline` lưu dạng ISO string — không phải `Date` object
`Date` object không serialize được sang JSON. Toàn bộ deadline được lưu và truyền dưới dạng ISO string, chỉ parse sang `Date` tại điểm tính toán (`date-fns`). Điều này đảm bảo dữ liệu trong `localStorage` luôn hợp lệ và không bị mất thông tin khi reload.

3. `DateTimePicker` tự xây dựng — không dùng thư viện ngoài
Thay vì dùng `react-datepicker` hay `input[type=datetime-local]` (giao diện phụ thuộc trình duyệt, khó style đồng nhất), component `DateTimePicker` được xây dựng hoàn toàn từ `date-fns` + Tailwind. Gồm hai tab: Lịch (grid 7 cột, điều hướng tháng, locale tiếng Việt) và Giờ. Sau khi chọn ngày, tự động chuyển sang tab giờ để tối ưu UX.

4. Logic "Quá hạn" và "Sắp đến hạn" trong `TaskCard`
Hai trạng thái hiển thị này không được lưu vào data mà tính toán lại mỗi lần render dựa trên thời gian thực:
Quá hạn (`isOverdue`): task chưa `DONE` và deadline đã qua (loại trừ đúng ngày hôm nay)
Sắp đến hạn (`isUrgent`): còn dưới 24 giờ mà chưa quá hạn
Card quá hạn đổi nền đỏ nhạt, badge thời gian chuyển màu đỏ. Badge sắp đến hạn có hiệu ứng `animate-pulse` màu cam để gây chú ý trực quan.

5. Toggle trạng thái nhanh trực tiếp trên `TaskCard`
Ngoài việc mở modal chỉnh sửa, người dùng có thể click vào badge trạng thái để chuyển vòng `TODO -> IN_PROGRESS -> DONE -> TODO` mà không cần mở form. Điều này tăng tốc workflow khi cần cập nhật nhanh nhiều task liên tiếp.

6. Hai chế độ xem: List Grid & Kanban Board
List (Grid): hiển thị tất cả task đã lọc trong grid 1–3 cột tùy màn hình, phù hợp duyệt nhanh toàn bộ
Board (Kanban): chia 3 cột cố định theo trạng thái, hiển thị badge đếm số task mỗi cột, phù hợp theo dõi luồng công việc
Chuyển đổi giữa hai chế độ dùng `AnimatePresence` + `motion` để có transition mượt (fade + slide y), tránh UI nhảy đột ngột.

7. `useMemo` cho `filteredTasks` và `stats`
Cả hai đều là derived state phụ thuộc `tasks`. Dùng `useMemo` để tránh tính toán lại khi các state không liên quan thay đổi (ví dụ `isFormOpen`, `viewMode`). Đặc biệt với `stats`, mỗi lần tính cần duyệt toàn bộ mảng và gọi `parseISO + isPast` cho từng phần tử — chi phí đáng để cache.

8. `clsx` + `tailwind-merge` trong `cn.ts`
TailwindCSS không tự giải quyết conflict class (truyền vào cả `border-red-200` lẫn `border-slate-200` — cái nào thắng?). `tailwind-merge` xử lý đúng priority theo quy tắc của Tailwind, còn `clsx` giúp viết conditional classname rõ ràng. Kết hợp vào helper `cn()` dùng xuyên suốt toàn bộ dự án.

9. TailwindCSS v4 — cú pháp mới `@import` và `@utility`
Dự án dùng Tailwind v4, khác v3 ở một số điểm quan trọng: không còn `@tailwind base/components/utilities`, thay bằng `@import "tailwindcss"`. Custom utility `scrollbar-hide` khai báo bằng directive `@utility` (cú pháp v4) thay vì `@layer utilities` như trước.
---


Những điểm sẽ cải thiện nếu có thêm thời gian

Tính năng
[ ] Drag & Drop Kanban: kéo thả task giữa các cột bằng `@dnd-kit/core` thay vì chỉ dùng toggle click
[ ] Bộ lọc deadline: lọc theo hôm nay / tuần này / quá hạn, không chỉ theo trạng thái
[ ] Undo xóa task: snackbar "Đã xóa" với nút "Hoàn tác" trong 5 giây trước khi xóa hẳn khỏi state
[ ] Subtasks: task con với progress bar tính % hoàn thành hiển thị trên card cha
[ ] Dark mode: toggle sáng/tối, lưu preference vào `localStorage`
[ ] Thông báo deadline: dùng Notification API của trình duyệt để nhắc task sắp đến hạn

Kỹ thuật
[ ] Unit test cho `useTasks`: dùng `vitest` + `@testing-library/react`, cover các case thêm/sửa/xóa, tính `overdue`, đọc/ghi `localStorage`
[ ] Unit test cho `DateTimePicker`: kiểm tra chuyển tháng, chọn ngày, đồng bộ giờ/phút với ISO string
[ ] Validate dữ liệu `localStorage`: hiện tại `JSON.parse` thẳng không kiểm tra — cần schema validation bằng `zod` để xử lý data cũ hoặc bị corrupt
[ ] Virtualized list: dùng `@tanstack/react-virtual` khi danh sách vượt 500 task để tránh lag render
[ ] Error Boundary: bắt lỗi runtime (ví dụ `parseISO` nhận giá trị không hợp lệ) và hiển thị fallback UI thay vì crash toàn trang
[ ] Accessibility (a11y): bổ sung `aria-label` cho icon button, `role="dialog"` + `aria-modal` cho modal, hỗ trợ điều hướng bàn phím trong `DateTimePicker`

Trải nghiệm người dùng
[ ] Sort task: sắp xếp theo deadline gần nhất, ngày tạo mới nhất, hoặc theo trạng thái
[ ] Bulk actions: chọn nhiều task để xóa hoặc chuyển trạng thái cùng lúc
[ ] Đồng nhất tìm kiếm giữa hai chế độ xem: Board view hiện chỉ lọc theo `title`, trong khi List view lọc cả `title` lẫn `description` — cần thống nhất logic