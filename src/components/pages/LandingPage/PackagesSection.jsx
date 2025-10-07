import React, { useState } from 'react';
import PlanCard from './PlanCard';
import AgentPlanCards from './AgentPlanCards';

const PackagesSection = () => {
  const [cardActiveTab, setcardActiveTab] = useState("individual");

  return (
    <section id="packages" className="py-16 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-white relative">
      {/* Section Title */}
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-['Poppins'] bg-gradient-to-r from-[#FF59B6] to-[#CB3B8B] text-transparent bg-clip-text pb-2 leading-tight">
            Packages & Pricing
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-[#6D6E6F] mt-4 max-w-2xl mx-auto px-4">
            Choose a plan that fits your needs and start your journey toward a blessed union.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <button
            className={`py-2 px-4 sm:px-6 text-xs sm:text-sm font-semibold rounded-full shadow-md transition-all ${
              cardActiveTab === "individual"
                ? "bg-gradient-to-r from-[#EE68B3] to-[#FF8DCD] text-white"
                : "bg-gray-200 text-gray-600"
            }`}
            onClick={() => setcardActiveTab("individual")}
          >
            Individual
          </button>
          {/* Uncomment when agent plans are ready
          <button
            className={`py-2 px-6 text-sm font-semibold rounded-full shadow-md transition-all ${
              cardActiveTab === "agent"
                ? "bg-gradient-to-r from-[#EE68B3] to-[#FF8DCD] text-white"
                : "bg-gray-200 text-gray-600"
            }`}
            onClick={() => setcardActiveTab("agent")}
          >
            Agent
          </button>
          */}
        </div>

        {/* Plans Display */}
        <div className="flex flex-col items-center pt-8 md:pt-16">
          {cardActiveTab === "agent" ? <AgentPlanCards /> : <PlanCard />}
        </div>
      </div>
    </section>
  );
};

export default PackagesSection;

