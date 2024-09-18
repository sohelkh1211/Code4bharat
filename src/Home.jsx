import document from "./assets/work.png"
import man from "./assets/man.png"
import admin from "./assets/protection.png"
import { useNavigate } from "react-router-dom"

const Home = () => {
    const navigate = useNavigate();
    return (
        <>
            <div className="flex flex-row gap-x-4 mt-8 justify-center items-center">
                <img src={document} className="w-12 h-12" />
                <h1 className="text-[26px]">Document Management System</h1>
            </div>
            <div className='flex gap-x-6 mt-32 w-fit mx-auto'>
                <div className="flex flex-col gap-y-2 justify-center items-center px-20 py-10 w-fit hover:bg-cyan-100 border shadow-lg rounded-md cursor-pointer" onClick={() => navigate("/admin/login")}>
                    <img src={admin} className="w-[100px]" />
                    <h1 className=" text-[20px]">Admin</h1>
                </div>
                {/* User */}
                <div className="flex flex-col gap-y-2 justify-center items-center px-20 py-10 w-fit hover:bg-[#ffe9cf] border shadow-lg rounded-md cursor-pointer" onClick={() => navigate("/user/login")}>
                    <img src={man} className="w-[100px]" />
                    <h1 className="text-[20px]">User</h1>
                </div>
            </div>
        </>
    )
}

export default Home