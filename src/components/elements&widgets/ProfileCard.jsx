import React from 'react'
import { useNavigate } from 'react-router-dom'

const ProfileCard = () => {

    const navigate = useNavigate();

    return (
        <>
            <div  onClick={() => navigate("/memprofile") } className=" bg-[#FFF3FA] min-w-[350px] min-h-[150px] h-[150px] rounded-[12px] p-4 flex border-[1px] border-[#FFCCEA] hover:bg-[#ffeff8] transition-all cursor-pointer ">
                <div className=' w-[60px] h-[60px] rounded-full bg-[#fff] flex-shrink-0 '></div>
                <div className='flex flex-col w-full px-6' >
                    <h1 className=' text-lg font-medium '>Affan Shaikh</h1>
                    <div className=' grid grid-rows-2 grid-cols-2 w-full h-auto mt-2 ' >
                        <h4 className=' text-sm font-normal ' >Pune</h4>
                        <h4 className=' text-sm font-normal ' >22</h4>
                        <h4 className=' text-sm font-normal ' >Fair</h4>
                        <h4 className=' text-sm font-normal ' >Single</h4>
                    </div>
                    <div className=' flex gap-4 w-full mt-3 ' >

                        <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.41333 13.8733C8.18666 13.9533 7.81333 13.9533 7.58667 13.8733C5.65333 13.2133 1.33333 10.46 1.33333 5.79332C1.33333 3.73332 2.99333 2.06665 5.04 2.06665C6.25333 2.06665 7.32667 2.65332 8 3.55998C8.67333 2.65332 9.75333 2.06665 10.96 2.06665C13.0067 2.06665 14.6667 3.73332 14.6667 5.79332C14.6667 10.46 10.3467 13.2133 8.41333 13.8733Z" stroke="#CB3B8B" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>

                        <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.3333 13.6667H4.66665C2.66665 13.6667 1.33331 12.6667 1.33331 10.3334V5.66671C1.33331 3.33337 2.66665 2.33337 4.66665 2.33337H11.3333C13.3333 2.33337 14.6666 3.33337 14.6666 5.66671V10.3334C14.6666 12.6667 13.3333 13.6667 11.3333 13.6667Z" stroke="#CB3B8B" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M11.3334 6L9.24668 7.66667C8.56002 8.21333 7.43335 8.21333 6.74668 7.66667L4.66669 6" stroke="#CB3B8B" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>

                        <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.66669 7.33337L14.1334 1.8667" stroke="#CB3B8B" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M14.6667 4.53337V1.33337H11.4667" stroke="#CB3B8B" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M7.33331 1.33337H5.99998C2.66665 1.33337 1.33331 2.66671 1.33331 6.00004V10C1.33331 13.3334 2.66665 14.6667 5.99998 14.6667H9.99998C13.3333 14.6667 14.6666 13.3334 14.6666 10V8.66671" stroke="#CB3B8B" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>





                    </div>
                </div>
            </div>
        </>
    )
}

export default ProfileCard