import { useEffect, useState } from "react";

import { createMember, getMember, updateMember, deleteMember } from "../lib/api";
import { Member } from "../type/member";
import { format } from "date-fns";
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";

export default function MemberContent() {

  const [members, setMember] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAdress] = useState("");
  const [membership_date, setMembership_date] = useState("");
  const [status, setStatus] = useState("");

  const fetchMember = async () => {
    setLoading(true);
    const data = await getMember();
    setMember(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchMember()
  }, []);

  function openAddModal() {
    setEditingMember(null);
    setName(""); setPhone(""); setAdress(""); setMembership_date(""); setStatus("");
    setShowModal(true);
  }

  function openEditModal(member: Member) {
    setEditingMember(member);
    setName(member.name || "");
    setPhone(member.phone || "");
    setAdress(member.address || "");
    setMembership_date(member.membership_date ? format(new Date(member.membership_date), 'yyyy-MM-dd') : "");
    setStatus(member.status || "");
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingMember(null);
    setName(""); setPhone(""); setAdress(""); setMembership_date(""); setStatus("");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!name || !phone || !address || !membership_date || !status) return alert("Nhập đủ thông tin!")

    try {
      if (editingMember && editingMember.id) {
        await updateMember(editingMember.id, { name, phone, address, membership_date, status })
      } else {
        await createMember({ name, phone, address, membership_date, status })
      }
      closeModal()
      fetchMember()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Không thể lưu thành viên"
      alert(message)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Bạn có chắc muốn xóa thành viên này?")) return
    try {
      await deleteMember(id)
      fetchMember()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Không thể xóa thành viên"
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
            placeholder="Tìm kiếm thành viên..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 border border-gray-300 rounded-2xl text-black text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-300"
          />
        </div>
        <button type="button" className="flex h-10 shadow-lg rounded-3xl border-2 border-gray-700 text-red-800 border-s-6 font-bold px-4 items-center" onClick={openAddModal}><FaPlus className="mr-1" /> Thêm thành viên</button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-2xl relative overflow-y-auto max-h-[90vh]">
            {/* Close Button */}
            <button
              type="button"
              className="absolute top-5 right-5 font-bold  text-gray-500 hover:text-gray-800"
              onClick={closeModal}
            >
              ✕
            </button>

            {/* Modal Content */}
            <h2 className="text-2xl text-black font-bold mb-4">{editingMember ? "Sửa thành viên" : "Thêm thành viên mới"}</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="text-black mt-0.5"> Tên thành viên</div>
              <input
                name="name"
                type="text"
                placeholder="Nhập tên thành viên"
                value={name}
                onChange={e => setName(e.target.value)}
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

              <div className="text-black mt-0.5">Địa chỉ</div>
              <input
                name="address"
                type="text"
                placeholder="Nhập địa chỉ"
                value={address}
                onChange={e => setAdress(e.target.value)}
                className="p-2 border   rounded-2xl  text-black"
              />
              <div className="text-black mt-0.5">Ngày đăng ký</div>
              <input
                name="membership_date"
                type="date"
                value={membership_date}
                onChange={e => setMembership_date(e.target.value)}
                className="p-2 border   rounded-2xl  text-black"
              />
              <div className="text-black mt-0.5">Trạng thái</div>
              <select
                value={status}
                onChange={e => setStatus(e.target.value)}
                className=" text-black w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">-- Chọn trạng thái --</option>
                <option value="active">Hoạt động</option>
                <option value="inactive">Không hoạt động</option>
                <option value="banned">Bị cấm</option>
              </select>
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
                  {editingMember ? "Cập nhật" : "Save"}
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
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-max">
              <thead>
                <tr className="text-black border-b border-gray-700">
                <th className="pb-3">Tên thành viên</th>
                <th className="pb-3">Số điện thoại</th>
                <th className="pb-3">Địa chỉ</th>
                <th className="pb-3">Ngày đăng ký</th>
                <th className="pb-3">Trạng thái</th>
                <th className="pb-3">Thao tác</th>
              </tr>
            </thead>
            <tbody>
            {(() => {
                const filtered = members.filter(m =>
                  (m.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                  (m.phone || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                  (m.address || "").toLowerCase().includes(searchQuery.toLowerCase())
                );
                return filtered.length > 0 ? (
                  filtered.map((member) => (
                  <tr key={member.id} className="border-b items-center text-black border-gray-800">
                    <td className="py-3 ">{member.name}</td>
                    <td className="py-3">{member.phone}</td>
                    <td className="py-3">{member.address}</td>
                    <td>{member.membership_date ? format(new Date(member.membership_date), 'dd/MM/yyyy') : '-'}</td>
                    <td className="py-3">{member.status}</td>
                    <td className="py-3 flex gap-2">
                      <button
                        onClick={() => openEditModal(member)}
                        className="flex items-center gap-1 px-3 py-1 rounded-xl bg-yellow-400 text-white hover:bg-yellow-500 text-sm"
                      >
                        <FaEdit /> Sửa
                      </button>
                      <button
                        onClick={() => member.id && handleDelete(member.id)}
                        className="flex items-center gap-1 px-3 py-1 rounded-xl bg-red-500 text-white hover:bg-red-600 text-sm"
                      >
                        <FaTrash /> Xóa
                      </button>
                    </td>
                  </tr>
                ))
                ) : (
                <tr>
                  <td colSpan={6} className="text-2xl py-3 mb-3 text-gray-500">
                    {searchQuery ? `Không tìm thấy thành viên "${searchQuery}"` : "Hiện chưa có thành viên nào"}
                  </td>
                </tr>
              );
              })()}
          </tbody>
          </table>
          </div>
        )}
      </div>
    </div>
  );
}