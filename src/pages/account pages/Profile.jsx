import React, { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import {
    LuArrowLeft
} from "react-icons/lu";
import { Button, Input } from '../../components/index.js';


function Profile() {
    const { setIsSidebarOpen } = useOutletContext()
    const [name, setname] = useState("John Doe")
    const [email, setemail] = useState("john.doe@example.com")
    const [phone, setphone] = useState("+91 9876543210")
    const [gender, setgender] = useState("Male")
    const [dateOfBirth, setdateOfBirth] = useState("1990-01-15")

    const [userData] = useState({
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+91 9876543210",
        gender: "Male",
        dateOfBirth: "1990-01-15"
    });
    return (
        <div>

            <div className="flex items-center gap-3 mb-6">
                <LuArrowLeft size={24} onClick={() => setIsSidebarOpen(true)} className='lg:hidden' />
                <h2 className="text-2xl font-bold text-text2">My Profile </h2>
            </div>

            <div className="bg-primary rounded p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            <option value='Male'>Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
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
                </div>
                <div className="mt-6">
                    <Button value='Save Changes' bg='btn2' size='md' style='base'/>
                </div>
            </div>
        </div>
    );
}

export default Profile