"use client";
import React, { useState } from 'react';
import TabBar from './components/TabBar';
import Sidebar from './components/SideBar';
import BooksContent from "./Content/BookContent";
import StaffContent from './Content/StaffContent';
import CategoryContent from './Content/CategoryContent';
import LoanContent from './Content/LoanContent';
import MemberContent from './Content/MemberContent';
import { FaBars } from 'react-icons/fa';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("books"); // mặc định Books
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex bg-white min-h-screen">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className='flex flex-1 flex-col w-full max-w-full overflow-hidden'>
        <div className="flex items-center justify-start bg-white p-4 sticky top-0 z-10 border-b" style={{ height: '60px' }}>
          <button className="md:hidden mr-4 text-black" onClick={() => setIsSidebarOpen(true)}>
            <FaBars size={24} />
          </button>
          <TabBar />
        </div>
        <div className="flex text-black mt-2 p-4 w-full overflow-x-auto">
          {activeTab === "books" && <BooksContent />}
 {activeTab === "staff" && <StaffContent />}
  {activeTab === "categories" && <CategoryContent />}

    {activeTab === "loans" && <LoanContent />}
       {activeTab === "member" && <MemberContent />}
        </div>
      </div>
    </div>
  );
}