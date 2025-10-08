import React, { useState } from 'react';

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "What is MehramMatch?",
      answer: "MehramMatch is a Muslim matrimonial platform designed to help individuals in the Muslim community find suitable life partners in accordance with Islamic values and traditions. Our goal is not to be profit-driven, but service-driven. We aim to provide the best Muslim matches for faster and more meaningful Muslim matchmaking. In addition to connecting individuals based on Islamic values, we offer guidance related to Muslim marriage and a wealth of educational resources through our Islamic marriage blogs. Our platform helps users understand the essentials of Islamic marriage and provides verified Muslim profiles, making it easier for the community to find their perfect match and navigate their marriage journey with confidence."
    },
    {
      question: "How do I create an account on MehramMatch?",
      answer: "To create an account on MehramMatch, simply download the MehramMatch app or visit our website. Click on 'Register' and complete the Muslim matrimonial registration form by providing some basic details like your name, email, gender, and date of birth. Afterward, follow the simple steps to set up your profile. This helps us suggest the most compatible Muslim matchmaking profiles for you based on your preferences, ensuring you receive the best potential matches for your Islamic marriage."
    },
    {
      question: "Is MehramMatch free to use?",
      answer: "Yes, registering on MehramMatch is completely free, and you can create your Muslim matrimonial profile without any charges. However, to interact with potential Muslim matches and access advanced features like messaging, visibility boosts, and enhanced matchmaking for Muslims, a minimal fee is required to use our premium services."
    },
    {
      question: "How can I search for potential matches?",
      answer: "You can search for Muslim matches by using filters like age, location, religious preferences, interests, and more. Additionally, we suggest profiles in three sections: Trending Muslim Profiles, Recommended Muslim Matches, and All Muslim Profiles based on your preferences. If you're looking for something specific, you can also use the search feature to find Muslim singles that match your criteria. This makes it easier to connect with someone who shares your values and beliefs for a meaningful Islamic marriage."
    },
    {
      question: "How does MehramMatch ensure the authenticity of profiles?",
      answer: "At MehramMatch, we are committed to providing a trusted Muslim matrimonial app where every profile is thoroughly verified for authenticity. To ensure the genuine Muslim matchmaking experience, we implement a multi-step verification process that includes OTP (One-Time Password) verification, manual reviews by our Relationship Managers (RMs), and identity checks. Our team works tirelessly to confirm that each profile belongs to a real person, giving you the confidence that you're connecting with verified and authentic Muslim singles on our platform. Whether you are looking for a Halal marriage platform or advice on Muslim marriage guidance, MehramMatch ensures you only interact with trustworthy individuals."
    },
    {
      question: "What information is required to create my profile?",
      answer: "Creating a profile on MehramMatch is simple and quick. To get started, you'll need to provide essential information like your name, date of birth, gender, location, and marital status. This helps us match you with the most compatible Muslim singles for your Nikah journey. You can also upload a profile photo and share your preferences regarding your future spouse, ensuring that the suggestions we offer are in line with your values and Islamic marriage goals. The more detailed your profile, the more likely we are to suggest authentic Muslim marriage profiles that suit your needs."
    },
    {
      question: "Is my personal information safe on MehramMatch?",
      answer: "Yes, the privacy and security of your personal information are our top priority at MehramMatch. We employ industry-standard encryption protocols and robust security measures to protect all your data. As a leading Islamic marriage platform, we ensure that all sensitive information, from your contact details to personal preferences, remains confidential. You can trust us to protect your privacy while you explore Muslim matchmaking services and connect with potential partners in a safe and secure environment."
    },
    {
      question: "Can I delete my account if I no longer want to use MehramMatch?",
      answer: "Yes, you can delete your account anytime you wish. To do so, simply go to your profile settings, select 'Delete My Account,' and confirm your decision. Once completed, your profile and all associated data will be permanently removed from the platform. If you no longer wish to be a part of our Muslim matrimonial site, we respect your choice and will ensure that your Muslim matchmaking profile is deleted securely and permanently."
    },
    {
      question: "Will my profile be visible to everyone?",
      answer: "On MehramMatch, you have complete control over your privacy. Your profile is visible to other registered users, but you can choose what information, including photos and personal details, is shared with them. This ensures that you can maintain your privacy while actively engaging in the search for your Halal marriage partner. By customizing your settings, you can ensure that your profile only reaches individuals who align with your values and are interested in serious, Islamic matrimonial matchmaking."
    },
    {
      question: "Can I hide my profile from others?",
      answer: "While we don't allow users to hide their entire profile, you can easily control which parts of your profile are visible to other users. If you wish to maintain a level of privacy, you can choose to hide your profile photos while still engaging with others. We prioritize Halal matchmaking services and take extensive security measures to ensure that private details, such as your phone number and email, remain protected and hidden from other users unless you decide otherwise. This way, you can safely browse profiles, connect with potential Muslim singles, and protect your personal information at all times."
    },
    {
      question: "How do I verify my identity on MehramMatch?",
      answer: "To ensure the authenticity of your profile, MehramMatch offers a comprehensive identity verification process. You can verify your account by completing both mobile and email OTP (One-Time Password) verification checks. In addition, we have a selfie verification feature to ensure that the person in the photos matches the individual behind the profile. Our goal is to provide a secure Muslim matrimonial platform where users can confidently connect with real, verified individuals. We are constantly updating our verification methods to maintain a high level of authenticity and security for users seeking genuine Islamic marriage matches."
    },
    {
      question: "How do I get in touch with someone I'm interested in?",
      answer: "To connect with a potential match on MehramMatch, you can send an interest or request to let them know you're interested in their profile. If the other person likes your profile in return, you can start a conversation through our secure messaging feature. However, we always recommend that you do not share personal details too early in the conversation, as this can compromise your privacy and safety. Our platform is built on the principles of Halal matchmaking to ensure that your interactions remain respectful and secure as you connect with others looking for serious Islamic marriage."
    },
    {
      question: "Can I block or report a user on MehramMatch?",
      answer: "Yes, you can block or report any user who engages in inappropriate behavior or violates the community guidelines. If you come across a profile that makes you uncomfortable or behaves inappropriately, simply go to their profile and use the block or report option. At MehramMatch, we are committed to creating a safe and respectful environment for everyone seeking a Muslim marriage partner. Our platform takes user safety seriously, ensuring that you have full control over your interactions."
    },
    {
      question: "How does the matchmaking algorithm work?",
      answer: "Our advanced matchmaking algorithm uses a combination of factors to suggest the most compatible Muslim singles for you. First, it compares your partner preferences with those of other users. It also takes into account crucial details such as location, age, sect, family background, and other relevant factors, ensuring that the matches you receive are aligned with your values and preferences. By using a comprehensive approach, we provide a more tailored experience to help you find the perfect Muslim life partner. Whether you're looking for Muslim matrimonial services or seeking Islamic marriage guidance, our algorithm ensures that you're paired with profiles most compatible with your goals."
    },
    {
      question: "How can I update my profile details?",
      answer: "Updating your Muslim matrimonial profile on MehramMatch is easy and can be done anytime. Simply log into your account, navigate to the 'Profile' section, and click on 'My Profile' to edit and update your details. Whether you want to change your marriage preferences, update your photo, or make adjustments to your location and personal information, our platform allows you to make changes quickly. This ensures that the profiles you receive as suggestions are accurate and reflective of your evolving preferences as you search for the right match for your Nikah."
    },
    {
      question: "How does MehramMatch handle payments for premium services?",
      answer: "At MehramMatch, we ensure that payments for our premium Muslim matrimonial services are processed securely through trusted third-party payment gateways, such as Razorpay. You can conveniently pay for your Halal matchmaking services using various options, including credit/debit cards, net banking, UPI, and other supported payment methods. This flexibility allows you to access advanced features, such as messaging and profile boosts, to enhance your experience on our Islamic marriage platform."
    },
    {
      question: "Are there any age restrictions for using MehramMatch?",
      answer: "Yes, to comply with local regulations, users must be at least 18 years old to register and use MehramMatch if they are female, and 21 years or older if they are male. This ensures that users are legally eligible to seek a Muslim life partner. Additionally, users must adhere to the age-related laws and terms of use specific to their country of residence. MehramMatch is committed to providing a safe and respectful environment for all users looking for Muslim matrimonial services."
    },
    {
      question: "Can I use MehramMatch outside of India?",
      answer: "Yes, MehramMatch is available globally, and you can use our platform to connect with potential matches from around the world. Whether you're looking for a partner in your local Muslim community or seeking someone from abroad, our Islamic matrimonial platform helps you find a Muslim marriage partner wherever you are. With access to a diverse pool of profiles, you can explore matches from different countries, ensuring you have a wide range of choices for your Halal matchmaking journey."
    },
    {
      question: "What should I do if I forget my password?",
      answer: "If you've forgotten your password, simply click on the 'Forgot Password' link on the login page. You'll receive instructions via email to reset your password and regain access to your Muslim matrimonial account. This process is quick and easy, allowing you to continue your search for your Muslim life partner without any hassle."
    },
    {
      question: "How do I contact customer support?",
      answer: "If you need assistance, our customer support team is here to help! You can contact us by emailing contact@mehrammatch.com or by visiting the 'Help' section on the app. We strive to resolve all queries promptly, usually within a few hours, so you can continue your Muslim matchmaking experience without delays. Whether you need guidance on using the platform or have a specific issue, we're dedicated to providing excellent support throughout your Nikah journey."
    }
  ];

  return (
    <section id="faqs" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#FFF5FB] to-[#F8F9FA]">
      <div className="container mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-['Poppins'] bg-gradient-to-r from-[#FF59B6] to-[#CB3B8B] text-transparent bg-clip-text mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-[#6D6E6F] max-w-2xl mx-auto">
            Get answers to common questions about MehramMatch and how our platform works.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid gap-4 md:gap-6">
            {faqs.map((faq, index) => (
              <FAQCard 
                key={index} 
                faq={faq} 
                index={index} 
                isOpen={openIndex === index}
                onToggle={() => toggleFAQ(index)}
              />
            ))}
          </div>

          {/* Contact CTA */}
          <div className="mt-12 md:mt-16">
            <div className="bg-[#FED5EC] rounded-2xl p-6 md:p-8 text-center">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 md:mb-4 text-[#d63384]">
                Still have questions?
              </h3>
              <p className="text-sm sm:text-base md:text-lg mb-4 md:mb-6 text-[#6D6E6F]">
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

const FAQCard = ({ faq, index, isOpen, onToggle }) => (
  <div className="bg-white rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
    <div 
      className="p-4 sm:p-6 md:p-8 cursor-pointer"
      onClick={onToggle}
    >
      <div className="flex items-center justify-between gap-3 sm:gap-4">
        <div className="flex-1">
          <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-[#2D3748] leading-tight">
            {faq.question}
          </h3>
        </div>
        <div className="flex-shrink-0">
          <div className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-gradient-to-r from-[#FF59B6] to-[#CB3B8B] rounded-full flex items-center justify-center transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
            <svg 
              className="w-3 h-3 sm:w-4 sm:h-4 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
    
    {/* Answer Section */}
    <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
      isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
    }`}>
      <div className="px-4 pb-4 sm:px-6 sm:pb-6 md:px-8 md:pb-8 pt-0">
        <p className="text-xs sm:text-sm md:text-base text-[#6D6E6F] leading-relaxed sm:leading-loose text-left">
          {faq.answer}
        </p>
      </div>
    </div>
  </div>
);

export default FAQSection;

