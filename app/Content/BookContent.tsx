import {  useEffect, useState } from "react";
import { getBooks, getCategory } from "../lib/api";
import { Book } from "../type/book";
import { Category } from "../type/category";

export default function BookContent() {

const [books,setBooks] = useState<Book[]>([])
const [loading,setLoading] = useState(true)
  const [categories, setCategory] = useState<Category[]>([])

  useEffect(() => {
    async function loadCategory() {
      const data = await getCategory()                                                            
      setCategory(Array.isArray(data) ? data : [])
    }
    loadCategory()
  }, [])
  useEffect(() => {
    const fetchBooks = async () => {
    setLoading(true);
    const data = await getBooks();
    setBooks(data);
    setLoading(false);
  };
  fetchBooks()
  }, []);

    return (
        <div className="bg-white text-white p-6 rounded-2xl shadow-lg w-full border border-gray-700 ">
          {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-black border-b border-gray-700">
              <th className="pb-3">Tên sách</th>
              <th className="pb-3">Tác giả</th>
              <th className="pb-3">Category ID</th>
              <th className="pb-3">Tổng số sách</th>
              <th className="pb-3">Còn lại</th>
            </tr>
          </thead>
          <tbody>
               {books && books.length > 0 ? (
              books.map((book) => (
                <tr key={book.id} className="border-b items-center text-black border-gray-800">
                 <td className="py-3">{book.title}</td>
                <td className="py-3">{book.tacgia}</td>
                <td className="py-3">{categories.find(c => c.id === Number(book.category_id))?.name || "Unknown"}</td>
                <td className="py-3">{book.total_copies} </td>
                <td className="py-3">{book.available_copies}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-2xl  py-3 mb-3 text-gray-500">
                  Hiện chưa có sách nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
        </div>
    );
}