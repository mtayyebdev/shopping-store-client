import React, { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import {
    LuArrowLeft
} from "react-icons/lu";
import { Button, Input } from '../../components/index.js';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';


function Profile() {
    const { user } = useSelector((state) => state.userSlice);

    const { setIsSidebarOpen } = useOutletContext()
    const [name, setname] = useState(user?.name)
    const [email, setemail] = useState(user?.email)
    const [phone, setphone] = useState(user?.phone)
    const [gender, setgender] = useState(user?.gender)
    const [dateOfBirth, setdateOfBirth] = useState(user?.birthDay);
    const [avatar, setavatar] = useState(user?.avatar?.url || "/avatar.png");

    // Password states
    const [currentPassword, setcurrentPassword] = useState("");
    const [newPassword, setnewPassword] = useState("");
    const [confirmNewPassword, setconfirmNewPassword] = useState("");

    const updateProfileHandler = async () => {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append('gender', gender);
        formData.append('birthDay', dateOfBirth);
        if (avatar && typeof avatar !== 'string') {
            formData.append('image', avatar);
        }

        try {
            const res = await axios.patch(`${import.meta.env.VITE_SERVER_URL}/api/auth/update-profile`, formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            if (res.status === 200) {
                toast.success(res.data.message);
            }
        } catch (error) {
            if (error.status === 500) {
                console.log("Something went wrong!");
            } else {
                console.log(error.response?.data?.message);
            }
        }
    }

    const updatePassword = async () => {
        if (newPassword !== confirmNewPassword) {
            toast.error("New password and confirm new password do not match!");
            return;
        }

        try {
            const res = await axios.patch(`${import.meta.env.VITE_SERVER_URL}/api/auth/update-password`, {
                oldPassword:currentPassword,
                newPassword
            }, {
                withCredentials: true
            });

            if (res.status === 200) {
                toast.success(res.data?.message);
                // Clear password fields
                setcurrentPassword("");
                setnewPassword("");
                setconfirmNewPassword("");
            }
        } catch (error) {
            if (error.status === 500) {
                console.log("Something went wrong!");
            } else {
                toast.error(error.response?.data?.message);
            }
        }
    }

    return (
        <div>

            <div className="flex items-center gap-3 mb-6">
                <LuArrowLeft size={24} onClick={() => setIsSidebarOpen(true)} className='lg:hidden' />
                <h2 className="text-2xl font-bold text-text2">My Profile </h2>
            </div>

            <div className="bg-primary rounded p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="img">
                        <div className="mt-4">
                            <img src={typeof avatar === 'string' ? avatar : URL.createObjectURL(avatar)} alt="avatar" className='w-32 h-32 object-cover rounded-full' />
                        </div>
                        <label className="text-sm font-semibold text-text2 block mb-2" htmlFor='avatar'>Profile Picture</label>
                        <input
                            type="file"
                            id='avatar'
                            name='avatar'
                            accept='image/*'
                            onChange={(e) => {
                                setavatar(e.target.files[0]);
                            }}
                            className="outline-none border border-gray-500 w-full focus:border-blue-500 focus:ring-2 ring-blue-500 transition-all text-base p-2 rounded-lg"
                        />
                    </div>
                    <Input
                        label={true}
                        labelText='Full Name'
                        name='name'
                        size='xl'
                        type='text'
                        placeholder='Your Name'
                        value={name}
                        onChange={(e) => setname(e.target.value)}
                    />
                    <Input
                        label={true}
                        labelText='Email Address'
                        name='email'
                        size='xl'
                        type='email'
                        placeholder='Your Email'
                        value={email}
                        onChange={(e) => setemail(e.target.value)}
                    />
                    <Input
                        label={true}
                        labelText='Phone Number'
                        name='phone'
                        size='xl'
                        type='tel'
                        placeholder='Your Phone Number'
                        value={phone}
                        onChange={(e) => setphone(e.target.value)}
                    />

                    <div>
                        <label className="text-sm font-semibold text-text2" htmlFor='gender'>
                            Gender
                        </label>
                        <select
                            value={gender}
                            id='gender'
                            name='gender'
                            onChange={(e) => setgender(e.target.value)}
                            className="outline-none mt-1 border border-gray-500 w-full focus:border-blue-500 focus:ring-2 ring-blue-500 transition-all text-base p-2 rounded-lg"
                        >
                            <option value='male'>Male</option>
                            <option value="female">Female</option>
                            <option value="other" defaultChecked={true}>Other</option>
                        </select>
                        <h3 className='text-base mt-1 font-semibold'>Your current gender: {gender}</h3>
                    </div>
                    <div>
                        <Input
                            label={true}
                            labelText='Date of Birth'
                            name='dob'
                            size='xl'
                            type='date'
                            placeholder='Your DOB'
                            value={dateOfBirth}
                            onChange={(e) => setdateOfBirth(e.target.value)}
                        />
                        <h3 className='text-base mt-1 font-semibold'>Your current DOB: {dateOfBirth || "Not set"}</h3>
                    </div>
                </div>
                <div className="mt-6">
                    <Button value='Save Changes' bg='btn2' size='md' style='base' onClick={updateProfileHandler} />
                </div>
            </div>
            <div className="bg-primary p-4 mt-4">
                <h2 className="text-2xl font-bold text-text2 mb-4">Update Password</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                        label={true}
                        labelText='Current Password'
                        name='currentPassword'
                        size='xl'
                        type='password'
                        placeholder='Your Current Password'
                        value={currentPassword}
                        onChange={(e) => setcurrentPassword(e.target.value)}
                    />
                    <Input
                        label={true}
                        labelText='New Password'
                        name='newPassword'
                        size='xl'
                        type='password'
                        placeholder='Your New Password'
                        value={newPassword}
                        onChange={(e) => setnewPassword(e.target.value)}
                    />
                    <Input
                        label={true}
                        labelText='Confirm New Password'
                        name='confirmNewPassword'
                        size='xl'
                        type='password'
                        placeholder='Confirm Your New Password'
                        value={confirmNewPassword}
                        onChange={(e) => setconfirmNewPassword(e.target.value)}
                    />
                </div>
                <div className="mt-6">
                    <Button value='Update Password' bg='btn2' size='md' style='base' onClick={updatePassword} />
                </div>
            </div>
        </div>
    );
}

export default Profile