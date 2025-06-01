import React from "react";
import dp_image from "../../images/dp_image.png";
import { useNavigate } from "react-router-dom";
import StepTracker from "../StepTracker/StepTracker";

const ProfileSection = ({userName , userProfession}) => {
    const navigate = useNavigate();
  return (
    <>
      {/* Profile Section */}
      <div className="h-[auto]] p-2 bg-white flex flex-col gap-2.5">
        {/* Cover Section */}
        

        <div className="h-[100px] rounded-lg bg-gradient-to-r from-[#ffe0f5] to-[#ffa6e1]">
          {" "}

        
        </div>
        <button
            type="button"
            className="w-[100px] text-white px-4 py-2 rounded-md bg-gradient-to-r from-[#833E8D] to-[#FF59B6] shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() => navigate(-1)}
          >
            Back
          </button>

        {/* Profile Details Section */}
        <div className="flex items-center p-4">
          {/* Display Picture */}
          <div
            className="w-24 h-24 bg-gray-300 rounded-md"
            style={{
              backgroundImage: `url(${dp_image})`,
              backgroundPosition: "center",
              backgroundSize: "100%",
            }}
          ></div>

          {/* User Info */}
          <div className="ml-4">
            <h2 className="text-[20px] font-medium leading-tight ">
             {userName}
            </h2>
            <p className="text-[16px] font-normal text-gray-600 leading-tight mb-4 ">
            {userProfession}
            </p>

            {/* Action Buttons */}
            <div className="flex space-x-4 mt-2">
              <button className="button_base p-2 bg-gray-200 rounded-full">
                Show Intrest
              </button>

              <button className=" profile_btn p-2 bg-gray-200 rounded-full">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.41331 13.8733C8.18665 13.9533 7.81331 13.9533 7.58665 13.8733C5.65331 13.2133 1.33331 10.46 1.33331 5.79332C1.33331 3.73332 2.99331 2.06665 5.03998 2.06665C6.25331 2.06665 7.32665 2.65332 7.99998 3.55998C8.67331 2.65332 9.75331 2.06665 10.96 2.06665C13.0066 2.06665 14.6666 3.73332 14.6666 5.79332C14.6666 10.46 10.3466 13.2133 8.41331 13.8733Z"
                    stroke="#CB3B8B"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>

              <button className="profile_btn p-2 bg-gray-200 rounded-full">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.66663 7H10.3333"
                    stroke="#CB3B8B"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M4.66671 12.2867H7.33337L10.3 14.26C10.74 14.5533 11.3334 14.24 11.3334 13.7067V12.2867C13.3334 12.2867 14.6667 10.9533 14.6667 8.95333V4.95333C14.6667 2.95333 13.3334 1.62 11.3334 1.62H4.66671C2.66671 1.62 1.33337 2.95333 1.33337 4.95333V8.95333C1.33337 10.9533 2.66671 12.2867 4.66671 12.2867Z"
                    stroke="#CB3B8B"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileSection;
