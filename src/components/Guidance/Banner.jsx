import React, { useState } from 'react';

export default function Banner({ blogs }) {
  const [index, setIndex] = useState(0);

  const prevSlide = () => {
    setIndex((prevIndex) => (prevIndex - 1 + blogs.length) % blogs.length);
  };

  const nextSlide = () => {
    setIndex((prevIndex) => (prevIndex + 1) % blogs.length);
  };

  return (
    <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden rounded-xl shadow-lg">
      <img
        src={blogs[index].img}
        alt={blogs[index].title}
        className="w-full h-full object-cover transition duration-500 ease-in-out"
      />

      {/* Overlay Title */}
      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
        <h2 className="text-white text-2xl md:text-4xl font-bold text-center p-4 bg-black/50 rounded-xl">
          {blogs[index].title}
        </h2>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-100 transition duration-200"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-100 transition duration-200"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {blogs.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-2 h-2 rounded-full transition duration-200 ${
              i === index ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
