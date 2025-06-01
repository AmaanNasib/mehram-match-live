import React from "react";

const AgentPlanCards = () => {
  const plans = [
    {
      name: "Basic Plan",
      description: "For serious commitment",
      price: "₹900",
      features: [
        "Access to 100+ profiles",
        "Personalized recommendations",
        "Dedicated support",
      ],
      isHighlighted: false,
    },
    {
      name: "Standard Plan",
      description: "For serious commitment",
      price: "₹1500",
      features: [
        "Access to all profiles",
        "Personalized recommendations",
        "Priority support",
        "Verified profile badge",
      ],
      isHighlighted: true,
    },
    // {
    //   name: "Premium Plan",
    //   description: "For serious commitment",
    //   price: "₹2200",
    //   features: [
    //     "Access to all profiles",
    //     "Personalized recommendations",
    //     "Dedicated matchmaker",
    //     "Priority support",
    //     "Verified profile badge",
    //   ],
    //   isHighlighted: false,
    // },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 sm:px-8 lg:px-12 items-stretch">
    {plans.map((plan, index) => (
      <div
        key={index}
        className={`flex flex-col p-8 rounded-2xl border-2 h-full
        ${
          plan.isHighlighted
            ? "border-[#FFCEE9] scale-105 shadow-xl bg-gradient-to-tr from-[#FF7CC5] to-[#FFBAE0] text-white"
            : "border-[#FFC1E4] text-[#9E286A] bg-white shadow-lg"
        }`}
      >
        {/* Card Header - Fixed Height */}
        <div className="h-24 mb-4">
          <h3
            className={`text-2xl font-bold text-center ${
              plan.isHighlighted ? "text-white" : "text-[#9E286A]"
            }`}
          >
            {plan.name}
          </h3>
          <p
            className={`text-sm mt-2 text-center ${
              plan.isHighlighted ? "text-white" : "text-[#EC80BC]"
            }`}
          >
            {plan.description}
          </p>
        </div>

        {/* Price - Fixed Height */}
        <div
          className={`text-5xl font-bold text-center h-20 mb-6 ${
            plan.isHighlighted ? "text-white" : "text-[#E64BA1]"
          }`}
        >
          {plan.price}
          <span
            className={`text-lg font-medium ml-1 ${
              plan.isHighlighted ? "text-white" : "text-[#9E286A]"
            }`}
          >
            /month
          </span>
        </div>

        {/* Features - Flexible Space */}
        <ul
          className={`flex-grow space-y-3 text-sm px-2 ${
            plan.isHighlighted ? "text-white" : "text-[#9E286A]"
          }`}
        >
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-start">
              <svg
                className={`w-5 h-5 mr-2 mt-0.5 flex-shrink-0 ${
                  plan.isHighlighted ? "text-white" : "text-[#FF59B6]"
                }`}
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
            className={`w-full py-3 px-6 text-sm font-semibold rounded-full shadow-md transition-all hover:shadow-lg 
              ${
                plan.isHighlighted
                  ? "bg-white text-[#FF59B6] hover:bg-gray-100"
                  : "bg-gradient-to-r from-[#EE68B3] to-[#FF8DCD] text-white hover:from-[#D959A0] hover:to-[#E57EB5]"
              }`}
          >
            Select Plan
          </button>
        </div>
      </div>
    ))}
  </div>


  );
};

export default AgentPlanCards;
