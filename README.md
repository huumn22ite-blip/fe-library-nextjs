# 📚 Quản Lý Thư Viện - Frontend

Frontend ứng dụng quản lý thư viện xây dựng bằng **Next.js 15 (App Router)** + **TypeScript** + **TailwindCSS**, kết nối với backend REST API chạy tại `http://localhost:8080`.

---

## 🚀 Cài đặt & Chạy

```bash
npm install
npm run dev
```

Ứng dụng chạy tại: `http://localhost:3000`

> Backend cần chạy song song tại `http://localhost:8080`

---

## 🗂️ Cấu trúc thư mục

```
app/
├── page.tsx                  # Trang chủ (/)
├── layout.tsx                # Layout gốc toàn app
├── globals.css               # CSS toàn cục
├── providers.tsx             # Provider wrapper
│
├── dashboard/
│   └── page.tsx              # Trang dashboard (/dashboard)
│
├── components/
│   ├── SideBar.tsx           # Thanh điều hướng trái
│   └── TabBar.tsx            # Thanh điều hướng trên (Dashboard / Login)
│
├── Content/
│   ├── BookContent.tsx       # Quản lý sách
│   ├── StaffContent.tsx      # Quản lý nhân viên
│   ├── CategoryContent.tsx   # Quản lý thể loại
│   ├── LoanContent.tsx       # Quản lý phiếu mượn
│   └── MemberContent.tsx     # Quản lý thành viên
│
├── lib/
│   └── api.ts                # Tất cả hàm gọi API (fetch)
│
└── type/
    ├── book.ts               # Interface Book
    ├── staff.ts              # Interface Staff
    ├── category.ts           # Interface Category
    ├── loan.ts               # Interface Loan
    └── member.ts             # Interface Member
```

---

## 🔄 Luồng chạy ứng dụng

### 1. Khởi động (`/`)

```
layout.tsx (RootLayout)
  └── Providers (wrapper)
        └── page.tsx (HomePage)
              ├── SideBar        ← chọn tab: books | staff | categories | loans | member
              ├── TabBar         ← điều hướng: Dashboard | Login
              └── Content Area
                    ├── BookContent      (activeTab === "books")
                    ├── StaffContent     (activeTab === "staff")
                    ├── CategoryContent  (activeTab === "categories")
                    ├── LoanContent      (activeTab === "loans")
                    └── MemberContent    (activeTab === "member")
```

**State `activeTab`** được quản lý ở `page.tsx` và truyền xuống `SideBar`. Khi người dùng nhấn một mục trong Sidebar → `setActiveTab()` → component Content tương ứng được render.

---

### 2. Trang Dashboard (`/dashboard`)

```
dashboard/page.tsx
  ├── SideBar  (nhấn → router.push("/") về trang chủ)
  ├── TabBar
  └── Bảng phiếu mượn sắp đến hạn
        ├── Lọc: status != "returned"
        ├── Sắp xếp: gần hạn nhất lên đầu
        └── Thống kê: Quá hạn | Hết hạn hôm nay | Còn ≤ 7 ngày
```

---

### 3. Gọi API (`lib/api.ts`)

Mỗi entity có đầy đủ **CRUD**:

| Hàm | Method | Endpoint |
|-----|--------|----------|
| `getBooks()` | GET | `/books` |
| `createBooks(data)` | POST | `/books` |
| `updateBooks(id, data)` | PUT | `/books/:id` |
| `deleteBooks(id)` | DELETE | `/books/:id` |
| *(tương tự cho staff, member, category, loan)* | | |

---

### 4. Mỗi màn hình Content

Tất cả 5 màn hình theo cùng một pattern:

```
State:
  - data[]           ← danh sách từ API
  - loading          ← hiển thị "Đang tải..."
  - showModal        ← điều khiển hiện/ẩn modal
  - editingItem      ← null = thêm mới, có giá trị = sửa
  - searchQuery      ← lọc dữ liệu real-time
  - [form fields]    ← các trường nhập liệu

Hàm:
  - fetchData()      ← tải danh sách từ API
  - openAddModal()   ← reset form, mở modal thêm
  - openEditModal()  ← điền dữ liệu cũ, mở modal sửa
  - closeModal()     ← đóng modal, reset form
  - handleSubmit()   ← createXxx() hoặc updateXxx() tuỳ editingItem
  - handleDelete()   ← confirm() → deleteXxx()
```

**Modal dùng chung** cho cả Thêm và Sửa — phân biệt qua `editingItem`:
- `editingItem === null` → Thêm mới (POST)
- `editingItem !== null` → Sửa (PUT)

---

### 5. Logic đặc biệt của LoanContent

| Tình huống | Hành vi |
|-----------|---------|
| Mở modal Thêm | Ngày mượn = hôm nay, Ngày hạn = hôm nay + 30 ngày |
| Submit Thêm | Status tự tính: `due_date >= hôm nay` → `borrowed`; ngược lại → `overdue` |
| Nhấn Sửa | Modal chỉ hiện thông tin đọc + ngày trả → nút **Xác nhận đã trả** (set `status = returned`) |
| Tìm kiếm | Lọc theo tên sách, tên người mượn, hoặc trạng thái |

---

## 🔗 API Endpoints (Backend)

| Entity | Base URL |
|--------|----------|
| Sách | `http://localhost:8080/books` |
| Thể loại | `http://localhost:8080/categories` |
| Nhân viên | `http://localhost:8080/staff` |
| Phiếu mượn | `http://localhost:8080/loans` |
| Thành viên | `http://localhost:8080/members` |

---

## 🧩 Các thư viện chính

| Thư viện | Mục đích |
|---------|---------|
| `next` | Framework React, App Router |
| `react-icons/fa` | Icons (FaPlus, FaEdit, FaTrash, FaSearch...) |
| `date-fns` | Format ngày tháng (`format`, `parseISO`, `differenceInDays`) |
| `tailwindcss` | Styling |
