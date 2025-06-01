import React from 'react'
import { useNavigate } from 'react-router-dom';
const TopBar = () => {
  const navigate = useNavigate();
  const logOut =()=>{
    localStorage.clear();
    navigate("/")

  }
  const userId = localStorage.getItem("userId")
  
  return (
    <>
      {/* Top Bar */}
      <div className="flex gap-4 justify-end items-center h-[60px] w-full bg-white p-4">
      <button type='button' className="text-white px-4 py-2 rounded-md bg-gradient-to-r from-[#833E8D] to-[#FF59B6] shadow-lg hover:shadow-xl transition-all duration-300" onClick={()=>logOut()}>
              Log Out
            </button>
        <svg className=' cursor-pointer ' width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 8C20.6569 8 22 6.65685 22 5C22 3.34315 20.6569 2 19 2C17.3431 2 16 3.34315 16 5C16 6.65685 17.3431 8 19 8Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M14 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V10" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>

        <div className="w-8 h-8 rounded-full bg-gray-200 cursor-pointer" onClick={(e)=>{navigate(`/users/${userId}`)}}></div>
      </div>

    </>
  )
}

export default TopBar