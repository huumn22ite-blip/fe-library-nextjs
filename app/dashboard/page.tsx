"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "../components/SideBar";
import TabBar from "../components/TabBar";
import { getLoan } from "../lib/api";
import { getBooks } from "../lib/api";
import { getMember } from "../lib/api";
import { Loan } from "../type/loan";
import { Book } from "../type/book";
import { Member } from "../type/member";
import { format, differenceInDays, parseISO } from "date-fns";
import { FaExclamationTriangle, FaClock, FaBook } from "react-icons/fa";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("books");
  const [loans, setLoans] = useState<Loan[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      const [loanData, bookData, memberData] = await Promise.all([
        getLoan(),
        getBooks(),
        getMember(),
      ]);
      setLoans(Array.isArray(loanData) ? loanData : []);
      setBooks(Array.isArray(bookData) ? bookData : []);
      setMembers(Array.isArray(memberData) ? memberData : []);
      setLoading(false);
    }
    fetchAll();
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Lọc: chưa trả (status != "returned") và còn hạn hoặc đã quá hạn
  const pendingLoans = loans.filter((loan) => {
    if (!loan.due_date) return false;
    if (loan.status === "returned") return false;
    return true;
  });

  // Sắp xếp theo số ngày còn lại tăng dần (gần hạn nhất lên đầu)
  const sortedLoans = [...pendingLoans].sort((a, b) => {
    const daysA = differenceInDays(parseISO(a.due_date!), today);
    const daysB = differenceInDays(parseISO(b.due_date!), today);
    return daysA - daysB;
  });

  function getDaysBadge(dueDate: string) {
    const days = differenceInDays(parseISO(dueDate), today);
    if (days < 0) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
          <FaExclamationTriangle /> Quá hạn {Math.abs(days)} ngày
        </span>
      );
    } else if (days === 0) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
          <FaClock /> Hết hạn hôm nay
        </span>
      );
    } else if (days <= 3) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
          <FaClock /> Còn {days} ngày
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
          <FaClock /> Còn {days} ngày
        </span>
      );
    }
  }

  // Thống kê
  const overdueCount = sortedLoans.filter(
    (l) => differenceInDays(parseISO(l.due_date!), today) < 0
  ).length;
  const dueTodayCount = sortedLoans.filter(
    (l) => differenceInDays(parseISO(l.due_date!), today) === 0
  ).length;
  const dueSoonCount = sortedLoans.filter((l) => {
    const d = differenceInDays(parseISO(l.due_date!), today);
    return d > 0 && d <= 7;
  }).length;

  return (
    <div className="flex bg-white min-h-screen">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex flex-1 flex-col">
        <div
          className="flex items-center justify-start bg-white p-4 sticky top-0 z-10"
          style={{ height: "40px" }}
        >
          <TabBar />
        </div>

        <div className="flex flex-col text-black mt-5 p-6 gap-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaBook className="text-red-600" /> Dashboard – Sách sắp đến hạn trả
          </h1>

          {/* Thống kê tổng quan */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex flex-col items-center shadow">
              <span className="text-3xl font-bold text-red-600">{overdueCount}</span>
              <span className="text-sm text-red-500 mt-1">Quá hạn</span>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex flex-col items-center shadow">
              <span className="text-3xl font-bold text-orange-500">{dueTodayCount}</span>
              <span className="text-sm text-orange-400 mt-1">Hết hạn hôm nay</span>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex flex-col items-center shadow">
              <span className="text-3xl font-bold text-yellow-600">{dueSoonCount}</span>
              <span className="text-sm text-yellow-500 mt-1">Đến hạn trong 7 ngày</span>
            </div>
          </div>

          {/* Bảng danh sách */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Danh sách phiếu mượn chưa trả
            </h2>

            {loading ? (
              <p className="text-gray-400">Đang tải dữ liệu...</p>
            ) : sortedLoans.length === 0 ? (
              <p className="text-gray-400 text-center py-8">
                Không có phiếu mượn nào chưa được trả 
              </p>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-gray-600 border-b border-gray-200 text-sm">
                    <th className="pb-3">Tên sách</th>
                    <th className="pb-3">Người mượn</th>
                    <th className="pb-3">Ngày mượn</th>
                    <th className="pb-3">Ngày đến hạn</th>
                    <th className="pb-3">Trạng thái</th>
                    <th className="pb-3">Thời gian còn lại</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedLoans.map((loan) => {
                    const days = loan.due_date
                      ? differenceInDays(parseISO(loan.due_date), today)
                      : 0;
                    const rowClass =
                      days < 0
                        ? "bg-red-50"
                        : days === 0
                        ? "bg-orange-50"
                        : days <= 3
                        ? "bg-yellow-50"
                        : "";

                    return (
                      <tr
                        key={loan.id}
                        className={`border-b border-gray-100 text-sm ${rowClass}`}
                      >
                        <td className="py-3 font-medium text-gray-800">
                          {books.find((b) => b.id === Number(loan.book_id))?.title ||
                            "Unknown"}
                        </td>
                        <td className="py-3 text-gray-700">
                          {members.find((m) => m.id === Number(loan.member_id))?.name ||
                            "Unknown"}
                        </td>
                        <td className="py-3 text-gray-600">
                          {loan.borrow_date
                            ? format(parseISO(loan.borrow_date), "dd/MM/yyyy")
                            : "-"}
                        </td>
                        <td className="py-3 text-gray-600">
                          {loan.due_date
                            ? format(parseISO(loan.due_date), "dd/MM/yyyy")
                            : "-"}
                        </td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              loan.status === "overdue"
                                ? "bg-red-100 text-red-700"
                                : loan.status === "borrowed"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {loan.status === "overdue"
                              ? "Quá hạn"
                              : loan.status === "borrowed"
                              ? "Đang mượn"
                              : loan.status}
                          </span>
                        </td>
                        <td className="py-3">
                          {loan.due_date && getDaysBadge(loan.due_date)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
