"use client";

import { usePathname, useRouter } from "next/navigation";

const tabs = [


  { name: "Dashboard", path: "/dashboard" },
  { name: "Login", path: "/login" },
];

export default function TabBar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex gap-9 mt-2 border-b pb-1 p-4">
      {tabs.map((tab) => {
        const isActive = pathname === tab.path;

        return (
          <button
            type="button"
            key={tab.path}
            onClick={() => router.push(tab.path)}
            className={`px-4  py-2 rounded-lg transition ${isActive
                ? " text-black"
                : "text-black hover:bg-gray-300"
              }`}
          >
            {tab.name}
          </button>
        );
      })}
    </div>
  );
}