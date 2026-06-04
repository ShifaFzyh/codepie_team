import { useState, useEffect } from "react";

const Navbar = ({ onLoginClick }) => {
  // State: apakah header sudah di-scroll atau belum
  const [isScrolled, setIsScrolled] = useState(false);
  // State: nilai input pencarian
  const [searchQuery, setSearchQuery] = useState("");
  // State: apakah search bar mobile sedang terbuka
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  // State: link navbar yang sedang aktif
  const [activeNav, setActiveNav] = useState("Explore");

  // Handling Event: scroll window → ubah tampilan header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handling Event: submit form pencarian
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      alert(`Mencari: "${searchQuery}"`);
    }
  };

  const navLinks = ["Explore", "Writers", "About"];

  return (
    <header
      className={`w-full top-0 sticky z-50 bg-surface-container-lowest border-b border-outline-variant transition-all duration-300 ${
        isScrolled
          ? "shadow-md bg-opacity-95 backdrop-blur-md"
          : "shadow-sm"
      }`}
    >
      <nav className="flex justify-between items-center w-full px-margin-desktop py-sm max-w-[1280px] mx-auto">
        {/* Brand Logo */}
        <div className="flex items-center gap-xs">
          <span className="font-display-lg text-display-lg font-extrabold text-primary">
            InkFlow
          </span>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-lg">
          {navLinks.map((link) => (
            <a
              key={link}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                // Handling Event: klik nav link → update state activeNav
                setActiveNav(link);
              }}
              className={`font-label-md text-label-md transition-all duration-200 ${
                activeNav === link
                  ? "text-primary border-b-2 border-primary pb-1"
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              {link}
            </a>
          ))}
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-md">
          {/* Search Desktop */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden lg:flex items-center bg-surface-container px-sm py-xs rounded-full border border-outline-variant"
          >
            <span className="material-symbols-outlined text-on-surface-variant mr-xs">
              search
            </span>
            <input
              className="bg-transparent border-none focus:ring-0 text-body-md w-48 outline-none"
              placeholder="Search stories..."
              type="text"
              value={searchQuery}
              // Handling Event: perubahan input → update state searchQuery
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          {/* Search Icon Mobile */}
          <button
            className="lg:hidden p-xs rounded-full hover:bg-surface-container transition-all"
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
          >
            <span className="material-symbols-outlined text-on-surface-variant">
              search
            </span>
          </button>

          {/* Login Button — memanggil handler dari props */}
          <button
            onClick={onLoginClick}
            className="bg-primary-container text-on-primary px-lg py-xs rounded-full font-label-md hover:brightness-110 active:scale-95 transition-all duration-200"
          >
            Log In
          </button>
        </div>
      </nav>

      {/* Mobile Search Bar — tampil kondisional berdasarkan state */}
      {isMobileSearchOpen && (
        <div className="lg:hidden px-margin-desktop pb-sm">
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center bg-surface-container px-sm py-xs rounded-full border border-outline-variant"
          >
            <span className="material-symbols-outlined text-on-surface-variant mr-xs">
              search
            </span>
            <input
              className="bg-transparent border-none focus:ring-0 text-body-md flex-1 outline-none"
              placeholder="Search stories..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <button
              type="button"
              onClick={() => setIsMobileSearchOpen(false)}
              className="ml-xs text-on-surface-variant"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </form>
        </div>
      )}
    </header>
  );
};

export default Navbar;