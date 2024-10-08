import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { admin, token } from "../actions";
import toast from "react-hot-toast";

import { adminDB } from "../firebase";
import { ref as dbRef, get } from "firebase/database";

const Admin_login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const new_admin = useSelector((state) => state.admin);
    const [show, setShow] = useState(false);

    const [userCredentials, setUserCredentials] = useState({
        email: '',
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

        if (!userCredentials.email) {
            newErrors.email = 'Email is required';
        }
        if (!userCredentials.password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            try {
                const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${import.meta.env.VITE_ADMIN_KEY}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userCredentials)
                });
                const data = await response.json();

                // console.log(response);
                // console.log(data);

                if (response.status === 400 || data.error) {
                    toast.error(data.error.message);
                    return;
                }

                try {
                    const backendResponse = await fetch('http://localhost:3000/api/auth/admin_login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ id: data.localId }),
                        credentials: 'include' // It allows backend to set token as cookie
                    });

                    const backendData = await backendResponse.json();

                    if (backendResponse.ok) {
                        dispatch(token(backendData.token));
                        console.log("Cookie set");
                    } else {
                        toast.error("Something went wrong with setting cookie");
                        return;
                    }
                }
                catch (error) {
                    toast.error(error.message || 'Something went wrong');
                    return;
                }

                const adminRef = dbRef(adminDB, `AdminData/${data.localId}`);
                const admin_snapshot = await get(adminRef);
                let admin_res = await admin_snapshot.val();

                dispatch(admin({ id: data.localId, name: admin_res.name, email: data.email, lists: admin_res?.lists ? admin_res.lists : [] }));

                localStorage.setItem('admin', JSON.stringify({ id: data.localId, name: admin_res.name, email: data.email, lists: admin_res?.lists ? lists : [] }));

                toast.success('LoggedIn Successful');
                navigate('/admin/profile', { replace: true });
            }
            catch (error) {
                toast.error(error.message || 'Something went wrong');
            }
        }
    }

    return (
        <div className='flex flex-col items-center p-6 w-fit mt-32 mx-auto border rounded-md'>
            <h1 className="text-[28px]">LogIn</h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-y-4 mt-6 ">
                <input type="text" name="email" placeholder="Email *" onChange={handleInputChange} className={`outline-none w-80 caret-slate-400 p-2 border-[1.5px] ${errors.email ? 'border-red-500' : 'border-slate-400'} focus:border-emerald-500  rounded-md`} />
                {errors.email && <span className="absolute mt-[41px] text-[12px] text-red-500">{errors.email}</span>}


                <input type={`${show ? 'text' : 'password'}`} name="password" placeholder="Password *" onChange={handleInputChange} className={`outline-none w-80 caret-slate-400 p-2 border-[1.5px] ${errors.password ? 'border-red-500' : 'border-slate-400'} focus:border-green-600 rounded-md`} />
                {errors.password && <span className="absolute mt-[96px] text-[12px] text-red-500">{errors.password}</span>}
                {show ? <i className="absolute mt-[73px] ml-[290px] text-slate-400 pi pi-eye cursor-pointer" onClick={() => setShow(!show)} /> : <i className="absolute mt-[73px] ml-[290px] text-slate-400 pi pi-eye-slash cursor-pointer" onClick={() => setShow(!show)} />}
                

                <input type="submit" value="Login" className="bg-emerald-400 active:scale-75 hover:text-[18px] text-slate-800 p-2 rounded-md cursor-pointer" />
            </form>
            <p className="mt-2 text-[14px] text-slate-600">New admin? <a href="/admin/signup" className="underline text-blue-600">Signup</a></p>
        </div>
    )
}

export default Admin_login