import React, { useState, useEffect } from 'react';

const TestimonialsSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const testimonials = [
    {
      quote: "This platform brought us together, and we couldn't be happier!",
      name: "Aisha & Zaid",
      profession: "Software Engineer & Doctor"
    },
    {
      quote: "Thank you for creating such an amazing platform.",
      name: "Fatima & Ahmed",
      profession: "Teacher & Accountant"
    },
    {
      quote: "The features made everything easy. Highly recommended!",
      name: "Sarah & Yusuf",
      profession: "Designer & Entrepreneur"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const StarRating = ({ rating }) => (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, index) => (
        <svg
          key={index}
          className={`w-5 h-5 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  );

  return (
    <section id="reviews" className="relative bg-white py-16 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-['Poppins'] text-[#6D6E6F]">
            What Our Users Say
          </h2>
          <p className="mt-4 text-sm sm:text-base md:text-lg lg:text-xl font-medium text-[#EC80BC] max-w-2xl mx-auto">
            Hear from happy couples who found their destinies with us.
          </p>
        </div>

        {/* Testimonial Slider - Desktop View */}
        <div className="hidden md:block relative overflow-hidden py-20">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {testimonials.map((testimonial, index) => (
              <div key={index} className="flex-shrink-0 w-full md:w-1/3 px-4">
                <TestimonialCard testimonial={testimonial} />
              </div>
            ))}
          </div>

          {/* Dots */}
          <div className="flex justify-center mt-8 gap-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide ? "bg-[#6D6E6F] w-8" : "bg-gray-300"
                }`}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Testimonial Cards - Mobile View (Stacked) */}
        <div className="md:hidden space-y-8 py-12">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

const TestimonialCard = ({ testimonial }) => (
  <div className="relative bg-white p-6 rounded-lg overflow-visible shadow-lg hover:shadow-xl transition-shadow duration-300">
    {/* Profile Picture */}
    <div className="absolute left-6 -top-12 w-20 h-20 rounded-full overflow-hidden border-4 border-[#6D6E6F] bg-gradient-to-br from-[#FF59B6] to-[#CB3B8B]">
      <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
        {testimonial.name.charAt(0)}
      </div>
    </div>

    {/* Comment Section */}
    <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-12 mb-4 italic">
      "{testimonial.quote}"
    </p>

    {/* Horizontal Line */}
    <hr className="my-4 border-gray-200" />

    {/* Name & Profession and Rating */}
    <div className="flex justify-between items-center flex-wrap gap-3">
      {/* Name and Profession */}
      <div>
        <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-[#6D6E6F]">
          {testimonial.name}
        </h4>
        <p className="text-xs sm:text-sm text-gray-500">
          {testimonial.profession}
        </p>
      </div>

      {/* Star Rating */}
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, index) => (
          <svg
            key={index}
            className={`w-4 h-4 sm:w-5 sm:h-5 ${index < 4 ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        ))}
      </div>
    </div>
  </div>
);

export default TestimonialsSection;

