import { useState } from "react";
import {
  AiOutlineMenu,
  AiOutlineClose,
  AiOutlineSearch,
  AiOutlineBell,
  AiOutlineUser,
  AiOutlineSetting,
  AiOutlineLogout,
  AiOutlineMore,
  AiOutlineDown
} from "react-icons/ai";
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { logoutUser, getUser } from '../../../store/publicSlices/UserSlice'

const Header = ({ sidebarToggle, setSidebarToggle }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.userSlice);
  const [menuToggle, setMenuToggle] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifying, setNotifying] = useState(true);
  const [searchValue, setSearchValue] = useState("");

  // Sample notification data
  const notifications = [
    {
      id: 1,
      user: "Terry Franci",
      avatar: "https://i.pravatar.cc/150?img=1",
      message: "requests permission to change",
      project: "Project - Nganter App",
      category: "Project",
      time: "5 min ago",
      online: true
    },
    {
      id: 2,
      user: "Alena Franci",
      avatar: "https://i.pravatar.cc/150?img=2",
      message: "requests permission to change",
      project: "Project - Nganter App",
      category: "Project",
      time: "8 min ago",
      online: true
    },
    {
      id: 3,
      user: "Jocelyn Kenter",
      avatar: "https://i.pravatar.cc/150?img=3",
      message: "requests permission to change",
      project: "Project - Nganter App",
      category: "Project",
      time: "15 min ago",
      online: true
    },
    {
      id: 4,
      user: "Brandon Philips",
      avatar: "https://i.pravatar.cc/150?img=4",
      message: "requests permission to change",
      project: "Project - Nganter App",
      category: "Project",
      time: "1 hr ago",
      online: false
    }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Search:", searchValue);
  };

  const handleLogout = async () => {
    dispatch(logoutUser())
    await dispatch(getUser()).then((res) => {
      navigate("/", { replace: true })
    });
  }

  return (
    <header className="sticky top-0 z-99999 flex w-full border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="flex grow flex-col items-center justify-between md:flex-row md:px-6">
        {/* Top Section */}
        <div className="flex w-full items-center justify-between gap-2 border-b border-gray-200 px-3 py-3 sm:gap-4 lg:justify-normal md:border-b-0 md:px-0 md:py-4 dark:border-gray-800">
          {/* Hamburger Toggle Button */}
          <button
            onClick={() => setSidebarToggle(!sidebarToggle)}
            className={`z-99999 flex h-10 w-10 items-center justify-center rounded-lg border text-gray-500 transition-all duration-200 lg:h-11 lg:w-11 dark:text-gray-400 ${sidebarToggle
              ? "bg-gray-100 lg:bg-transparent dark:bg-gray-800 dark:lg:bg-transparent"
              : "border-gray-200 dark:border-gray-800"
              }`}
          >
            <svg
              className="hidden fill-current lg:block"
              width="16"
              height="12"
              viewBox="0 0 16 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0.583252 1C0.583252 0.585788 0.919038 0.25 1.33325 0.25H14.6666C15.0808 0.25 15.4166 0.585786 15.4166 1C15.4166 1.41421 15.0808 1.75 14.6666 1.75L1.33325 1.75C0.919038 1.75 0.583252 1.41422 0.583252 1ZM0.583252 11C0.583252 10.5858 0.919038 10.25 1.33325 10.25L14.6666 10.25C15.0808 10.25 15.4166 10.5858 15.4166 11C15.4166 11.4142 15.0808 11.75 14.6666 11.75L1.33325 11.75C0.919038 11.75 0.583252 11.4142 0.583252 11ZM1.33325 5.25C0.919038 5.25 0.583252 5.58579 0.583252 6C0.583252 6.41421 0.919038 6.75 1.33325 6.75L7.99992 6.75C8.41413 6.75 8.74992 6.41421 8.74992 6C8.74992 5.58579 8.41413 5.25 7.99992 5.25L1.33325 5.25Z"
                fill=""
              />
            </svg>

            {sidebarToggle ? (
              <AiOutlineMenu className="block lg:hidden w-6 h-6" />
            ) : (
              <AiOutlineClose className="block lg:hidden w-6 h-6" />
            )}
          </button>

          {/* Logo - Mobile */}
          <Link href="/" className="lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
          </Link>

          {/* Application Menu Button - Mobile */}
          <button
            onClick={() => setMenuToggle(!menuToggle)}
            className={`z-99999 flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 transition-all duration-200 md:hidden dark:text-gray-400 ${menuToggle ? "bg-gray-100 dark:bg-gray-800" : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
          >
            <AiOutlineMore className="w-6 h-6" />
          </button>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:block">
            <div className="relative">
              <span className="absolute top-1/2 left-4 -translate-y-1/2">
                <AiOutlineSearch className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </span>
              <input
                type="text"
                placeholder="Search or type command..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch(e);
                }}
                className="h-11 w-full xl:w-107.5 rounded-lg border border-gray-200 bg-transparent py-2.5 pr-14 pl-12 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-3 focus:ring-blue-500/10 focus:border-blue-300 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-blue-800 transition-all duration-200"
              />
              <button
                type="button"
                className="absolute top-1/2 right-2.5 -translate-y-1/2 inline-flex items-center gap-0.5 rounded-lg border border-gray-200 bg-gray-50 px-1.75 py-[4.5px] text-xs text-gray-500 dark:border-gray-800 dark:bg-white/3 dark:text-gray-400"
              >
                <span>⌘</span>
                <span>K</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div
          className={`w-full items-center justify-between gap-4 px-5 py-4 md:flex md:justify-end md:px-0 md:shadow-none shadow-lg transition-all duration-300 ${menuToggle ? "flex" : "hidden"
            }`}
        >
          <div className="flex items-center gap-2 sm:gap-3 z-50">
            {/* Notification Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotificationOpen(!notificationOpen);
                  setNotifying(false);
                }}
                className="relative flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-all duration-200 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
              >
                {notifying && (
                  <span className="absolute top-0.5 right-0 z-1 h-2 w-2 rounded-full bg-orange-400">
                    <span className="absolute -z-1 inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75"></span>
                  </span>
                )}
                <AiOutlineBell className="w-5 h-5" />
              </button>

              {/* Notification Dropdown */}
              {notificationOpen && (
                <div className="absolute -right-60 md:right-0 mt-4 flex h-120 w-70 flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-2xl dark:border-gray-800 dark:bg-gray-900 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="mb-3 flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
                    <h5 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                      Notification
                    </h5>
                    <button
                      onClick={() => setNotificationOpen(false)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
                    >
                      <AiOutlineClose className="w-5 h-5" />
                    </button>
                  </div>

                  <ul className="flex h-auto flex-col overflow-y-auto custom-scrollbar">
                    {notifications.map((notif) => (
                      <li key={notif.id}>
                        <Link
                          to="#"
                          className="flex gap-3 rounded-lg border-b border-gray-100 px-1 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5 transition-all duration-200"
                        >

                          <span className="block">
                            <span className="mb-1.5 block text-sm text-gray-500 dark:text-gray-400">
                              <span className="font-medium text-gray-800 dark:text-white/90">
                                {notif.user}
                              </span>{" "}
                              {notif.message}{" "}
                              <span className="font-medium text-gray-800 dark:text-white/90">
                                {notif.project}
                              </span>
                            </span>

                            <span className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                              <span>{notif.category}</span>
                              <span className="h-1 w-1 rounded-full bg-gray-400"></span>
                              <span>{notif.time}</span>
                            </span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>

                  <Link
                    to="/web-admin/notifications"
                    className="mt-3 flex justify-center rounded-lg border border-gray-300 bg-white p-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/3 dark:hover:text-gray-200 transition-all duration-200"
                  >
                    View All Notification
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* User Dropdown */}
          <div className="relative z-50">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors duration-200"
            >
              <span className="mr-3 h-11 w-11 overflow-hidden rounded-full ring-2 ring-transparent hover:ring-blue-500/20 transition-all duration-200">
                <img src={user?.avatar?.url} alt="User" />
              </span>

              <span className="block text-sm font-medium mr-1">{user?.name?.split(" ")[0]}</span>

              <AiOutlineDown
                className={`w-4 h-4 transition-transform duration-200 ${userDropdownOpen ? "rotate-180" : ""
                  }`}
              />
            </button>

            {/* User Dropdown Menu */}
            {userDropdownOpen && (
              <div className="absolute right-0 mt-4 flex w-65 flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-2xl dark:border-gray-800 dark:bg-gray-900 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="pb-3">
                  <span className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                    {user?.name}
                  </span>
                  <span className="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">
                    {user?.email}
                  </span>
                </div>

                <ul className="flex flex-col gap-1 border-b border-gray-200 pt-4 pb-3 dark:border-gray-800">
                  <li>
                    <Link
                      to="/web-admin/profile"
                      className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300 transition-all duration-200"
                    >
                      <AiOutlineUser className="w-5 h-5 text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300" />
                      Edit profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/web-admin/settings"
                      className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300 transition-all duration-200"
                    >
                      <AiOutlineSetting className="w-5 h-5 text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300" />
                      Account settings
                    </Link>
                  </li>
                </ul>

                <button className="group mt-3 cursor-pointer flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300 transition-all duration-200" onClick={handleLogout}>
                  <AiOutlineLogout className="w-5 h-5 text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click Outside Handler */}
      {(notificationOpen || userDropdownOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setNotificationOpen(false);
            setUserDropdownOpen(false);
          }}
        />
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes slide-in-from-top {
          from {
            transform: translateY(-8px);
          }
          to {
            transform: translateY(0);
          }
        }
        
        .animate-in {
          animation: fade-in 0.2s ease-out, slide-in-from-top 0.2s ease-out;
        }
      `}</style>
    </header>
  );
};

export default Header