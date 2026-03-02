import React, { useState } from "react";
import {
  FaBell,
  FaGlobe,
  FaKey,
  FaMoon,
  FaPalette,
  FaSave,
  FaShieldAlt,
  FaStore,
  FaUserCog,
  FaTimes
} from "react-icons/fa";

function Toggle({ name, checked, label, onChange }) {
  return (
    <label className="flex items-center justify-between py-2 cursor-pointer">
      <span className="text-sm text-gray-700 font-medium">{label}</span>
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="w-4 h-4"
      />
    </label>
  );
}

function Settings() {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [settings, setSettings] = useState({
    adminName: "Admin User",
    adminEmail: "admin@shop.com",
    adminPhone: "+92 300 1234567",
    storeName: "Urban Cart",
    supportEmail: "support@urbancart.com",
    supportPhone: "+92 311 2223344",
    currency: "USD",
    timezone: "Asia/Karachi",
    language: "English",
    orderPrefix: "ORD",
    lowStockAlert: "10",
    twoFactorAuth: true,
    loginAlerts: true,
    maintenanceMode: false,
    emailOrderUpdates: true,
    emailPromotions: false,
    pushNotifications: true,
    themeMode: "light",
    compactSidebar: false,
    primaryColor: "blue",
    sessionTimeout: "30",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePasswordInput = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleClosePasswordModal = () => {
    setShowPasswordModal(false);
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="space-y-5">
      <div className="bg-white p-5 rounded-2xl shadow-lg flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500 mb-1">Control Center</p>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Configure store, security, notifications and app behavior.</p>
        </div>

        <button
          type="button"
          className="py-2 px-6 rounded bg-btn2 text-text hover:bg-hover-btn2 focus:outline-none focus:ring-2 focus:ring-btn2 focus:ring-opacity-75 min-w-40 flex items-center justify-center gap-2"
        >
          <FaSave size={14} /> Save Settings
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <section className="bg-white p-5 rounded-2xl shadow-lg">
            <div className="flex items-center gap-2 mb-5">
              <FaUserCog className="text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-800">Admin Profile</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Full Name</label>
                <input
                  type="text"
                  name="adminName"
                  value={settings.adminName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Email</label>
                <input
                  type="email"
                  name="adminEmail"
                  value={settings.adminEmail}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Phone</label>
                <input
                  type="text"
                  name="adminPhone"
                  value={settings.adminPhone}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </section>

          <section className="bg-white p-5 rounded-2xl shadow-lg">
            <div className="flex items-center gap-2 mb-5">
              <FaStore className="text-emerald-600" />
              <h2 className="text-lg font-semibold text-gray-800">Store Settings</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Store Name</label>
                <input
                  type="text"
                  name="storeName"
                  value={settings.storeName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Order Prefix</label>
                <input
                  type="text"
                  name="orderPrefix"
                  value={settings.orderPrefix}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Support Email</label>
                <input
                  type="email"
                  name="supportEmail"
                  value={settings.supportEmail}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Support Phone</label>
                <input
                  type="text"
                  name="supportPhone"
                  value={settings.supportPhone}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Currency</label>
                <select
                  name="currency"
                  value={settings.currency}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="USD">USD</option>
                  <option value="PKR">PKR</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Timezone</label>
                <select
                  name="timezone"
                  value={settings.timezone}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="Asia/Karachi">Asia/Karachi</option>
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">America/New_York</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Default Language</label>
                <select
                  name="language"
                  value={settings.language}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="English">English</option>
                  <option value="Urdu">Urdu</option>
                  <option value="Arabic">Arabic</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Low Stock Alert Threshold</label>
                <input
                  type="number"
                  name="lowStockAlert"
                  value={settings.lowStockAlert}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </section>

          <section className="bg-white p-5 rounded-2xl shadow-lg">
            <div className="flex items-center gap-2 mb-5">
              <FaShieldAlt className="text-red-600" />
              <h2 className="text-lg font-semibold text-gray-800">Security</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Session Timeout (minutes)</label>
                <input
                  type="number"
                  name="sessionTimeout"
                  value={settings.sessionTimeout}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(true)}
                  className="w-full py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
                >
                  <FaKey size={13} /> Change Password
                </button>
              </div>
            </div>

            <div className="mt-4 border-t pt-4 space-y-1">
              <Toggle name="twoFactorAuth" checked={settings.twoFactorAuth} label="Enable Two-Factor Authentication" onChange={handleChange} />
              <Toggle name="loginAlerts" checked={settings.loginAlerts} label="Send Login Alerts" onChange={handleChange} />
              <Toggle name="maintenanceMode" checked={settings.maintenanceMode} label="Maintenance Mode" onChange={handleChange} />
            </div>
          </section>
        </div>

        <div className="space-y-5">
          <section className="bg-white p-5 rounded-2xl shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <FaBell className="text-amber-600" />
              <h2 className="text-lg font-semibold text-gray-800">Notifications</h2>
            </div>

            <div className="space-y-1">
              <Toggle
                name="emailOrderUpdates"
                checked={settings.emailOrderUpdates}
                label="Email Order Updates"
                onChange={handleChange}
              />
              <Toggle
                name="emailPromotions"
                checked={settings.emailPromotions}
                label="Email Promotions"
                onChange={handleChange}
              />
              <Toggle
                name="pushNotifications"
                checked={settings.pushNotifications}
                label="Push Notifications"
                onChange={handleChange}
              />
            </div>
          </section>

          <section className="bg-white p-5 rounded-2xl shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <FaPalette className="text-violet-600" />
              <h2 className="text-lg font-semibold text-gray-800">Appearance</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Theme Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSettings((p) => ({ ...p, themeMode: "light" }))}
                    className={`py-2 rounded-lg border text-sm font-medium ${settings.themeMode === "light"
                      ? "border-blue-500 text-blue-600 bg-blue-50"
                      : "border-gray-300 text-gray-700"
                      }`}
                  >
                    Light
                  </button>
                  <button
                    type="button"
                    onClick={() => setSettings((p) => ({ ...p, themeMode: "dark" }))}
                    className={`py-2 rounded-lg border text-sm font-medium ${settings.themeMode === "dark"
                      ? "border-blue-500 text-blue-600 bg-blue-50"
                      : "border-gray-300 text-gray-700"
                      }`}
                  >
                    Dark
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Primary Color</label>
                <select
                  name="primaryColor"
                  value={settings.primaryColor}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="blue">Blue</option>
                  <option value="green">Green</option>
                  <option value="red">Red</option>
                  <option value="orange">Orange</option>
                </select>
              </div>

              <Toggle name="compactSidebar" checked={settings.compactSidebar} label="Compact Sidebar" onChange={handleChange} />
            </div>
          </section>

          <section className="bg-white p-5 rounded-2xl shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <FaGlobe className="text-sky-600" />
              <h2 className="text-lg font-semibold text-gray-800">Quick Summary</h2>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Current Theme</span>
                <span className="font-medium text-gray-800 flex items-center gap-1">
                  <FaMoon size={11} /> {settings.themeMode}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Currency</span>
                <span className="font-medium text-gray-800">{settings.currency}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Timezone</span>
                <span className="font-medium text-gray-800">{settings.timezone}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">2FA Status</span>
                <span className={`font-medium ${settings.twoFactorAuth ? "text-emerald-600" : "text-red-600"}`}>
                  {settings.twoFactorAuth ? "Enabled" : "Disabled"}
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="border-b p-5 flex items-center justify-between rounded-t-2xl">
              <h3 className="text-xl font-bold text-gray-800">Change Password</h3>
              <button
                type="button"
                onClick={handleClosePasswordModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaTimes size={18} className="text-gray-600" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordInput}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordInput}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordInput}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Use at least 8 characters with letters and numbers.</p>
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleClosePasswordModal}
                  className="flex-1 px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="flex-1 px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800 font-semibold"
                >
                  Update Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Settings;
