import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { admin, token } from "../actions";

import toast from "react-hot-toast";

const Admin_login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const new_admin = useSelector((state) => state.admin);

    const [userCredentials, setUserCredentials] = useState({
        secret_key: '',
        password: ''
    });
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserCredentials({
            ...userCredentials,
            [name]: value
        });

        setErrors({
            ...errors,
            [name]: ''
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};

        if (!userCredentials.secret_key) {
            newErrors.secret_key = 'Secret key is required';
        }
        if (!userCredentials.password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            try {
                const response = await fetch('http://localhost:3000/api/auth/admin_login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userCredentials),
                    credentials: 'include'
                });
                const data = await response.json();

                if (response.status === 401) {
                    return toast.error(data.message);
                }

                // Store admin's credential in React Redux memory
                dispatch(admin({ ...new_admin, name: data.admin.name, email: data.admin.email }));

                // Store admin's token in React Redux memory to authenticate admin when page reloads or user tries to access protective route
                dispatch(token(data.token));

                // Store list of registered users in the system or database
                dispatch(fetch_users(data.users));

                // Store non-confidential data in local storage to ensure no lose of data
                localStorage.setItem('admin', JSON.stringify({ name: data.admin.name, email: data.admin.email }));

                localStorage.setItem('users_list', JSON.stringify(data.users));

                toast.success(`Welcome ${data.admin.name}`);

                navigate('/admin/profile', { replace: true });

            } catch (error) {
                toast.error(error.message);
            }
        }
    }

    return (
        <div className='flex flex-col items-center p-6 w-fit mt-32 mx-auto border rounded-md'>
            <h1 className="text-[28px]">LogIn</h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-y-4 mt-6 ">
                <input type="text" name="secret_key" placeholder="Secret Key *" onChange={handleInputChange} className={`outline-none w-80 caret-slate-400 p-2 border-[1.5px] ${errors.secret_key ? 'border-red-500' : 'border-slate-400'} focus:border-emerald-500  rounded-md`} />
                {errors.secret_key && <span className="absolute mt-[41px] text-[12px] text-red-500">{errors.secret_key}</span>}
                <input type="password" name="password" placeholder="Password *" onChange={handleInputChange} className={`outline-none w-80 caret-slate-400 p-2 border-[1.5px] ${errors.password ? 'border-red-500' : 'border-slate-400'} focus:border-emerald-500 rounded-md`} />
                {errors.password && <span className="absolute mt-[99px] text-[12px] text-red-500">{errors.password}</span>}
                {/* <input type="text" name="secret_key" placeholder="Secret Key *" className={`outline-none w-80 caret-slate-400 p-2 border-[1.5px] ${ errors.secret_key ? 'border-red-500' : 'border-slate-400' } focus:border-emerald-500 rounded-md`} /> */}
                <input type="submit" value="Login" className="bg-emerald-400 hover:scale-[104%] hover:text-[18px] text-slate-800 p-2 rounded-md cursor-pointer" />
            </form>
        </div>
    )
}

export default Admin_login