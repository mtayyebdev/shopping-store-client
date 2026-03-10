import React, { useEffect, useState } from "react";
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
  FaFilter
} from "react-icons/fa";
import { Pagination } from '../../../components/index'
import { formatAmount } from '../../../custom methods/index'
import { deleteReturn, getReturn, getReturns, updateReturnActionStatus, updateReturnStatus } from '../../../store/adminSlices/ReturnsSlice'
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

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

const labelize = (value) =>
  value
    ?.split("_")
    ?.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    ?.join(" ");

const statusClass = (status) => {
  if (["completed", "refunded", "replaced"].includes(status)) return "bg-emerald-100 text-emerald-700";
  if (["rejected"].includes(status)) return "bg-red-100 text-red-700";
  if (["requested", "approved", "picked", "received"].includes(status)) return "bg-amber-100 text-amber-700";
  return "bg-gray-100 text-gray-700";
};

const formatDate = (date) => (date ? new Date(date).toLocaleString() : "-");

function Returns() {
  const dispatch = useDispatch()
  const {
    totalReturns,
    totalPages,
    totalReturnsSearched,
    returns: returnsData,
    pendingReturns,
    completedReturns,
    rejectedReturns
  } = useSelector((state) => state.returnsAdminSlice);
  const { currency } = useSelector((state) => state.userSlice);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [reasonFilter, setReasonFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [actionStatusFilter, setactionStatusFilter] = useState("all")
  const [page, setpage] = useState(1);
  const [limit, setlimit] = useState(15);
  const [viewModal, setViewModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [eventChanged, seteventChanged] = useState(false);
  const [filtersOpen, setfiltersOpen] = useState(false)

  const stats = [
    { id: 1, title: "Total Returns", value: totalReturns, icon: FaRedoAlt, bgColor: "bg-blue-50", iconColor: "text-blue-600", valueColor: "text-blue-600" },
    { id: 2, title: "In Review", value: pendingReturns, icon: FaBoxOpen, bgColor: "bg-amber-50", iconColor: "text-amber-600", valueColor: "text-amber-600" },
    { id: 3, title: "Resolved", value: completedReturns, icon: FaCheckCircle, bgColor: "bg-emerald-50", iconColor: "text-emerald-600", valueColor: "text-emerald-600" },
    { id: 4, title: "Rejected", value: rejectedReturns, icon: FaTimesCircle, bgColor: "bg-rose-50", iconColor: "text-rose-600", valueColor: "text-rose-600" },
  ];

  const closeModals = () => {
    setViewModal(false);
    setDeleteModal(false);
    setSelectedReturn(null);
  };

  const clearAllFilters = () => {
    setReasonFilter("all");
    setTimeFilter("all");
    setStatusFilter("all");
    setactionStatusFilter("all");
  }

  const handleStatusChange = async (id, status) => {
    await dispatch(updateReturnStatus({ returnId: id, returnStatus: status }))
      .then((res) => {
        if (res.type === "updatereturnstatus/fulfilled") {
          toast.success(res.payload?.message);
          seteventChanged((prev) => !prev);
        } else {
          toast.error(res.payload?.message);
        }
      }).catch((err) => {
        toast.error(err || "Something went wrong.")
      })
  };

  const handleActionStatusChange = async (id, actionStatus) => {
    await dispatch(updateReturnActionStatus({ returnId: id, actionStatus }))
      .then((res) => {
        if (res.type === "updatereturnactionstatus/fulfilled") {
          toast.success(res.payload?.message);
          seteventChanged((prev) => !prev);
        } else {
          toast.error(res.payload?.message);
        }
      }).catch((err) => {
        toast.error(err || "Something went wrong.")
      })
  };

  const openView = async (returnId) => {
    await dispatch(getReturn(returnId))
      .then((res) => {
        if (res.type === "getreturn/fulfilled") {
          setSelectedReturn(res.payload?.data);
          setViewModal(true);
        } else {
          toast.error(res.payload?.message);
        }
      }).catch((err) => {
        toast.error(err || "Something went wrong.")
      })
  };

  const openDelete = (item) => {
    setSelectedReturn(item);
    setDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!selectedReturn) return;

    await dispatch(deleteReturn(selectedReturn?._id))
      .then((res) => {
        if (res.type === "deletereturn/fulfilled") {
          toast.success(res.payload?.message);
          seteventChanged((prev) => !prev);
          closeModals();
        } else {
          toast.error(res.payload?.message);
        }
      }).catch((err) => {
        toast.error(err || "Something went wrong.")
      })
  };

  useEffect(() => {
    dispatch(getReturns({ page, limit, search, time: timeFilter, reason: reasonFilter, status: statusFilter, actionStatus: actionStatusFilter }));

  }, [page, limit, search, reasonFilter, statusFilter, timeFilter, actionStatusFilter, dispatch, eventChanged])

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl shadow-lg">
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
          <h3 className="text-xl font-semibold">Returns Management</h3>

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
                placeholder="Search order/product..."
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
                  <option value="all">All Status</option>
                  {RETURN_STATUSES.map((status, i) => (
                    <option key={i} value={status}>
                      {labelize(status)}
                    </option>
                  ))}
                </select>

                <select
                  value={reasonFilter}
                  onChange={(e) => {
                    setReasonFilter(e.target.value);
                    setpage(1);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                >
                  <option value="all">All Reasons</option>
                  {RETURN_REASONS.map((reason, i) => (
                    <option key={i} value={reason}>
                      {labelize(reason)}
                    </option>
                  ))}
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
          <table className="w-full min-w-240">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="text-left px-2 py-3 font-semibold text-gray-700 whitespace-nowrap">Return ID</th>
                <th className="text-left px-2 py-3 font-semibold text-gray-700">Order</th>
                <th className="text-left px-2 py-3 font-semibold text-gray-700">Customer</th>
                <th className="text-left px-2 py-3 font-semibold text-gray-700">Product</th>
                <th className="text-left px-2 py-3 font-semibold text-gray-700">Reason</th>
                <th className="text-left px-2 py-3 font-semibold text-gray-700">Refund</th>
                <th className="text-left px-2 py-3 font-semibold text-gray-700">Status</th>
                <th className="text-left px-2 py-3 font-semibold text-gray-700 whitespace-nowrap">Action Status</th>
                <th className="text-center px-2 py-3 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>

            <tbody>
              {returnsData?.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-500">
                    No returns found.
                  </td>
                </tr>
              ) : (
                returnsData?.map((item, i) => (
                  <tr key={i} className="border-b border-gray-200">
                    <td className="px-2 py-3">
                      <p className="font-semibold text-gray-800 text-nowrap">{item?.returnId}</p>
                    </td>
                    <td className="px-2 py-3">
                      <p className="text-gray-700 whitespace-nowrap">{item?.orders_info?.orderId}</p>
                      <p className="text-xs text-gray-500">Qty: {item?.quantity}</p>
                    </td>
                    <td className="px-2 py-3">
                      <p className="text-gray-700 font-medium whitespace-nowrap">{item?.users_info?.name}</p>
                    </td>
                    <td className="px-2 py-3 text-gray-700 whitespace-nowrap">{String(item?.productName).slice(0, 25)}</td>
                    <td className="px-2 py-3 text-sm text-gray-700 whitespace-nowrap">{labelize(item?.reason)}</td>
                    <td className="px-2 py-3">
                      <div className="text-sm text-gray-700">
                        <p className="font-semibold">{currency?.symbol}{formatAmount(item?.refundAmount)}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <FaWallet size={10} /> {labelize(item?.refundMethod)}
                        </p>
                      </div>
                    </td>
                    <td className="px-2 py-3">
                      <select
                        value={item?.status}
                        onChange={(e) => handleStatusChange(item?._id, e.target.value)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border outline-none ${statusClass(item?.status)}`}
                      >
                        {RETURN_STATUSES.map((status, i) => (
                          <option key={i} value={status}>
                            {labelize(status)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-2 py-3">
                      <select
                        value={item?.actionStatus}
                        onChange={(e) => handleActionStatusChange(item?._id, e.target.value)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border outline-none `}
                      >
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                        <option value="deleted">Deleted</option>
                      </select>
                    </td>
                    <td className="px-2 py-3">
                      <div className="flex justify-center gap-2">
                        <button
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View"
                          onClick={() => openView(item?._id)}
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

        <Pagination NumberOfItems={totalReturnsSearched} limit={limit} page={page} setpage={setpage} title="Returns" totalPages={totalPages} />
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500">Return ID</p>
                  <p className="font-semibold text-gray-800">{selectedReturn?.returnId}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500">Order ID</p>
                  <p className="font-semibold text-gray-800">{selectedReturn?.orderId?.orderId}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500">Status</p>
                  <p className="font-semibold text-gray-800">{labelize(selectedReturn?.status)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500">Reason</p>
                  <p className="font-semibold text-gray-800">{labelize(selectedReturn?.reason)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500">Refund</p>
                  <p className="font-semibold text-gray-800">{currency?.symbol}{formatAmount(selectedReturn?.refundAmount)}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <h4 className="font-semibold text-gray-700 mb-2">Product Information</h4>
                  <p className="text-sm text-gray-700">{selectedReturn?.productName}</p>
                  <p className="text-xs text-gray-500 mt-1">Product ID: {selectedReturn?.productId}</p>
                  <p className="text-xs text-gray-500">Order Item ID: {selectedReturn?.orderItemId}</p>
                  <p className="text-sm text-gray-700 mt-2">Quantity: {selectedReturn?.quantity}</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <h4 className="font-semibold text-gray-700 mb-2">Customer & Refund</h4>
                  <p className="text-sm text-gray-700">{selectedReturn?.userId?.name}</p>
                  <p className="text-xs text-gray-500 mt-1">User ID: {selectedReturn?.userId?._id}</p>
                  <p className="text-sm text-gray-700 mt-2">Refund Method: {labelize(selectedReturn?.refundMethod)}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <h4 className="font-semibold text-gray-700 mb-2">User Note</h4>
                <p className="text-sm text-gray-600">{selectedReturn?.description || "No description provided."}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <h4 className="font-semibold text-gray-700 mb-3">Return Images</h4>
                {selectedReturn?.images?.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {selectedReturn?.images?.map((img) => (
                      <img key={img?.publicId} src={img?.url} alt="Return evidence" className="w-full aspect-square rounded-lg object-cover border border-gray-200" />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No images attached.</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500">Created</p>
                  <p className="font-medium text-gray-800 text-sm">{formatDate(selectedReturn?.createdAt)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500">Updated</p>
                  <p className="font-medium text-gray-800 text-sm">{formatDate(selectedReturn?.updatedAt)}</p>
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
              Are you sure you want to delete return request for <span className="font-semibold">{selectedReturn?.productName}</span>?
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
