// // src/layouts/Layout.jsx
// import { useState } from 'react';
// import Sidebar from '../components/Sidebar';
// import Header from '../components/Header';
// import Footer from '../components/Footer';

// const Layout = ({ children }) => {
//   const [sidebarOpen, setSidebarOpen] = useState(true);

//   return (
//     <div className="flex h-screen bg-gray-50">
//       <Sidebar isOpen={sidebarOpen} toggle={() => setSidebarOpen(!sidebarOpen)} />
//       <div className="flex-1 flex flex-col overflow-hidden">
//         <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
//         <main className="flex-1 overflow-y-auto p-6">
//           {children}
//         </main>
//         <Footer />
//       </div>
//     </div>
//   );
// };

// export default Layout;

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        toggle={() => setSidebarOpen(false)}
      />

      {/* Right Side */}
      <div className="lg:ml-72 flex flex-col min-h-screen transition-all duration-300">

        <Header
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className="flex-1 p-6 lg:p-8 mt-16">
          {children}
        </main>

        <Footer />

      </div>
    </div>
  );
}