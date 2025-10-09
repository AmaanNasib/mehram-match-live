import React, { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Footer from '../../sections/Footer';
import Navbar from '../../sections/Navbar';
import './TermsConditions.css';

const TermsConditions = () => {
  // Smooth scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  return (
    <>
      <Navbar />
      <div className="terms-conditions-page">
        <Container>
          <Row className="justify-content-center">
            <Col lg={10} xl={8}>
              <div className="terms-conditions-content">
                {/* Header Section */}
                <div className="terms-header text-center mb-5">
                  <h1 className="terms-title">🕋 MehramMatch – Terms and Conditions</h1>
                  <p className="terms-subtitle">Last Updated: October 9, 2025</p>
                  <div className="terms-intro">
                    <p>
                      Welcome to MehramMatch, a Shariah-compliant Muslim matrimonial platform designed to help 
                      single Muslims find compatible life partners for Nikah (marriage) in accordance with Islamic 
                      principles and Indian laws.
                    </p>
                    <p>
                      By registering or using MehramMatch ("the Platform"), you agree to these Terms and 
                      Conditions ("Terms"). If you do not agree, please discontinue use of the Platform.
                    </p>
                  </div>
                </div>

                 {/* Main Content */}
                 <div className="terms-content">
                   
                   {/* Section 1 */}
                   <section className="terms-section">
                     <h2 className="section-title">1. Acceptance of Terms</h2>
                     <p>
                       By accessing or using MehramMatch, you acknowledge that you have read, understood, and 
                       agree to comply with these Terms and our Privacy Policy.
                     </p>
                     <p>
                       MehramMatch reserves the right to update these Terms at any time, and continued use after 
                       updates signifies your acceptance.
                     </p>
                   </section>

                   {/* Section 2 */}
                   <section className="terms-section">
                     <h2 className="section-title">2. Eligibility</h2>
                     <ul className="terms-list">
                       <li>Users must be at least 18 years old (female) and 21 years old (male) as per Indian law.</li>
                       <li>Users must be single, married, unmarried, divorced/khula, or widowed and seeking marriage (Nikah) in accordance with Islamic teachings.</li>
                       <li>By creating an account, you confirm that you are legally competent to marry under the laws of India and not prohibited by any existing marital contract.</li>
                     </ul>
                   </section>

                   {/* Section 3 */}
                   <section className="terms-section">
                     <h2 className="section-title">3. Purpose of the Platform</h2>
                     <p>
                       MehramMatch is a Shariah-compliant Muslim matrimonial service, not a dating or friendship website.
                     </p>
                     <p>
                       All activities on the platform must align with Islamic ethics, modesty, and the sanctity of marriage.
                     </p>
                     <p>
                       Any misuse of the platform for un-Islamic or unlawful purposes is strictly prohibited.
                     </p>
                   </section>

                   {/* Section 4 */}
                   <section className="terms-section">
                     <h2 className="section-title">4. User Accounts & Responsibilities</h2>
                     <ul className="terms-list">
                       <li>Provide accurate, current, and complete personal information during registration.</li>
                       <li>Maintain the confidentiality of your login credentials and do not share your account with others.</li>
                       <li>Immediately update any incorrect or outdated information on your profile.</li>
                       <li>MehramMatch may suspend or delete any account found to contain false or misleading information.</li>
                     </ul>
                   </section>

                   {/* Section 5 */}
                   <section className="terms-section">
                     <h2 className="section-title">5. Islamic Conduct & Values</h2>
                     <p>
                       All users must observe Islamic adab (etiquette) and Shariah compliance in communication and behavior.
                     </p>
                     <p><strong>The following are strictly prohibited:</strong></p>
                     <ul className="terms-list">
                       <li>Promoting or displaying indecent, un-Islamic, or vulgar content.</li>
                       <li>Engaging in flirting, dating, or haram interactions.</li>
                       <li>Promoting alcohol, gambling, music-related, or unlawful professions.</li>
                       <li>Disrespecting, harassing, or defaming any member.</li>
                       <li>Using the platform for non-marital purposes.</li>
                     </ul>
                     <p>
                       <strong>Violation may result in immediate termination or permanent ban from the platform.</strong>
                     </p>
                   </section>

                   {/* Section 6 */}
                   <section className="terms-section">
                     <h2 className="section-title">6. Profile Guidelines</h2>
                     <ul className="terms-list">
                       <li>Profiles must be created only with genuine marital intentions.</li>
                       <li>Married individuals seeking another marriage must clearly disclose their marital status and comply with both Islamic and Indian legal provisions.</li>
                       <li>MehramMatch reserves the right to review, verify, or remove any profile that violates platform ethics or community standards.</li>
                     </ul>
                   </section>

                   {/* Section 7 */}
                   <section className="terms-section">
                     <h2 className="section-title">7. Communication Policy</h2>
                     <ul className="terms-list">
                       <li>Users may communicate only through the Platform's approved messaging tools.</li>
                       <li>Sharing contact details publicly or before mutual interest approval is discouraged for user safety.</li>
                       <li>MehramMatch may send emails, SMS, or WhatsApp notifications for matches, updates, or promotions.</li>
                       <li>By registering, you consent to receive communications as part of your membership.</li>
                     </ul>
                   </section>

                   {/* Section 8 */}
                   <section className="terms-section">
                     <h2 className="section-title">8. Payments, Membership & Refunds</h2>
                     <ul className="terms-list">
                       <li>Some services are free; premium plans require payment of applicable fees as listed on the website.</li>
                       <li>Payments must be made via authorized and secure methods.</li>
                       <li>MehramMatch reserves the right to change pricing or features with prior notice.</li>
                     </ul>
                   </section>

                   {/* Section 9 */}
                   <section className="terms-section">
                     <h2 className="section-title">9. Privacy & Data Protection</h2>
                     <ul className="terms-list">
                       <li>MehramMatch respects your privacy in accordance with Indian IT Act 2000 and GDPR standards.</li>
                       <li>Your personal data will only be used for matchmaking and communication purposes.</li>
                       <li>We implement strict security measures to protect your data, but users are responsible for safe interactions.</li>
                       <li>Refer to our Privacy Policy for detailed information.</li>
                     </ul>
                   </section>

                   {/* Section 10 */}
                   <section className="terms-section">
                     <h2 className="section-title">10. Content Ownership & Intellectual Property</h2>
                     <ul className="terms-list">
                       <li>All trademarks, logos, and content on the Platform belong to MehramMatch.</li>
                       <li>Users grant MehramMatch a limited, non-exclusive license to use profile content for matchmaking display.</li>
                       <li>Unauthorized use, duplication, or redistribution of any platform material is prohibited.</li>
                     </ul>
                   </section>

                   {/* Section 11 */}
                   <section className="terms-section">
                     <h2 className="section-title">11. Suspension or Termination</h2>
                     <p><strong>MehramMatch reserves the right to:</strong></p>
                     <ul className="terms-list">
                       <li>Suspend or terminate any account violating these Terms or Islamic ethics.</li>
                       <li>Delete any content found unlawful, obscene, or deceptive.</li>
                       <li>Retain minimal data backups for record-keeping as required by law.</li>
                     </ul>
                     <p>
                       Users may request account deletion anytime via account settings or contact@mehrammatch.com.
                     </p>
                   </section>

                   {/* Section 12 */}
                   <section className="terms-section">
                     <h2 className="section-title">12. Disclaimers & Limitations</h2>
                     <ul className="terms-list">
                       <li>MehramMatch does not guarantee a successful match or marriage.</li>
                       <li>User information is self-submitted; the platform is not responsible for inaccuracies or false representations.</li>
                       <li>The platform is not liable for offline interactions or damages resulting from member communications or meetings.</li>
                     </ul>
                   </section>

                   {/* Section 13 */}
                   <section className="terms-section">
                     <h2 className="section-title">13. Dispute Resolution & Governing Law</h2>
                     <ul className="terms-list">
                       <li>These Terms are governed by the laws of India and guided by Islamic principles of justice and ethics.</li>
                       <li>Any dispute shall first be attempted to resolve amicably or through mediation.</li>
                       <li>If unresolved, disputes shall be referred to arbitration in accordance with the Arbitration and Conciliation Act, 1996, held in Hyderabad, India.</li>
                     </ul>
                   </section>

                   {/* Section 14 */}
                   <section className="terms-section">
                     <h2 className="section-title">14. Amendments</h2>
                     <p>
                       MehramMatch may revise these Terms periodically.
                     </p>
                     <p>
                       Users will be notified via email or on-site notice. Continued use implies acceptance of the updated Terms.
                     </p>
                   </section>

                   {/* Section 15 */}
                   <section className="terms-section">
                     <h2 className="section-title">15. Contact Information</h2>
                     <p>For any questions, concerns, or legal notices, please contact:</p>
                     <div className="contact-info">
                       <div className="contact-item">
                         📧 <strong>Email:</strong> contact@mehrammatch.com
                       </div>
                       <div className="contact-item">
                         🌐 <strong>Website:</strong> https://www.mehrammatch.com
                       </div>
                       <div className="contact-item">
                         📍 <strong>Address:</strong> Maharashtra, India
                       </div>
                     </div>
                   </section>

                   {/* Agreement Statement */}
                   <section className="terms-section">
                     <div className="bg-gradient-to-r from-[#FFF5FB] to-[#F8F9FA] p-4 rounded-lg border-l-4 border-[#FF59B6]">
                       <p className="text-sm font-medium text-gray-700">
                         <strong>By using MehramMatch, you acknowledge that you have read, understood, and agree to these Terms and Conditions.</strong>
                       </p>
                     </div>
                   </section>

                 </div>

                {/* Footer Note */}
                <div className="terms-footer-note">
                  <p>
                    <strong>Last Updated:</strong> October 9, 2025<br />
                    <strong>Version:</strong> 1.0<br />
                    <strong>Governing Law:</strong> Indian Law & Islamic Principles<br />
                    <strong>Arbitration Venue:</strong> Maharashtra, India
                  </p>
                </div>

              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default TermsConditions;
