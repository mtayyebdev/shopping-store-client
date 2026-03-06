import React, { useEffect, useState } from "react";
import {
  FaBoxOpen,
  FaCheckCircle,
  FaClock,
  FaEye,
  FaFilter,
  FaSearch,
  FaTimes,
  FaTrash,
  FaTruck,
} from "react-icons/fa";
import { Pagination } from '../../../components/index'
import { useDispatch, useSelector } from "react-redux";
import { deleteOrder, getOrder, getOrders, updateOrderStatus, updateOrderActionStatus } from '../../../store/adminSlices/OrdersSlice';
import { toast } from "react-toastify";

const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "out_for_delivery",
  "delivered",
  "cancelled",
  "returned",
  "refunded",
];

const statusLabel = (status) =>
  status
    ?.split("_")
    ?.map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    ?.join(" ");

const statusBadgeClass = (status) => {
  if (status === "delivered") return "bg-emerald-100 text-emerald-700";
  if (status === "cancelled" || status === "returned" || status === "refunded") return "bg-red-100 text-red-700";
  if (status === "shipped" || status === "out_for_delivery") return "bg-blue-100 text-blue-700";
  if (status === "processing" || status === "confirmed") return "bg-amber-100 text-amber-700";
  return "bg-gray-100 text-gray-700";
};

const paymentBadgeClass = (status) => {
  if (status === "paid") return "bg-emerald-100 text-emerald-700";
  if (status === "failed") return "bg-red-100 text-red-700";
  if (status === "refunded") return "bg-amber-100 text-amber-700";
  return "bg-gray-100 text-gray-700";
};

function Orders() {
  const dispatch = useDispatch();
  const { orders, totalOrders, totalOrdersPagination, totalPages, inprogress, delivered, paidRevenue, loading } = useSelector((state) => state.ordersAdminSlice);
  const { currency } = useSelector((state) => state.userSlice)
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [paymentStatusFilter, setpaymentStatusFilter] = useState("all");
  const [actionStatusFilter, setactionStatusFilter] = useState("all");
  const [page, setpage] = useState(1);
  const [limit, setlimit] = useState(10);
  const [viewModal, setViewModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [eventChanged, seteventChanged] = useState(false);
  const [filtersOpen, setfiltersOpen] = useState(false)

  const stats = [
    {
      id: 1,
      title: "Total Orders",
      value: totalOrders,
      icon: FaBoxOpen,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      valueColor: "text-blue-600",
    },
    {
      id: 2,
      title: "In Progress",
      value: inprogress,
      icon: FaClock,
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600",
      valueColor: "text-amber-600",
    },
    {
      id: 3,
      title: "Delivered",
      value: delivered,
      icon: FaTruck,
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
      valueColor: "text-emerald-600",
    },
    {
      id: 4,
      title: "Paid Revenue",
      value: `${currency.symbol}${paidRevenue}`,
      icon: FaCheckCircle,
      bgColor: "bg-violet-50",
      iconColor: "text-violet-600",
      valueColor: "text-violet-600",
    },
  ];

  const handleStatusChange = async (orderId, status) => {
    await dispatch(updateOrderStatus({ orderId, orderStatus: status }))
      .then((res) => {
        if (res.type === "updateorderstatus/fulfilled") {
          seteventChanged((prev) => !prev);
          toast.success(res.payload?.message || "Order status updated successfully");
        } else {
          toast.error(res.payload?.message || "Failed to update order status");
        }
      })
      .catch((err) => {
        toast.error(err.message || "Failed to update order status");
      })
  };

  const handleActionStatusChange = async (orderId, actionStatus) => {
    await dispatch(updateOrderActionStatus({ orderId, actionStatus }))
      .then((res) => {
        if (res.type === "updateorderactionstatus/fulfilled") {
          seteventChanged((prev) => !prev);
          toast.success(res.payload?.message || "Order action status updated successfully");
        } else {
          toast.error(res.payload?.message || "Failed to update order action status");
        }
      })
      .catch((err) => {
        toast.error(err.message || "Failed to update order action status");
      })
  };

  const handleViewOrder = async (orderId) => {
    await dispatch(getOrder(orderId))
      .then((res) => {
        if (res.type === "getorder/fulfilled") {
          setSelectedOrder(res.payload?.data);
          setViewModal(true);
        } else {
          toast.error(res.payload?.message || "Failed to fetch order details");
        }
      })
      .catch((err) => {
        toast.error(err.message || "Failed to fetch order details");
      })
  };

  const handleDeleteClick = (order) => {
    setSelectedOrder(order);
    setDeleteModal(true);
  };

  const handleDeleteOrder = async () => {
    if (!selectedOrder) return;

    await dispatch(deleteOrder(selectedOrder._id))
      .then((res) => {
        if (res.type === "deleteorder/fulfilled") {
          seteventChanged((prev) => !prev);
          toast.success(res.payload?.message || "Order deleted successfully");
          setDeleteModal(false);
          setSelectedOrder(null);
        } else {
          toast.error(res.payload?.message || "Failed to delete order");
        }
      })
      .catch((err) => {
        toast.error(err.message || "Failed to delete order");
      })
  };

  const handleCloseModals = () => {
    setViewModal(false);
    setDeleteModal(false);
    setSelectedOrder(null);
  };

  const clearAllFilters = () => {
    setactionStatusFilter("all");
    setpaymentStatusFilter("all");
    setTimeFilter("all");
    setStatusFilter("all")
  }

  const formatDate = (date) => (date ? new Date(date).toLocaleString() : "-");

  useEffect(() => {
    dispatch(getOrders({ page, limit, search, status: statusFilter, time: timeFilter, paymentStatus: paymentStatusFilter, actionStatus: actionStatusFilter }));
  }, [page, limit, search, statusFilter, timeFilter, eventChanged, actionStatusFilter, paymentStatusFilter, dispatch]);

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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h3 className="text-xl font-semibold">Orders Management</h3>

          <div className="flex items-center flex-row justify-between gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-72">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setpage(1);
                }}
                placeholder="Search by Order ID..."
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="dropdown relative">
              <FaFilter size={20} className="text-blue-500 hover:text-blue-600 cursor-pointer" onClick={() => setfiltersOpen(!filtersOpen)} />
              {filtersOpen && <div className="popup flex flex-col p-3 gap-3 z-10 absolute -right-2 top-11 bg-white shadow-md rounded-lg">
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setpage(1);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                >
                  <option value="all">All Orders Status</option>
                  {ORDER_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {statusLabel(status)}
                    </option>
                  ))}
                </select>

                <select
                  value={paymentStatusFilter}
                  onChange={(e) => {
                    setpaymentStatusFilter(e.target.value);
                    setpage(1);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                >
                  <option value="all">All Payments Status</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                  <option value="paid">Paid</option>
                  <option value="refunded">Refunded</option>
                </select>

                <select
                  value={timeFilter}
                  onChange={(e) => {
                    setTimeFilter(e.target.value);
                    setpage(1);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                >
                  <option value="all">All Time</option>
                  <option value="24hours">Last 24 Hours</option>
                  <option value="7days">Last 7 Days</option>
                  <option value="30days">Last 30 Days</option>
                  <option value="year">Last 12 Months</option>
                </select>

                <select
                  value={actionStatusFilter}
                  onChange={(e) => {
                    setactionStatusFilter(e.target.value);
                    setpage(1);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                >
                  <option value="all">All Actions Status</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="deleted">Deleted</option>
                </select>

                <button onClick={clearAllFilters} className="cursor-pointer text-sm text-btn2"> Clear All Filters</button>
              </div>}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto block overflow-hidden">
          <table className="w-full min-w-220">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="text-left px-2 py-3 font-semibold text-gray-700">Order ID</th>
                <th className="text-left px-2 py-3 font-semibold text-gray-700">Customer</th>
                <th className="text-left px-2 py-3 font-semibold text-gray-700">Items</th>
                <th className="text-left px-2 py-3 font-semibold text-gray-700">Payment</th>
                <th className="text-left px-2 py-3 font-semibold text-gray-700">Total</th>
                <th className="text-left px-2 py-3 font-semibold text-gray-700">Status</th>
                <th className="text-left px-2 py-3 font-semibold text-gray-700">Action Status</th>
                <th className="text-left px-2 py-3 font-semibold text-gray-700">Created</th>
                <th className="text-center px-2 py-3 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders?.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-500">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders?.map((order) => (
                  <tr key={order.orderId} className="border-b border-gray-200">
                    <td className="px-2 py-3">
                      <p className="font-semibold text-gray-800">{order.orderId}</p>
                    </td>
                    <td className="px-2 py-3">
                      <p className="font-medium text-gray-800">{order?.user?.name || order?.guestName}</p>
                      <p className="text-sm text-gray-500">{order?.user?.email || order?.guestEmail}</p>
                    </td>
                    <td className="px-2 py-3 text-gray-600">{order.items.length} item(s)</td>
                    <td className="px-2 py-3">
                      <p className="text-sm text-gray-700 uppercase">{order.paymentMethod}</p>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${paymentBadgeClass(order.paymentStatus)}`}>
                        {statusLabel(order.paymentStatus)}
                      </span>
                    </td>
                    <td className="px-2 py-3 font-semibold text-gray-800">{currency?.symbol}{order.totalPrice.toFixed(2)}</td>
                    <td className="px-2 py-3">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleStatusChange(order?._id, e.target.value)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border outline-none ${statusBadgeClass(order.orderStatus)}`}
                      >
                        {ORDER_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {statusLabel(status)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-2 py-3">
                      <select
                        value={order.actionStatus}
                        onChange={(e) => handleActionStatusChange(order?._id, e.target.value)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border outline-none `}
                      >
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                        <option value="deleted">Deleted</option>
                      </select>
                    </td>
                    <td className="px-2 py-3 text-sm text-gray-600">{formatDate(order.createdAt)}</td>
                    <td className="px-2 py-3">
                      <div className="flex justify-center gap-2">
                        <button
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View"
                          onClick={() => handleViewOrder(order?._id)}
                        >
                          <FaEye size={15} />
                        </button>
                        <button
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                          onClick={() => handleDeleteClick(order)}
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

        <Pagination NumberOfItems={totalOrdersPagination} limit={limit} page={page} setpage={setpage} title={"Orders"} totalPages={totalPages} />
      </div>

      {viewModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-5 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-2xl font-bold text-gray-800">Order Details</h2>
              <button onClick={handleCloseModals} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <FaTimes size={20} className="text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500">Order ID</p>
                  <p className="font-semibold text-gray-800">{selectedOrder?.orderId}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500">Order Status</p>
                  <p className="font-semibold text-gray-800">{statusLabel(selectedOrder?.orderStatus)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500">Payment Method</p>
                  <p className="font-semibold text-gray-800 uppercase">{selectedOrder?.paymentMethod}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500">Payment Status</p>
                  <p className="font-semibold text-gray-800">{statusLabel(selectedOrder?.paymentStatus)}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <h4 className="font-semibold text-gray-700 mb-3">Shipping Address</h4>
                  <p className="text-sm text-gray-700">{selectedOrder?.shippingAddress?.username}</p>
                  <p className="text-sm text-gray-600">{selectedOrder?.shippingAddress?.email || "-"}</p>
                  <p className="text-sm text-gray-600">{selectedOrder?.shippingAddress?.phone}</p>
                  <p className="text-sm text-gray-600 mt-2">{selectedOrder?.shippingAddress?.address}</p>
                  <p className="text-sm text-gray-600">
                    {selectedOrder?.shippingAddress?.city}, {selectedOrder?.shippingAddress?.region}
                  </p>
                  <p className="text-sm text-gray-600">{selectedOrder?.shippingAddress?.district}</p>
                  <p className="text-xs text-gray-500 mt-2">Ship To: {selectedOrder?.shippingAddress?.shipTo}</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <h4 className="font-semibold text-gray-700 mb-3">Order Timeline</h4>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p><span className="font-semibold">Created:</span> {formatDate(selectedOrder?.createdAt)}</p>
                    <p><span className="font-semibold">Updated:</span> {formatDate(selectedOrder?.updatedAt)}</p>
                    <p><span className="font-semibold">Paid At:</span> {formatDate(selectedOrder?.paidAt)}</p>
                    <p><span className="font-semibold">Delivered At:</span> {formatDate(selectedOrder?.deliveredAt)}</p>
                    <p><span className="font-semibold">Payment Ref:</span> {selectedOrder?.paymentResult?.id || "-"}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <h4 className="font-semibold text-gray-700 mb-3">Order Items</h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={`${item?.product}-${idx}`} className="flex items-center justify-between gap-4 bg-white border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <img src={item?.image} alt={item?.name} className="w-12 h-12 rounded object-cover" />
                        <div>
                          <p className="font-medium text-gray-800">{item?.name}</p>
                          <p className="text-xs text-gray-500">Color: {item?.color} | Size: {item?.size}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-800">{currency?.symbol}{item?.price.toFixed(2)}</p>
                        <p className="text-xs text-gray-500">Qty: {item?.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500">Items Price</p>
                  <p className="font-semibold text-gray-800">{currency?.symbol}{selectedOrder?.itemsPrice.toFixed(2)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500">Shipping Price</p>
                  <p className="font-semibold text-gray-800">{currency?.symbol}{selectedOrder?.shippingPrice.toFixed(2)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500">Tax</p>
                  <p className="font-semibold text-gray-800">{currency?.symbol}{selectedOrder?.taxPrice.toFixed(2)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500">Total</p>
                  <p className="font-semibold text-gray-800">{currency?.symbol}{selectedOrder?.totalPrice.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Delete Order</h3>
            <p className="text-gray-600 mb-5">
              Are you sure you want to delete <span className="font-semibold">{selectedOrder?.orderId}</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleCloseModals}
                className="flex-1 px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteOrder}
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

export default Orders;
