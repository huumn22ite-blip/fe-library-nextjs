import { useEffect, useState } from "react";
import { format } from 'date-fns';
import { Loan } from "../type/loan";
import { getBooks, getLoan, getStaff, getMember, createLoan, updateLoan, deleteLoan } from "../lib/api";
import { Book } from "../type/book";
import { Member } from "../type/member";
import { Staff } from "../type/staff";
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";

export default function LoanContent() {
  const [showModal, setShowModal] = useState(false);
  const [loans, setLoan] = useState<Loan[]>([])
  const [loading, setLoading] = useState(true)
  const [members, setMember] = useState<Member[]>([]);
  const [books, setBooks] = useState<Book[]>([])
  const [staffs, setStaff] = useState<Staff[]>([])
  const [editingLoan, setEditingLoan] = useState<Loan | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [book_id, setBook_id] = useState("")
  const [member_id, setMember_id] = useState("")
  const [staff_id, setStaff_id] = useState("")
  const [borrow_date, setBorrow_date] = useState("")
  const [due_date, setDue_date] = useState("")
  const [return_date, setReturn_date] = useState("")
  const [status, setStatus] = useState("")

  useEffect(() => {
    async function loadBook() {
      const data = await getBooks()
      setBooks(Array.isArray(data) ? data : [])
    }
    async function loadMember() {
      const data = await getMember()
      setMember(Array.isArray(data) ? data : [])
    }
    async function loadStaff() {
      const data = await getStaff()
      setStaff(Array.isArray(data) ? data : [])
    }
    loadBook()
    loadMember()
    loadStaff()
  }, [])

  const fetchLoan = async () => {
    setLoading(true);
    const data = await getLoan();
    setLoan(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    fetchLoan()
  }, []);

  function openAddModal() {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const due = new Date(today);
    due.setDate(due.getDate() + 30);
    const dueStr = due.toISOString().split('T')[0];
    setEditingLoan(null);
    setBook_id(""); setMember_id(""); setStaff_id("");
    setBorrow_date(todayStr); setDue_date(dueStr); setReturn_date(""); setStatus("");
    setShowModal(true);
  }
  
  function openEditModal(loan: Loan) {
    setEditingLoan(loan);
    setBook_id(loan.book_id ? String(loan.book_id) : "");
    setMember_id(loan.member_id ? String(loan.member_id) : "");
    setStaff_id(loan.staff_id ? String(loan.staff_id) : "");
    setBorrow_date(loan.borrow_date ? format(new Date(loan.borrow_date), 'yyyy-MM-dd') : "");
    setDue_date(loan.due_date ? format(new Date(loan.due_date), 'yyyy-MM-dd') : "");
    setReturn_date(loan.return_date ? format(new Date(loan.return_date), 'yyyy-MM-dd') : "");
    setStatus(loan.status || "");
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingLoan(null);
    setBook_id(""); setMember_id(""); setStaff_id("");
    setBorrow_date(""); setDue_date(""); setReturn_date(""); setStatus("");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!book_id || !member_id || !staff_id || !borrow_date || !due_date) return alert("Nhập đủ thông tin!")

    let computedStatus = status;
    if (!editingLoan) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const due = new Date(due_date);
      computedStatus = due >= today ? "borrowed" : "overdue";
    }

    try {
      if (editingLoan && editingLoan.id) {
        await updateLoan(editingLoan.id, {
          book_id: Number(book_id),
          member_id: Number(member_id),
          staff_id: Number(staff_id),
          borrow_date,
          due_date,
          return_date: return_date || undefined,
          status: computedStatus
        })
      } else {
        await createLoan({
          book_id: Number(book_id),
          member_id: Number(member_id),
          staff_id: Number(staff_id),
          borrow_date,
          due_date,
          return_date: return_date || undefined,
          status: computedStatus
        })
      }
      closeModal()
      fetchLoan()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Không thể lưu phiếu mượn"
      alert(message)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Bạn có chắc muốn xóa phiếu mượn này?")) return
    try {
      await deleteLoan(id)
      fetchLoan()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Không thể xóa phiếu mượn"
      alert(message)
    }
  }

  return (
    <div className="bg-white text-white p-6 rounded-2xl shadow-lg w-full border border-gray-700 ">
      <div className="flex justify-between items-center mb-3">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm phiếu mượn..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 border border-gray-300 rounded-2xl text-black text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-300"
          />
        </div>
        <button type="button" className="flex h-10 shadow-lg rounded-3xl border-2 border-gray-700 text-red-800 border-s-6 font-bold px-4 items-center" onClick={openAddModal}><FaPlus className="mr-1" /> Thêm phiếu mượn</button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-100">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-2xl relative overflow-y-auto max-h-[90vh]">

            <button
              type="button"
              className="absolute top-5 right-5 font-bold  text-gray-500 hover:text-gray-800"
              onClick={closeModal}
            >
              ✕
            </button>

            <h2 className="text-2xl text-black font-bold mb-4">{editingLoan ? "Xác nhận trả sách" : "Thêm mượn sách mới"}</h2>
            {editingLoan ? (
              <div className="flex flex-col gap-4">
                <div className="bg-gray-50 rounded-2xl p-4 flex flex-col gap-2 text-sm text-black">
                  <div><span className="font-semibold text-gray-500">Sách:</span> {books.find(b => b.id === Number(editingLoan.book_id))?.title || "-"}</div>
                  <div><span className="font-semibold text-gray-500">Người mượn:</span> {members.find(m => m.id === Number(editingLoan.member_id))?.name || "-"}</div>
                  <div><span className="font-semibold text-gray-500">Ngày mượn:</span> {editingLoan.borrow_date ? format(new Date(editingLoan.borrow_date), "dd/MM/yyyy") : "-"}</div>
                  <div><span className="font-semibold text-gray-500">Ngày đến hạn:</span> {editingLoan.due_date ? format(new Date(editingLoan.due_date), "dd/MM/yyyy") : "-"}</div>
                  <div><span className="font-semibold text-gray-500">Trạng thái:</span>{" "}
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${editingLoan.status === "overdue" ? "bg-red-100 text-red-700" : editingLoan.status === "returned" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                      {editingLoan.status === "overdue" ? "Quá hạn" : editingLoan.status === "returned" ? "Đã trả" : "Đang mượn"}
                    </span>
                  </div>
                </div>
                <div className="text-black text-sm">Ngày trả</div>
                <input
                  type="date"
                  value={return_date}
                  onChange={e => setReturn_date(e.target.value)}
                  className="p-2 border rounded-2xl text-black"
                />
                <div className="flex justify-end gap-2 mt-2">
                  <button type="button" className="px-4 py-2 rounded-2xl bg-gray-400 text-white" onClick={closeModal}>Hủy</button>
                  <button
                    type="button"
                    className="px-4 py-2 rounded-2xl bg-green-500 text-white font-semibold"
                    onClick={async () => {
                      if (!editingLoan.id) return;
                      const todayStr = new Date().toISOString().split("T")[0];
                      try {
                        await updateLoan(editingLoan.id, {
                          ...editingLoan,
                          return_date: return_date || todayStr,
                          status: "returned"
                        });
                        closeModal();
                        fetchLoan();
                      } catch (err) {
                        alert(err instanceof Error ? err.message : "Không thể cập nhật");
                      }
                    }}
                  >
                    ✓ Xác nhận đã trả
                  </button>
                </div>
              </div>
            ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="text-black mt-0.5"> Tên sách mượn</div>
              <select
                value={book_id}
                onChange={e => setBook_id(e.target.value)}
                className=" text-black w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Chọn sách</option>
                {books.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>

              <div className="text-black mt-0.5">Người mượn</div>
              <select
                value={member_id}
                onChange={e => setMember_id(e.target.value)}
                className=" text-black w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Chọn người mượn</option>
                {members.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <div className="text-black mt-0.5">Người quản lý</div>
              <select
                value={staff_id}
                onChange={e => setStaff_id(e.target.value)}
                className=" text-black w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Chọn quản lý</option>
                {staffs.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <div className="text-black mt-0.5">Ngày mượn</div>
              <input
                name="borrow_date"
                type="date"
                value={borrow_date}
                onChange={e => setBorrow_date(e.target.value)}
                className="p-2 border   rounded-2xl  text-black"
              />
              <div className="text-black mt-0.5">Ngày đến hạn</div>
              <input
                name="due_date"
                type="date"
                value={due_date}
                onChange={e => setDue_date(e.target.value)}
                className="p-2 border   rounded-2xl  text-black"
              />
              <div className="text-black mt-0.5">Ngày trả</div>
              <input
                name="return_date"
                type="date"
                value={return_date}
                onChange={e => setReturn_date(e.target.value)}
                className="p-2 border   rounded-2xl  text-black"
              />
              <div className="text-black mt-0.5">Trạng thái</div>
              {editingLoan ? (
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                  className=" text-black w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">-- Chọn trạng thái --</option>
                  <option value="borrowed">Đang mượn</option>
                  <option value="returned">Đã trả</option>
                  <option value="overdue">Quá hạn</option>
                </select>
              ) : (
                <div className="p-2 rounded-2xl border border-gray-200 bg-gray-50 text-sm text-gray-500 italic">
                  Tự động tính theo ngày đến hạn
                </div>
              )}
              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  className="px-4 py-2  rounded-2xl bg-gray-400 text-white "
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2  rounded-2xl bg-blue-500 text-white "
                >
                  Save
                </button>
              </div>
            </form>
            )}
          </div>
        </div>
      )}

      <div className="bg-white text-white p-6 rounded-2xl shadow-lg w-full border border-gray-700 ">
        {loading ? (
          <p>Đang tải dữ liệu...</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-black border-b border-gray-700">
                <th className="pb-3">Tên sách</th>
                <th className="pb-3">Người mượn</th>
                <th className="pb-3">Nhân viên phụ trách</th>
                <th className="pb-3">Ngày mượn</th>
                <th className="pb-3">Ngày đến hạn</th>
                <th className="pb-3">Ngày trả</th>
                <th className="pb-3">Trạng thái</th>
                <th className="pb-3">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                const filtered = loans.filter(loan => {
                  const bookTitle = (books.find(b => b.id === Number(loan.book_id))?.title || "").toLowerCase();
                  const memberName = (members.find(m => m.id === Number(loan.member_id))?.name || "").toLowerCase();
                  const q = searchQuery.toLowerCase();
                  return bookTitle.includes(q) || memberName.includes(q) || (loan.status || "").toLowerCase().includes(q);
                });
                return filtered.length > 0 ? (
                  filtered.map((loan) => (
                  <tr key={loan.id} className="border-b items-center text-black border-gray-800">
                    <td className="py-3">{books.find(c => c.id === Number(loan.book_id))?.title || "Unknown"}</td>
                    <td className="py-3">{members.find(c => c.id === Number(loan.member_id))?.name || "Unknown"}</td>
                    <td className="py-3">{staffs.find(c => c.id === Number(loan.staff_id))?.name || "Unknown"}</td>
                    <td className="py-3">{loan.borrow_date ? format(new Date(loan.borrow_date), 'dd/MM/yyyy') : '-'}</td>
                    <td className="py-3">{loan.due_date ? format(new Date(loan.due_date), 'dd/MM/yyyy') : '-'}</td>
                    <td className="py-3">{loan.return_date ? format(new Date(loan.return_date), 'dd/MM/yyyy') : '-'}</td>
                    <td className="py-3">{loan.status}</td>
                    <td className="py-3 flex gap-2">
                      <button
                        onClick={() => openEditModal(loan)}
                        className="flex items-center gap-1 px-3 py-1 rounded-xl bg-yellow-400 text-white hover:bg-yellow-500 text-sm"
                      >
                        <FaEdit /> Sửa
                      </button>
                      <button
                        onClick={() => loan.id && handleDelete(loan.id)}
                        className="flex items-center gap-1 px-3 py-1 rounded-xl bg-red-500 text-white hover:bg-red-600 text-sm"
                      >
                        <FaTrash /> Xóa
                      </button>
                    </td>
                  </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-2xl py-3 mb-3 text-gray-500">
                      {searchQuery ? `Không tìm thấy phiếu mượn "${searchQuery}"` : "Hiện chưa có phiếu mượn nào"}
                    </td>
                  </tr>
                );
              })()}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}