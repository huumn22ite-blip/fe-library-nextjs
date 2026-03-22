import { useEffect, useState } from "react";

import { Category } from "../type/category";
import { createCategory, getCategory, updateCategory, deleteCategory } from "../lib/api";
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";

export default function CategoryContent() {
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategory] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  const fetchCategory = async () => {
    setLoading(true);
    const data = await getCategory();
    setCategory(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCategory()
  }, []);

  function openAddModal() {
    setEditingCategory(null);
    setName(""); setDescription("");
    setShowModal(true);
  }

  function openEditModal(category: Category) {
    setEditingCategory(category);
    setName(category.name || "");
    setDescription(category.description || "");
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingCategory(null);
    setName(""); setDescription("");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!name || !description) return alert("Nhập đủ thông tin!")

    try {
      if (editingCategory && editingCategory.id) {
        await updateCategory(editingCategory.id, { name, description })
      } else {
        await createCategory({ name, description })
      }
      closeModal()
      fetchCategory()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Không thể lưu thể loại"
      alert(message)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Bạn có chắc muốn xóa thể loại này?")) return
    try {
      await deleteCategory(id)
      fetchCategory()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Không thể xóa thể loại"
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
            placeholder="Tìm kiếm thể loại..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 border border-gray-300 rounded-2xl text-black text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-300"
          />
        </div>
        <button type="button" className="flex h-10 shadow-lg rounded-3xl border-2 border-gray-700 text-red-800 border-s-6 font-bold px-4 items-center" onClick={openAddModal}><FaPlus className="mr-1" /> Thêm thể loại</button>
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
            <h2 className="text-2xl text-black font-bold mb-4">{editingCategory ? "Sửa thể loại" : "Thêm thể loại mới"}</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="text-black mt-0.5"> Tên thể loại</div>
              <input
                name="name"
                type="text"
                placeholder="Nhập tên thể loại"
                value={name}
                onChange={e => setName(e.target.value)}
                className="p-2 border   rounded-2xl  text-black"
              />
              <div className="text-black mt-0.5">Mô tả sản phẩm</div>
              <input
                name="description"
                type="text"
                placeholder="Nhập mô tả sản phẩm"
                value={description}
                onChange={e => setDescription(e.target.value)}
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
                  {editingCategory ? "Cập nhật" : "Save"}
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
                <th className="pb-3">Tên thể loại</th>
                <th className="pb-3">Mô tả</th>
                <th className="pb-3">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                const filtered = categories.filter(c =>
                  (c.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                  (c.description || "").toLowerCase().includes(searchQuery.toLowerCase())
                );
                return filtered.length > 0 ? (
                  filtered.map((category) => (
                  <tr key={category.id} className="border-b items-center text-black border-gray-800">
                    <td className="py-3  ">{category.name}</td>
                    <td className="py-3">{category.description}</td>
                    <td className="py-3 flex gap-2">
                      <button
                        onClick={() => openEditModal(category)}
                        className="flex items-center gap-1 px-3 py-1 rounded-xl bg-yellow-400 text-white hover:bg-yellow-500 text-sm"
                      >
                        <FaEdit /> Sửa
                      </button>
                      <button
                        onClick={() => category.id && handleDelete(category.id)}
                        className="flex items-center gap-1 px-3 py-1 rounded-xl bg-red-500 text-white hover:bg-red-600 text-sm"
                      >
                        <FaTrash /> Xóa
                      </button>
                    </td>
                  </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-2xl py-3 mb-3 text-gray-500">
                      {searchQuery ? `Không tìm thấy thể loại "${searchQuery}"` : "Hiện chưa có thể loại nào"}
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