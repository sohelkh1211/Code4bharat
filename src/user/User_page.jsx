import { useSelector, useDispatch } from "react-redux"

const User_page = () => {
  const dispatch = useDispatch();
  const user_details = useSelector((state) => state.user);
  
  return (
    <div className='flex flex-col w-fit mx-auto mt-10'>
      <h1 className='text-[28px]'>Welcome User</h1>
      
    </div>
  )
}

export default User_page