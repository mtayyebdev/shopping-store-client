import React, { useMemo, useState } from "react";
import {
  FaBoxOpen,
  FaCheckCircle,
  FaClock,
  FaEye,
  FaMapMarkedAlt,
  FaSearch,
  FaShippingFast,
  FaTimes,
  FaTrash,
  FaTruck,
} from "react-icons/fa";
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md";

const SHIPMENT_STATUSES = [
  "pending_pickup",
  "picked_up",
  "in_transit",
  "out_for_delivery",
  "delivered",
  "failed_attempt",
  "returned",
  "cancelled",
];

const CARRIERS = ["TCS", "Leopards", "BlueEx", "M&P", "DHL"];

const statusLabel = (status) =>
  status
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const statusBadgeClass = (status) => {
  if (status === "delivered") return "bg-emerald-100 text-emerald-700";
  if (status === "cancelled" || status === "returned" || status === "failed_attempt") return "bg-red-100 text-red-700";
  if (status === "out_for_delivery" || status === "in_transit") return "bg-blue-100 text-blue-700";
  if (status === "picked_up") return "bg-violet-100 text-violet-700";
  return "bg-amber-100 text-amber-700";
};

const dayOffset = (days) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
};

const createMockShipments = () => {
  const customers = [
    "Ali Raza",
    "Sara Khan",
    "Ahmed Ali",
    "Fatima Noor",
    "Hassan Shah",
    "Ayesha Malik",
    "Usman Tariq",
    "Zara Ahmed",
  ];

  const cities = ["Lahore", "Karachi", "Islamabad", "Rawalpindi", "Faisalabad", "Multan"];

  return Array.from({ length: 34 }, (_, i) => {
    const status = SHIPMENT_STATUSES[i % SHIPMENT_STATUSES.length];
    const shippedAt = dayOffset(i + 1);
    const estDelivery = dayOffset(Math.max(i - 2, 0));
    const deliveredAt = status === "delivered" ? dayOffset(Math.max(i - 3, 0)) : null;
    const carrier = CARRIERS[i % CARRIERS.length];

    return {
      _id: `66b3aa9cb2a1e30018d9${2000 + i}`,
      shipmentId: `SHP-${String(30001 + i)}`,
      orderId: `ORD-${String(10001 + i)}`,
      trackingNumber: `${carrier}-${String(778800 + i)}`,
      carrier,
      shipmentStatus: status,
      customerName: customers[i % customers.length],
      customerPhone: `03${(i % 9) + 1}1234567${i % 10}`,
      destination: {
        city: cities[i % cities.length],
        region: ["Punjab", "Sindh", "ICT", "KPK"][i % 4],
        address: `${15 + i} Commercial Street, Block ${(i % 6) + 1}`,
      },
      itemsCount: (i % 4) + 1,
      packageWeightKg: Number((0.4 + (i % 6) * 0.35).toFixed(2)),
      shippingCost: Number((6 + (i % 5) * 2.5).toFixed(2)),
      paymentType: i % 2 === 0 ? "Prepaid" : "Cash on Delivery",
      shippedAt: shippedAt.toISOString(),
      estimatedDeliveryAt: estDelivery.toISOString(),
      deliveredAt: deliveredAt ? deliveredAt.toISOString() : null,
      updatedAt: dayOffset(Math.max(i - 1, 0)).toISOString(),
      shipmentEvents: [
        {
          label: "Shipment Created",
          status: "completed",
          time: dayOffset(i + 2).toISOString(),
        },
        {
          label: "Picked by Courier",
          status: ["picked_up", "in_transit", "out_for_delivery", "delivered"].includes(status)
            ? "completed"
            : "pending",
          time: dayOffset(i + 1).toISOString(),
        },
        {
          label: "In Transit",
          status: ["in_transit", "out_for_delivery", "delivered"].includes(status)
            ? "completed"
            : status === "failed_attempt" || status === "returned" || status === "cancelled"
              ? "failed"
              : "pending",
          time: dayOffset(i).toISOString(),
        },
        {
          label: "Delivered",
          status: status === "delivered" ? "completed" : "pending",
          time: deliveredAt ? deliveredAt.toISOString() : null,
        },
      ],
    };
  });
};

function Shipments() {
  const [shipments, setShipments] = useState(createMockShipments);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [carrierFilter, setCarrierFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewModal, setViewModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);

  const rowsPerPage = 8;

  const filteredShipments = useMemo(() => {
    const q = search.trim().toLowerCase();
    let data = [...shipments];

    if (q) {
      data = data.filter((s) => {
        const text = [
          s.shipmentId,
          s.orderId,
          s.trackingNumber,
          s.customerName,
          s.customerPhone,
          s.destination.city,
          s.carrier,
        ]
          .join(" ")
          .toLowerCase();
        return text.includes(q);
      });
    }

    if (statusFilter !== "all") {
      data = data.filter((s) => s.shipmentStatus === statusFilter);
    }

    if (carrierFilter !== "all") {
      data = data.filter((s) => s.carrier === carrierFilter);
    }

    if (timeFilter !== "all") {
      const now = new Date();
      data = data.filter((s) => {
        const d = new Date(s.shippedAt);
        const diffDays = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
        if (timeFilter === "day") return diffDays <= 1;
        if (timeFilter === "week") return diffDays <= 7;
        if (timeFilter === "month") return diffDays <= 30;
        if (timeFilter === "year") return diffDays <= 365;
        return true;
      });
    }

    return data.sort((a, b) => new Date(b.shippedAt) - new Date(a.shippedAt));
  }, [shipments, search, statusFilter, carrierFilter, timeFilter]);

  const totalPages = Math.ceil(filteredShipments.length / rowsPerPage);
  const pageData = filteredShipments.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const totalShipments = shipments.length;
  const inTransitCount = shipments.filter((s) => ["in_transit", "out_for_delivery"].includes(s.shipmentStatus)).length;
  const deliveredCount = shipments.filter((s) => s.shipmentStatus === "delivered").length;
  const returnedCount = shipments.filter((s) => ["returned", "cancelled", "failed_attempt"].includes(s.shipmentStatus)).length;

  const stats = [
    {
      id: 1,
      title: "Total Shipments",
      value: totalShipments,
      icon: FaBoxOpen,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      valueColor: "text-blue-600",
    },
    {
      id: 2,
      title: "In Transit",
      value: inTransitCount,
      icon: FaTruck,
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600",
      valueColor: "text-amber-600",
    },
    {
      id: 3,
      title: "Delivered",
      value: deliveredCount,
      icon: FaCheckCircle,
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
      valueColor: "text-emerald-600",
    },
    {
      id: 4,
      title: "Issues/Returns",
      value: returnedCount,
      icon: FaClock,
      bgColor: "bg-rose-50",
      iconColor: "text-rose-600",
      valueColor: "text-rose-600",
    },
  ];

  const formatDate = (value) => (value ? new Date(value).toLocaleString() : "-");

  const handleStatusChange = (shipmentId, newStatus) => {
    setShipments((prev) =>
      prev.map((item) =>
        item.shipmentId === shipmentId ? { ...item, shipmentStatus: newStatus, updatedAt: new Date().toISOString() } : item
      )
    );
  };

  const handleView = (shipment) => {
    setSelectedShipment(shipment);
    setViewModal(true);
  };

  const handleDeleteClick = (shipment) => {
    setSelectedShipment(shipment);
    setDeleteModal(true);
  };

  const handleDelete = () => {
    if (!selectedShipment) return;
    setShipments((prev) => prev.filter((item) => item.shipmentId !== selectedShipment.shipmentId));
    setDeleteModal(false);
    setSelectedShipment(null);
  };

  const closeModals = () => {
    setViewModal(false);
    setDeleteModal(false);
    setSelectedShipment(null);
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
          <h3 className="text-xl font-semibold">Shipments Management</h3>

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
                placeholder="Search shipment/order ID..."
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
              {SHIPMENT_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {statusLabel(status)}
                </option>
              ))}
            </select>

            <select
              value={carrierFilter}
              onChange={(e) => {
                setCarrierFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
            >
              <option value="all">All Carriers</option>
              {CARRIERS.map((carrier) => (
                <option key={carrier} value={carrier}>
                  {carrier}
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
                <th className="text-left px-2 py-3 font-semibold text-gray-700">Shipment</th>
                <th className="text-left px-2 py-3 font-semibold text-gray-700">Order</th>
                <th className="text-left px-2 py-3 font-semibold text-gray-700">Customer</th>
                <th className="text-left px-2 py-3 font-semibold text-gray-700">Carrier</th>
                <th className="text-left px-2 py-3 font-semibold text-gray-700">Destination</th>
                <th className="text-left px-2 py-3 font-semibold text-gray-700">Weight</th>
                <th className="text-left px-2 py-3 font-semibold text-gray-700">Status</th>
                <th className="text-left px-2 py-3 font-semibold text-gray-700">Shipped</th>
                <th className="text-center px-2 py-3 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageData.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-gray-500">
                    No shipments found.
                  </td>
                </tr>
              ) : (
                pageData.map((shipment) => (
                  <tr key={shipment.shipmentId} className="border-b border-gray-200">
                    <td className="px-2 py-3">
                      <p className="font-semibold text-gray-800">{shipment.shipmentId}</p>
                      <p className="text-xs font-mono text-gray-500">{shipment.trackingNumber}</p>
                    </td>
                    <td className="px-2 py-3">
                      <p className="text-gray-700">{shipment.orderId}</p>
                      <p className="text-xs text-gray-500">{shipment.itemsCount} items</p>
                    </td>
                    <td className="px-2 py-3">
                      <p className="text-gray-700 font-medium">{shipment.customerName}</p>
                      <p className="text-xs text-gray-500">{shipment.customerPhone}</p>
                    </td>
                    <td className="px-2 py-3">
                      <p className="text-gray-700">{shipment.carrier}</p>
                      <p className="text-xs text-gray-500">{shipment.paymentType}</p>
                    </td>
                    <td className="px-2 py-3 text-gray-600">
                      {shipment.destination.city}, {shipment.destination.region}
                    </td>
                    <td className="px-2 py-3 text-gray-700">{shipment.packageWeightKg} kg</td>
                    <td className="px-2 py-3">
                      <select
                        value={shipment.shipmentStatus}
                        onChange={(e) => handleStatusChange(shipment.shipmentId, e.target.value)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border outline-none ${statusBadgeClass(shipment.shipmentStatus)}`}
                      >
                        {SHIPMENT_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {statusLabel(status)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-2 py-3 text-sm text-gray-600">{formatDate(shipment.shippedAt)}</td>
                    <td className="px-2 py-3">
                      <div className="flex justify-center gap-2">
                        <button
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View"
                          onClick={() => handleView(shipment)}
                        >
                          <FaEye size={15} />
                        </button>
                        <button
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                          onClick={() => handleDeleteClick(shipment)}
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
            {" "}to <span className="font-semibold text-gray-900">{Math.min(currentPage * rowsPerPage, filteredShipments.length)}</span>
            {" "}of <span className="font-semibold text-gray-900">{filteredShipments.length}</span> shipments
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

      {viewModal && selectedShipment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-5 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-2xl font-bold text-gray-800">Shipment Details</h2>
              <button onClick={closeModals} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <FaTimes size={20} className="text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500">Shipment ID</p>
                  <p className="font-semibold text-gray-800">{selectedShipment.shipmentId}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500">Order ID</p>
                  <p className="font-semibold text-gray-800">{selectedShipment.orderId}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500">Tracking Number</p>
                  <p className="font-semibold text-gray-800">{selectedShipment.trackingNumber}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500">Carrier</p>
                  <p className="font-semibold text-gray-800">{selectedShipment.carrier}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <h4 className="font-semibold text-gray-700 mb-3">Receiver Information</h4>
                  <p className="text-sm text-gray-700">{selectedShipment.customerName}</p>
                  <p className="text-sm text-gray-600">{selectedShipment.customerPhone}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <FaMapMarkedAlt className="text-blue-600" />
                    <p className="text-sm text-gray-700">
                      {selectedShipment.destination.address}, {selectedShipment.destination.city}, {selectedShipment.destination.region}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <h4 className="font-semibold text-gray-700 mb-3">Package & Billing</h4>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p><span className="font-semibold">Items Count:</span> {selectedShipment.itemsCount}</p>
                    <p><span className="font-semibold">Weight:</span> {selectedShipment.packageWeightKg} kg</p>
                    <p><span className="font-semibold">Shipping Cost:</span> ${selectedShipment.shippingCost.toFixed(2)}</p>
                    <p><span className="font-semibold">Payment Type:</span> {selectedShipment.paymentType}</p>
                    <p>
                      <span className="font-semibold">Current Status:</span>{" "}
                      <span className={`px-2 py-0.5 rounded-full text-xs ${statusBadgeClass(selectedShipment.shipmentStatus)}`}>
                        {statusLabel(selectedShipment.shipmentStatus)}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <h4 className="font-semibold text-gray-700 mb-3">Shipment Timeline</h4>
                <div className="space-y-3">
                  {selectedShipment.shipmentEvents.map((event, index) => (
                    <div key={`${event.label}-${index}`} className="flex items-start gap-3">
                      <div
                        className={`w-3 h-3 rounded-full mt-1.5 ${
                          event.status === "completed"
                            ? "bg-emerald-500"
                            : event.status === "failed"
                              ? "bg-red-500"
                              : "bg-gray-300"
                        }`}
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-800">{event.label}</p>
                        <p className="text-xs text-gray-500">{formatDate(event.time)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500">Shipped At</p>
                  <p className="font-medium text-gray-800 text-sm">{formatDate(selectedShipment.shippedAt)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500">Est. Delivery</p>
                  <p className="font-medium text-gray-800 text-sm">{formatDate(selectedShipment.estimatedDeliveryAt)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500">Delivered At</p>
                  <p className="font-medium text-gray-800 text-sm">{formatDate(selectedShipment.deliveredAt)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500">Last Updated</p>
                  <p className="font-medium text-gray-800 text-sm">{formatDate(selectedShipment.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteModal && selectedShipment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Delete Shipment</h3>
            <p className="text-gray-600 mb-5">
              Are you sure you want to delete <span className="font-semibold">{selectedShipment.shipmentId}</span>? This action cannot be undone.
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

export default Shipments;
