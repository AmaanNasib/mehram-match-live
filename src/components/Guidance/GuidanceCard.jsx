import React from 'react'
import image01 from "../../images/img1.jpg"
import { useNavigate } from 'react-router-dom'

const GuidanceCard = ({data} ) => {
    
    const navigate = useNavigate();

    const showBlog =()=>{
        const title =data.title
        navigate(`/blogpage?title=${encodeURIComponent(title)}`);

    }

    
    return (
        <>
            <div onClick={()=> showBlog() } className="h-auto w-full max-w-sm mx-auto sm:max-w-none overflow-hidden font-sans text-gray-800 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer">

                <div className="w-full h-48 sm:h-56 md:h-64 lg:h-72 rounded-t-xl relative overflow-hidden flex justify-center items-center text-lg text-gray-600 bg-cover bg-center"
                    style={{ backgroundImage: `url(${image01})` }}
                >
                    <div className="h-24 sm:h-32 md:h-36 lg:h-40 w-32 sm:w-40 md:w-44 lg:w-48 transform rotate-[65deg] bg-[#F998CE] opacity-40 absolute -bottom-6 sm:-bottom-8 md:-bottom-10 lg:-bottom-12 right-0 blur-2xl"></div>
                </div>

                <div className="w-full h-full p-4 sm:p-5 md:p-6">
                    <h4 className="text-lg sm:text-xl md:text-xl font-bold mt-2 sm:mt-3 mb-2 sm:mb-3 text-[#EA57A9] leading-tight line-clamp-2">{data.title}</h4>

                    <h5 className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 flex items-center gap-2">
                        <span className="text-[#FF59B6]">📅</span>
                        {data.date} | <span className="text-[#FF59B6]">⏱️</span> {data.readTime}
                    </h5>

                    <p className="text-xs sm:text-sm md:text-sm text-gray-700 leading-relaxed mb-4 line-clamp-3">{data.description}</p>
                    
                    <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm text-[#FF59B6] font-medium">Read More →</span>
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-[#FF59B6] rounded-full"></div>
                            <div className="w-2 h-2 bg-[#FF59B6] rounded-full"></div>
                            <div className="w-2 h-2 bg-[#FF59B6] rounded-full"></div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default GuidanceCard