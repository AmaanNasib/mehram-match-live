import React from 'react';

const MobileAppSection = () => {
  return (
    <section className="py-16 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          {/* Image Section */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <div
              className="w-full max-w-sm aspect-[9/16] rounded-3xl overflow-hidden relative bg-gradient-to-br from-[#FF59B6] to-[#CB3B8B] shadow-2xl border-2 border-[#FFCEE9]"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white p-8">
                  <svg className="w-24 h-24 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/>
                  </svg>
                  <p className="text-lg font-semibold">App Preview</p>
                </div>
              </div>
              <div className="h-64 w-full transform rotate-45 bg-white/10 absolute -bottom-32 -right-20 blur-3xl" />
            </div>
          </div>

          {/* Text Content */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#FF59B6] to-[#CB3B8B] text-transparent bg-clip-text leading-tight mb-4">
              Mobile App
            </h2>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-6">
              Available for iOS and Android
            </h3>

            {/* Coming Soon Badge */}
            <div className="inline-block mb-8">
              <div className="bg-gradient-to-r from-[#FF59B6] to-[#CB3B8B] text-white px-6 py-3 rounded-full font-semibold text-lg sm:text-xl shadow-lg">
                Coming Soon
              </div>
            </div>

            {/* App Store Badges - Placeholder for future */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
              <div className="w-40 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                App Store
              </div>
              <div className="w-40 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                Play Store
              </div>
            </div>

            {/* Features List */}
            <div className="space-y-3 max-w-md mx-auto lg:mx-0">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#FF59B6] to-[#CB3B8B] flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-600">Seamless mobile experience</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#FF59B6] to-[#CB3B8B] flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-600">All features on-the-go</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#FF59B6] to-[#CB3B8B] flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-600">Push notifications</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MobileAppSection;

