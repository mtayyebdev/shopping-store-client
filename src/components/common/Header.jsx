import { useState } from "react";
import { LuSearch, LuShoppingCart, LuUser, LuMenu, LuX } from "react-icons/lu";
import { Link } from "react-router-dom";
import { Button } from "../index.js";

export default function Header() {
  const [isLogined, setisLogined] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(3);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Handle search logic here
      console.log("Searching for:", searchQuery);
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-gray-700 hover:text-blue-600 transition-colors duration-300"
            >
              {isMobileMenuOpen ? (
                <LuX className="w-6 h-6" />
              ) : (
                <LuMenu className="w-6 h-6" />
              )}
            </button>
            <Link
              to="/"
              className="flex-shrink-0 text-lg sm:text-xl md:text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors duration-300"
            >
              Shopping
            </Link>
          </div>

          {/* Center - Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="w-full relative">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch(e)}
                  placeholder="Search products..."
                  className="w-full pl-12 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-300 outline-none"
                />
                <button
                  onClick={handleSearch}
                  className="absolute left-0 top-0 h-full px-4 text-gray-400 hover:text-blue-600 transition-colors duration-300"
                >
                  <LuSearch className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right - Icons (Desktop) */}
          <div className="flex items-center space-x-5 sm:space-x-6">
            {/* Profile Icon */}
            {isLogined ? (
              <Button
                size="lg"
                icon={
                  <LuUser className="w-6 h-6 transform group-hover:scale-110 transition-transform duration-300" />
                }
                iconPosition="left"
                link="/profile"
                value="Profile"
                paddings={false}
                classes="group hover:text-blue-600"
              />
            ) : (
              <Button
                size="lg"
                icon={
                  <LuUser className="w-6 h-6 transform group-hover:scale-110 transition-transform duration-300" />
                }
                iconPosition="left"
                link="/login"
                value="Login"
                paddings={false}
                classes="group hover:text-blue-600"
              />
            )}

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative text-gray-700 hover:text-blue-600 transition-colors duration-300 group"
            >
              <LuShoppingCart className="w-6 h-6 transform group-hover:scale-110 transition-transform duration-300" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch(e)}
              placeholder="Search products..."
              className="w-full pl-12 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-300 outline-none"
            />
            <button
              onClick={handleSearch}
              className="absolute left-0 top-0 h-full px-4 text-gray-400 hover:text-blue-600 transition-colors duration-300"
            >
              <LuSearch className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Sidebar */}
      {isMobileMenuOpen && (
        <>
          <div className="md:hidden fixed top-0 left-0 min-h-screen w-full bg-black/50" onClick={()=>setIsMobileMenuOpen(false)}></div>
          <div className="md:hidden fixed left-0 min-h-screen top-0 w-[250px] bg-white border-r shadow-lg border-gray-200 animate-sideBar">
            <ul className="px-4 py-4 space-y-3">
              <li>Home</li>
              <li>Shop</li>
              <li>About</li>
              <li>Contact</li>
            </ul>
          </div>
        </>
      )}

      <style>{`
        @keyframes sideBar {
          from {
            opacity: 0;
            transform: translateX(-100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-sideBar {
          animation: sideBar 0.3s ease-out;
        }
      `}</style>
    </header>
  );
}
