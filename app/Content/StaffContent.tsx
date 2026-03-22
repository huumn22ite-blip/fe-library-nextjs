import { useEffect, useState } from "react";
import { createStaff, getStaff, updateStaff, deleteStaff } from "../lib/api";
import { Staff } from "../type/staff";
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";

export default function StaffContent() {

  const [staffs, setStaff] = useState<Staff[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")

  const fetchStaff = async () => {
    setLoading(true);
    const data = await getStaff();
    setStaff(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchStaff()
  }, []);

  function openAddModal() {
    setEditingStaff(null);
    setName("");
    setEmail("");
    setPhone("");
    setShowModal(true);
  }

  function openEditModal(staff: Staff) {
    setEditingStaff(staff);
    setName(staff.name || "");
    setEmail(staff.email || "");
    setPhone(staff.phone || "");
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingStaff(null);
    setName("");
    setEmail("");
    setPhone("");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!name || !email || !phone) return alert("Nhập đủ thông tin!")

    try {
      if (editingStaff && editingStaff.id) {
        await updateStaff(editingStaff.id, { name, email, phone })
      } else {
        await createStaff({ name, email, phone })
      }
      closeModal()
      fetchStaff()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Không thể lưu nhân viên"
      alert(message)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Bạn có chắc muốn xóa nhân viên này?")) return
    try {
      await deleteStaff(id)
      fetchStaff()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Không thể xóa nhân viên"
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
            placeholder="Tìm kiếm nhân viên..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 border border-gray-300 rounded-2xl text-black text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-300"
          />
        </div>
        <button type="button" className="flex h-10 shadow-lg rounded-3xl border-2 border-gray-700 text-red-800 border-s-6 font-bold px-4 items-center" onClick={openAddModal}><FaPlus className="mr-1" /> Thêm nhân viên</button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-100">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-2xl relative">
            {/* Close Button */}
            <button
              type="button"
              className="absolute top-5 right-5 font-bold  text-gray-500 hover:text-gray-800"
              onClick={closeModal}
            >
              ✕
            </button>

            {/* Modal Content */}
            <h2 className="text-2xl text-black font-bold mb-4">{editingStaff ? "Sửa nhân viên" : "Thêm nhân viên mới"}</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="text-black mt-0.5">Tên nhân viên</div>
              <input
                name="name"
                type="text"
                placeholder="Nhập tên nhân viên"
                value={name}
                onChange={e => setName(e.target.value)}
                className="p-2 border   rounded-2xl  text-black"
              />
              <div className="text-black mt-0.5"> Email</div>
              <input
                name="email"
                type="text"
                placeholder="Nhập email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="p-2 border   rounded-2xl  text-black"
              />
              <div className="text-black mt-0.5">Số điện thoại</div>
              <input
                name="phone"
                type="number"
                placeholder="Nhập số điện thoại"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="p-2 border   rounded-2xl  text-black"
              />

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
                  {editingStaff ? "Cập nhật" : "Save"}
                </button>
              </div>
            </form>
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
                <th className="pb-3">Tên nhân viên</th>
                <th className="pb-3">Email</th>
                <th className="pb-3">Số điện thoại</th>
                <th className="pb-3">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {staffs && staffs.filter(s =>
                (s.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                (s.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                (s.phone || "").toLowerCase().includes(searchQuery.toLowerCase())
              ).length > 0 ? (
                staffs.filter(s =>
                  (s.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                  (s.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                  (s.phone || "").toLowerCase().includes(searchQuery.toLowerCase())
                ).map((staff) => (
                  <tr key={staff.id} className="border-b items-center text-black border-gray-800">
                    <td className="py-3 ">{staff.name}</td>
                    <td className="py-3">{staff.email}</td>
                    <td className="py-3">{staff.phone}</td>
                    <td className="py-3 flex gap-2">
                      <button
                        onClick={() => openEditModal(staff)}
                        className="flex items-center gap-1 px-3 py-1 rounded-xl bg-yellow-400 text-white hover:bg-yellow-500 text-sm"
                      >
                        <FaEdit /> Sửa
                      </button>
                      <button
                        onClick={() => staff.id && handleDelete(staff.id)}
                        className="flex items-center gap-1 px-3 py-1 rounded-xl bg-red-500 text-white hover:bg-red-600 text-sm"
                      >
                        <FaTrash /> Xóa
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-2xl py-3 mb-3 text-gray-500">
                    {searchQuery ? `Không tìm thấy nhân viên "${searchQuery}"` : "Hiện chưa có nhân viên nào"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}