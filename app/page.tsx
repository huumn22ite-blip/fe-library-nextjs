"use client";
import React, { useState } from 'react';
import TabBar from './components/TabBar';
import Sidebar from './components/SideBar';
import BooksContent from "./Content/BookContent";
import StaffContent from './Content/StaffContent';
import CategoryContent from './Content/CategoryContent';
import LoanContent from './Content/LoanContent';
import MemberContent from './Content/MemberContent';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("books"); // mặc định Books
  return (
    <div className="flex bg-white">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className='flex flex-1 flex-col'>
        <div className="flex  items-center justify-start bg-white p-4 sticky top-0 z-10" style={{ height: '40px' }}>
          <TabBar />
        </div>
        <div className="flex text-black mt-5 p-4">
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