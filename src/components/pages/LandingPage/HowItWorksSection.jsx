import React from 'react';

const HowItWorksSection = ({ hero3 }) => {
  const steps = [
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M10.4899 2.23006L5.49991 4.11006C4.34991 4.54006 3.40991 5.90006 3.40991 7.12006V14.5501C3.40991 15.7301 4.18991 17.2801 5.13991 17.9901L9.43991 21.2001C10.8499 22.2601 13.1699 22.2601 14.5799 21.2001L18.8799 17.9901C19.8299 17.2801 20.6099 15.7301 20.6099 14.5501V7.12006C20.6099 5.89006 19.6699 4.53006 18.5199 4.10006L13.5299 2.23006C12.6799 1.92006 11.3199 1.92006 10.4899 2.23006Z" stroke="#D64294" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9.05005 11.8701L10.66 13.4801L14.96 9.18005" stroke="#D64294" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: "Register and Verify",
      description: "Sign up by filling in the registration form and verify your account with OTP."
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M19.86 8.08997C19.86 8.50997 19.83 8.91997 19.78 9.30997C19.32 9.10997 18.82 8.99997 18.29 8.99997C17.07 8.99997 15.99 9.58996 15.32 10.49C14.64 9.58996 13.56 8.99997 12.34 8.99997C10.29 8.99997 8.63 10.67 8.63 12.74C8.63 15.42 10.05 17.47 11.63 18.86C11.58 18.89 11.53 18.9 11.48 18.92C11.18 19.03 10.68 19.03 10.38 18.92C7.79 18.03 2 14.35 2 8.08997C2 5.32997 4.21999 3.09998 6.95999 3.09998C8.58999 3.09998 10.03 3.87997 10.93 5.08997C11.84 3.87997 13.28 3.09998 14.9 3.09998C17.64 3.09998 19.86 5.32997 19.86 8.08997Z" stroke="#D64294" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M21.9999 12.74C21.9999 17.42 17.6699 20.18 15.7299 20.84C15.4999 20.92 15.1299 20.92 14.8999 20.84C14.0699 20.56 12.7999 19.89 11.6299 18.86C10.0499 17.47 8.62988 15.42 8.62988 12.74C8.62988 10.67 10.2899 9 12.3399 9C13.5599 9 14.6399 9.58999 15.3199 10.49C15.9899 9.58999 17.0699 9 18.2899 9C18.8199 9 19.3199 9.11 19.7799 9.31C21.0899 9.89 21.9999 11.2 21.9999 12.74Z" stroke="#D64294" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: "Complete Your Profile",
      description: "Add essential details like preferences, biodata, and photographs to enhance visibility."
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M18.0001 7.16C17.9401 7.15 17.8701 7.15 17.8101 7.16C16.4301 7.11 15.3301 5.98 15.3301 4.58C15.3301 3.15 16.4801 2 17.9101 2C19.3401 2 20.4901 3.16 20.4901 4.58C20.4801 5.98 19.3801 7.11 18.0001 7.16Z" stroke="#D64294" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16.9702 14.44C18.3402 14.67 19.8502 14.43 20.9102 13.72C22.3202 12.78 22.3202 11.24 20.9102 10.3C19.8402 9.59004 18.3102 9.35003 16.9402 9.59003" stroke="#D64294" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5.96998 7.16C6.02998 7.15 6.09998 7.15 6.15998 7.16C7.53998 7.11 8.63998 5.98 8.63998 4.58C8.63998 3.15 7.48998 2 6.05998 2C4.62998 2 3.47998 3.16 3.47998 4.58C3.48998 5.98 4.58998 7.11 5.96998 7.16Z" stroke="#D64294" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6.99994 14.44C5.62994 14.67 4.11994 14.43 3.05994 13.72C1.64994 12.78 1.64994 11.24 3.05994 10.3C4.12994 9.59004 5.65994 9.35003 7.02994 9.59003" stroke="#D64294" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12.0001 14.63C11.9401 14.62 11.8701 14.62 11.8101 14.63C10.4301 14.58 9.33008 13.45 9.33008 12.05C9.33008 10.62 10.4801 9.46997 11.9101 9.46997C13.3401 9.46997 14.4901 10.63 14.4901 12.05C14.4801 13.45 13.3801 14.59 12.0001 14.63Z" stroke="#D64294" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9.08997 17.78C7.67997 18.72 7.67997 20.26 9.08997 21.2C10.69 22.27 13.31 22.27 14.91 21.2C16.32 20.26 16.32 18.72 14.91 17.78C13.32 16.72 10.69 16.72 9.08997 17.78Z" stroke="#D64294" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: "Browse Profiles",
      description: "Explore potential matches based on your preferences. Use filters to refine your search."
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M8.5 19H8C4 19 2 18 2 13V8C2 4 4 2 8 2H16C20 2 22 4 22 8V13C22 17 20 19 16 19H15.5C15.19 19 14.89 19.15 14.7 19.4L13.2 21.4C12.54 22.28 11.46 22.28 10.8 21.4L9.3 19.4C9.14 19.18 8.77 19 8.5 19Z" stroke="#D64294" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7 8H17" stroke="#D64294" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7 13H13" stroke="#D64294" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: "Connect and Communicate",
      description: "Send messages or initiate contact with users you are interested in. Agents can assist if needed."
    }
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="container mx-auto">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-['Poppins'] bg-gradient-to-r from-[#FF59B6] to-[#CB3B8B] text-transparent bg-clip-text">
            How It Works
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-[#6D6E6F] mt-4 max-w-2xl mx-auto">
            Follow these simple steps to understand the process and get started today!
          </p>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Steps Grid */}
          <div className="w-full lg:w-1/2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {steps.map((step, index) => (
                <div key={index} className="flex flex-col gap-4 p-4 rounded-xl hover:bg-[#FFF5FB] transition-colors duration-300">
                  <div className="flex-shrink-0">
                    {step.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-[#CB3B8B] mb-2">
                      {step.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}

              {/* Nikah Step - Full Width */}
              <div className="sm:col-span-2 flex flex-col gap-4 p-4 rounded-xl hover:bg-[#FFF5FB] transition-colors duration-300">
                <div className="flex-shrink-0">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M19.86 8.08997C19.86 8.50997 19.83 8.91997 19.78 9.30997C19.32 9.10997 18.82 8.99997 18.29 8.99997C17.07 8.99997 15.99 9.58996 15.32 10.49C14.64 9.58996 13.56 8.99997 12.34 8.99997C10.29 8.99997 8.63 10.67 8.63 12.74C8.63 15.42 10.05 17.47 11.63 18.86C11.58 18.89 11.53 18.9 11.48 18.92C11.18 19.03 10.68 19.03 10.38 18.92C7.79 18.03 2 14.35 2 8.08997C2 5.32997 4.21999 3.09998 6.95999 3.09998C8.58999 3.09998 10.03 3.87997 10.93 5.08997C11.84 3.87997 13.28 3.09998 14.9 3.09998C17.64 3.09998 19.86 5.32997 19.86 8.08997Z" stroke="#D64294" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M21.9999 12.74C21.9999 17.42 17.6699 20.18 15.7299 20.84C15.4999 20.92 15.1299 20.92 14.8999 20.84C14.0699 20.56 12.7999 19.89 11.6299 18.86C10.0499 17.47 8.62988 15.42 8.62988 12.74C8.62988 10.67 10.2899 9 12.3399 9C13.5599 9 14.6399 9.58999 15.3199 10.49C15.9899 9.58999 17.0699 9 18.2899 9C18.8199 9 19.3199 9.11 19.7799 9.31C21.0899 9.89 21.9999 11.2 21.9999 12.74Z" stroke="#D64294" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-[#CB3B8B] mb-2">
                    Nikah
                  </h4>
                  <p className="text-sm text-gray-600">
                    Use the platform's tools and services to finalize your match and begin your journey.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Video Section */}
          <div className="w-full lg:w-1/2">
            <div className="aspect-video rounded-2xl overflow-hidden shadow-xl bg-black">
              <video
                className="w-full h-full object-cover"
                controls
                playsInline
                preload="metadata"
                poster="/images/hero3.jpg"
              >
                <source src="/images/6554025-uhd_3840_2160_24fps.mp4#t=0.1" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;

