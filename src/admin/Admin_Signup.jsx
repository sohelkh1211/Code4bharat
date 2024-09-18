import { useState } from "react";
import document from '../assets/work.png';

const Admin_Signup = () => {
    const [userCredentials, setUserCredentials] = useState({
        name: '',
        email: '',
        password: '',
        confirm_password: '',
        secret_key: ''
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

    const handleSubmit = (e) => {
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
        if (!userCredentials.secret_key) {
            newErrors.secret_key = "Secret key is reuired";
        }
        if (!emailRegex.test(userCredentials.email)) {
            newErrors.email = 'Please Enter valid E-mail';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            console.log("All is well");
        }

    }

    return (
        <>
            <div className="flex flex-row gap-x-4 mt-8 justify-center items-center">
                <img src={document} className="w-12 h-12" />
                <h1 className="text-[26px]">JWT Tutorial</h1>
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

                    <input type="text" name="secret_key" placeholder="Enter Secret Key *" onChange={handleInputChange} className={`outline-none w-80 caret-slate-400 p-2 border-[1.5px] ${errors.secret_key ? 'border-red-500' : 'border-slate-400'} focus:border-emerald-500 rounded-md`} />
                    {errors.secret_key && <span className="absolute mt-[275px] text-[12px] text-red-500">{errors.secret_key}</span>}

                    <input type="submit" value="Continue" className="p-2 hover:scale-[104%] text-slate-700 bg-emerald-400 border rounded-md cursor-pointer" />
                </form>
                <p className="mt-2 text-[14px] text-slate-600 mx-auto">Already have an account? <a href="/admin/login" className="text-blue-600 underline">Login</a></p>
            </div>
        </>
    )
}

export default Admin_Signup
