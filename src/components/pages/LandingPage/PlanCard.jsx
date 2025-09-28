import React from "react";

const PlanCard = () => {
  const plan = {
    name: "Standard Plan",
    description: "Enjoy core features at no cost",
    price: "Free",
    features: [
      "Browse profiles",
      "Basic recommendations",
      "Community support",
    ],
  };

  return (
    <div className="px-4 sm:px-8 lg:px-12 flex justify-center">
      <div
        className={
          "flex flex-col p-8 rounded-2xl border-2 h-full max-w-md w-full " +
          "border-[#FFC1E4] text-[#9E286A] bg-white shadow-xl"
        }
      >
        {/* Card Header - Fixed Height */}
        <div className="h-24 mb-4">
          <h3 className="text-2xl font-bold text-center text-[#9E286A]">
            {plan.name}
          </h3>
          <p className="text-sm mt-2 text-center text-[#EC80BC]">
            {plan.description}
          </p>
        </div>

        {/* Price - Fixed Height */}
        <div className="text-5xl font-bold text-center h-20 mb-6 text-[#E64BA1]">
          {plan.price}
          <span className="text-lg font-medium ml-1 text-[#9E286A]">/month</span>
        </div>

        {/* Features - Flexible Space */}
        <ul className="flex-grow space-y-3 text-sm px-2 text-[#9E286A]">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-start">
              <svg
                className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0 text-[#FF59B6]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {feature}
            </li>
          ))}
        </ul>

        {/* Button - Fixed Position at Bottom */}
        <div className="mt-6 pt-4">
          <button
            disabled
            className={
              "w-full py-3 px-6 text-sm font-semibold rounded-full shadow-md transition-all " +
              "bg-gradient-to-r from-[#EE68B3] to-[#FF8DCD] text-white " +
              "opacity-60 cursor-not-allowed hover:shadow-none"
            }
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlanCard;