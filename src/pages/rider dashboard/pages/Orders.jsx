import React, { useEffect, useState } from "react";
import {
  FaBoxOpen,
  FaCheckCircle,
  FaClock,
  FaEye,
  FaFilter,
  FaSearch,
  FaShippingFast,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Pagination } from "../../../components/index";
import {
  getAssignedOrders,
  updateassignedOrderStatus,
  getAssignedOrder,
} from "../../../store/publicSlices/DeliveryBoySlice";

const RIDER_ALLOWED_STATUSES = [
  "processing",
  "shipped",
  "out_for_delivery",
  "delivered",
  "returned",
  "refunded",
];

const STATUS_FLOW = {
  confirmed: ["processing"],
  processing: ["shipped"],
  shipped: ["out_for_delivery"],
  out_for_delivery: ["delivered"],
  delivered: ["returned"],
  returned: ["refunded"],
};

const statusLabel = (status) =>
  status
    ?.split("_")
    ?.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    ?.join(" ");

const statusBadgeClass = (status) => {
  if (status === "delivered") return "bg-emerald-100 text-emerald-700";
  if (status === "returned" || status === "refunded") return "bg-red-100 text-red-700";
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

const formatDateTime = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleString();
};

function Orders() {
  const dispatch = useDispatch();
  const { assignedOrders, totalPages, ordersLoading, totalAssigned, totalAssignedOrders, activeDelivery, delivered, codPending } = useSelector((state) => state.deliveryBoySlice);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(15);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusUpdatingId, setStatusUpdatingId] = useState("");
  const [eventChanged, seteventChanged] = useState(false);
  const [openOrder, setopenOrder] = useState(false);

  const stats = [
    {
      id: 1,
      title: "Assigned Orders",
      value: totalAssigned,
      icon: FaBoxOpen,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      valueColor: "text-blue-600",
    },
    {
      id: 2,
      title: "In Delivery",
      value: activeDelivery,
      icon: FaShippingFast,
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600",
      valueColor: "text-amber-600",
    },
    {
      id: 3,
      title: "Delivered",
      value: delivered,
      icon: FaCheckCircle,
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
      valueColor: "text-emerald-600",
    },
    {
      id: 4,
      title: "COD Pending",
      value: codPending,
      icon: FaClock,
      bgColor: "bg-violet-50",
      iconColor: "text-violet-600",
      valueColor: "text-violet-600",
    },
  ];

  const handleStatusChange = async (order, nextStatus) => {
    if (!order?.orderId || !nextStatus || order?.orderStatus === nextStatus) return;

    setStatusUpdatingId(order.orderId);

    const result = await dispatch(
      updateassignedOrderStatus({
        orderId: order.orderId,
        status: { status: nextStatus },
      }),
    );

    if (result.type === "updateassignedorderstatus/fulfilled") {
      toast.success(result.payload?.message || "Order status updated");
      dispatch(getAssignedOrders());
    } else {
      toast.error(result.payload?.message || "Unable to update status");
    }

    setStatusUpdatingId("");
  };

  const handleViewOrder = async (orderId) => {
    await dispatch(getAssignedOrder(orderId))
      .then((res) => {
        if (res.type === "getassignedorder/fulfilled") {
          setSelectedOrder(res.payload?.data);
          setopenOrder(true)
        } else {
          toast.error(res.payload?.message)
        }
      }).catch((err) => {
        toast.error("Something went wrong while getting data")
      })
  }

  const clearFilters = () => {
    setStatusFilter("all");
    setTimeFilter("all");
    setSearch("");
    setPage(1);
  };

  useEffect(() => {
    dispatch(getAssignedOrders({ page, limit, search, status: statusFilter, time: timeFilter }));
  }, [dispatch, search, page, limit, statusFilter, timeFilter, eventChanged]);

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
          <h3 className="text-xl font-semibold">Assigned Orders</h3>

          <div className="flex items-center flex-row justify-between gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-72">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by Order ID..."
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="dropdown relative">
              <button
                onClick={() => setFiltersOpen((prev) => !prev)}
                className="h-10 w-10 rounded-lg border border-blue-200 text-blue-600 flex items-center justify-center hover:bg-blue-50 cursor-pointer"
              >
                <FaFilter size={16} />
              </button>

              {filtersOpen && (
                <div className="popup flex flex-col p-3 gap-3 z-10 absolute -right-2 top-11 bg-white shadow-md rounded-lg border border-gray-200 min-w-56">
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setPage(1);
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                  >
                    <option value="all">All Status</option>
                    {RIDER_ALLOWED_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {statusLabel(status)}
                      </option>
                    ))}
                  </select>

                  <select
                    value={timeFilter}
                    onChange={(e) => {
                      setTimeFilter(e.target.value);
                      setPage(1);
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                  >
                    <option value="all">All Time</option>
                    <option value="24hours">Today</option>
                    <option value="7days">Last 7 Days</option>
                    <option value="30days">Last 30 Days</option>
                    <option value="year">Last 12 Months</option>
                  </select>

                  <button onClick={clearFilters} className="cursor-pointer text-sm text-btn2 text-left">
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto block overflow-hidden">
          <table className="w-full min-w-220">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="text-left px-2 py-3 font-semibold text-gray-700">Order ID</th>
                <th className="text-left px-2 py-3 font-semibold text-gray-700">Customer</th>
                <th className="text-left px-2 py-3 font-semibold text-gray-700">Address</th>
                <th className="text-left px-2 py-3 font-semibold text-gray-700">Items</th>
                <th className="text-left px-2 py-3 font-semibold text-gray-700">Payment</th>
                <th className="text-left px-2 py-3 font-semibold text-gray-700">Status</th>
                <th className="text-left px-2 py-3 font-semibold text-gray-700">Created</th>
                <th className="text-center px-2 py-3 font-semibold text-gray-700">Action</th>
              </tr>
            </thead>

            <tbody>
              {assignedOrders?.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-500">
                    No assigned orders found.
                  </td>
                </tr>
              ) : null}

              {assignedOrders?.map((order) => {
                const nextStatuses = STATUS_FLOW[order?.orderStatus] || [];
                const canUpdate = nextStatuses.length > 0;

                return (
                  <tr key={order?._id || order?.orderId} className="border-b border-gray-100 hover:bg-gray-50/70">
                    <td className="px-2 py-3 text-sm font-semibold text-gray-800">#{order?.orderId || "-"}</td>
                    <td className="px-2 py-3 text-sm text-gray-700">
                      <p className="font-medium">{order?.shippingAddress?.username || "-"}</p>
                      <p className="text-xs text-gray-500">{order?.shippingAddress?.phone || "-"}</p>
                    </td>
                    <td className="px-2 py-3 text-sm text-gray-600 max-w-70">
                      <p className="line-clamp-2">
                        {order?.shippingAddress?.address || "-"}, {order?.shippingAddress?.city || "-"}
                      </p>
                    </td>
                    <td className="px-2 py-3 text-sm text-gray-700">{order?.items?.length || 0}</td>
                    <td className="px-2 py-3 text-sm text-gray-700">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${paymentBadgeClass(order?.paymentStatus)}`}
                      >
                        {statusLabel(order?.paymentStatus || "pending")}
                      </span>
                    </td>
                    <td className="px-2 py-3 text-sm text-gray-700">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadgeClass(order?.orderStatus)}`}>
                        {statusLabel(order?.orderStatus)}
                      </span>
                    </td>
                    <td className="px-2 py-3 text-sm text-gray-600">{formatDateTime(order?.createdAt)}</td>
                    <td className="px-2 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <select
                          disabled={!canUpdate || statusUpdatingId === order?.orderId}
                          value=""
                          onChange={(e) => handleStatusChange(order, e.target.value)}
                          className="px-2 py-1.5 text-xs border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white disabled:bg-gray-100 disabled:text-gray-400"
                        >
                          <option value="" disabled>
                            {canUpdate ? "Update Status" : "Completed"}
                          </option>
                          {nextStatuses.map((status) => (
                            <option key={status} value={status}>
                              {statusLabel(status)}
                            </option>
                          ))}
                        </select>

                        <button
                          onClick={() => handleViewOrder(order._id)}
                          className="h-8 w-8 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 flex items-center justify-center"
                          title="View Order"
                        >
                          <FaEye size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {ordersLoading ? (
          <div className="py-8 text-center text-gray-500">Loading assigned orders...</div>
        ) : (
          <div className="mt-6">
            <Pagination totalPages={totalPages} NumberOfItems={totalAssignedOrders} limit={limit} title={"Orders"} page={page} setpage={setPage} />
          </div>
        )}
      </div>

      {selectedOrder && openOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-[1px]">
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <h3 className="text-lg font-semibold">Order #{selectedOrder?.orderId}</h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="h-9 w-9 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
              >
                x
              </button>
            </div>

            <div className="p-5 max-h-[75vh] overflow-y-auto space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Customer</p>
                  <p className="font-semibold text-gray-800">{selectedOrder?.shippingAddress?.username || "-"}</p>
                  <p className="text-sm text-gray-600">{selectedOrder?.shippingAddress?.phone || "-"}</p>
                  <p className="text-sm text-gray-600">{selectedOrder?.shippingAddress?.email || "-"}</p>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Shipping Address</p>
                  <p className="text-sm text-gray-700 leading-6">
                    {selectedOrder?.shippingAddress?.address || "-"}
                    {selectedOrder?.shippingAddress?.city ? `, ${selectedOrder.shippingAddress.city}` : ""}
                    {selectedOrder?.shippingAddress?.region ? `, ${selectedOrder.shippingAddress.region}` : ""}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">Created: {formatDateTime(selectedOrder?.createdAt)}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-100">
                  <p className="text-xs text-blue-600">Order Status</p>
                  <p className="font-semibold text-blue-700">{statusLabel(selectedOrder?.orderStatus)}</p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                  <p className="text-xs text-emerald-600">Payment Status</p>
                  <p className="font-semibold text-emerald-700">{statusLabel(selectedOrder?.paymentStatus)}</p>
                </div>
                <div className="p-3 rounded-xl bg-violet-50 border border-violet-100">
                  <p className="text-xs text-violet-600">Method</p>
                  <p className="font-semibold text-violet-700">{(selectedOrder?.paymentMethod || "-").toUpperCase()}</p>
                </div>
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-100">
                  <p className="text-xs text-amber-600">Total</p>
                  <p className="font-semibold text-amber-700">Rs. {selectedOrder?.totalPrice || 0}</p>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 font-semibold text-gray-800">Order Items</div>
                <div className="divide-y divide-gray-100">
                  {(selectedOrder?.items || []).map((item, index) => (
                    <div key={`${item?.name || "item"}-${index}`} className="px-4 py-3 flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 truncate">{item?.name || "Product"}</p>
                        <p className="text-xs text-gray-500">
                          Qty: {item?.quantity || 1}
                          {item?.size ? ` | Size: ${item.size}` : ""}
                          {item?.color ? ` | Color: ${item.color}` : ""}
                        </p>
                      </div>
                      <p className="font-semibold text-gray-700">Rs. {item?.price || 0}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Orders;
