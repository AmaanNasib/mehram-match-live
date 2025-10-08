import React, { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Footer from '../../sections/Footer';
import Navbar from '../../sections/Navbar';
import './PrivacyPolicy.css';

const PrivacyPolicy = () => {
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
      <div className="privacy-policy-page">
        <Container>
          <Row className="justify-content-center">
            <Col lg={10} xl={8}>
              <div className="privacy-policy-content">
                {/* Header Section */}
                <div className="privacy-header text-center mb-5">
                  <h1 className="privacy-title">Privacy Policy</h1>
                  <p className="privacy-subtitle">Effective Date: October 1, 2025</p>
                  <div className="privacy-intro">
                    <p>
                      Welcome to MehramMatch! As a platform dedicated to helping individuals find suitable life 
                      partners in line with Islamic traditions, we respect your privacy and are committed to 
                      protecting your personal information. This Privacy Policy explains how we collect, use, 
                      and safeguard your data.
                    </p>
                    <p>
                      By using our services, you agree to the practices outlined in this policy. If you do not 
                      agree, please refrain from using the platform.
                    </p>
                  </div>
                </div>

                {/* Main Content */}
                <div className="privacy-content">
                  
                  {/* Section 1 */}
                  <section className="privacy-section">
                    <h2 className="section-title">1. Information We Collect</h2>
                    
                    <div className="subsection">
                      <h3 className="subsection-title">Personal Information You Provide</h3>
                      <p>When you use our platform, we may ask you to provide certain personal details, such as:</p>
                      <ul className="privacy-list">
                        <li><strong>Basic Profile Information:</strong> Name, gender, date of birth, email address, phone number, marital status, mother tongue, location, height, job, income, etc.</li>
                        <li><strong>Profile Photos:</strong> Uploading a photo is optional. You have full control over how and if your photo appears.</li>
                        <li><strong>Verification Information:</strong> You may choose to verify your identity using a selfie for added authenticity.</li>
                        <li><strong>Preferences & Details:</strong> Information related to your marriage preferences, religion, family background, etc.</li>
                      </ul>
                    </div>

                    <div className="subsection">
                      <h3 className="subsection-title">Automatically Collected Information</h3>
                      <p>When you visit or use MehramMatch, we may collect some information automatically:</p>
                      <ul className="privacy-list">
                        <li><strong>Device Information:</strong> This includes data such as the type of device you're using, operating system, browser, and IP address.</li>
                        <li><strong>Usage Data:</strong> We may collect information about how you interact with the site, such as pages visited, searches made, and other actions taken on the platform.</li>
                        <li><strong>Location Data:</strong> If you enable location services, we may collect your location to better match you with nearby users.</li>
                      </ul>
                    </div>
                  </section>

                  {/* Section 2 */}
                  <section className="privacy-section">
                    <h2 className="section-title">2. How We Use Your Information</h2>
                    <p>We use the information we collect for various purposes:</p>
                    <ul className="privacy-list">
                      <li><strong>Matchmaking:</strong> To help you find suitable marriage profiles based on your preferences.</li>
                      <li><strong>Personalization:</strong> To personalize your experience by suggesting relevant matches and content.</li>
                      <li><strong>Communication:</strong> To notify you about new matches, updates, or important activities on your profile.</li>
                      <li><strong>Improving the Service:</strong> To enhance the quality of our platform and provide a better experience to users.</li>
                      <li><strong>Legal Compliance:</strong> To comply with applicable laws and protect the platform from misuse.</li>
                    </ul>
                  </section>

                  {/* Section 3 */}
                  <section className="privacy-section">
                    <h2 className="section-title">3. Sharing Your Information</h2>
                    <p>We may share your information in the following cases:</p>
                    <ul className="privacy-list">
                      <li><strong>With Other Users:</strong> Your profile details, such as name, photos, and preferences, will be visible to other registered users who may be interested in connecting with you.</li>
                      <li><strong>Service Providers:</strong> We may work with third-party vendors to process payments, host the website, or help with analytics. These service providers only access the data necessary to perform their tasks.</li>
                      <li><strong>Legal Obligations:</strong> If required by law, we may share your information with law enforcement or other authorities to comply with legal requests or protect the platform and its users.</li>
                    </ul>
                  </section>

                  {/* Section 4 */}
                  <section className="privacy-section">
                    <h2 className="section-title">4. How We Protect Your Data</h2>
                    <p>
                      We are committed to ensuring your personal information is safe. We use industry-standard 
                      security measures to protect your data, including encryption and secure servers. You are also 
                      responsible for keeping your login details confidential and not sharing your account information 
                      with others.
                    </p>
                  </section>

                  {/* Section 5 */}
                  <section className="privacy-section">
                    <h2 className="section-title">5. Retention of Your Information</h2>
                    <p>
                      We will keep your data for as long as you have an active account with MehramMatch. When 
                      you delete your account, we will remove your information from our system, except where legally 
                      required or necessary to maintain operational records.
                    </p>
                  </section>

                  {/* Section 6 */}
                  <section className="privacy-section">
                    <h2 className="section-title">6. Changes to This Privacy Policy</h2>
                    <p>
                      We may update this Privacy Policy to reflect changes in our services or legal requirements. 
                      When we do, we will post the updated policy on our platform, and the effective date will be 
                      updated. We encourage you to check this page periodically for any changes.
                    </p>
                  </section>

                  {/* Section 7 */}
                  <section className="privacy-section">
                    <h2 className="section-title">7. Contact Us</h2>
                    <p>If you have any questions or concerns about this Privacy Policy, please feel free to contact us at:</p>
                    <div className="contact-info">
                      <div className="contact-item">
                        <strong>Email:</strong> contact@mehrammatch.com
                      </div>
                      <div className="contact-item">
                        <strong>Phone:</strong> +91-9876543210
                      </div>
                      {/* <div className="contact-item">
                        <strong>Address:</strong> MehramMatch, 123 Islamic Street, Mumbai, Maharashtra, 400001, India
                      </div> */}
                    </div>
                  </section>

                </div>

                {/* Footer Note */}
                <div className="privacy-footer-note">
                  <p>
                    <strong>Last Updated:</strong> October 1, 2025<br />
                    <strong>Version:</strong> 1.0
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

export default PrivacyPolicy;
