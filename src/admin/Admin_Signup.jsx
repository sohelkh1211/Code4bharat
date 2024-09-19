import { useState } from "react";
import document from '../assets/work.png';
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { adminDB } from "../firebase";
import { ref as dbRef, set } from "firebase/database";

const Admin_Signup = () => {
    const navigate = useNavigate();
    const [userCredentials, setUserCredentials] = useState({
        name: '',
        email: '',
        password: '',
        confirm_password: ''
    });

    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setUserCredentials({
            ...userCredentials,
            [name]: value
        });

        // Clear error when user starts typing
        setErrors({
            ...errors,
            [name]: ''
        })

    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        const newErrors = {};

        if (!userCredentials.name) {
            newErrors.name = 'Name is required';
        }
        if (!userCredentials.email) {
            newErrors.email = 'Email is required';
        }
        if (!userCredentials.password) {
            newErrors.password = 'Password is required';
        }
        if (!userCredentials.confirm_password) {
            newErrors.confirm_password = 'Confirm Password is required';
        }
        if (userCredentials.password !== userCredentials.confirm_password) {
            newErrors.confirm_password = 'Passwords do not match';
        }
        if (!emailRegex.test(userCredentials.email)) {
            newErrors.email = 'Please Enter valid E-mail';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            try {
                const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${import.meta.env.VITE_ADMIN_KEY}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email: userCredentials.email, password: userCredentials.password })
                });

                const data = await response.json();

                const userRef = dbRef(adminDB, `AdminData/${data.localId}`); // To get reference to firebase database with url as "db/UserData/${data.localId}"

                if (response.ok) {
                    try {
                        await set(userRef, {
                            name: userCredentials.name,
                            email: userCredentials.email
                        });
                        toast.success("Registration Successful");
                        navigate("/admin/login");
                    } catch (error) {
                        toast.error(error.message);
                    }
                }

                else {
                    toast.error(data.error.message || "Registration failed");
                }

            }
            catch (error) {
                toast.error(error.message);
            }
        }

    }

    return (
        <>
            <div className="flex flex-row gap-x-4 mt-8 justify-center items-center">
                <img src={document} className="w-12 h-12" />
                <h1 className="text-[26px]">Document Management System</h1>
            </div>
            <div className="flex flex-col w-fit p-6 mt-10 mx-auto border rounded-md">
                <h1 className="text-[22px] mx-auto">Create an account</h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-y-4 mt-6">
                    <input type="text" name="name" placeholder="Name *" onChange={handleInputChange} className={`outline-none w-80 p-2 caret-slate-400 border-[1.5px] ${errors.name ? 'border-red-500' : 'border-slate-400'} focus:border-emerald-500 rounded-md`} />
                    {errors.name && <span className="absolute mt-[41px] text-[12px] text-red-500">{errors.name}</span>}

                    <input type="email" name="email" placeholder="Email *" onChange={handleInputChange} className={`outline-none w-80 p-2 caret-slate-400 border-[1.5px] ${errors.email ? 'border-red-500' : 'border-slate-400'} focus:border-emerald-500 rounded-md`} />
                    {errors.email && <span className="absolute mt-[99px] text-[12px] text-red-500">{errors.email}</span>}

                    <input type="password" name="password" placeholder="Password *" onChange={handleInputChange} className={`outline-none w-80 p-2 caret-slate-400 border-[1.5px] ${errors.password ? 'border-red-500' : 'border-slate-400'} focus:border-emerald-500 rounded-md`} />
                    {errors.password && <span className="absolute mt-[158px] text-[12px] text-red-500">{errors.password}</span>}

                    <input type="password" name="confirm_password" placeholder="Change Password *" onChange={handleInputChange} className={`outline-none w-80 p-2 caret-slate-400 border-[1.5px] ${errors.confirm_password ? 'border-red-500' : 'border-slate-400'} focus:border-emerald-500 rounded-md`} />
                    {errors.confirm_password && <span className="absolute mt-[216px] text-[12px] text-red-500">{errors.confirm_password}</span>}

                    <input type="submit" value="Continue" className="p-2 hover:scale-[104%] text-slate-700 bg-emerald-400 border rounded-md cursor-pointer" />
                </form>
                <p className="mt-2 text-[14px] text-slate-600 mx-auto">Already have an account? <a href="/admin/login" className="text-blue-600 underline">Login</a></p>
            </div>
        </>
    )
}

export default Admin_Signup
