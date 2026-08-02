// // src/components/Header.jsx
// import { useState } from 'react';
// import { Bars3Icon, MagnifyingGlassIcon, BellIcon } from '@heroicons/react/24/outline';
// import { useNavigate } from 'react-router-dom';

// const Header = ({ toggleSidebar }) => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const navigate = useNavigate();

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       navigate(`/members?search=${encodeURIComponent(searchQuery)}`);
//     }
//   };

//   return (
//     <header className="bg-white border-b border-gray-200 h-16 flex items-center px-6">
//       <button
//         onClick={toggleSidebar}
//         className="lg:hidden p-2 rounded-md hover:bg-gray-100"
//       >
//         <Bars3Icon className="h-6 w-6 text-gray-600" />
//       </button>

//       <div className="flex-1 ml-4">
//         <form onSubmit={handleSearch} className="max-w-xl">
//           <div className="relative">
//             <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search members, families, documents..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
//             />
//           </div>
//         </form>
//       </div>

//       <div className="flex items-center space-x-4">
//         <button
//           onClick={() => navigate('/notifications')}
//           className="relative p-2 rounded-full hover:bg-gray-100"
//         >
//           <BellIcon className="h-6 w-6 text-gray-600" />
//           <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
//         </button>
//       </div>
//     </header>
//   );
// };

// export default Header;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  BellIcon,
  SunIcon,
} from "@heroicons/react/24/outline";

export default function Header({ toggleSidebar }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();

    if (!search.trim()) return;

    navigate(`/members?search=${encodeURIComponent(search)}`);
  };

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-72 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm z-30 transition-all">

      <div className="h-full flex items-center justify-between px-4 lg:px-8">

        {/* Left */}
        <div className="flex items-center gap-4">

          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-xl hover:bg-slate-100 transition"
          >
            <Bars3Icon className="w-6 h-6 text-slate-700" />
          </button>

          <div className="hidden md:block">

            <h2 className="text-xl font-bold text-slate-800">
              Dashboard
            </h2>

            <p className="text-sm text-slate-500">
              Welcome back 👋
            </p>

          </div>

        </div>

        {/* Center Search */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 max-w-xl mx-8"
        >
          <div className="relative w-full">

            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search members, families..."
              className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
            />

          </div>
        </form>

        {/* Right */}
        <div className="flex items-center gap-3">

          {/* Theme Button */}
          <button className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition">
            <SunIcon className="w-5 h-5 text-slate-700" />
          </button>

          {/* Notification */}
          <button
            onClick={() => navigate("/notifications")}
            className="relative w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition"
          >
            <BellIcon className="w-5 h-5 text-slate-700" />

            <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white"></span>
          </button>

          {/* User */}
          <button className="flex items-center gap-3 rounded-xl bg-slate-100 hover:bg-slate-200 px-3 py-2 transition">

            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold shadow">
              R
            </div>

            <div className="hidden lg:block text-left">

              <p className="text-sm font-semibold text-slate-800">
                Roshan
              </p>

              <p className="text-xs text-slate-500">
                Administrator
              </p>

            </div>

          </button>

        </div>

      </div>

    </header>
  );
}