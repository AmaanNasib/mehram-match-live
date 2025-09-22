import React from "react";
import DashboardLayout from "../UserDashboard/DashboardLayout";

const PremiumPlans = () => {
  const plans = [
    {
      name: "Basic",
      description: "Monthly Charge",
      price: "Free",
      features: [
        "Free Setup",
        "Bandwidth Limit 10 GB",
        "20 User Connection",
        "Analytics Report",
        "Public API Access",
        "Plugins Intregation",
        "Custom Content Management",
      ],
      isHighlighted: false,
    },
    {
      name: "Standard",
      description: "Monthly Charge",
      price: "Free",
      features: [
        "Free Setup",
        "Bandwidth Limit 10 GB",
        "20 User Connection",
        "Analytics Report",
        "Public API Access",
        "Plugins Intregation",
        "Custom Content Management",
      ],
      isHighlighted: false,
    },
    {
      name: "Premium",
      description: "Monthly Charge",
      price: "₹1500",
      features: [
        "Free Setup",
        "Bandwidth Limit 10 GB",
        "20 User Connection",
        "Analytics Report",
        "Public API Access",
        "Plugins Intregation",
        "Custom Content Management",
      ],
      isHighlighted: false,
    },
  ];

  return (
     <DashboardLayout>
   <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-3"> {/* Container with max width */}
   <h1 className="mt-3">Pricing</h1>
   <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch"> {/* Reduced gap */}
      {plans.map((plan, index) => (
        <div
          key={index}
          className={`flex flex-col p-4 rounded-2xl border-2 h-full
          ${
            plan.isHighlighted
              ? "border-[#fff] scale-105 shadow-xl bg-gradient-to-tr from-[#FF7CC5] to-[#FFBAE0] text-white"
              : "border-[#fff] text-[#9E286A] bg-white shadow-lg"
          }`}
        >
          {/* Card Header - Fixed Height */}
          <div className="h-12 mb-4">
            <h3
              className={`text-2xl font-bold text-center ${
                plan.isHighlighted ? "text-white" : "text-[#121212]"
              }`}
            >
              {plan.name}
            </h3>
            <p
              className={`text-sm mt-2 text-center ${
                plan.isHighlighted ? "text-white" : "text-[#374151]"
              }`}
            >
              {plan.description}
            </p>
          </div>

          {/* Price - Fixed Height */}
          <div
            className={`text-3xl font-bold text-center h-14 mb-2 ${
              plan.isHighlighted ? "text-white" : "text-[#FF59B6]"
            }`}
          >
            {plan.price}
            <span
              className={`text-lg font-medium ml-1 ${
                plan.isHighlighted ? "text-white" : "text-[#9E286A]"
              }`}
            >
            </span>
          </div>

          {/* Features - Flexible Space */}
          <ul className={`flex-grow space-y-2 text-sm px-2 ${
  plan.isHighlighted ? "text-white" : "text-[#121212]"
}`}>
  {plan.features.map((feature, i) => (
    <li 
      key={i} 
      className={`flex items-center w-full p-2 rounded-lg ${
        i % 5 === 0 
          ? plan.isHighlighted 
            ? "bg-white/10"  // Light highlight for featured plan
            : "bg-gray-100"  // Light gray for regular plan
          : plan.isHighlighted
            ? "bg-white/20"  // Darker highlight for featured plan
            : "bg-gray-200"  // Darker gray for regular plan
      }`}
    >
      <svg
        className={`w-4 h-4 mr-2 flex-shrink-0 ${
          plan.isHighlighted 
            ? "text-white" 
            : i % 2 === 0 
              ? "text-gray-600"  // Darker arrow for light bg
              : "text-gray-500"   // Lighter arrow for dark bg
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
      <span className={`text-sm ${
        plan.isHighlighted 
          ? "text-white" 
          : i % 2 === 0 
            ? "text-gray-900" 
            : "text-gray-800"
      }`}>
        {feature}
      </span>
    </li>
  ))}
</ul>

          {/* Button - Fixed Position at Bottom */}
          <div className="pt-4">
          <button
    className={`w-full py-3 px-6 text-sm font-semibold rounded-full border-2 transition-all
      ${
        plan.isHighlighted
          ? "border-white text-white bg-transparent hover:bg-white hover:text-[#FF59B6]"
          : "border-[#FF59B6] text-[#9E286A] bg-transparent hover:bg-gradient-to-r hover:from-[#EE68B3] hover:to-[#FF8DCD] hover:text-white hover:border-transparent"
      }`}
  >
    Get Started
  </button>
            <div className="text-center mt-2">
    <a 
      href="#" 
      className="text-sm text-[#000000] hover:text-[#333333] underline underline-offset-4"
    >
       Start Your 30 Day Free Trial
    </a>
  </div>
          </div>
        </div>
      ))}
    </div>
    </div>
    </DashboardLayout>
  );
};

export default PremiumPlans;