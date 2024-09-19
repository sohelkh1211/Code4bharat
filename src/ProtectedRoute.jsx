import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { token, user, admin } from "./actions"
import toast from "react-hot-toast"
import { Navigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import Access from './Access';

const ProtectedRoute = ({ children, allowedRole }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const new_token = useSelector((state) => state.token.value);

    useEffect(() => {
        const fetchProtectedData = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/auth/protected', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                });

                const data = await response.json();

                if (response.status === 200) {
                    dispatch(token(data.token));
                } else {
                    toast.error(data.message);
                }

                let role = jwtDecode(data.token).role;

                if (role === 'user') {
                    const user_details = JSON.parse(localStorage.getItem('user'));
                    dispatch(user(user_details));
                }
                else {
                    const admin_details = JSON.parse(localStorage.getItem('admin'));
                    dispatch(admin(admin_details));
                }

            } catch (error) {
                console.log(error);
                return <Navigate to='/' />;
            } finally {
                setLoading(false);
            }
        }

        if (!new_token) {
            fetchProtectedData();
        } else {
            setLoading(false);
        }
    }, [new_token, dispatch]);

    if (loading) {
        return <div className="flex w-fit mx-auto mt-40 text-black text-[30px]">Loading...</div>
    }

    if (new_token) {
        const decoded = jwtDecode(new_token);
        var role = decoded.role;
    }

    if (!new_token) {
        return <Navigate to='/' />;
    }

    if(allowedRole !== role) {
        return <Access role={role} />;
    }

    return children;

}

export default ProtectedRoute
