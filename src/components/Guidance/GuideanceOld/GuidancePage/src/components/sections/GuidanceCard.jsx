import React from 'react'
import image01 from "../../../../images/img1.jpg"
import { useNavigate } from 'react-router-dom'

const GuidanceCard = ({data} ) => {
    
    const navigate = useNavigate();

    const showBlog =()=>{
        const title =data.title
        navigate(`/blogpage?title=${encodeURIComponent(title)}`);

    }

    
    return (
        <>
            <div onClick={()=> showBlog() }  className="h-auto w-[300px] overflow-hidden font-sans text-gray-800">

                <div className="w-full h-[370px] rounded-xl relative overflow-hidden flex justify-center items-center text-lg text-gray-600 bg-cover bg-center"
                    style={{ backgroundImage: `url(${image01})` }}
                >
                    <div className="h-[200px] sm:h-[250px] md:h-[275px] w-48 sm:w-56 md:w-60 transform rotate-[65deg] bg-[#F998CE] opacity-40 absolute -bottom-10 sm:-bottom-15 md:-bottom-20 right-0 blur-2xl"></div>
                </div>

                <div className=" w-full h-full pr-2 pl-2 " >
                    <h4 className="text-xl font-bold mt-4 mb-1 text-[#EA57A9]">{data.title}</h4>

                    <h5 className="text-sm text-gray-600 mb-4"> {data.date} |  {data.readTime}</h5>

                    <p className="text-sm text-gray-700 leading-tight mb-4">{data.description}</p>
                </div>



            </div>
        </>
    )
}

export default GuidanceCard