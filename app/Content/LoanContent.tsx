import { useEffect, useState } from "react";
import { format } from 'date-fns';
import { Loan } from "../type/loan";
import { getBooks, getLoan,getStaff,getMember } from "../lib/api";
import { Book } from "../type/book";
import { Member } from "../type/member";
import { Staff } from "../type/staff";

export default function LoanContent() {

  const [loans, setLoan] = useState<Loan[]>([])
  const [loading, setLoading] = useState(true)

 const [books, setBooks] = useState<Book[]>([])
 
 const [members, setMember] = useState<Member[]>([])
 
 const [staffs, setStaff] = useState<Staff[]>([])
  

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


  useEffect(() => {
    const fetchLoan = async () => {
      setLoading(true);
      const data = await getLoan();
      setLoan(data);
      setLoading(false);
    };
    fetchLoan()
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
              <th className="pb-3">Người mượn</th>
              <th className="pb-3">Nhân viên phụ trách</th>

              <th className="pb-3">Ngày đến hạn</th>
              <th className="pb-3">Ngày trả</th>
              <th className="pb-3">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {loans && loans.length > 0 ? (
              loans.map((loan) => (
                <tr key={loan.id} className="border-b items-center text-black border-gray-800">
                  <td className="py-3 ">{loan.book_id}</td>
                  <td className="py-3">{loan.member_id}</td>
                  <td className="py-3 ">{loan.staff_id}</td>
  <td className="py-3">{books.find(c => c.id === Number(loan.book_id))?.title || "Unknown"}</td>
    <td className="py-3">{members.find(c => c.id === Number(loan.member_id))?.name || "Unknown"}</td>
      <td className="py-3">{staffs.find(c => c.id === Number(loan.staff_id))?.name || "Unknown"}</td>

                  <td>{loan.borrow_date ? format(loan.borrow_date, 'dd/MM/yyyy') : '-'}</td>
                  <td>{loan.due_date ? format(loan.due_date, 'dd/MM/yyyy') : '-'}</td>
                  <td>{loan.return_date ? format(loan.return_date, 'dd/MM/yyyy') : '-'}</td>

                  <td className="py-3">{loan.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-2xl  py-3 mb-3 text-gray-500">
                  Hiện chưa có phiếu mượn nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}