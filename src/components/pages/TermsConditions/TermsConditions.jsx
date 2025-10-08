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
                  <h1 className="terms-title">Terms & Conditions</h1>
                  <p className="terms-subtitle">Effective Date: October 1, 2025</p>
                  <div className="terms-intro">
                    <p>
                      Welcome to MehramMatch! These Terms and Conditions ("Terms") govern your use of our 
                      Muslim matrimonial platform. By accessing or using our services, you agree to be bound 
                      by these Terms. Please read them carefully.
                    </p>
                    <p>
                      If you do not agree to these Terms, please do not use our platform. We reserve the 
                      right to modify these Terms at any time, and your continued use constitutes acceptance 
                      of any changes.
                    </p>
                  </div>
                </div>

                 {/* Main Content */}
                 <div className="terms-content">
                   
                   {/* Section 1 */}
                   <section className="terms-section">
                     <h2 className="section-title">1. Acceptance of Terms</h2>
                     <p>
                       By accessing or using Mehram Match, you agree to be legally bound by these Terms and Conditions 
                       and our Privacy Policy. If you do not agree, please do not use our services.
                     </p>
                   </section>

                   {/* Section 2 */}
                   <section className="terms-section">
                     <h2 className="section-title">2. Eligibility</h2>
                     <ul className="terms-list">
                       <li>You must be at least 18 years old to register</li>
                       <li>Mehram Match is intended for Muslim individuals seeking matrimonial alliances</li>
                       <li>Users must provide accurate, truthful, and complete information during registration</li>
                     </ul>
                   </section>

                   {/* Section 3 */}
                   <section className="terms-section">
                     <h2 className="section-title">3. User Conduct</h2>
                     <ul className="terms-list">
                       <li>You agree to use the platform in a respectful and honest manner</li>
                       <li>Harassment, discrimination, hate speech, or any offensive behavior is strictly prohibited</li>
                       <li>No content or behavior that violates Islamic ethics or the laws of your country is allowed</li>
                       <li>Users should avoid sharing explicit, misleading, or fraudulent information</li>
                     </ul>
                   </section>

                   {/* Section 4 */}
                   <section className="terms-section">
                     <h2 className="section-title">4. Profile Information</h2>
                     <ul className="terms-list">
                       <li>Users are responsible for maintaining the accuracy of their profile information</li>
                       <li>Mehram Match does not verify the authenticity of user profiles but reserves the right to suspend or remove any profiles found to be fraudulent or inappropriate</li>
                     </ul>
                   </section>

                   {/* Section 5 */}
                   <section className="terms-section">
                     <h2 className="section-title">5. Privacy</h2>
                     <ul className="terms-list">
                       <li>Mehram Match respects your privacy and handles your personal data in accordance with our Privacy Policy</li>
                       <li>Personal details shared on the platform should be treated with confidentiality by all users</li>
                     </ul>
                   </section>

                   {/* Section 6 */}
                   <section className="terms-section">
                     <h2 className="section-title">6. Use of Services</h2>
                     <ul className="terms-list">
                       <li>Mehram Match provides a platform to connect Muslim singles but does not guarantee any marriage or relationship outcomes</li>
                       <li>Users are responsible for their own interactions, meetings, and decisions</li>
                       <li>The platform is not responsible for any disputes, damages, or losses arising from user interactions</li>
                     </ul>
                   </section>

                   {/* Section 7 */}
                   <section className="terms-section">
                     <h2 className="section-title">7. Prohibited Activities</h2>
                     <ul className="terms-list">
                       <li>Use of Mehram Match for commercial, advertising, or solicitation purposes is forbidden</li>
                       <li>Creating fake profiles or impersonating others is strictly prohibited</li>
                       <li>Sharing offensive, defamatory, or illegal content is forbidden</li>
                     </ul>
                   </section>

                   {/* Section 8 */}
                   <section className="terms-section">
                     <h2 className="section-title">8. Termination and Suspension</h2>
                     <ul className="terms-list">
                       <li>Mehram Match reserves the right to suspend or terminate accounts at its sole discretion for violating these terms or engaging in inappropriate conduct</li>
                       <li>Users can deactivate their accounts at any time</li>
                     </ul>
                   </section>

                   {/* Section 9 */}
                   <section className="terms-section">
                     <h2 className="section-title">9. Intellectual Property</h2>
                     <ul className="terms-list">
                       <li>All content on Mehram Match, including logos, design, and text, is owned by Mehram Match or its licensors</li>
                       <li>Users may not copy, reproduce, or distribute content without permission</li>
                     </ul>
                   </section>

                   {/* Section 10 */}
                   <section className="terms-section">
                     <h2 className="section-title">10. Disclaimer and Limitation of Liability</h2>
                     <ul className="terms-list">
                       <li>Mehram Match is provided "as is" without warranties of any kind</li>
                       <li>The platform does not guarantee the accuracy, completeness, or reliability of user-generated content</li>
                       <li>Mehram Match is not liable for any direct or indirect damages resulting from the use of the site or interactions with other users</li>
                     </ul>
                   </section>

                   {/* Section 11 */}
                   <section className="terms-section">
                     <h2 className="section-title">11. Changes to Terms</h2>
                     <p>
                       Mehram Match reserves the right to modify these Terms and Conditions at any time. Users will be 
                       notified of significant changes, and continued use after updates constitutes acceptance.
                     </p>
                   </section>

                   {/* Section 12 */}
                   <section className="terms-section">
                     <h2 className="section-title">12. Governing Law</h2>
                     <p>
                       These Terms and Conditions shall be governed by and construed in accordance with the laws of India.
                     </p>
                   </section>

                   {/* Section 13 */}
                   <section className="terms-section">
                     <h2 className="section-title">13. Contact Us</h2>
                     <p>For questions or concerns about these Terms, please contact us at:</p>
                     <div className="contact-info">
                       <div className="contact-item">
                         <strong>Email:</strong> contact@mehrammatch.com
                       </div>
                       <div className="contact-item">
                         <strong>Address:</strong> MehramMatch, Mumbai, Maharashtra, India
                       </div>
                     </div>
                   </section>

                   {/* Agreement Statement */}
                   <section className="terms-section">
                     <div className="bg-gradient-to-r from-[#FFF5FB] to-[#F8F9FA] p-4 rounded-lg border-l-4 border-[#FF59B6]">
                       <p className="text-sm font-medium text-gray-700">
                         <strong>By using Mehram Match, you acknowledge that you have read, understood, and agree to these Terms and Conditions.</strong>
                       </p>
                     </div>
                   </section>

                 </div>

                {/* Footer Note */}
                <div className="terms-footer-note">
                  <p>
                    <strong>Last Updated:</strong> October 1, 2025<br />
                    <strong>Version:</strong> 1.0<br />
                    <strong>Governing Law:</strong> Indian Law
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
