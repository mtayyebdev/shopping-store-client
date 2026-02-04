import React, { useState } from 'react'
import {
    LuMapPin,
    LuArrowLeft,
    LuPencil,
    LuTrash2,
    LuHouse,
    LuBriefcase
} from "react-icons/lu";
import { useOutletContext } from 'react-router-dom'
import { Button, Input } from '../../components/index.js';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getUser } from '../../store/publicSlices/UserSlice.jsx'

function Address() {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.userSlice);
    const { setIsSidebarOpen } = useOutletContext()
    const [addressFormOpen, setAddressFormOpen] = useState(false);
    const [addressFormEdit, setaddressFormEdit] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [storeAddressId, setStoreAddressId] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        region: "",
        city: "",
        district: "",
        address: "",
        landmark: "",
        shipTo: "home",
        defaultShipping: false
    });

    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = "Full name is required";
        if (!formData.phone.trim()) {
            newErrors.phone = "Phone number is required";
        } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/[^0-9]/g, ''))) {
            newErrors.phone = "Please enter a valid phone number";
        }
        if (!formData.region) newErrors.region = "Region is required";
        if (!formData.city) newErrors.city = "City is required";
        if (!formData.district) newErrors.district = "District is required";
        if (!formData.address.trim()) newErrors.address = "Address is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/auth/create-user-info`, formData, {
                withCredentials: true
            })
            if (res.status == 200) {
                toast.success("Address added successfully!");
                dispatch(getUser())
                setAddressFormOpen(false);
                setFormData({
                    name: "",
                    phone: "",
                    region: "",
                    city: "",
                    district: "",
                    address: "",
                    landmark: "",
                    shipTo: "home",
                    defaultShipping: false
                });
            }
        } catch (error) {
            console.log("Network error. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const deleteAddressHandler = async (addressId) => {
        try {
            const res = await axios.delete(`${import.meta.env.VITE_SERVER_URL}/api/auth/delete-info/${addressId}`, {
                withCredentials: true
            });
            if (res.status === 200) {
                toast.success("Address deleted successfully!");
                dispatch(getUser())
            }
        } catch (error) {
            console.log('Network error. Please try again.');
        }
    }

    const editAddressHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.patch(`${import.meta.env.VITE_SERVER_URL}/api/auth/update-info/${storeAddressId}`,
                formData,
                { withCredentials: true }
            )

            if (res.status == 200) {
                toast.success("Address updated successfully.");
                setaddressFormEdit(false)
                setStoreAddressId(null)
                setFormData({
                    name: "",
                    phone: "",
                    region: "",
                    city: "",
                    district: "",
                    address: "",
                    landmark: "",
                    shipTo: "home",
                    defaultShipping: false
                });
                dispatch(getUser())
            }
        } catch (error) {
            console.log('Network error. Please try again.');
        }
    }

    const openEditForm = (addressId) => {
        const addressData = user?.addresses?.find((a) => a._id === addressId)
        setFormData({
            name: addressData?.name,
            phone: addressData?.phone,
            region: addressData?.region,
            city: addressData?.city,
            district: addressData?.district,
            address: addressData?.address,
            landmark: addressData?.landmark,
            shipTo: addressData?.shipTo,
            defaultShipping: addressData?.defaultShipping
        })
        setStoreAddressId(addressId)
        setaddressFormEdit(true)
    }

    // Show new Form
    if (addressFormOpen) {
        return (
            <div className="bg-primary rounded-lg shadow-md p-6">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                    <LuMapPin className="w-6 h-6 text-blue-600" />
                    <h2 className="text-2xl font-bold text-text2">Add New Address</h2>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        {/* Full Name */}
                        <div>
                            <Input
                                label={true}
                                labelText='Full Name'
                                name='name'
                                size='xl'
                                type='text'
                                placeholder='Enter full name'
                                value={formData.name}
                                onChange={handleInputChange}
                            />
                            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                        </div>

                        {/* Phone Number */}
                        <div>
                            <Input
                                label={true}
                                labelText='Phone Number'
                                name='phone'
                                size='xl'
                                type='number'
                                placeholder='Enter phone number'
                                value={formData.phone}
                                onChange={handleInputChange}
                            />
                            {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
                        </div>

                        {/* Region */}
                        <div>
                            <Input
                                label={true}
                                labelText='Region *'
                                name='region'
                                size='xl'
                                type='text'
                                placeholder='Your region'
                                value={formData.region}
                                onChange={handleInputChange}
                            />
                            {errors.region && <p className="text-red-600 text-sm mt-1">{errors.region}</p>}
                        </div>

                        {/* City */}
                        <div>
                            <Input
                                label={true}
                                labelText='City *'
                                name='city'
                                size='xl'
                                type='text'
                                placeholder='Your city'
                                value={formData.city}
                                onChange={handleInputChange}
                            />
                            {errors.city && <p className="text-red-600 text-sm mt-1">{errors.city}</p>}
                        </div>

                        {/* District */}
                        <div>
                            <Input
                                label={true}
                                labelText='District'
                                name='district'
                                size='xl'
                                type='text'
                                placeholder='Enter district'
                                value={formData.district}
                                onChange={handleInputChange}
                                disabled={!formData.city}
                            />
                            {errors.district && <p className="text-red-600 text-sm mt-1">{errors.district}</p>}
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-sm font-semibold text-text2 mb-2">
                                Address *
                            </label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                placeholder="House No, Building Name, Street Name"
                                rows="3"
                                className={`w-full px-4 py-2.5 border-2 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-300 ${errors.address ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'
                                    }`}
                            ></textarea>
                            {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address}</p>}
                        </div>

                        {/* Landmark */}
                        <div>
                            <Input
                                label={true}
                                labelText='Landmark'
                                name='landmark'
                                size='xl'
                                type='text'
                                placeholder='Enter landmark (optional)'
                                value={formData.landmark}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* Ship To */}
                        <div>
                            <label className="block text-sm font-semibold text-text2 mb-3">
                                Ship To *
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, shipTo: "home" }))}
                                    className={`flex items-center justify-center gap-2 px-4 py-3 border-2 rounded-lg font-medium transition-all duration-300 ${formData.shipTo === "home"
                                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                                        : 'border-gray-200 text-text2 hover:border-gray-300'
                                        }`}
                                >
                                    <LuHouse className="w-5 h-5" />
                                    <span>Home</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, shipTo: "office" }))}
                                    className={`flex items-center justify-center gap-2 px-4 py-3 border-2 rounded-lg font-medium transition-all duration-300 ${formData.shipTo === "office"
                                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                                        : 'border-gray-200 text-text2 hover:border-gray-300'
                                        }`}
                                >
                                    <LuBriefcase className="w-5 h-5" />
                                    <span>Office</span>
                                </button>
                            </div>
                        </div>

                        {/* Default Shipping */}
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                            <input
                                type="checkbox"
                                name="defaultShipping"
                                id="defaultShipping"
                                checked={formData.defaultShipping}
                                onChange={handleInputChange}
                                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                            />
                            <label htmlFor="defaultShipping" className="text-sm font-medium text-text2 cursor-pointer">
                                Set as default shipping address
                            </label>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3 pt-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? "Saving..." : "Save Address"}
                            </button>
                            <Button
                                onClick={() => setAddressFormOpen(false)}
                                value='Cancel'
                                bg='btn2'
                                style='base'
                                size='md'
                            />
                        </div>
                    </div>
                </form>
            </div>
        );
    }

    // Show Edit Form
    if (addressFormEdit) {
        return (
            <div className="bg-primary rounded-lg shadow-md p-6">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                    <LuMapPin className="w-6 h-6 text-blue-600" />
                    <h2 className="text-2xl font-bold text-text2">Edit Address</h2>
                </div>

                <form onSubmit={editAddressHandler}>
                    <div className="space-y-6">
                        {/* Full Name */}
                        <div>
                            <Input
                                label={true}
                                labelText='Full Name'
                                name='name'
                                size='xl'
                                type='text'
                                placeholder='Enter full name'
                                value={formData.name}
                                onChange={handleInputChange}
                            />
                            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                        </div>

                        {/* Phone Number */}
                        <div>
                            <Input
                                label={true}
                                labelText='Phone Number'
                                name='phone'
                                size='xl'
                                type='number'
                                placeholder='Enter phone number'
                                value={formData.phone}
                                onChange={handleInputChange}
                            />
                            {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
                        </div>

                        {/* Region */}
                        <div>
                            <Input
                                label={true}
                                labelText='Region *'
                                name='region'
                                size='xl'
                                type='text'
                                placeholder='Your region'
                                value={formData.region}
                                onChange={handleInputChange}
                            />
                            {errors.region && <p className="text-red-600 text-sm mt-1">{errors.region}</p>}
                        </div>

                        {/* City */}
                        <div>
                            <Input
                                label={true}
                                labelText='City *'
                                name='city'
                                size='xl'
                                type='text'
                                placeholder='Your city'
                                value={formData.city}
                                onChange={handleInputChange}
                            />
                            {errors.city && <p className="text-red-600 text-sm mt-1">{errors.city}</p>}
                        </div>

                        {/* District */}
                        <div>
                            <Input
                                label={true}
                                labelText='District'
                                name='district'
                                size='xl'
                                type='text'
                                placeholder='Enter district'
                                value={formData.district}
                                onChange={handleInputChange}
                                disabled={!formData.city}
                            />
                            {errors.district && <p className="text-red-600 text-sm mt-1">{errors.district}</p>}
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-sm font-semibold text-text2 mb-2">
                                Address *
                            </label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                placeholder="House No, Building Name, Street Name"
                                rows="3"
                                className={`w-full px-4 py-2.5 border-2 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-300 ${errors.address ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'
                                    }`}
                            ></textarea>
                            {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address}</p>}
                        </div>

                        {/* Landmark */}
                        <div>
                            <Input
                                label={true}
                                labelText='Landmark'
                                name='landmark'
                                size='xl'
                                type='text'
                                placeholder='Enter landmark (optional)'
                                value={formData.landmark}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* Ship To */}
                        <div>
                            <label className="block text-sm font-semibold text-text2 mb-3">
                                Ship To *
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, shipTo: "home" }))}
                                    className={`flex items-center justify-center gap-2 px-4 py-3 border-2 rounded-lg font-medium transition-all duration-300 ${formData.shipTo === "home"
                                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                                        : 'border-gray-200 text-text2 hover:border-gray-300'
                                        }`}
                                >
                                    <LuHouse className="w-5 h-5" />
                                    <span>Home</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, shipTo: "office" }))}
                                    className={`flex items-center justify-center gap-2 px-4 py-3 border-2 rounded-lg font-medium transition-all duration-300 ${formData.shipTo === "office"
                                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                                        : 'border-gray-200 text-text2 hover:border-gray-300'
                                        }`}
                                >
                                    <LuBriefcase className="w-5 h-5" />
                                    <span>Office</span>
                                </button>
                            </div>
                        </div>

                        {/* Default Shipping */}
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                            <input
                                type="checkbox"
                                name="defaultShipping"
                                id="defaultShipping"
                                checked={formData.defaultShipping}
                                onChange={handleInputChange}
                                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                            />
                            <label htmlFor="defaultShipping" className="text-sm font-medium text-text2 cursor-pointer">
                                Set as default shipping address
                            </label>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3 pt-4">
                            <button
                                type="submit"
                                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                Save Address
                            </button>
                            <Button
                                onClick={() => {
                                    setaddressFormEdit(false);
                                    setStoreAddressId(null);
                                    setFormData({
                                        name: "",
                                        phone: "",
                                        region: "",
                                        city: "",
                                        district: "",
                                        address: "",
                                        landmark: "",
                                        shipTo: "home",
                                        defaultShipping: false
                                    });
                                }}
                                value='Cancel'
                                bg='btn2'
                                style='base'
                                size='md'
                            />
                        </div>
                    </div>
                </form>
            </div>
        );
    }

    // Show Address List
    return (
        <div>
            <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
                <div className="flex items-center gap-3">
                    <LuArrowLeft size={24} onClick={() => setIsSidebarOpen(true)} className='lg:hidden cursor-pointer' />
                    <h2 className="text-2xl font-bold text-text2">Address Book</h2>
                </div>
                <Button value='+ Add New Address' bg='btn2' style='base' size='md' onClick={() => setAddressFormOpen(true)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user?.addresses?.map((address) => (
                    <div
                        key={address._id}
                        className="bg-primary rounded p-4"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-text2">{address?.shipTo}</h3>
                                {address?.defaultShipping && (
                                    <span className="text-xs bg-secondary1 text-secondary2 px-2 py-0.5 rounded-full font-semibold">
                                        Default
                                    </span>
                                )}
                            </div>
                            <LuMapPin className="w-5 h-5 text-blue-600" />
                        </div>
                        <p className="text-sm text-text2 font-medium mb-1">
                            {address.name} | {address.phone}
                        </p>
                        <p className="text-sm text-text1 mb-1">
                            {address?.address}, {address?.city}, {address?.region} - {address?.district}
                        </p>
                        <p className="text-sm text-text1 mb-3">
                            {address?.landmark}
                        </p>
                        <div className="flex gap-3">
                            <button className="text-sm cursor-pointer text-blue-600 hover:text-blue-700 font-semibold" onClick={() => openEditForm(address?._id)}>
                                <LuPencil size={18} />
                            </button>
                            <button className="text-sm cursor-pointer text-red-600 hover:text-red-700 font-semibold" onClick={() => deleteAddressHandler(address._id)}>
                                <LuTrash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Address