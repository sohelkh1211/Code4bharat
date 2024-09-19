import { useNavigate } from "react-router-dom"

const Access = ({ role }) => {
  const navigate = useNavigate();

  return (
    <div className='flex flex-col items-center gap-y-10 w-[50%] mx-auto mt-40'>
        <h1 className='text-[28px]'>🚫 Oops! You're Not Authorized</h1>
        <p className='text-center'>🔒 It seems like you're trying to access {role === 'user' ? 'a' : 'an'} <span className="font-bold">{role}-only area</span>. Please log in with appropriate credentials. <a className="cursor-pointer text-blue-600 underline" onClick={() => navigate(`/${role === 'user' ? 'admin' : 'user' }/profile`)}>Go to profile</a></p>
    </div>
  )
}

export default Access