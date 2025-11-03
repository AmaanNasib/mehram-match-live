import React, { useState, useEffect, useRef } from "react";

import Footer from "../sections/Footer";
import Navbar from "../sections/Navbar";
import GuidanceCard from "../Guidance/GuidanceCard";
import ReactPaginate from 'react-paginate';
import Carousel from "./Carousel";
import { blogData } from "./blogData";


const LandingPage = () => {
  const [login, setLogin] = useState(false);

  // Blog data is now imported from blogData.js


const offers = [
  "50% off on all items!",
  "Buy 1 Get 1 Free!",
  "Limited Time: Free Shipping!",
  "Flash Sale: Up to 70% off!"
];





  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6; 

// Pagination Logic
const pageCount = Math.ceil(blogData.length / itemsPerPage);
 const startOffset = currentPage * itemsPerPage;
 const paginatedData = blogData.slice(
   startOffset,
   startOffset + itemsPerPage
 );

 const handlePageClick = ({ selected }) => {
   setCurrentPage(selected);
 };






  return (
    <>
       
      <Navbar isLogIn={login} setLogin={setLogin} login={login} />

      <div className="relative text-white overflow-hidden bg-gradient-to-r from-white to-pink-100 min-h-screen">

        {/* Guidance Section */}
        <section className="container mx-auto pt-16 sm:pt-20 pb-16 sm:pb-20 px-4 sm:px-6 z-50">

          {/* Section Title */}
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-['Poppins'] bg-gradient-to-r from-[#FF59B6] to-[#CB3B8B] text-transparent bg-clip-text leading-tight">
              Guidance
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 mt-4 max-w-2xl mx-auto px-4">
              Discover Islamic guidance, marriage advice, and spiritual insights for your journey
            </p>
          </div>

          {/* Carousel Section */}
          <div className="mb-12 sm:mb-16">
            <Carousel offers={blogData} />
          </div>

          {/* Blog Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 max-w-7xl mx-auto cursor-pointer">
            {paginatedData.map((item, index) => (
              <GuidanceCard key={index} data={item} />
            ))}
          </div>

        </section>

        {/* Pagination Section */}
        <div className="mb-12 sm:mb-16 mt-8 sm:mt-12 px-4">
          <div className="flex justify-center">
            <ReactPaginate
              previousLabel={"Previous"}
              nextLabel={"Next"}
              breakLabel={"..."}
              pageCount={pageCount}
              marginPagesDisplayed={1}
              pageRangeDisplayed={3}
              onPageChange={handlePageClick}
              containerClassName="pagination-container"
              activeClassName="selected"
              previousClassName="pagination-btn"
              nextClassName="pagination-btn"
              pageClassName="pagination-page"
              breakClassName="pagination-break"
            />
          </div>
        </div>


        <Footer />

      </div>

    </>
  );
};

export default LandingPage;
