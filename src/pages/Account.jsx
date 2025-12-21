import { useState } from "react";
import {
    LuPackage,
    LuRotateCcw,
    LuHeart,
    LuSettings
} from "react-icons/lu";
import { NavLink, Outlet } from "react-router-dom";

export default function Account() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [userData] = useState({
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+91 9876543210",
        gender: "Male",
        dateOfBirth: "1990-01-15"
    });

    const menuItems = [
        {
            id: "account",
            label: "Manage My Account",
            icon: LuSettings,
            subItems: [
                { id: "profile", label: "My Profile", link: "/account" },
                { id: "addresses", label: "Address Book", link: "/account/address" }
            ]
        },
        { id: "orders", label: "My Orders", icon: LuPackage, link: "/account/orders" },
        { id: "returns", label: "My Returns", icon: LuRotateCcw, link: "/account/returns" },
        { id: "wishlist", label: "My Wishlist", icon: LuHeart, link: "/account/wishlist" }
    ];

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    return (
        <div className="min-h-screen py-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 relative">
                {/* Left Sidebar */}
                <div
                    className={`lg:col-span-1 absolute lg:relative inset-y-0 left-0 top-0 z-40 w-full lg:w-auto transform transition-transform duration-300 lg:transform-none ${isSidebarOpen ? 'block' : 'hidden lg:block'
                        }`}
                >
                    <div className="bg-primary sticky top-0 left-0 p-4 h-full lg:h-auto overflow-y-auto">
                        {/* User Info */}
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                            <div className="w-12 h-12 bg-secondary2 rounded-full flex items-center justify-center text-text font-bold text-lg">
                                {userData.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-bold text-text2">{userData.name}</h3>
                                <p className="text-sm text-text1">{userData.email}</p>
                            </div>
                        </div>

                        {/* Menu Items */}
                        <nav className="space-y-1">
                            {menuItems.map((item) => (
                                <div key={item.id}>
                                    {item.subItems ? (
                                        <div>
                                            <div className="flex items-center gap-3 px-3 py-2 text-gray-700 font-semibold">
                                                <item.icon className="w-5 h-5" />
                                                <span>{item.label}</span>
                                            </div>
                                            <div className="ml-8 space-y-1">
                                                {item.subItems.map((subItem) => (
                                                    <NavLink
                                                        to={subItem.link}
                                                        end
                                                        key={subItem.id}
                                                        onClick={closeSidebar}
                                                        className="block w-full text-left px-3 py-2 rounded-lg transition-colors duration-300 text-gray-700 hover:bg-gray-50"
                                                    >
                                                        {subItem.label}
                                                    </NavLink>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <NavLink
                                            to={item.link}
                                            onClick={closeSidebar}
                                            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-colors duration-300 text-gray-700 hover:bg-gray-50"
                                        >
                                            <item.icon className="w-5 h-5" />
                                            <span>{item.label}</span>
                                        </NavLink>
                                    )}
                                </div>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3 lg:ml-0">
                    <Outlet context={{ setIsSidebarOpen }} />
                </div>
            </div>
        </div>
    );
}