import { useState } from "react";
import { NavLink, useLocation, Link, useNavigate } from "react-router-dom";
import {
    AiOutlineHome,
    AiOutlineDown,
} from "react-icons/ai";
import { LuGrid2X2, LuLogOut, LuSettings, LuShoppingCart, LuTruck, LuUsers } from 'react-icons/lu'
import { TbTruckReturn } from "react-icons/tb";
import { RiCoupon2Fill } from "react-icons/ri";
import { useDispatch } from 'react-redux'
import { logoutUser, getUser } from '../../../store/publicSlices/UserSlice'

const Sidebar = ({ sidebarToggle, setSidebarToggle }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [openDropdown, setOpenDropdown] = useState("");
    const location = useLocation();

    const toggleDropdown = (menu) => {
        setOpenDropdown((prev) => (prev === menu ? "" : menu));
    };

    // Check if any child route is active
    const isDropdownActive = (routes) => {
        return routes.some(route => location.pathname === route);
    };

    const MenuItem = ({ icon: Icon, label, to, hasDropdown, children, dropdownRoutes = [] }) => {
        const isActive = to ? location.pathname === to : isDropdownActive(dropdownRoutes);
        const isOpen = openDropdown === label;

        if (hasDropdown) {
            return (
                <div>
                    <button
                        onClick={() => toggleDropdown(label)}
                        className={`flex items-center w-full gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive
                            ? "bg-btn2 text-white"
                            : "text-text1 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                            } ${sidebarToggle ? "justify-center" : ""}`}
                    >
                        <div className="relative group">
                            <Icon className={`${sidebarToggle ? "w-6 h-6" : "w-5 h-5"} shrink-0 transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`} />
                        </div>
                        {!sidebarToggle && (
                            <>
                                <span className="flex-1 text-left font-medium">{label}</span>
                                <AiOutlineDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                            </>
                        )}
                    </button>

                    {/* Dropdown */}
                    <div
                        className={`overflow-hidden transition-all duration-300 ${isOpen && !sidebarToggle ? "max-h-96 opacity-100 mt-2" : "max-h-0 opacity-0"
                            }`}
                    >
                        <div className="pl-6 pr-2 space-y-1">
                            {children}
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <NavLink
                to={to}
                end={to === "/web-admin"}
                className={({ isActive }) => `flex items-center w-full gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative group ${isActive
                    ? "bg-linear-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/50"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                    } ${sidebarToggle ? "justify-center" : ""}`}
            >
                <Icon className={`${sidebarToggle ? "w-6 h-6" : "w-5 h-5"} shrink-0 transition-transform duration-300 group-hover:scale-110`} />
                {!sidebarToggle && <span className="flex-1 text-left font-medium">{label}</span>}
            </NavLink>
        );
    };

    const DropdownItem = ({ to, label, badge }) => (
        <NavLink
            to={to}
            className={({ isActive }) => `flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 ${isActive
                ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 font-medium"
                : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
                }`}
        >
            <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
            <span className="flex-1">{label}</span>
            {badge && (
                <span className="px-2 py-0.5 text-xs font-semibold bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-full">
                    {badge}
                </span>
            )}
        </NavLink>
    );

    const handleLogout = async () => {
        dispatch(logoutUser())
        await dispatch(getUser()).then((res) => {
            navigate("/", { replace: true })
        });
    }

    return (
        <>
            {/* Mobile Overlay */}
            {!sidebarToggle && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 lg:hidden transition-opacity duration-300"
                    onClick={() => setSidebarToggle(true)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`z-30 fixed top-0 left-0 lg:static overflow-visible flex h-screen flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ${sidebarToggle ? "lg:w-20 -translate-x-full lg:translate-x-0" : "w-72 translate-x-0"}`}
                onMouseEnter={() => { sidebarToggle && setSidebarToggle(false) }}
            >
                {/* Header */}
                <div className={`flex items-center h-20 px-4 ${sidebarToggle ? "justify-center" : "justify-between"}`}>
                    {!sidebarToggle && (
                        <Link to="/web-admin" className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                <span className="text-white font-bold text-lg">S</span>
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-gray-900 dark:text-white">Shopping</h1>
                                <p className="text-xs text-gray-500">Dashboard</p>
                            </div>
                        </Link>
                    )}

                    {sidebarToggle && (
                        <NavLink to="/web-admin" className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <span className="text-white font-bold text-lg">A</span>
                        </NavLink>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 navigation px-3 py-6 space-y-2">
                    {!sidebarToggle && (
                        <h3 className="px-4 mb-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
                            Menu
                        </h3>
                    )}

                    <MenuItem
                        to={"/web-admin"}
                        icon={AiOutlineHome}
                        label={"Dashboard"}
                    />

                    <MenuItem
                        icon={LuGrid2X2}
                        label={"Products"}
                        hasDropdown={true}
                        dropdownRoutes={["/web-admin/products", "/web-admin/create-product"]}
                    >
                        <DropdownItem to={"/web-admin/products"} label={"Products"} />
                        <DropdownItem to={"/web-admin/create-product"} label={"Create Product"} />
                        <DropdownItem to={"/web-admin/categories"} label={"Categories"} />
                    </MenuItem>

                    <MenuItem
                        icon={LuUsers}
                        label="Customers"
                        to="/web-admin/customers"
                    />

                    <MenuItem
                        icon={LuTruck}
                        label="Delivery Boys"
                        to="/web-admin/delivery-boys"
                    />

                    <MenuItem
                        icon={LuShoppingCart}
                        label="Orders"
                        to="/web-admin/orders"
                    />

                    <MenuItem
                        icon={RiCoupon2Fill}
                        label="Coupons"
                        to="/web-admin/coupons"
                    />

                    <MenuItem
                        icon={TbTruckReturn}
                        label="Returns"
                        to="/web-admin/returns"
                    />

                    <MenuItem
                        icon={LuSettings}
                        label="Settings"
                        to="/web-admin/settings"
                    />

                    <button
                        onClick={handleLogout}
                        className={`flex items-center w-full gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-gray-600 hover:bg-gray-100 ${sidebarToggle ? "justify-center" : ""} group`}
                    >
                        <div className="relative">
                            <LuLogOut className={`${sidebarToggle ? "w-6 h-6" : "w-5 h-5"} shrink-0 transition-transform duration-300 group-hover:scale-110`} />
                        </div>
                        {!sidebarToggle && (
                            <>
                                <span className="flex-1 text-left font-medium">Logout</span>
                            </>
                        )}
                    </button>
                </nav>

            </aside>

        </>
    );
};

export default Sidebar;
