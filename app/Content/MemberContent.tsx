import { useEffect, useState } from "react";

import { getMember } from "../lib/api";
import { Member } from "../type/member";
import { format } from "date-fns";

export default function MemberContent() {

  const [members, setMember] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)



  useEffect(() => {
    const fetchMember = async () => {
      setLoading(true);
      const data = await getMember();
      setMember(data);
      setLoading(false);
    };
    fetchMember()
  }, []);

  return (
    <div className="bg-white text-white p-6 rounded-2xl shadow-lg w-full border border-gray-700 ">
      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-black border-b border-gray-700">
              <th className="pb-3">Tên thành viên</th>
       
              <th className="pb-3">Số điện thoại</th>
                     <th className="pb-3">Địa chỉ</th>
                      <th className="pb-3">Ngày đăng ký</th>
                       <th className="pb-3">Trạng thái</th>

            </tr>
          </thead>
          <tbody>
            {members && members.length > 0 ? (
              members.map((member) => (
                <tr key={member.id} className="border-b items-center text-black border-gray-800">
                  <td className="py-3 ">{member.name}</td>

                  <td className="py-3">{member.phone}</td>
                       <td className="py-3">{member.address}</td>
                            <td>{member.membership_date ? format(member.membership_date, 'dd/MM/yyyy') : '-'}</td>
                         
                                 <td className="py-3">{member.status}</td>
                                      
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-2xl  py-3 mb-3 text-gray-500">
                  Hiện chưa có thành viên nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}