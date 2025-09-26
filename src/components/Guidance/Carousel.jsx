import React, { useState, useEffect } from "react";
import "./Carousel.css";
import rightArrow from "../../images/rightArrow.svg";
import leftArrow from "../../images/leftArrow.svg";
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
              className="h-[100%] w-[100%] overflow-hidden font-sans text-gray-800"
            >
              <div
                className="w-full h-[100%] rounded-xl relative overflow-hidden flex justify-lest items-center text-lg text-black-600 bg-cover bg-center hover:scale-100"
                style={{
                  backgroundImage: `url(${dua})`,
                }}
              >
                <div className="heads">
                  <h4 className="text-m font-bold font-['Poppins']  mb-1 text-[#FF59B6] text-[40px] text-spacify bottom-10 w-[40rem] leading-tight m-[1rem] block " style={{ fontFamily: '"Inknut Antiqua", serif' }}>
                    {offer.title}
                  </h4>
                  <h3 className="text-m   mb-1 text-[black] text-[20px] text-spacify  bottom-10  w-[40rem] leading-tight m-[1rem] " style={{ fontFamily: '"Raleway", serif' }}>
                    {offer?.description}
                  </h3>
                </div>
              </div>
            </div>
          ))}
          <div className="crBtn">
            <button className="carousel-btn" onClick={handlePrev}>
              <img src={leftArrow} alt="Previous" />
            </button>
            <button className="carousel-btn" onClick={handleNext}>
              <img src={rightArrow} alt="Next" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carousel;
