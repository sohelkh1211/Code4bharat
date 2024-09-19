import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { user, token } from "../actions";
import { useSelector, useDispatch } from 'react-redux';
import toast from "react-hot-toast";
import 'primeicons/primeicons.css';

import { db } from "../firebase";
import { ref as dbRef, get } from "firebase/database";

const Login = () => {
    const user_details = useSelector((state) => state.user); // Global state variable for storing user details

    const dispatch = useDispatch();

    const navigate = useNavigate();
    const [userCredentials, setUserCredentials] = useState({
        email: '',
        password: ''
    });

    const [show, setShow] = useState(false);

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
        const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

        if (!userCredentials.email) {
            newErrors.email = 'Email is required';
        }
        if (!userCredentials.password) {
            newErrors.password = 'Password is required';
        }
        if (!emailRegex.test(userCredentials.email)) {
            newErrors.email = 'Please Enter valid E-mail';
        }
        setErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
            try {
                const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${import.meta.env.VITE_API_KEY}`, {
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
                    const backendResponse = await fetch('http://localhost:3000/api/auth/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ id: data.localId }),
                        credentials: 'include' // It allows backend to set token as cookie
                    });

                    if (backendResponse.ok) {
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

                const userRef = dbRef(db, `UserData/${data.localId}`);
                const snapshot = await get(userRef);
                let res = await snapshot.val();

                dispatch(user({ id: data.localId, name: res.name, email: data.email, links: res?.links ? res.links : [] }));

                localStorage.setItem('user', JSON.stringify({ id: data.localId, name: res.name, email: data.email, links: res?.links ? links : [] }));

                dispatch(token(data.idToken));
                toast.success('LoggedIn Successful');
                navigate('/user/profile', { replace: true });
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
                <input type="email" name="email" placeholder="Email *" onChange={handleInputChange} className={`outline-none w-80 caret-slate-400 p-2 border-[1.5px] ${errors.email ? 'border-red-500' : 'border-slate-400'} focus:border-green-600 rounded-md`} />
                {errors.email && <span className="absolute mt-[39px] text-[12px] text-red-500">{errors.email}</span>}

                <input type={`${show ? 'text' : 'password'}`} name="password" placeholder="Password *" onChange={handleInputChange} className={`outline-none w-80 caret-slate-400 p-2 border-[1.5px] ${errors.password ? 'border-red-500' : 'border-slate-400'} focus:border-green-600 rounded-md`} />
                {errors.password && <span className="absolute mt-[96px] text-[12px] text-red-500">{errors.password}</span>}
                {show ? <i className="absolute mt-[73px] ml-[290px] text-slate-400 pi pi-eye cursor-pointer" onClick={() => setShow(!show)} /> : <i className="absolute mt-[73px] ml-[290px] text-slate-400 pi pi-eye-slash cursor-pointer" onClick={() => setShow(!show)} />}

                <input type="submit" value="Login" className="bg-emerald-400 text-slate-800 p-2 rounded-md cursor-pointer" />
            </form>
            <p className="mt-2 text-[14px] text-slate-600">New user? <a href="/user/signup" className="underline text-blue-600">Signup</a></p>
        </div>
    )
}

export default Login