import { useEffect, useState } from "react";
import { createBooks, getBooks, getCategory, updateBooks, deleteBooks } from "../lib/api";
import { Book } from "../type/book";
import { Category } from "../type/category";
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";


export default function BookContent() {

  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategory] = useState<Category[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [title, setTitle] = useState("")
  const [tacgia, setTacgia] = useState("")
  const [category_id, setcategory_id] = useState("")
  const [total_copies, setTotal_copies] = useState("")
  const [available_copies, setAvailable_copies] = useState("")

  const fetchBooks = async () => {
    setLoading(true);
    const data = await getBooks();
    setBooks(data);
    setLoading(false);
  };

  useEffect(() => {
    async function loadCategory() {
      const data = await getCategory()
      setCategory(Array.isArray(data) ? data : [])
    }
    loadCategory()
  }, [])

  useEffect(() => {
    fetchBooks()
  }, []);

  function openAddModal() {
    setEditingBook(null);
    setTitle(""); setTacgia(""); setcategory_id(""); setTotal_copies(""); setAvailable_copies("");
    setShowModal(true);
  }

  function openEditModal(book: Book) {
    setEditingBook(book);
    setTitle(book.title || "");
    setTacgia(book.tacgia || "");
    setcategory_id(book.category_id ? String(book.category_id) : "");
    setTotal_copies(book.total_copies ? String(book.total_copies) : "");
    setAvailable_copies(book.available_copies ? String(book.available_copies) : "");
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingBook(null);
    setTitle(""); setTacgia(""); setcategory_id(""); setTotal_copies(""); setAvailable_copies("");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!title || !tacgia || !category_id || !total_copies || !available_copies) return alert("Nhập đủ thông tin!")

    try {
      if (editingBook && editingBook.id) {
        await updateBooks(editingBook.id, {
          title, tacgia,
          category_id: Number(category_id),
          total_copies: Number(total_copies),
          available_copies: Number(available_copies)
        })
      } else {
        await createBooks({
          title, tacgia,
          category_id: Number(category_id),
          total_copies: Number(total_copies),
          available_copies: Number(available_copies)
        })
      }
      closeModal()
      fetchBooks()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Không thể lưu sách"
      alert(message)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Bạn có chắc muốn xóa sách này?")) return
    try {
      await deleteBooks(id)
      fetchBooks()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Không thể xóa sách"
      alert(message)
    }
  }

  return (
    <div className="bg-white text-white p-6 rounded-2xl shadow-lg w-full border  border-gray-700   ">
      <div className="flex justify-between items-center mb-3">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm sách..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 border border-gray-300 rounded-2xl text-black text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-300"
          />
        </div>
        <button type="button" className="flex h-10 shadow-lg rounded-3xl border-2 border-gray-700 text-red-800 border-s-6 font-bold px-4 items-center" onClick={openAddModal}><FaPlus className="mr-1" /> Thêm sách</button>
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

         
            <h2 className="text-2xl text-black font-bold mb-4">{editingBook ? "Sửa sách" : "Thêm sách mới"}</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="text-black mt-0.5"> Tên sách</div>
              <input
                name="title"
                type="text"
                placeholder="Nhập tên sách"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="p-2 border   rounded-2xl  text-black"
              />
              <div className="text-black mt-0.5">Tác giả</div>
              <input
                name="tacgia"
                type="text"
                placeholder="Nhập tác giả"
                value={tacgia}
                onChange={e => setTacgia(e.target.value)}
                className="p-2 border   rounded-2xl  text-black"
              />
              <div className="text-black mt-0.5">Thể loại</div>
              <select
                value={category_id}
                onChange={e => setcategory_id(e.target.value)}
                className=" text-black w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Chọn thể loại</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <div className="text-black mt-0.5">Tổng số sách</div>
              <input
                name="total_copies"
                type="number"
                placeholder="Nhập tổng số sách"
                value={total_copies}
                onChange={e => setTotal_copies(e.target.value)}
                className="p-2 border   rounded-2xl  text-black"
              />
              <div className="text-black mt-0.5">Còn lại</div>
              <input
                name="available_copies"
                type="number"
                placeholder="Nhập số sách còn lại"
                value={available_copies}
                onChange={e => setAvailable_copies(e.target.value)}
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
                  {editingBook ? "Cập nhật" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white text-white p-6 rounded-2xl shadow-lg w-full border border-gray-700 ">
        {loading ? (
          <p>Đang tải dữ liệu</p>
        ) : (
          <div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-black border-b border-gray-700">
                  <th className="pb-3">Tên sách</th>
                  <th className="pb-3">Tác giả</th>
                  <th className="pb-3">Thể loại</th>
                  <th className="pb-3">Tổng số sách</th>
                  <th className="pb-3">Còn lại</th>
                  <th className="pb-3">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const filtered = books.filter(b =>
                    (b.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (b.tacgia || "").toLowerCase().includes(searchQuery.toLowerCase())
                  );
                  return filtered.length > 0 ? (
                    filtered.map((book) => (
                    <tr key={book.id} className="border-b items-center text-black border-gray-800">
                      <td className="py-3">{book.title}</td>
                      <td className="py-3">{book.tacgia}</td>
                      <td className="py-3">{categories.find(c => c.id === Number(book.category_id))?.name || "Unknown"}</td>
                      <td className="py-3">{book.total_copies} </td>
                      <td className="py-3">{book.available_copies}</td>
                      <td className="py-3 flex gap-2">
                        <button
                          onClick={() => openEditModal(book)}
                          className="flex items-center gap-1 px-3 py-1 rounded-xl bg-yellow-400 text-white hover:bg-yellow-500 text-sm"
                        >
                          <FaEdit /> Sửa
                        </button>
                        <button
                          onClick={() => book.id && handleDelete(book.id)}
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
                        {searchQuery ? `Không tìm thấy sách "${searchQuery}"` : "Hiện chưa có sách nào"}
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