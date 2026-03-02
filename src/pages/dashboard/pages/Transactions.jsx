import React, { useMemo, useState } from "react";
import {
  FaCheckCircle,
  FaClock,
  FaCreditCard,
  FaEye,
  FaMoneyBillWave,
  FaReceipt,
  FaSearch,
  FaTimes,
  FaTrash,
  FaUndo,
} from "react-icons/fa";
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md";

const PAYMENT_METHODS = ["stripe", "paypal", "cod", "jazzcash", "easypaisa"];
const PAYMENT_STATUSES = ["pending", "paid", "failed", "refunded"];

const formatLabel = (value) =>
  value
    .split("_")
    .map((v) => v.charAt(0).toUpperCase() + v.slice(1))
    .join(" ");

const statusClass = (status) => {
  if (status === "paid") return "bg-emerald-100 text-emerald-700";
  if (status === "failed") return "bg-red-100 text-red-700";
  if (status === "refunded") return "bg-amber-100 text-amber-700";
  return "bg-gray-100 text-gray-700";
};

const methodClass = (method) => {
  if (method === "stripe") return "bg-purple-100 text-purple-700";
  if (method === "paypal") return "bg-blue-100 text-blue-700";
  if (method === "cod") return "bg-emerald-100 text-emerald-700";
  if (method === "jazzcash") return "bg-pink-100 text-pink-700";
  return "bg-indigo-100 text-indigo-700";
};

const daysAgo = (days) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
};

const createMockTransactions = () => {
  const names = [
    "Ali Raza",
    "Sara Khan",
    "Ahmed Ali",
    "Fatima Noor",
    "Hassan Shah",
    "Ayesha Malik",
    "Usman Tariq",
    "Zara Ahmed",
  ];

  return Array.from({ length: 36 }, (_, i) => {
    const paymentMethod = PAYMENT_METHODS[i % PAYMENT_METHODS.length];
    const paymentStatus = PAYMENT_STATUSES[i % PAYMENT_STATUSES.length];
    const amount = Number((35 + i * 4.75).toFixed(2));

    return {
      _id: `66c5bb2da2b1e30018d9${4000 + i}`,
      transactionId: `TXN-${String(70001 + i)}`,
      orderId: `ORD-${String(10001 + i)}`,
      userName: names[i % names.length],
      userEmail: `customer${i + 1}@mail.com`,
      paymentMethod,
      paymentStatus,
      amount,
      tax: Number((amount * 0.07).toFixed(2)),
      shippingFee: i % 4 === 0 ? 0 : 8.5,
      netAmount: Number((amount - amount * 0.02).toFixed(2)),
      gatewayFee: Number((amount * 0.02).toFixed(2)),
      paymentResult: {
        id: `PAY-${90000 + i}`,
        status: paymentStatus,
        update_time: daysAgo(i).toISOString(),
        email_address: `payer${i + 1}@mail.com`,
      },
      note:
        paymentStatus === "failed"
          ? "Gateway timeout, retry required"
          : paymentStatus === "refunded"
            ? "Partial refund processed"
            : "Payment processed successfully",
      paidAt: paymentStatus === "paid" || paymentStatus === "refunded" ? daysAgo(i).toISOString() : null,
      createdAt: daysAgo(i + 1).toISOString(),
      updatedAt: daysAgo(Math.max(i - 1, 0)).toISOString(),
    };
  });
};

function Transactions() {
  const [transactions, setTransactions] = useState(createMockTransactions);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewModal, setViewModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const rowsPerPage = 8;

  const filteredTransactions = useMemo(() => {
    let data = [...transactions];
    const q = search.trim().toLowerCase();

    if (q) {
      data = data.filter((tx) => {
        const text = [
          tx.transactionId,
          tx.orderId,
          tx.userName,
          tx.userEmail,
          tx.paymentResult?.id,
          tx.paymentMethod,
          tx.paymentStatus,
        ]
          .join(" ")
          .toLowerCase();
        return text.includes(q);
      });
    }

    if (statusFilter !== "all") {
      data = data.filter((tx) => tx.paymentStatus === statusFilter);
    }

    if (methodFilter !== "all") {
      data = data.filter((tx) => tx.paymentMethod === methodFilter);
    }

    if (timeFilter !== "all") {
      const now = new Date();
      data = data.filter((tx) => {
        const d = new Date(tx.createdAt);
        const diffDays = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
        if (timeFilter === "day") return diffDays <= 1;
        if (timeFilter === "week") return diffDays <= 7;
        if (timeFilter === "month") return diffDays <= 30;
        if (timeFilter === "year") return diffDays <= 365;
        return true;
      });
    }

    return data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [transactions, search, statusFilter, methodFilter, timeFilter]);

  const totalPages = Math.ceil(filteredTransactions.length / rowsPerPage);
  const pageData = filteredTransactions.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const totalTransactions = transactions.length;
  const paidCount = transactions.filter((tx) => tx.paymentStatus === "paid").length;
  const pendingCount = transactions.filter((tx) => tx.paymentStatus === "pending").length;
  const refundedAmount = transactions
    .filter((tx) => tx.paymentStatus === "refunded")
    .reduce((sum, tx) => sum + tx.amount, 0)
    .toFixed(2);

  const stats = [
    {
      id: 1,
      title: "Total Transactions",
      value: totalTransactions,
      icon: FaReceipt,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      valueColor: "text-blue-600",
    },
    {
      id: 2,
      title: "Paid",
      value: paidCount,
      icon: FaCheckCircle,
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
      valueColor: "text-emerald-600",
    },
    {
      id: 3,
      title: "Pending",
      value: pendingCount,
      icon: FaClock,
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600",
      valueColor: "text-amber-600",
    },
    {
      id: 4,
      title: "Refunded Amount",
      value: `$${refundedAmount}`,
      icon: FaUndo,
      bgColor: "bg-rose-50",
      iconColor: "text-rose-600",
      valueColor: "text-rose-600",
    },
  ];

  const formatDate = (value) => (value ? new Date(value).toLocaleString() : "-");

  const handleStatusChange = (transactionId, status) => {
    setTransactions((prev) =>
      prev.map((tx) =>
        tx.transactionId === transactionId
          ? {
              ...tx,
              paymentStatus: status,
              paymentResult: {
                ...tx.paymentResult,
                status,
                update_time: new Date().toISOString(),
              },
              updatedAt: new Date().toISOString(),
            }
          : tx
      )
    );
  };

  const handleView = (tx) => {
    setSelectedTransaction(tx);
    setViewModal(true);
  };

  const handleDeleteClick = (tx) => {
    setSelectedTransaction(tx);
    setDeleteModal(true);
  };

  const handleDelete = () => {
    if (!selectedTransaction) return;
    setTransactions((prev) => prev.filter((tx) => tx.transactionId !== selectedTransaction.transactionId));
    setDeleteModal(false);
    setSelectedTransaction(null);
  };

  const closeModals = () => {
    setViewModal(false);
    setDeleteModal(false);
    setSelectedTransaction(null);
  };

  const goToPage = (page) => {
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
          <h3 className="text-xl font-semibold">Transactions Management</h3>

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
                placeholder="Search TXN / Order / User..."
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
              {PAYMENT_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {formatLabel(status)}
                </option>
              ))}
            </select>

            <select
              value={methodFilter}
              onChange={(e) => {
                setMethodFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
            >
              <option value="all">All Methods</option>
              {PAYMENT_METHODS.map((method) => (
                <option key={method} value={method}>
                  {formatLabel(method)}
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
          <table className="w-full min-w-230">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="text-left px-2 py-3 font-semibold text-gray-700">Transaction</th>
                <th className="text-left px-2 py-3 font-semibold text-gray-700">Order</th>
                <th className="text-left px-2 py-3 font-semibold text-gray-700">Customer</th>
                <th className="text-left px-2 py-3 font-semibold text-gray-700">Method</th>
                <th className="text-left px-2 py-3 font-semibold text-gray-700">Amount</th>
                <th className="text-left px-2 py-3 font-semibold text-gray-700">Status</th>
                <th className="text-left px-2 py-3 font-semibold text-gray-700">Created</th>
                <th className="text-center px-2 py-3 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-500">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                pageData.map((tx) => (
                  <tr key={tx.transactionId} className="border-b border-gray-200">
                    <td className="px-2 py-3">
                      <p className="font-semibold text-gray-800">{tx.transactionId}</p>
                      <p className="text-xs font-mono text-gray-500">{tx.paymentResult?.id}</p>
                    </td>
                    <td className="px-2 py-3 text-gray-700">{tx.orderId}</td>
                    <td className="px-2 py-3">
                      <p className="text-gray-700 font-medium">{tx.userName}</p>
                      <p className="text-xs text-gray-500">{tx.userEmail}</p>
                    </td>
                    <td className="px-2 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${methodClass(tx.paymentMethod)}`}>
                        {formatLabel(tx.paymentMethod)}
                      </span>
                    </td>
                    <td className="px-2 py-3 font-semibold text-gray-800">${tx.amount.toFixed(2)}</td>
                    <td className="px-2 py-3">
                      <select
                        value={tx.paymentStatus}
                        onChange={(e) => handleStatusChange(tx.transactionId, e.target.value)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border outline-none ${statusClass(tx.paymentStatus)}`}
                      >
                        {PAYMENT_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {formatLabel(status)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-2 py-3 text-sm text-gray-600">{formatDate(tx.createdAt)}</td>
                    <td className="px-2 py-3">
                      <div className="flex justify-center gap-2">
                        <button
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View"
                          onClick={() => handleView(tx)}
                        >
                          <FaEye size={15} />
                        </button>
                        <button
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                          onClick={() => handleDeleteClick(tx)}
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
            {" "}to <span className="font-semibold text-gray-900">{Math.min(currentPage * rowsPerPage, filteredTransactions.length)}</span>
            {" "}of <span className="font-semibold text-gray-900">{filteredTransactions.length}</span> transactions
          </p>

          <div className="flex items-center gap-1">
            <button
              onClick={() => goToPage(currentPage - 1)}
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
                  onClick={() => goToPage(page)}
                  className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-semibold ${
                    currentPage === page ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next <MdOutlineKeyboardArrowRight className="inline" size={18} />
            </button>
          </div>
        </div>
      </div>

      {viewModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-5 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-2xl font-bold text-gray-800">Transaction Details</h2>
              <button onClick={closeModals} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <FaTimes size={20} className="text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500">Transaction ID</p>
                  <p className="font-semibold text-gray-800">{selectedTransaction.transactionId}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500">Order ID</p>
                  <p className="font-semibold text-gray-800">{selectedTransaction.orderId}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500">Gateway Ref</p>
                  <p className="font-semibold text-gray-800">{selectedTransaction.paymentResult?.id}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500">Payment Method</p>
                  <p className="font-semibold text-gray-800 uppercase">{selectedTransaction.paymentMethod}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <h4 className="font-semibold text-gray-700 mb-3">Customer Info</h4>
                  <p className="text-sm text-gray-700">{selectedTransaction.userName}</p>
                  <p className="text-sm text-gray-600">{selectedTransaction.userEmail}</p>
                  <p className="text-xs text-gray-500 mt-3 font-mono">DB ID: {selectedTransaction._id}</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <h4 className="font-semibold text-gray-700 mb-3">Status & Timeline</h4>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p>
                      <span className="font-semibold">Status:</span>{" "}
                      <span className={`px-2 py-0.5 rounded-full text-xs ${statusClass(selectedTransaction.paymentStatus)}`}>
                        {formatLabel(selectedTransaction.paymentStatus)}
                      </span>
                    </p>
                    <p><span className="font-semibold">Created:</span> {formatDate(selectedTransaction.createdAt)}</p>
                    <p><span className="font-semibold">Updated:</span> {formatDate(selectedTransaction.updatedAt)}</p>
                    <p><span className="font-semibold">Paid At:</span> {formatDate(selectedTransaction.paidAt)}</p>
                    <p><span className="font-semibold">Gateway Update:</span> {formatDate(selectedTransaction.paymentResult?.update_time)}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500">Amount</p>
                  <p className="font-semibold text-gray-800">${selectedTransaction.amount.toFixed(2)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500">Tax</p>
                  <p className="font-semibold text-gray-800">${selectedTransaction.tax.toFixed(2)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500">Shipping</p>
                  <p className="font-semibold text-gray-800">${selectedTransaction.shippingFee.toFixed(2)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500">Gateway Fee</p>
                  <p className="font-semibold text-gray-800">${selectedTransaction.gatewayFee.toFixed(2)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500">Net Amount</p>
                  <p className="font-semibold text-gray-800">${selectedTransaction.netAmount.toFixed(2)}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <h4 className="font-semibold text-gray-700 mb-2">Note</h4>
                <p className="text-sm text-gray-600">{selectedTransaction.note}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Delete Transaction</h3>
            <p className="text-gray-600 mb-5">
              Are you sure you want to delete <span className="font-semibold">{selectedTransaction.transactionId}</span>? This action cannot be undone.
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

export default Transactions;
