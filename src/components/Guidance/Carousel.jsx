import React, { useState, useEffect } from "react";
import "./Carousel.css";
import dua from "../../images/img2.jpg";

const Carousel = ({ offers }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSliding, setIsSliding] = useState(false);

  // Automatically change slides every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 3000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [currentIndex]);

  const handleNext = () => {
    setIsSliding(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === offers.length - 3 ? 0 : prevIndex + 1
      );
      setIsSliding(false);
    }, 300); // Match the animation duration
  };

  const handlePrev = () => {
    setIsSliding(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? offers.length - 3 : prevIndex - 1
      );
      setIsSliding(false);
    }, 300); // Match the animation duration
  };

  const showBlog = () => {
    // Placeholder function for when a card is clicked
    alert("Show Blog");
  };

  return (
    <div className="carousel">
      <div className={`carousel-content ${isSliding ? "slide-right" : ""}`}>
        <div className="carousel-items">
          {offers.slice(currentIndex, currentIndex + 1).map((offer, index) => (
            <div
              key={index}
              onClick={showBlog}
              className="h-full w-full overflow-hidden font-sans text-gray-800 cursor-pointer"
            >
              <div
                className="w-full h-full rounded-xl relative overflow-hidden flex justify-start items-center text-lg text-black-600 bg-cover bg-center hover:scale-105 transition-transform duration-300"
                style={{
                  backgroundImage: `url(${dua})`,
                }}
              >
                {/* Gift Wrapper in Corner */}
                <div className="gift-corner-wrapper">
                  <div className="gift-bow">
                    <div className="bow-left"></div>
                    <div className="bow-center"></div>
                    <div className="bow-right"></div>
                  </div>
                  <div className="gift-box">
                    <span className="gift-text">Featured</span>
                  </div>
                </div>
                
                {/* Overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>
                
                {/* Content Container */}
                <div className="relative z-10 w-full h-full flex items-center">
                  <div className="carousel-content-wrapper mobile-fix">
                    <h4 className="carousel-title">
                      {offer.title}
                    </h4>
                    <h3 className="carousel-description">
                      {offer?.description}
                    </h3>
                    <div className="carousel-meta">
                      <span className="meta-item">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        {offer.readTime}
                      </span>
                      <span className="meta-item">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        {offer.date}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Modern Indicators */}
      <div className="carousel-indicators">
        {offers.slice(0, Math.min(3, offers.length)).map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
