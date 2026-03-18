import { useEffect, useState } from "react";
import { getStaff } from "../lib/api";
import { Staff } from "../type/staff";

export default function StaffContent() {

  const [staffs, setStaff] = useState<Staff[]>([])
  const [loading, setLoading] = useState(true)



  useEffect(() => {
    const fetchStaff = async () => {
      setLoading(true);
      const data = await getStaff();
      setStaff(data);
      setLoading(false);
    };
    fetchStaff()
  }, []);

  return (
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

            </tr>
          </thead>
          <tbody>
            {staffs && staffs.length > 0 ? (
              staffs.map((staff) => (
                <tr key={staff.id} className="border-b items-center text-black border-gray-800">
                  <td className="py-3 ">{staff.name}</td>
                  <td className="py-3">{staff.email}</td>
                  <td className="py-3">{staff.phone}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-2xl  py-3 mb-3 text-gray-500">
                  Hiện chưa có nhân viên nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}