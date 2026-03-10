import React, { useEffect, useState } from "react";
import {
  FaBan,
  FaBicycle,
  FaCar,
  FaCheckCircle,
  FaEdit,
  FaEye,
  FaFilter,
  FaMotorcycle,
  FaPlus,
  FaSearch,
  FaTimes,
  FaTrash,
  FaUsers,
} from "react-icons/fa";
import { createRider, deleteRider, getRider, getRiders, updateRider, updateRiderActionStatus } from '../../../store/adminSlices/DeliveryBoySlice'
import { useDispatch, useSelector } from 'react-redux'
import { Pagination } from '../../../components/index'
import { toast } from "react-toastify";

const VEHICLE_TYPES = ["bike", "car", "cycle"];
const ACTION_STATUSES = ["active", "suspended", "deleted"];

const formatLabel = (value) => value.charAt(0).toUpperCase() + value.slice(1);
const formatDate = (date) => (date ? new Date(date).toLocaleString() : "-");

const statusClass = (status) => {
  if (status === "active") return "bg-emerald-100 text-emerald-700";
  if (status === "suspended") return "bg-amber-100 text-amber-700";
  return "bg-red-100 text-red-700";
};

const vehicleIcon = (vehicleType) => {
  if (vehicleType === "bike") return FaMotorcycle;
  if (vehicleType === "car") return FaCar;
  return FaBicycle;
};


function DeliveryBoys() {
  const { riders, totalPages, totalDeliveryBoys, totalRiders, activeRiders, busyRiders, suspendedRiders } = useSelector((state) => state.deliveryBoyAdminSlice);
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [vehicleFilter, setVehicleFilter] = useState("all");
  const [workloadFilter, setWorkloadFilter] = useState("all");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setpage] = useState(1);
  const [limit, setlimit] = useState(15);
  const [eventChanged, seteventChanged] = useState(false);

  const [createModal, setCreateModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedRider, setSelectedRider] = useState(null);

  const [createForm, setCreateForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    vehicleType: "bike",
    vehicleNumber: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    fullAddress: "",
  });

  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    vehicleType: "bike",
    vehicleNumber: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    fullAddress: "",
  });

  const stats = [
    {
      id: 1,
      title: "Total Riders",
      value: totalRiders,
      icon: FaUsers,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      id: 2,
      title: "Active Riders",
      value: activeRiders,
      icon: FaCheckCircle,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      id: 3,
      title: "Busy Riders",
      value: busyRiders,
      icon: FaMotorcycle,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      id: 4,
      title: "Suspended",
      value: suspendedRiders,
      icon: FaBan,
      color: "text-rose-600",
      bg: "bg-rose-50",
    },
  ];

  const handleStatusChange = async (id, status) => {
    await dispatch(updateRiderActionStatus({ riderId: id, actionStatus: status }))
      .then((res) => {
        if (res.type === "updaterideractionstatus/fulfilled") {
          toast.success(res.payload?.message);
          seteventChanged((prev) => !prev);
        } else {
          toast.error(res.payload?.message);
        }
      })
      .catch((err) => {
        console.log("Something went wrong while updating Rider status.");
      })
  };

  const openView = async (riderId) => {
    await dispatch(getRider(riderId))
      .then((res) => {
        if (res.type === "getrider/fulfilled") {
          setSelectedRider(res.payload?.data);
          setViewModal(true);
        } else {
          toast.error(res.payload?.message);
        }
      })
      .catch((err) => {
        console.log("Something went wrong while getting Rider data.");
      })
  };

  const openEdit = async (riderId) => {
    setSelectedRider(riderId);
    await dispatch(getRider(riderId))
      .then((res) => {
        if (res.type === "getrider/fulfilled") {
          const rider = res.payload?.data;
          setEditForm({
            name: rider?.name || "",
            phone: rider?.phone || "",
            email: rider?.email || "",
            password: "",
            vehicleType: rider?.vehicleType || "",
            vehicleNumber: rider?.vehicleNumber || "",
            city: rider?.address?.city || "",
            country: rider?.address?.country || "",
            state: rider?.address?.state || "",
            postalCode: rider?.address?.postalCode || "",
            fullAddress: rider?.address?.fullAddress || "",
          });
          setEditModal(true);
        } else {
          toast.error(res.payload?.message);
        }
      })
      .catch((err) => {
        console.log("Something went wrong while getting Rider data.");
      })
  };

  const openDelete = (rider) => {
    setSelectedRider(rider);
    setDeleteModal(true);
  };

  const closeModals = () => {
    setCreateModal(false);
    setViewModal(false);
    setEditModal(false);
    setDeleteModal(false);
    setSelectedRider(null);
  };

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setCreateForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateRider = async () => {
    if (!createForm.name.trim() || !createForm.phone.trim()) return;

    await dispatch(createRider(createForm))
      .then((res) => {
        if (res.type === "createrider/fulfilled") {
          toast.success(res.payload?.message);
          seteventChanged((prev) => !prev)
          setCreateModal(false);
          setCreateForm({
            name: "",
            phone: "",
            email: "",
            password: "",
            vehicleType: "bike",
            vehicleNumber: "",
            country: "",
            city: "",
            state: "",
            postalCode: "",
            fullAddress: "",
          });
        } else {
          toast.error(res.payload?.message);
        }
      })
      .catch((err) => {
        console.log("Something went wrong while creating new Rider.");
      })
  };

  const handleSaveEdit = async () => {
    if (!selectedRider) return;

    await dispatch(updateRider({ riderId: selectedRider, riderData: editForm }))
      .then((res) => {
        if (res.type === "updaterider/fulfilled") {
          toast.success(res.payload?.message);
          seteventChanged((prev) => !prev)
          setEditModal(false);
          setSelectedRider(null);
          setEditForm({
            name: "",
            phone: "",
            email: "",
            password: "",
            vehicleType: "",
            vehicleNumber: "",
            country: "",
            city: "",
            state: "",
            postalCode: "",
            fullAddress: "",
          });
        } else {
          toast.error(res.payload?.message);
        }
      })
      .catch((err) => {
        console.log("Something went wrong while updating Rider data.");
      })
  };

  const handleDelete = async () => {
    if (!selectedRider) return;
    await dispatch(deleteRider(selectedRider?._id))
      .then((res) => {
        if (res.type === "deleterider/fulfilled") {
          toast.success(res.payload?.message);
          seteventChanged((prev) => !prev)
          setSelectedRider(null);
          closeModals();
        } else {
          toast.error(res.payload?.message);
        }
      })
      .catch((err) => {
        console.log("Something went wrong while updating Rider data.");
      })

  };

  const clearAllFilters = () => {
    setStatusFilter("all");
    setVehicleFilter("all");
    setWorkloadFilter("all");
  };

  useEffect(() => {
    dispatch(getRiders({ page, limit, search, actionStatus: statusFilter, vehicleType: vehicleFilter, workload: workloadFilter }));
  }, [page, limit, search, statusFilter, vehicleFilter, workloadFilter, eventChanged])

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
        {stats.map((stat) => (
          <div key={stat.id} className="bg-white p-5 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                <h3 className={`text-2xl font-bold ${stat.color}`}>{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`text-2xl ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-5 rounded-2xl shadow-lg">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-6">
          <h3 className="text-xl font-semibold">Delivery Boys Management</h3>

          <div className="flex items-center flex-row gap-3 w-full md:w-auto relative">
            <button
              type="button"
              onClick={() => setCreateModal(true)}
              className="px-4 py-2 bg-btn2 text-text rounded-lg hover:bg-hover-btn2 flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <FaPlus size={13} /> Add Delivery Boy
            </button>

            <div className="relative w-full sm:w-72">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setpage(1);
                }}
                placeholder="Search rider..."
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="px-3 py-2 border border-gray-300 rounded-lg outline-none hover:bg-gray-50 flex items-center gap-2 whitespace-nowrap"
            >
              <FaFilter size={13} /> Filters
            </button>

            {filtersOpen && (
              <div className="absolute top-12 right-0 z-20 bg-white p-3 rounded-xl shadow-lg border border-gray-100 w-72 space-y-2">
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setpage(1);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                >
                  <option value="all">All Status</option>
                  {ACTION_STATUSES.map((status) => (
                    <option key={status} value={status}>{formatLabel(status)}</option>
                  ))}
                </select>

                <select
                  value={vehicleFilter}
                  onChange={(e) => {
                    setVehicleFilter(e.target.value);
                    setpage(1);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                >
                  <option value="all">All Vehicles</option>
                  {VEHICLE_TYPES.map((type) => (
                    <option key={type} value={type}>{formatLabel(type)}</option>
                  ))}
                </select>

                <select
                  value={workloadFilter}
                  onChange={(e) => {
                    setWorkloadFilter(e.target.value);
                    setpage(1);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                >
                  <option value="all">All Workload</option>
                  <option value="idle">Idle</option>
                  <option value="normal">Normal (1-3)</option>
                  <option value="busy">Busy ({">3"})</option>
                </select>

                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="w-full px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="overflow-x-auto block overflow-hidden">
          <table className="w-full min-w-240">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="text-left px-2 py-3 font-semibold text-gray-700">Rider</th>
                <th className="text-left px-2 py-3 font-semibold text-gray-700">Contact</th>
                <th className="text-left px-2 py-3 font-semibold text-gray-700">Vehicle</th>
                <th className="text-left px-2 py-3 whitespace-nowrap font-semibold text-gray-700">Current Orders</th>
                <th className="text-left px-2 py-3 font-semibold text-gray-700">Location</th>
                <th className="text-left px-2 py-3 font-semibold text-gray-700">Status</th>
                <th className="text-center px-2 py-3 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {riders?.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">No delivery boys found.</td>
                </tr>
              ) : (
                riders?.map((rider) => {
                  const VehicleIcon = vehicleIcon(rider?.vehicleType);
                  return (
                    <tr key={rider?._id} className="border-b border-gray-200">
                      <td className="px-2 py-3">
                        <p className="font-semibold text-gray-800">{rider?.name}</p>
                      </td>
                      <td className="px-2 py-3 text-sm text-gray-700">
                        <p>{rider?.phone}</p>
                        <p className="text-xs text-gray-500">{rider?.email}</p>
                      </td>
                      <td className="px-2 py-3">
                        <div className="inline-flex items-center gap-2 text-sm text-gray-700">
                          <VehicleIcon size={14} />
                          {formatLabel(rider?.vehicleType)} ({rider?.vehicleNumber})
                        </div>
                      </td>
                      <td className="px-2 py-3 text-sm text-gray-700">{rider?.currentOrders}</td>
                      <td className="px-2 py-3 text-sm text-gray-700">
                        {rider?.address?.city}
                      </td>
                      <td className="px-2 py-3">
                        <select
                          value={rider?.actionStatus}
                          onChange={(e) => handleStatusChange(rider?._id, e.target.value)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border outline-none ${statusClass(rider?.actionStatus)}`}
                        >
                          {ACTION_STATUSES.map((status) => (
                            <option key={status} value={status}>{formatLabel(status)}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-2 py-3">
                        <div className="flex justify-center gap-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" onClick={() => openView(rider?._id)}>
                            <FaEye size={15} />
                          </button>
                          <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" onClick={() => openEdit(rider?._id)}>
                            <FaEdit size={15} />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" onClick={() => openDelete(rider)}>
                            <FaTrash size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <Pagination NumberOfItems={totalDeliveryBoys} limit={limit} page={page} setpage={setpage} title={"Delivery Boys"} totalPages={totalPages} />
      </div>

      {createModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-5 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-2xl font-bold text-gray-800">Add Delivery Boy</h2>
              <button onClick={closeModals} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <FaTimes size={20} className="text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Name</label>
                  <input type="text" name="name" value={createForm.name} onChange={handleCreateChange} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Phone</label>
                  <input type="text" name="phone" value={createForm.phone} onChange={handleCreateChange} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Email</label>
                  <input type="email" name="email" value={createForm.email} onChange={handleCreateChange} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Password</label>
                  <input type="password" name="password" value={createForm.password} onChange={handleCreateChange} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Vehicle Type</label>
                  <select name="vehicleType" value={createForm.vehicleType} onChange={handleCreateChange} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    {VEHICLE_TYPES.map((type) => (
                      <option key={type} value={type}>{formatLabel(type)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Vehicle Number</label>
                  <input type="text" name="vehicleNumber" value={createForm.vehicleNumber} onChange={handleCreateChange} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Country</label>
                  <input type="text" name="country" value={createForm.country} onChange={handleCreateChange} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">City</label>
                  <input type="text" name="city" value={createForm.city} onChange={handleCreateChange} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">State</label>
                  <input type="text" name="state" value={createForm.state} onChange={handleCreateChange} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Postal Code</label>
                  <input type="text" name="postalCode" value={createForm.postalCode} onChange={handleCreateChange} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Full Address</label>
                  <input type="text" name="fullAddress" value={createForm.fullAddress} onChange={handleCreateChange} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModals} className="flex-1 px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold">Cancel</button>
                <button type="button" onClick={handleCreateRider} className="flex-1 px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800 font-semibold">Add Rider</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {viewModal && selectedRider && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-5 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-2xl font-bold text-gray-800">Delivery Boy Details</h2>
              <button onClick={closeModals} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <FaTimes size={20} className="text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500">Name</p>
                  <p className="font-semibold text-gray-800">{selectedRider?.name}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="font-semibold text-gray-800">{selectedRider?.phone}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-semibold text-gray-800 text-sm">{selectedRider?.email || "-"}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500">Status</p>
                  <p className="font-semibold text-gray-800">{formatLabel(selectedRider?.actionStatus)}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <h4 className="font-semibold text-gray-700 mb-3">Vehicle & Orders</h4>
                  <p className="text-sm text-gray-700">Vehicle: {formatLabel(selectedRider?.vehicleType)}</p>
                  <p className="text-sm text-gray-700">Vehicle Number: {selectedRider?.vehicleNumber}</p>
                  <p className="text-sm text-gray-700">Current Orders: {selectedRider?.currentOrders}</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <h4 className="font-semibold text-gray-700 mb-3">Address</h4>
                  <p className="text-sm text-gray-700">{selectedRider?.address?.fullAddress}</p>
                  <p className="text-sm text-gray-700">{selectedRider?.address?.city}, {selectedRider?.address?.state}</p>
                  <p className="text-sm text-gray-700">{selectedRider?.address?.country} - {selectedRider?.address?.postalCode}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500">Latitude</p>
                  <p className="font-semibold text-gray-800">{selectedRider?.location?.lat}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500">Longitude</p>
                  <p className="font-semibold text-gray-800">{selectedRider?.location?.lng}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500">Location Updated</p>
                  <p className="font-semibold text-gray-800 text-sm">{formatDate(selectedRider?.location?.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {editModal && selectedRider && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-5 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-2xl font-bold text-gray-800">Update Delivery Boy</h2>
              <button onClick={closeModals} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <FaTimes size={20} className="text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Name</label>
                  <input type="text" name="name" value={editForm.name} onChange={handleEditChange} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Phone</label>
                  <input type="text" name="phone" value={editForm.phone} onChange={handleEditChange} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Email</label>
                  <input type="email" name="email" value={editForm.email} onChange={handleEditChange} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Password</label>
                  <input type="password" name="password" value={editForm.password} onChange={handleEditChange} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Vehicle Type</label>
                  <select name="vehicleType" value={editForm.vehicleType} onChange={handleEditChange} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    {VEHICLE_TYPES.map((type) => (
                      <option key={type} value={type}>{formatLabel(type)}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Vehicle Number</label>
                  <input type="text" name="vehicleNumber" value={editForm.vehicleNumber} onChange={handleEditChange} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Country</label>
                  <input type="text" name="country" value={editForm.country} onChange={handleEditChange} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">City</label>
                  <input type="text" name="city" value={editForm.city} onChange={handleEditChange} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">State</label>
                  <input type="text" name="state" value={editForm.state} onChange={handleEditChange} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Postal Code</label>
                  <input type="text" name="postalCode" value={editForm.postalCode} onChange={handleEditChange} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Full Address</label>
                  <input type="text" name="fullAddress" value={editForm.fullAddress} onChange={handleEditChange} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModals} className="flex-1 px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold">Cancel</button>
                <button type="button" onClick={handleSaveEdit} className="flex-1 px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800 font-semibold">Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteModal && selectedRider && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Delete Delivery Boy</h3>
            <p className="text-gray-600 mb-5">
              Are you sure you want to delete <span className="font-semibold">{selectedRider.name}</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button type="button" onClick={closeModals} className="flex-1 px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold">Cancel</button>
              <button type="button" onClick={handleDelete} className="flex-1 px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold">Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DeliveryBoys;
