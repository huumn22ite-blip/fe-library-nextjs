import { useEffect, useState } from "react";

import { Category } from "../type/category";
import { getCategory } from "../lib/api";

export default function CategoryContent() {

  const [categories, setCategory] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)



  useEffect(() => {
    const fetchCategory = async () => {
      setLoading(true);
      const data = await getCategory();
      setCategory(data);
      setLoading(false);
    };
    fetchCategory()
  }, []);

  return (
    <div className="bg-white text-white p-6 rounded-2xl shadow-lg w-full border border-gray-700 ">
      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-black border-b border-gray-700">
              <th className="pb-3">Tên thể loại</th>
              <th className="pb-3">Mô tả</th>
            

            </tr>
          </thead>
          <tbody>
            {categories && categories.length > 0 ? (
              categories.map((category) => (
                <tr key={category.id} className="border-b items-center text-black border-gray-800">
                  <td className="py-3  ">{category.name}</td>
                  <td className="py-3">{category.decscription}</td>
              
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-2xl  py-3 mb-3 text-gray-500">
                  Hiện chưa có thể loại nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}