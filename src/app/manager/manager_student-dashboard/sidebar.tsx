// // staff/students/layout.tsx
// import Link from 'next/link';

// export default function StudentsLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <>
//       {/* Top Navigation Bar - Exact same as your HTML */}
//       <header className="fixed top-0 w-full h-[64px] z-50 flex items-center justify-between px-6 bg-[#12121d] shadow-none">
//         <div className="flex items-center gap-4">
//           <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-[#c0c1ff] to-[#8083ff]">
//             Library OS
//           </span>
//         </div>

//         <div className="flex items-center gap-6">
//           <div className="relative hidden md:block">
//             <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
//             <input
//               className="bg-surface-container-lowest border-none rounded-lg pl-10 pr-4 py-1.5 text-sm focus:ring-1 focus:ring-primary w-64"
//               placeholder="Global Search..."
//               type="text"
//             />
//           </div>

//           <div className="flex items-center gap-4 text-slate-400">
//             <span className="material-symbols-outlined cursor-pointer hover:text-white transition-colors">notifications</span>
//             <span className="material-symbols-outlined cursor-pointer hover:text-white transition-colors">help</span>
//             <span className="material-symbols-outlined cursor-pointer hover:text-white transition-colors">settings</span>

//             <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant/20">
//               <img
//                 alt="User Profile Avatar"
//                 className="w-full h-full object-cover"
//                 src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9ExNYZFdaaZ-Pvc7nJ6vy3Ax48kr25AKxbMmgxqeYff_ND8LYLpTHIc-k_SiUCe2_asTkeWXOgfHXRUEykUit2-MZbQ_lWGa718d7K7T1AMZDEhVihlbRq9253mx32GlhCjy4oEL9MKOwmgzeP0FQX4GHllLY-Xgb8ggFDSEsq58fQqVXJi9NKPvafxr165wnjIxybJWxtHX5QL-wI0lPMk78fZ_23QnPZasDfTkDZYZbdcz577OcaTu2u0vQLedGW-Zu1r1XUZKX"
//               />
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Staff Sidebar - Exact same as your HTML */}
//       <aside className="fixed left-0 top-0 h-screen w-[240px] z-40 flex flex-col pt-[64px] pb-4 overflow-y-auto bg-[#1b1a26]">
//         <div className="px-6 py-6 border-b border-outline-variant/10">
//           <h2 className="text-xs font-semibold text-primary tracking-widest uppercase">Admission Module</h2>
//           <p className="text-[10px] text-slate-500 mt-1">Academic Year 2024-25</p>
//         </div>

//         <nav className="mt-4 flex flex-col">
//           <Link href="/staff" className="flex items-center gap-3 px-6 py-3 cursor-pointer text-slate-400 hover:bg-[#292935] hover:text-white transition-all">
//             <span className="material-symbols-outlined">dashboard</span>
//             <span className="text-sm">Dashboard</span>
//           </Link>
//           <Link href="/staff/reports" className="flex items-center gap-3 px-6 py-3 cursor-pointer text-slate-400 hover:bg-[#292935] hover:text-white transition-all">
//             <span className="material-symbols-outlined">assessment</span>
//             <span className="text-sm">Reports</span>
//           </Link>
//           <Link href="/staff/enquiries" className="flex items-center gap-3 px-6 py-3 cursor-pointer text-slate-400 hover:bg-[#292935] hover:text-white transition-all">
//             <span className="material-symbols-outlined">manage_search</span>
//             <span className="text-sm">CRM (Enquiries)</span>
//           </Link>

//           {/* Students - Active (highlighted) */}
//           <Link
//             href="/staff/students"
//             className="flex items-center gap-3 px-6 py-3 cursor-pointer text-indigo-300 font-medium border-l-4 border-indigo-500 bg-indigo-500/10"
//           >
//             <span className="material-symbols-outlined">group</span>
//             <span className="text-sm">Students</span>
//           </Link>

//           <Link href="/staff/seats" className="flex items-center gap-3 px-6 py-3 cursor-pointer text-slate-400 hover:bg-[#292935] hover:text-white transition-all">
//             <span className="material-symbols-outlined">event_seat</span>
//             <span className="text-sm">Seats &amp; Shifts</span>
//           </Link>
//           <Link href="/staff/finance" className="flex items-center gap-3 px-6 py-3 cursor-pointer text-slate-400 hover:bg-[#292935] hover:text-white transition-all">
//             <span className="material-symbols-outlined">payments</span>
//             <span className="text-sm">Finance</span>
//           </Link>
//           <Link href="/staff/operations" className="flex items-center gap-3 px-6 py-3 cursor-pointer text-slate-400 hover:bg-[#292935] hover:text-white transition-all">
//             <span className="material-symbols-outlined">settings_applications</span>
//             <span className="text-sm">Operations</span>
//           </Link>
//           <Link href="/staff/accounts" className="flex items-center gap-3 px-6 py-3 cursor-pointer text-slate-400 hover:bg-[#292935] hover:text-white transition-all">
//             <span className="material-symbols-outlined">account_balance</span>
//             <span className="text-sm">Accounts</span>
//           </Link>
//           <Link href="/staff/communication" className="flex items-center gap-3 px-6 py-3 cursor-pointer text-slate-400 hover:bg-[#292935] hover:text-white transition-all">
//             <span className="material-symbols-outlined">chat</span>
//             <span className="text-sm">Communication</span>
//           </Link>
//           <Link href="/staff/admin" className="flex items-center gap-3 px-6 py-3 cursor-pointer text-slate-400 hover:bg-[#292935] hover:text-white transition-all">
//             <span className="material-symbols-outlined">admin_panel_settings</span>
//             <span className="text-sm">Admin</span>
//           </Link>
//           <Link href="/staff/system" className="flex items-center gap-3 px-6 py-3 cursor-pointer text-slate-400 hover:bg-[#292935] hover:text-white transition-all">
//             <span className="material-symbols-outlined">settings</span>
//             <span className="text-sm">System</span>
//           </Link>
//         </nav>
//       </aside>

//       {/* Main Content Wrapper */}
//       <main className="ml-[240px] mt-[64px] min-h-screen">
//         {children}
//       </main>
//     </>
//   );
// }

 import React from 'react'
 
 const sidebar = () => {
   return (
     <div>sidebar</div>
   )
 }
 
 export default sidebar
