// src/components/TopBar.jsx
// Header bar yang muncul di semua halaman

export default function TopBar({ title = "Dashboard" }) {
  return (
    <header className="fixed top-0 right-0 left-64 h-14 z-40 bg-white border-b border-slate-200 shadow-sm flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <button className="text-slate-600 hover:text-blue-500 cursor-pointer transition-transform active:scale-95">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <h1 className="text-lg font-black text-slate-900">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <button className="text-slate-600 hover:text-blue-500 cursor-pointer">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full">
              3
            </span>
          </button>
        </div>
        <button className="text-slate-600 hover:text-blue-500 cursor-pointer">
          <span className="material-symbols-outlined">account_circle</span>
        </button>
      </div>
    </header>
  );
}
