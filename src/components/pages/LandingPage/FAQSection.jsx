import React from 'react';

const FAQSection = () => {
  const faqs = [
    {
      question: "What is MehramMatch?",
      answer: "MehramMatch is a SaaS platform designed to help individuals and families find the right match for Nikah. It combines advanced matchmaking algorithms, robust security features, and a user-friendly interface to ensure a seamless and halal experience."
    },
    {
      question: "How does MehramMatch work?",
      answer: "MehramMatch uses advanced algorithms to match profiles based on compatibility, values, and preferences. Users can register, complete their profiles, and explore potential matches while maintaining privacy and cultural values."
    },
    {
      question: "Is MehramMatch secure?",
      answer: "Yes, security and privacy are our top priorities. MehramMatch uses encrypted data, secure authentication, and profile verification to ensure a safe platform for all users."
    },
    {
      question: "What makes MehramMatch unique?",
      answer: "MehramMatch is a SaaS-based solution specifically designed with Islamic principles in mind. It seamlessly combines technology with tradition to offer a modern approach to finding compatible matches while adhering to halal standards."
    },
    {
      question: "Can I use MehramMatch on mobile devices?",
      answer: "As a SaaS platform, MehramMatch is accessible on desktops and tablets. We are excited to announce that our mobile app is launching soon, allowing users to enjoy a seamless experience on their mobile devices in the near future."
    }
  ];

  return (
    <section id="faqs" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#FFF5FB] to-[#F8F9FA]">
      <div className="container mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-['Poppins'] bg-gradient-to-r from-[#FF59B6] to-[#CB3B8B] text-transparent bg-clip-text mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-base sm:text-lg text-[#6D6E6F] max-w-2xl mx-auto">
            Get answers to common questions about MehramMatch and how our platform works.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid gap-4 md:gap-6">
            {faqs.map((faq, index) => (
              <FAQCard key={index} faq={faq} index={index} />
            ))}
          </div>

          {/* Contact CTA */}
          <div className="mt-12 md:mt-16">
            <div className="bg-[#FED5EC] rounded-2xl p-6 md:p-8 text-center">
              <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-[#d63384]">
                Still have questions?
              </h3>
              <p className="text-base md:text-lg mb-4 md:mb-6 text-[#6D6E6F]">
                Our support team is here to help you with any questions you might have.
              </p>
              <a 
                href="mailto:contact@mehrammatch.com"
                className="inline-block bg-[#d63384] text-white px-6 md:px-8 py-2.5 md:py-3 rounded-full font-semibold hover:bg-[#CB3B8B] transition-colors duration-300 text-sm md:text-base"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const FAQCard = ({ faq, index }) => (
  <div className="bg-white rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
    <div className="p-6 md:p-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-lg md:text-xl font-semibold text-[#2D3748] mb-3 md:mb-4">
            {faq.question}
          </h3>
          <p className="text-sm md:text-base text-[#6D6E6F] leading-relaxed">
            {faq.answer}
          </p>
        </div>
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-gradient-to-r from-[#FF59B6] to-[#CB3B8B] rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">Q</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default FAQSection;

