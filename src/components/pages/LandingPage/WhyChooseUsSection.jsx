import React from 'react';

const WhyChooseUsSection = () => {
  const features = [
    {
      title: "Faith-Centered",
      description: "We understand the importance of aligning with Islamic values in your search for a life partner."
    },
    {
      title: "Confidential & Secure",
      description: "Your privacy is our priority. We offer secure communication and profile protection, ensuring a safe and trusted platform for your journey."
    },
    {
      title: "Personalized Matches",
      description: "We use detailed preferences to recommend the best matches tailored to your needs, ensuring compatibility and a meaningful connection."
    },
    {
      title: "Community Support",
      description: "Join a community that supports you in your journey toward a blessed Nikah."
    }
  ];

  return (
    <section id="premium-members" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="container mx-auto">
        <h2 className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-12 lg:mb-20 bg-gradient-to-r from-[#FF59B6] to-[#CB3B8B] text-transparent bg-clip-text">
          Why Choose Us?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="relative bg-[#FFF5FB] rounded-2xl p-6 lg:p-8 flex flex-col justify-end min-h-[200px] md:min-h-[250px] border border-[#898B92] hover:shadow-xl shadow-md transition-all duration-300 transform hover:scale-105"
            >
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-[#FF59B6] to-[#CB3B8B] text-transparent bg-clip-text mb-3">
                {feature.title}
              </h3>
              <p className="text-xs sm:text-sm lg:text-base text-[#EC80BC]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;

