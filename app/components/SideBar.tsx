"use client";

import { useRouter, usePathname } from "next/navigation";

type SidebarProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export default function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    { name: "Books", key: "books" },
    { name: "Staff", key: "staff" },
    { name: "Categories", key: "categories" },
    { name: "Loans", key: "loans" },
    { name: "Members", key: "member" },
  ];

  function handleTabClick(key: string) {
    setActiveTab(key);
    setIsOpen(false);
    if (pathname !== "/") {
      router.push("/");
    }
  }

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      <div className={`fixed inset-y-0 left-0 z-50 transform ${isOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 transition-transform duration-200 ease-in-out flex flex-col w-64 h-screen border-r p-4 bg-gray-50`}>
      <h1 className="text-black text-center font-bold text-xl mb-8 border-b pb-3">
        Quản lý thư viện
      </h1>

      {tabs.map((tab) => (
        <button
          type="button"
          key={tab.key}
          onClick={() => handleTabClick(tab.key)}
          className={`ml-3 px-4 py-3 mb-2 text-left rounded-lg transition transform ${
            activeTab === tab.key
              ? "bg-black w-full text-white"
              : "text-black hover:scale-105 hover:font-bold hover:bg-amber-100"
          }`}
        >
          {tab.name}
        </button>
      ))}
      </div>
    </>
  );
}
