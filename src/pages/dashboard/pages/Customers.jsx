import React, { useEffect, useState } from "react";
import {
  FaEdit,
  FaSearch,
  FaTrash,
  FaTimes,
  FaUser,
  FaUserCheck,
  FaUserShield,
  FaUsers,
  FaPause,
} from "react-icons/fa";
import { Input, Pagination } from "../../../components/index";
import { useDispatch, useSelector } from "react-redux";
import { getUsers, deleteUser, getUser, updateUserInfo, updateUserProfile, updateUserStatus } from "../../../store/adminSlices/UsersSlice";
import { toast } from "react-toastify";

function Customers() {
  const dispatch = useDispatch();
  const {
    data,
    totalPages,
    totalUsers,
    verifiedUsers,
    suspendedUsers,
    adminUsers,
    loading,
    totalUsersStats
  } = useSelector((state) => state.usersAdminSlice);

  const [search, setSearch] = useState("");
  const [page, setpage] = useState(1);
  const [limit, setlimit] = useState(20);
  const [handleDataChanged, sethandleDataChanged] = useState(false)
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [statusFilter, setstatusFilter] = useState("all");

  const [editFormData, setEditFormData] = useState({
    name: "",
    gender: "other",
    role: "user",
    birthDay: "",
    isVerified: false,
    avatar: {
      file: null,
      preview: "",
    },
  });

  useEffect(() => {
    dispatch(getUsers({ page, limit, search, statusFilter }));
  }, [dispatch, page, limit, search, handleDataChanged, statusFilter]);

  const stats = [
    {
      id: 1,
      title: "Total Customers",
      value: totalUsersStats,
      icon: FaUsers,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      valueColor: "text-blue-600",
    },
    {
      id: 2,
      title: "Verified Accounts",
      value: verifiedUsers,
      icon: FaUserCheck,
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
      valueColor: "text-emerald-600",
    },
    {
      id: 3,
      title: "Suspended Accounts",
      value: suspendedUsers,
      icon: FaPause,
      bgColor: "bg-violet-50",
      iconColor: "text-violet-600",
      valueColor: "text-violet-600",
    },
    {
      id: 4,
      title: "Admin Users",
      value: adminUsers,
      icon: FaUserShield,
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600",
      valueColor: "text-amber-600",
    },

  ];

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString();
  };

  const openEditModal = (customerId) => {
    setSelectedCustomer(customerId);
    dispatch(getUser(customerId))
      .then((res) => {
        if (res.type === "getsingleuser/fulfilled") {
          const customer = res.payload?.data || null;
          setEditFormData({
            name: customer?.name || "",
            gender: customer?.gender || "other",
            role: customer?.role || "user",
            isVerified: customer?.isVerified,
            actionStatus: customer?.actionStatus || "",
            birthDay: customer?.birthDay ? new Date(customer.birthDay).toISOString().split("T")[0] : "",
            avatar: {
              file: null,
              preview: customer?.avatar?.url || "",
            },
          });
          setEditModal(true);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("An error occurred while fetching customer details");
      });
  };

  const openDeleteModal = (customer) => {
    setSelectedCustomer(customer);
    setDeleteModal(true);
  };

  const handleCloseModals = () => {
    setViewModal(false);
    setEditModal(false);
    setDeleteModal(false);
    setSelectedCustomer(null);
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEditFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditFormData((prev) => ({
        ...prev,
        avatar: {
          file,
          preview: URL.createObjectURL(file),
        },
      }));
    }
  }

  const handleViewCustomer = async (customerId) => {
    await dispatch(getUser(customerId))
      .then((res) => {
        if (res.type === "getsingleuser/fulfilled") {
          setSelectedCustomer(res.payload?.data || null);
          setViewModal(true);
        } else {
          toast.error(res.payload?.message || "Failed to load customer details");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("An error occurred while fetching customer details");
      });
  };

  const handleEditCustomerProfile = async () => {
    if (!selectedCustomer) return;

    const formData = new FormData();
    formData.append("name", editFormData.name);
    formData.append("gender", editFormData.gender);
    formData.append("role", editFormData.role);
    formData.append("birthDay", editFormData.birthDay);
    formData.append("isVerified", editFormData.isVerified);
    if (editFormData.avatar.file) {
      formData.append("image", editFormData.avatar.file);
    }

    await dispatch(updateUserProfile({ userId: selectedCustomer, userData: formData }))
      .then((res) => {
        if (res.type === "updateuserprofile/fulfilled") {
          toast.success(res.payload?.message || "Customer information updated successfully");
          handleCloseModals();
          sethandleDataChanged(!handleDataChanged);
        } else {
          toast.error(res.payload?.message || "Failed to update customer information");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("An error occurred while updating customer information");
      });
  };

  const handleDeleteCustomer = () => {
    if (!selectedCustomer) return;

    dispatch(deleteUser(selectedCustomer._id))
      .then((res) => {
        if (res.type === "deleteuser/fulfilled") {
          toast.success(res.payload?.message || "Customer deleted successfully");
          handleCloseModals();
          sethandleDataChanged(!handleDataChanged);
        } else {
          toast.error(res.payload?.message || "Failed to delete customer");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("An error occurred while deleting customer");
      });
  };

  const handleUpdateCustomerStatus = async (customerId, status) => {
    dispatch(updateUserStatus({ userId: customerId, status }))
      .then((res) => {
        if (res.type === "updateuserstatus/fulfilled") {
          toast.success(res.payload?.message || "Customer status updated successfully");
          sethandleDataChanged(!handleDataChanged);
        } else {
          toast.error(res.payload?.message || "Failed to update customer status");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("An error occurred while updating customer status");
      });
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-5">
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
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <h3 className="text-xl font-semibold">All Customers</h3>
         <div className="flex items-center gap-3">
           <div className="relative w-full md:w-96">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search by name, email, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <select
              value={statusFilter}
              onChange={(e) => {
                setstatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="deleted">Deleted</option>
            </select>
         </div>
        </div>

        <div className="overflow-x-auto block overflow-hidden">
          <table className="w-full min-w-200">
            <thead>
              <tr className="border-b border-gray-300">
                {
                  ["Customer", "Email", "Phone", "Role", "Status", "isActive", "Joined", "Actions"].map((head, i) => (
                    <th key={i} className="text-left px-2 py-3 font-semibold text-gray-700 whitespace-nowrap">{head}</th>
                  ))
                }
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-2 py-8 text-center text-gray-500">
                    Loading customers...
                  </td>
                </tr>
              ) : data?.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-2 py-8 text-center text-gray-500">
                    No customers found.
                  </td>
                </tr>
              ) : (
                data?.map((customer) => (
                  <tr key={customer?._id} className="border-b border-gray-200">
                    <td className="px-2 py-3">
                      <div className="flex items-center gap-3">
                        {customer?.avatar?.url ? (
                          <img
                            src={customer.avatar.url}
                            alt={customer?.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                            <FaUser size={16} />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-800">{customer?.name || "-"}</p>
                          <p className="text-xs font-mono text-gray-500">{customer?._id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-3 text-gray-600">{customer?.email || "-"}</td>
                    <td className="px-2 py-3 text-gray-600">{customer?.phone || "-"}</td>
                    <td className="px-2 py-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${customer?.role === "admin"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-blue-100 text-blue-700"
                          }`}
                      >
                        {customer?.role || "user"}
                      </span>
                    </td>
                    <td className="px-2 py-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${customer?.isVerified
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-gray-100 text-gray-700"
                          }`}
                      >
                        {customer?.isVerified ? "Verified" : "Unverified"}
                      </span>
                    </td>
                    <td className="px-2 py-3">
                      <select
                        value={customer?.actionStatus}
                        onChange={(e) => handleUpdateCustomerStatus(customer._id, e.target.value)}
                        className={`px-2 py-1 rounded text-sm font-medium  focus:outline-none`}
                      >
                        <option value="active">Active</option>
                        <option value="suspended">Suspend</option>
                        <option value="deleted">Delete</option>
                      </select>
                    </td>
                    <td className="px-2 py-3 text-gray-600">{formatDate(customer?.createdAt)}</td>
                    <td className="px-2 py-3">
                      <div className="flex justify-center gap-2">
                        <button
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View"
                          onClick={() => handleViewCustomer(customer?._id)}
                        >
                          <FaSearch size={15} />
                        </button>
                        <button
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Edit"
                          onClick={() => openEditModal(customer?._id)}
                        >
                          <FaEdit size={15} />
                        </button>
                        <button
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                          onClick={() => openDeleteModal(customer)}
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
        <Pagination
          NumberOfItems={totalUsers}
          limit={limit}
          page={page}
          setpage={setpage}
          totalPages={totalPages}
          title="Customers"
        />
      </div>

      {viewModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-5 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-2xl font-bold text-gray-800">Customer Details</h2>
              <button onClick={handleCloseModals} className="p-2 hover:bg-gray-100 rounded-lg">
                <FaTimes size={20} className="text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="flex items-center gap-4">
                {selectedCustomer?.avatar?.url ? (
                  <img
                    src={selectedCustomer.avatar.url}
                    alt={selectedCustomer?.name}
                    className="w-20 h-20 rounded-full object-cover border border-gray-200"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                    <FaUser size={28} />
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{selectedCustomer?.name || "-"}</h3>
                  <p className="text-sm text-gray-500">{selectedCustomer?.email || "-"}</p>
                  <p className="text-xs font-mono text-gray-500 mt-1">{selectedCustomer?._id}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-base font-medium text-gray-800">{selectedCustomer?.phone || "-"}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500">Gender</p>
                  <p className="text-base font-medium text-gray-800">{selectedCustomer?.gender || "other"}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500">Role</p>
                  <p className="text-base font-medium text-gray-800">{selectedCustomer?.role || "user"}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500">Status</p>
                  <p className="text-base font-medium text-gray-800">
                    {selectedCustomer?.isVerified ? "Verified" : "Unverified"}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500">Is Active</p>
                  <p className="text-base font-medium text-gray-800">
                    {selectedCustomer?.actionStatus==="active" ? "Active" : selectedCustomer?.actionStatus==="suspended" ? "Suspended" : selectedCustomer?.actionStatus==="deleted" ? "Deleted" : "-"}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500">Date Of Birth</p>
                  <p className="text-base font-medium text-gray-800">{formatDate(selectedCustomer?.birthDay)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500">Joined</p>
                  <p className="text-base font-medium text-gray-800">{formatDate(selectedCustomer?.createdAt)}</p>
                </div>

              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Saved Addresses</h4>
                {Array.isArray(selectedCustomer?.addresses) && selectedCustomer.addresses.length > 0 ? (
                  <div className="space-y-3">
                    {selectedCustomer.addresses.map((addr, index) => (
                      <div key={`${addr?.phone || "addr"}-${index}`} className="border border-gray-200 rounded-lg p-3 bg-white">
                        <p className="text-sm font-medium text-gray-800">{addr?.name || "Address"}</p>
                        <p className="text-sm text-gray-600">{addr?.address || "-"}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {addr?.district || ""} {addr?.city ? `, ${addr.city}` : ""}
                          {addr?.region ? `, ${addr.region}` : ""}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No saved addresses.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {editModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-5 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-2xl font-bold text-gray-800">Update Customer</h2>
              <button onClick={handleCloseModals} className="p-2 hover:bg-gray-100 rounded-lg">
                <FaTimes size={20} className="text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="avatar md:col-span-2 flex flex-col items-center gap-2">
                  <label htmlFor="avatar-upload" className="cursor-pointer">
                    <img
                      src={editFormData.avatar.preview || "/default-avatar.png"}
                      alt="Avatar Preview"
                      className="w-25 h-25 rounded-full object-cover border-2 border-gray-300"
                    />
                    {editFormData.avatar.file ? (
                      <p className="text-xs text-gray-500 mt-2">Selected: {editFormData.avatar.file.name}</p>
                    ) : (
                      <p className="text-xs text-gray-500 mt-2">Please select an avatar image</p>
                    )}
                  </label>
                  <input
                    type="file"
                    id="avatar-upload"
                    name="avatar"
                    accept=".jpg,.jpeg,.png,.webp"
                    onChange={handleEditFileChange}
                    className="hidden"
                  />
                </div>
                <Input
                  label
                  labelText="Full Name"
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditChange}
                  size="xl"
                  classes="border-gray-300"
                />
                <div>
                  <label className="text-sm mb-1 font-semibold text-text2" htmlFor="gender">Gender</label>
                  <select
                    id="gender"
                    name="gender"
                    value={editFormData.gender}
                    onChange={handleEditChange}
                    className="outline-none border border-gray-300 w-full focus:border-blue-500 focus:ring-2 ring-blue-500 transition-all text-base p-2 rounded-lg bg-white"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm mb-1 font-semibold text-text2" htmlFor="role">Role</label>
                  <select
                    id="role"
                    name="role"
                    value={editFormData.role}
                    onChange={handleEditChange}
                    className="outline-none border border-gray-300 w-full focus:border-blue-500 focus:ring-2 ring-blue-500 transition-all text-base p-2 rounded-lg bg-white"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm mb-1 font-semibold text-text2" htmlFor="birthDay">Birth Day</label>
                  <input type="date" id="birthDay" name="birthDay" value={editFormData.birthDay} onChange={handleEditChange} className="outline-none border border-gray-300 w-full focus:border-blue-500 focus:ring-2 ring-blue-500 transition-all text-base p-2 rounded-lg bg-white" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="inline-flex items-center gap-2 cursor-pointer mt-2">
                    <input
                      type="checkbox"
                      name="isVerified"
                      checked={editFormData.isVerified}
                      onChange={handleEditChange}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium text-gray-700">Verified Account</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCloseModals}
                  className="flex-1 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleEditCustomerProfile}
                  className="flex-1 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 font-semibold"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Delete Customer</h3>
            <p className="text-gray-600 mb-5">
              Are you sure you want to delete <span className="font-semibold">{selectedCustomer?.name}</span>? This action cannot be undone.
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
                onClick={handleDeleteCustomer}
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

export default Customers;
