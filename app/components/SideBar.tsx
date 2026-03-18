"use client";

type SidebarProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const tabs = [
    { name: "Books", key: "books" },
    { name: "Staff", key: "staff" },
     { name: "Categories", key: "categories" },
      { name: "Loans", key: "loans" },
       { name: "Members", key: "member" },
  ];

  return (
    <div className="flex flex-col w-56 h-screen border-r p-4 bg-gray-50">
      <h1 className="text-black text-center font-bold text-xl mb-8 border-b pb-3">
        Quản lý thư viện
      </h1>

      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setActiveTab(tab.key)}
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
  );
}