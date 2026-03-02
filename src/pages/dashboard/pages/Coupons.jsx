import React, { useState, useEffect } from "react";
import {
    FaCheckCircle,
    FaEdit,
    FaEye,
    FaPlus,
    FaSearch,
    FaTag,
    FaTimes,
    FaTimesCircle,
    FaTrash,
    FaUserCheck,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { createCoupon, deleteCoupon, getCoupon, getCoupons, updateCoupon, updateCouponStatus } from '../../../store/adminSlices/CouponsSlice'
import { toast } from "react-toastify";
import { Pagination } from '../../../components/index'
import { formatAmount } from "../../../custom methods";

const formatDate = (date) => (date ? new Date(date).toLocaleDateString() : "-");

function Coupons() {
    const dispatch = useDispatch();
    const {
        coupons,
        totalCoupons,
        activeCoupons,
        expiredCoupons,
        totalUsage,
        totalPages,
        totalCouponsStats
    } = useSelector((state) => state.couponsAdminSlice);
    const { currency } = useSelector((state) => state.userSlice);

    const [search, setSearch] = useState("");
    const [page, setpage] = useState(1);
    const [limit, setlimit] = useState(20);
    const [statusFilter, setStatusFilter] = useState("all");
    const [discountTypeFilter, setDiscountTypeFilter] = useState("all");
    const [timeFilter, setTimeFilter] = useState("all");

    const [viewModal, setViewModal] = useState(false);
    const [createModal, setCreateModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedCoupon, setSelectedCoupon] = useState(null);
    const [handleChange, sethandleChange] = useState(false);

    const [createForm, setCreateForm] = useState({
        code: "",
        discountType: "percentage",
        discountValue: 0,
        minOrderAmount: 0,
        maxOrderAmount: 0,
        usageLimit: 0,
        expiresIn: "",
        isActive: true,
    });

    const [editForm, setEditForm] = useState({
        code: "",
        discountType: "percentage",
        discountValue: 0,
        minOrderAmount: 0,
        maxOrderAmount: 0,
        usageLimit: 0,
        expiresIn: ""
    });

    useEffect(() => {
        dispatch(getCoupons({ page, limit, statusFilter, discountTypeFilter, timeFilter }));
    }, [dispatch, page, limit, handleChange, statusFilter, discountTypeFilter, timeFilter]);

    const stats = [
        {
            id: 1,
            title: "Total Coupons",
            value: totalCouponsStats,
            icon: FaTag,
            bgColor: "bg-blue-50",
            iconColor: "text-blue-600",
            valueColor: "text-blue-600",
        },
        {
            id: 2,
            title: "Active Coupons",
            value: activeCoupons,
            icon: FaCheckCircle,
            bgColor: "bg-emerald-50",
            iconColor: "text-emerald-600",
            valueColor: "text-emerald-600",
        },
        {
            id: 3,
            title: "Expired Coupons",
            value: expiredCoupons,
            icon: FaTimesCircle,
            bgColor: "bg-rose-50",
            iconColor: "text-rose-600",
            valueColor: "text-rose-600",
        },
        {
            id: 4,
            title: "Total Usage",
            value: totalUsage,
            icon: FaUserCheck,
            bgColor: "bg-violet-50",
            iconColor: "text-violet-600",
            valueColor: "text-violet-600",
        },
    ];

    const openView = async (couponId) => {
        await dispatch(getCoupon(couponId))
            .then((res) => {
                if (res.type === "getcoupon/fulfilled") {
                    setSelectedCoupon(res.payload.data);
                    setViewModal(true);
                } else {
                    toast.error(res.payload?.message || "Failed to fetch coupon details.");
                }
            })
            .catch((err) => {
                toast.error("Failed to fetch coupon details.");
            });
    };

    const openEdit = async (couponId) => {
        setSelectedCoupon(couponId);
        await dispatch(getCoupon(couponId))
            .then((res) => {
                if (res.type === "getcoupon/fulfilled") {
                    setEditForm({
                        code: res.payload.data.code,
                        discountType: res.payload.data.discountType,
                        discountValue: res.payload.data.discountValue,
                        minOrderAmount: res.payload.data.minOrderAmount,
                        maxOrderAmount: res.payload.data.maxOrderAmount ?? 0,
                        usageLimit: res.payload.data.usageLimit,
                        expiresIn: res.payload.data.expiresAt ? new Date(res.payload.data.expiresAt).toISOString().split("T")[0] : "",
                    });
                    setEditModal(true);
                } else {
                    toast.error(res.payload?.message || "Failed to fetch coupon details.");
                }
            })
            .catch((err) => {
                toast.error("Failed to fetch coupon details.");
            });
    };

    const openDelete = (coupon) => {
        setSelectedCoupon(coupon);
        setDeleteModal(true);
    };

    const closeModals = () => {
        setViewModal(false);
        setCreateModal(false);
        setEditModal(false);
        setDeleteModal(false);
        setSelectedCoupon(null);
    };

    const handleDelete = async () => {
        if (!selectedCoupon) return;
        await dispatch(deleteCoupon(selectedCoupon._id))
            .then((res) => {
                if (res.type === "deletecoupon/fulfilled") {
                    toast.success(res.payload?.message || "Coupon deleted successfully.");
                    sethandleChange(prev => !prev);
                    closeModals();
                } else {
                    toast.error(res.payload?.message || "Failed to delete coupon.");
                }
            })
            .catch((err) => {
                toast.error("Failed to delete coupon.");
            });
    };

    const handleEditChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    };

    const handleCreateChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCreateForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    };

    const resetCreateForm = () => {
        setCreateForm({
            code: "",
            discountType: "percentage",
            discountValue: 0,
            minOrderAmount: 0,
            maxOrderAmount: 0,
            usageLimit: 0,
            expiresIn: "",
            isActive: true,
        });
    };

    const handleCreateCoupon = async () => {
        const code = createForm.code.trim().toUpperCase();
        if (!code || !createForm.expiresIn || !createForm.discountValue) {
            toast.error("Please fill in all required fields.");
            return;
        };

        const couponData = {
            ...createForm,
            discountValue: Number(createForm.discountValue),
            minOrderAmount: Number(createForm.minOrderAmount) || 0,
            maxOrderAmount: Number(createForm.maxOrderAmount) || 0,
            usageLimit: Number(createForm.usageLimit) || 0,
        };

        await dispatch(createCoupon(couponData))
            .then((res) => {
                if (res.type === "createcoupon/fulfilled") {
                    toast.success(res.payload.message || "Coupon created successfully.");
                    sethandleChange(prev => !prev);
                    setCreateModal(false);
                    resetCreateForm();
                } else {
                    toast.error(res.payload?.message || "Failed to create coupon.");
                }
            })
            .catch((err) => {
                toast.error("Failed to create coupon.");
            });
    };

    const getDiscountText = (coupon) =>
        coupon.discountType === "percentage" ? `${coupon.discountValue}% Off` : `${currency.symbol}${coupon.discountValue} Off`;

    const handleUpdateCouponStatus = async (couponId, status) => {
        await dispatch(updateCouponStatus({ couponId, status }))
            .then((res) => {
                if (res.type === "updatecouponstatus/fulfilled") {
                    toast.success(res.payload?.message)
                    sethandleChange(prev => !prev);
                } else {
                    toast.error(res.payload?.message)
                }
            }).catch((err) => {
                console.log(err);

            });
    };

    const handleUpdateCoupon = async () => {
        if (!selectedCoupon) return;

        const updatedForm = {
            ...editForm,
            discountValue: Number(editForm.discountValue) || 0,
            minOrderAmount: Number(editForm.minOrderAmount) || 0,
            maxOrderAmount: Number(editForm.maxOrderAmount) || 0,
            usageLimit: Number(editForm.usageLimit) || 0,
        };

        await dispatch(updateCoupon({ couponId: selectedCoupon, couponData: updatedForm }))
            .then((res) => {
                if (res.type === "updatecoupon/fulfilled") {
                    toast.success(res.payload?.message || "Coupon updated successfully.");
                    sethandleChange(prev => !prev);
                    closeModals();
                } else {
                    toast.error(res.payload?.message || "Failed to update coupon.");
                }
            })
            .catch((err) => {
                toast.error("Failed to update coupon.");
            });
    }

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
                <div className="mb-6 space-y-4">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                        <h3 className="text-xl w-full sm:w-auto font-semibold">Coupons Management</h3>
                        <button
                            type="button"
                            onClick={() => setCreateModal(true)}
                            className="px-4 py-2 w-full sm:w-auto bg-btn2 text-text rounded-lg hover:bg-hover-btn2 flex items-center justify-center gap-2 min-w-44"
                        >
                            <FaPlus size={13} /> Create Coupon
                        </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                        <div className="relative min-w-56">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setpage(1);
                                }}
                                placeholder="Search coupon code..."
                                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                        </div>

                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setpage(1);
                            }}
                            className="px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="expired">Expired</option>
                            <option value="deleted">Deleted</option>
                        </select>

                        <select
                            value={discountTypeFilter}
                            onChange={(e) => {
                                setDiscountTypeFilter(e.target.value);
                                setpage(1);
                            }}
                            className="px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                        >
                            <option value="all">All Discount Types</option>
                            <option value="percentage">Percentage</option>
                            <option value="fixed">Fixed</option>
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
                    </div>
                </div>

                <div className="overflow-x-auto block overflow-hidden">
                    <table className="w-full min-w-240">
                        <thead>
                            <tr className="border-b border-gray-300">
                                <th className="text-left px-2 py-3 font-semibold text-gray-700">Code</th>
                                <th className="text-left px-2 py-3 font-semibold text-gray-700">Discount</th>
                                <th className="text-left px-2 py-3 font-semibold text-gray-700">Min/Max Order</th>
                                <th className="text-left px-2 py-3 font-semibold text-gray-700">Usage</th>
                                <th className="text-left px-2 py-3 font-semibold text-gray-700">Expiry</th>
                                <th className="text-left px-2 py-3 font-semibold text-gray-700">Status</th>
                                <th className="text-center px-2 py-3 font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {coupons?.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-8 text-gray-500">
                                        No coupons found.
                                    </td>
                                </tr>
                            ) : (
                                coupons?.map((coupon) => {
                                    const usedCount = coupon.usedBy.reduce((sum, user) => sum + user.usedCount, 0);

                                    return (
                                        <tr key={coupon._id} className="border-b border-gray-200">
                                            <td className="px-2 py-3">
                                                <p className="font-semibold text-gray-800">{coupon.code}</p>
                                                <p className="text-xs font-mono text-gray-500">{coupon._id}</p>
                                            </td>
                                            <td className="px-2 py-3">
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                                    {getDiscountText(coupon)}
                                                </span>
                                            </td>
                                            <td className="px-2 py-3 text-sm text-gray-700">
                                                Min: {currency.symbol}{formatAmount(coupon.minOrderAmount)}
                                                <br />
                                                Max: {coupon.maxOrderAmount ? `${currency.symbol}${formatAmount(coupon.maxOrderAmount)}` : "No Limit"}
                                            </td>
                                            <td className="px-2 py-3 text-sm text-gray-700">
                                                {usedCount}
                                            </td>
                                            <td className="px-2 py-3 text-sm text-gray-700">{formatDate(coupon?.expiresAt)}</td>
                                            <td className="px-2 py-3">
                                                <select
                                                    value={coupon.actionStatus}
                                                    onChange={(e) => handleUpdateCouponStatus(coupon._id, e.target.value)}
                                                    className={`px-2 py-1 rounded text-sm font-medium  focus:outline-none`}
                                                >
                                                    <option value="active">Active</option>
                                                    <option value="inactive">InActive</option>
                                                    <option value="deleted">Delete</option>
                                                </select>
                                            </td>
                                            <td className="px-2 py-3">
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="View"
                                                        onClick={() => openView(coupon?._id)}
                                                    >
                                                        <FaEye size={15} />
                                                    </button>
                                                    <button
                                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                        title="Edit"
                                                        onClick={() => openEdit(coupon?._id)}
                                                    >
                                                        <FaEdit size={15} />
                                                    </button>
                                                    <button
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete"
                                                        onClick={() => openDelete(coupon)}
                                                    >
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

                <Pagination
                    NumberOfItems={totalCoupons}
                    limit={limit}
                    page={page}
                    setpage={setpage}
                    title={"Coupons"}
                    totalPages={totalPages}
                />
            </div>

            {createModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b p-5 flex items-center justify-between rounded-t-2xl">
                            <h2 className="text-2xl font-bold text-gray-800">Create Coupon</h2>
                            <button onClick={() => { setCreateModal(false); resetCreateForm(); }} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <FaTimes size={20} className="text-gray-600" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">Coupon Code</label>
                                    <input
                                        type="text"
                                        name="code"
                                        value={createForm.code}
                                        onChange={handleCreateChange}
                                        placeholder="e.g. SAVE20"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">Discount Type</label>
                                    <select
                                        name="discountType"
                                        value={createForm.discountType}
                                        onChange={handleCreateChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                    >
                                        <option value="percentage">Percentage</option>
                                        <option value="fixed">Fixed</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">Discount Value</label>
                                    <input
                                        type="number"
                                        name="discountValue"
                                        value={createForm.discountValue}
                                        onChange={handleCreateChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">Min Order Amount</label>
                                    <input
                                        type="number"
                                        name="minOrderAmount"
                                        value={createForm.minOrderAmount}
                                        onChange={handleCreateChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">Max Order Amount</label>
                                    <input
                                        type="number"
                                        name="maxOrderAmount"
                                        value={createForm.maxOrderAmount}
                                        onChange={handleCreateChange}
                                        placeholder="Optional"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">Usage Limit</label>
                                    <input
                                        type="number"
                                        name="usageLimit"
                                        value={createForm.usageLimit}
                                        onChange={handleCreateChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">Expires At</label>
                                    <input
                                        type="date"
                                        name="expiresIn"
                                        value={createForm.expiresIn}
                                        onChange={handleCreateChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            <label className="inline-flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={createForm.isActive}
                                    onChange={handleCreateChange}
                                    className="w-4 h-4"
                                />
                                <span className="text-sm font-medium text-gray-700">Coupon is Active</span>
                            </label>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => { setCreateModal(false); resetCreateForm(); }}
                                    className="flex-1 px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCreateCoupon}
                                    className="flex-1 px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800 font-semibold"
                                >
                                    Create Coupon
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {viewModal && selectedCoupon && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b p-5 flex items-center justify-between rounded-t-2xl">
                            <h2 className="text-2xl font-bold text-gray-800">Coupon Details</h2>
                            <button onClick={closeModals} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <FaTimes size={20} className="text-gray-600" />
                            </button>
                        </div>

                        <div className="p-6 space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-xs text-gray-500">Code</p>
                                    <p className="font-semibold text-gray-800">{selectedCoupon.code}</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-xs text-gray-500">Discount Type</p>
                                    <p className="font-semibold text-gray-800">{selectedCoupon.discountType}</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-xs text-gray-500">Discount Value</p>
                                <p className="font-semibold text-gray-800">{getDiscountText(selectedCoupon)}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-xs text-gray-500">Min Order Amount</p>
                                    <p className="font-semibold text-gray-800">{currency.symbol}{formatAmount(selectedCoupon.minOrderAmount)}</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-xs text-gray-500">Max Order Amount</p>
                                    <p className="font-semibold text-gray-800">{selectedCoupon.maxOrderAmount ? `${currency.symbol}${formatAmount(selectedCoupon.maxOrderAmount)}` : "No Limit"}</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-xs text-gray-500">Usage Limit</p>
                                    <p className="font-semibold text-gray-800">{selectedCoupon.usageLimit > 0 ? selectedCoupon.usageLimit : "Unlimited"}</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-xs text-gray-500">Expires At</p>
                                    <p className="font-semibold text-gray-800">{formatDate(selectedCoupon.expiresAt)}</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-xs text-gray-500">Created At</p>
                                    <p className="font-semibold text-gray-800">{formatDate(selectedCoupon.createdAt)}</p>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                                <h4 className="font-semibold text-gray-700 mb-3">Used By Users</h4>
                                {selectedCoupon.usedBy.length > 0 ? (
                                    <div className="space-y-2">
                                        {selectedCoupon.usedBy.map((user, index) => (
                                            <div
                                                key={`${user.userId}-${index}`}
                                                className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-3 py-2"
                                            >
                                                <p className="text-xs font-mono text-gray-600">{user.userId}</p>
                                                <p className="text-sm font-medium text-gray-800">Used: {user.usedCount}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500">No usage yet.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {editModal && selectedCoupon && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b p-5 flex items-center justify-between rounded-t-2xl">
                            <h2 className="text-2xl font-bold text-gray-800">Update Coupon</h2>
                            <button onClick={closeModals} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <FaTimes size={20} className="text-gray-600" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">Coupon Code</label>
                                    <input
                                        type="text"
                                        name="code"
                                        value={editForm.code}
                                        onChange={handleEditChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">Discount Type</label>
                                    <select
                                        name="discountType"
                                        value={editForm.discountType}
                                        onChange={handleEditChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                    >
                                        <option value="percentage">Percentage</option>
                                        <option value="fixed">Fixed</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">Discount Value</label>
                                    <input
                                        type="number"
                                        name="discountValue"
                                        value={editForm.discountValue}
                                        onChange={handleEditChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">Min Order Amount</label>
                                    <input
                                        type="number"
                                        name="minOrderAmount"
                                        value={editForm.minOrderAmount}
                                        onChange={handleEditChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">Max Order Amount</label>
                                    <input
                                        type="number"
                                        name="maxOrderAmount"
                                        value={editForm.maxOrderAmount}
                                        onChange={handleEditChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">Usage Limit</label>
                                    <input
                                        type="number"
                                        name="usageLimit"
                                        value={editForm.usageLimit}
                                        onChange={handleEditChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">Expires In</label>
                                    <input
                                        type="date"
                                        name="expiresIn"
                                        value={editForm.expiresIn}
                                        onChange={handleEditChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={closeModals}
                                    className="flex-1 px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdateCoupon}
                                    type="button"
                                    className="flex-1 px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800 font-semibold"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {deleteModal && selectedCoupon && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Delete Coupon</h3>
                        <p className="text-gray-600 mb-5">
                            Are you sure you want to delete <span className="font-semibold">{selectedCoupon.code}</span>? This action cannot be undone.
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

export default Coupons;
