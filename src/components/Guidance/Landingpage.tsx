import React, { useState, useEffect, useRef } from "react";

import Footer from "../sections/Footer";
import Navbar from "../sections/Navbar";
import GuidanceCard from "../Guidance/GuidanceCard";
import ReactPaginate from 'react-paginate';
import Carousel from "./Carousel";


const LandingPage = () => {

  const blogData = [
  {
    image: "../../../images/img1",
    title: "Is celebrating Shab-E Barat Bid’ah?",
    date: "September 13, 2024",
    readTime: "2 Mins Read",
    description: "Exploring the religious and cultural significance of Shab-E Barat in modern times."
  },
  {
    image: "../../../images/img2",
    title: "The Benefits of Regular Exercise",
    date: "October 10, 2024",
    readTime: "3 Mins Read",
    description: "Learn about the physical and mental benefits of maintaining a regular exercise routine."
  },
  {
    image: "https://via.placeholder.com/300",
    title: "Understanding Climate Change",
    date: "November 1, 2024",
    readTime: "5 Mins Read",
    description: "An in-depth look at the causes and effects of global climate change."
  },
  {
    image: "https://via.placeholder.com/300",
    title: "The Art of Mindful Living",
    date: "October 15, 2024",
    readTime: "4 Mins Read",
    description: "Discover how mindfulness can transform your daily life and improve your well-being."
  },
  {
    image: "https://via.placeholder.com/300",
    title: "How to Build Healthy Eating Habits",
    date: "September 25, 2024",
    readTime: "3 Mins Read",
    description: "Practical tips to create sustainable and healthy eating patterns for a better lifestyle."
  },
  {
    image: "https://via.placeholder.com/300",
    title: "Advancements in AI Technology",
    date: "October 20, 2024",
    readTime: "6 Mins Read",
    description: "A look at how artificial intelligence is shaping the future of industries and daily life."
  },
  {
    image: "https://via.placeholder.com/300",
    title: "The Role of Education in Modern Society",
    date: "September 18, 2024",
    readTime: "5 Mins Read",
    description: "Examining how education influences societal growth and personal development."
  },
  {
    image: "https://via.placeholder.com/300",
    title: "Travel on a Budget: Top Tips",
    date: "November 5, 2024",
    readTime: "4 Mins Read",
    description: "Learn how to explore the world without breaking the bank with these travel tips."
  },
  {
    image: "https://via.placeholder.com/300",
    title: "The History of the Internet",
    date: "September 30, 2024",
    readTime: "5 Mins Read",
    description: "A journey through the development and impact of the internet on modern society."
  },
  {
    image: "https://via.placeholder.com/300",
    title: "Improving Your Sleep Quality",
    date: "October 12, 2024",
    readTime: "3 Mins Read",
    description: "Discover the habits and strategies to get a better night's sleep every day."
  },
  {
    image: "https://via.placeholder.com/300",
    title: "The Power of Positive Thinking",
    date: "November 2, 2024",
    readTime: "4 Mins Read",
    description: "How adopting a positive mindset can lead to personal and professional success."
  },
  {
    image: "https://via.placeholder.com/300",
    title: "The Importance of Mental Health Awareness",
    date: "October 8, 2024",
    readTime: "5 Mins Read",
    description: "Understanding the significance of mental health and how to support it in society."
  },
  {
    image: "https://via.placeholder.com/300",
    title: "Top 10 Must-Read Books of 2024",
    date: "September 20, 2024",
    readTime: "4 Mins Read",
    description: "A curated list of books to inspire, educate, and entertain you this year."
  },
  {
    image: "https://via.placeholder.com/300",
    title: "The Future of Renewable Energy",
    date: "November 10, 2024",
    readTime: "6 Mins Read",
    description: "Exploring the advancements and challenges in adopting renewable energy sources."
  },
  {
    image: "https://via.placeholder.com/300",
    title: "How to Stay Productive Working Remotely",
    date: "October 6, 2024",
    readTime: "3 Mins Read",
    description: "Practical advice for maximizing productivity while working from home."
  },
  {
    image: "https://via.placeholder.com/300",
    title: "The Evolution of Music Genres",
    date: "September 28, 2024",
    readTime: "5 Mins Read",
    description: "A dive into the history and transformation of music styles over the decades."
  },
  {
    image: "https://via.placeholder.com/300",
    title: "The Secrets of Successful Entrepreneurs",
    date: "October 18, 2024",
    readTime: "5 Mins Read",
    description: "Insights into the habits and strategies of highly successful entrepreneurs."
  },
  {
    image: "https://via.placeholder.com/300",
    title: "Understanding Cryptocurrency",
    date: "November 8, 2024",
    readTime: "6 Mins Read",
    description: "An introduction to cryptocurrencies and their impact on the financial world."
  },{
    image: "https://via.placeholder.com/300",
    title: "The Secrets of Successful Entrepreneurs",
    date: "October 18, 2024",
    readTime: "5 Mins Read",
    description: "Insights into the habits and strategies of highly successful entrepreneurs."
  },
  {
    image: "https://via.placeholder.com/300",
    title: "Understanding Cryptocurrency",
    date: "November 8, 2024",
    readTime: "6 Mins Read",
    description: "An introduction to cryptocurrencies and their impact on the financial world."
  }
];


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
       
      <Navbar isLogIn={false} setLogin={() => {}} login={false} />

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
