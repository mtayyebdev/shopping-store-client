import React, { useMemo, useState } from "react";
import {
  FaBoxOpen,
  FaCheckCircle,
  FaEye,
  FaRedoAlt,
  FaSearch,
  FaTimes,
  FaTrash,
  FaWallet,
  FaTimesCircle,
} from "react-icons/fa";
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md";

const RETURN_REASONS = [
  "damaged",
  "wrong_item",
  "wrong_size",
  "not_as_described",
  "other",
  "change_mind",
  "wrong_color",
];

const RETURN_STATUSES = [
  "requested",
  "approved",
  "rejected",
  "picked",
  "received",
  "refunded",
  "replaced",
  "completed",
];

const REFUND_METHODS = ["wallet", "bank", "original"];

const labelize = (value) =>
  value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const statusClass = (status) => {
  if (["completed", "refunded", "replaced"].includes(status)) return "bg-emerald-100 text-emerald-700";
  if (["rejected"].includes(status)) return "bg-red-100 text-red-700";
  if (["requested", "approved", "picked", "received"].includes(status)) return "bg-amber-100 text-amber-700";
  return "bg-gray-100 text-gray-700";
};

const daysAgo = (days) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
};

const formatDate = (date) => (date ? new Date(date).toLocaleString() : "-");

const createMockReturns = () => {
  const products = [
    "Classic White T-Shirt",
    "Running Shoes Black",
    "Wireless Headphones",
    "Denim Jeans Blue",
    "Leather Wallet Brown",
  ];

  const names = ["Ali Raza", "Sara Khan", "Ahmed Ali", "Fatima Noor", "Usman Tariq", "Zara Ahmed"];

  return Array.from({ length: 26 }, (_, i) => {
    const status = RETURN_STATUSES[i % RETURN_STATUSES.length];
    const reason = RETURN_REASONS[i % RETURN_REASONS.length];
    const method = REFUND_METHODS[i % REFUND_METHODS.length];

    return {
      _id: `66eacc3fa2b1e30018d9${7000 + i}`,
      userId: `65d4c8f9a2b1e30018u${String(500 + i)}`,
      customerName: names[i % names.length],
      orderId: `65f2a8c9b1a1e30018d9${String(800 + i)}`,
      orderCode: `ORD-${String(12000 + i)}`,
      productId: `65d4c8f9a2b1e30018p${String(400 + i)}`,
      orderItemId: `65d4c8f9a2b1e30018i${String(200 + i)}`,
      productName: products[i % products.length],
      quantity: (i % 3) + 1,
      reason,
      description:
        reason === "damaged"
          ? "Package received with visible physical damage."
          : reason === "wrong_item"
            ? "Different item delivered than ordered."
            : "Customer requested return due to product mismatch.",
      images:
        i % 3 === 0
          ? [
              {
                url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=120&h=120&fit=crop",
                publicId: `return-${i}-1`,
              },
              {
                url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=120&h=120&fit=crop",
                publicId: `return-${i}-2`,
              },
            ]
          : [],
      status,
      refundAmount: Number((25 + i * 3.5).toFixed(2)),
      refundMethod: method,
      adminNote:
        status === "rejected"
          ? "Return denied due to policy mismatch."
          : status === "approved"
            ? "Pickup scheduled and customer informed."
            : "Under review by returns team.",
      createdAt: daysAgo(i + 1).toISOString(),
      updatedAt: daysAgo(Math.max(i - 1, 0)).toISOString(),
    };
  });
};

function Returns() {
  const [returnsData, setReturnsData] = useState(createMockReturns);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [reasonFilter, setReasonFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewModal, setViewModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedReturn, setSelectedReturn] = useState(null);

  const rowsPerPage = 8;

  const filtered = useMemo(() => {
    let data = [...returnsData];
    const q = search.trim().toLowerCase();

    if (q) {
      data = data.filter((item) => {
        const txt = [item.orderCode, item.productName, item.customerName, item._id, item.orderItemId].join(" ").toLowerCase();
        return txt.includes(q);
      });
    }

    if (statusFilter !== "all") data = data.filter((item) => item.status === statusFilter);
    if (reasonFilter !== "all") data = data.filter((item) => item.reason === reasonFilter);

    if (timeFilter !== "all") {
      const now = new Date();
      data = data.filter((item) => {
        const d = new Date(item.createdAt);
        const diffDays = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
        if (timeFilter === "day") return diffDays <= 1;
        if (timeFilter === "week") return diffDays <= 7;
        if (timeFilter === "month") return diffDays <= 30;
        if (timeFilter === "year") return diffDays <= 365;
        return true;
      });
    }

    return data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [returnsData, search, statusFilter, reasonFilter, timeFilter]);

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const pageData = filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const totalReturns = returnsData.length;
  const pendingReturns = returnsData.filter((r) => ["requested", "approved", "picked", "received"].includes(r.status)).length;
  const completedReturns = returnsData.filter((r) => ["completed", "refunded", "replaced"].includes(r.status)).length;
  const rejectedReturns = returnsData.filter((r) => r.status === "rejected").length;

  const stats = [
    { id: 1, title: "Total Returns", value: totalReturns, icon: FaRedoAlt, bgColor: "bg-blue-50", iconColor: "text-blue-600", valueColor: "text-blue-600" },
    { id: 2, title: "In Review", value: pendingReturns, icon: FaBoxOpen, bgColor: "bg-amber-50", iconColor: "text-amber-600", valueColor: "text-amber-600" },
    { id: 3, title: "Resolved", value: completedReturns, icon: FaCheckCircle, bgColor: "bg-emerald-50", iconColor: "text-emerald-600", valueColor: "text-emerald-600" },
    { id: 4, title: "Rejected", value: rejectedReturns, icon: FaTimesCircle, bgColor: "bg-rose-50", iconColor: "text-rose-600", valueColor: "text-rose-600" },
  ];

  const handleStatusChange = (id, status) => {
    setReturnsData((prev) => prev.map((item) => (item._id === id ? { ...item, status, updatedAt: new Date().toISOString() } : item)));
  };

  const openView = (item) => {
    setSelectedReturn(item);
    setViewModal(true);
  };

  const openDelete = (item) => {
    setSelectedReturn(item);
    setDeleteModal(true);
  };

  const closeModals = () => {
    setViewModal(false);
    setDeleteModal(false);
    setSelectedReturn(null);
  };

  const handleDelete = () => {
    if (!selectedReturn) return;
    setReturnsData((prev) => prev.filter((item) => item._id !== selectedReturn._id));
    closeModals();
  };

  const setPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
        {stats.map((stat) => (
          <div key={stat.id} className="bg-white p-5 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                <h3 className={`text-2xl font-bold ${stat.valueColor}`}>{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`text-2xl ${stat.iconColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-5 rounded-2xl shadow-lg">
        <div className="flex flex-col gap-4 mb-6">
          <h3 className="text-xl font-semibold">Returns Management</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 w-full xl:w-auto">
            <div className="relative min-w-56">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search order/product..."
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
            >
              <option value="all">All Status</option>
              {RETURN_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {labelize(status)}
                </option>
              ))}
            </select>

            <select
              value={reasonFilter}
              onChange={(e) => {
                setReasonFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
            >
              <option value="all">All Reasons</option>
              {RETURN_REASONS.map((reason) => (
                <option key={reason} value={reason}>
                  {labelize(reason)}
                </option>
              ))}
            </select>

            <select
              value={timeFilter}
              onChange={(e) => {
                setTimeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
            >
              <option value="all">All Time</option>
              <option value="day">Last 24 Hours</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="year">Last 12 Months</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto block overflow-hidden">
          <table className="w-full min-w-240">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="text-left px-2 py-3 font-semibold text-gray-700">Return ID</th>
                <th className="text-left px-2 py-3 font-semibold text-gray-700">Order</th>
                <th className="text-left px-2 py-3 font-semibold text-gray-700">Customer</th>
                <th className="text-left px-2 py-3 font-semibold text-gray-700">Product</th>
                <th className="text-left px-2 py-3 font-semibold text-gray-700">Reason</th>
                <th className="text-left px-2 py-3 font-semibold text-gray-700">Refund</th>
                <th className="text-left px-2 py-3 font-semibold text-gray-700">Status</th>
                <th className="text-center px-2 py-3 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>

            <tbody>
              {pageData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-500">
                    No returns found.
                  </td>
                </tr>
              ) : (
                pageData.map((item) => (
                  <tr key={item._id} className="border-b border-gray-200">
                    <td className="px-2 py-3">
                      <p className="font-semibold text-gray-800">{item._id.slice(-8).toUpperCase()}</p>
                      <p className="text-xs font-mono text-gray-500">{item._id}</p>
                    </td>
                    <td className="px-2 py-3">
                      <p className="text-gray-700">{item.orderCode}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </td>
                    <td className="px-2 py-3">
                      <p className="text-gray-700 font-medium">{item.customerName}</p>
                      <p className="text-xs text-gray-500">{item.userId}</p>
                    </td>
                    <td className="px-2 py-3 text-gray-700">{item.productName}</td>
                    <td className="px-2 py-3 text-sm text-gray-700">{labelize(item.reason)}</td>
                    <td className="px-2 py-3">
                      <div className="text-sm text-gray-700">
                        <p className="font-semibold">${item.refundAmount.toFixed(2)}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <FaWallet size={10} /> {labelize(item.refundMethod)}
                        </p>
                      </div>
                    </td>
                    <td className="px-2 py-3">
                      <select
                        value={item.status}
                        onChange={(e) => handleStatusChange(item._id, e.target.value)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border outline-none ${statusClass(item.status)}`}
                      >
                        {RETURN_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {labelize(status)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-2 py-3">
                      <div className="flex justify-center gap-2">
                        <button
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View"
                          onClick={() => openView(item)}
                        >
                          <FaEye size={15} />
                        </button>
                        <button
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                          onClick={() => openDelete(item)}
                        >
                          <FaTrash size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between mt-8 gap-4">
          <p className="text-sm text-gray-500">
            Showing <span className="font-semibold text-gray-900">{pageData.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1}</span>
            {" "}to <span className="font-semibold text-gray-900">{Math.min(currentPage * rowsPerPage, filtered.length)}</span>
            {" "}of <span className="font-semibold text-gray-900">{filtered.length}</span> returns
          </p>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MdOutlineKeyboardArrowLeft className="inline" size={18} /> Prev
            </button>

            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => setPage(page)}
                  className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-semibold ${
                    currentPage === page ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() => setPage(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next <MdOutlineKeyboardArrowRight className="inline" size={18} />
            </button>
          </div>
        </div>
      </div>

      {viewModal && selectedReturn && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-5 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-2xl font-bold text-gray-800">Return Details</h2>
              <button onClick={closeModals} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <FaTimes size={20} className="text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500">Order</p>
                  <p className="font-semibold text-gray-800">{selectedReturn.orderCode}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500">Status</p>
                  <p className="font-semibold text-gray-800">{labelize(selectedReturn.status)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500">Reason</p>
                  <p className="font-semibold text-gray-800">{labelize(selectedReturn.reason)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500">Refund</p>
                  <p className="font-semibold text-gray-800">${selectedReturn.refundAmount.toFixed(2)}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <h4 className="font-semibold text-gray-700 mb-2">Product Information</h4>
                  <p className="text-sm text-gray-700">{selectedReturn.productName}</p>
                  <p className="text-xs text-gray-500 mt-1">Product ID: {selectedReturn.productId}</p>
                  <p className="text-xs text-gray-500">Order Item ID: {selectedReturn.orderItemId}</p>
                  <p className="text-sm text-gray-700 mt-2">Quantity: {selectedReturn.quantity}</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <h4 className="font-semibold text-gray-700 mb-2">Customer & Refund</h4>
                  <p className="text-sm text-gray-700">{selectedReturn.customerName}</p>
                  <p className="text-xs text-gray-500 mt-1">User ID: {selectedReturn.userId}</p>
                  <p className="text-sm text-gray-700 mt-2">Refund Method: {labelize(selectedReturn.refundMethod)}</p>
                  <p className="text-sm text-gray-700">Admin Note: {selectedReturn.adminNote || "-"}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <h4 className="font-semibold text-gray-700 mb-2">Description</h4>
                <p className="text-sm text-gray-600">{selectedReturn.description || "No description provided."}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <h4 className="font-semibold text-gray-700 mb-3">Return Images</h4>
                {selectedReturn.images.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {selectedReturn.images.map((img) => (
                      <img key={img.publicId} src={img.url} alt="Return evidence" className="w-full aspect-square rounded-lg object-cover border border-gray-200" />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No images attached.</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500">Created</p>
                  <p className="font-medium text-gray-800 text-sm">{formatDate(selectedReturn.createdAt)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500">Updated</p>
                  <p className="font-medium text-gray-800 text-sm">{formatDate(selectedReturn.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteModal && selectedReturn && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Delete Return</h3>
            <p className="text-gray-600 mb-5">
              Are you sure you want to delete return request for <span className="font-semibold">{selectedReturn.productName}</span>?
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={closeModals}
                className="flex-1 px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Returns;
