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
                      By creating an account, accessing, or using MehramMatch, you acknowledge that you have 
                      read, understood, and agree to be bound by these Terms and our Privacy Policy. These 
                      Terms constitute a legally binding agreement between you and MehramMatch.
                    </p>
                    <ul className="terms-list">
                      <li>You must be at least 18 years old (for females) or 21 years old (for males) to use our services</li>
                      <li>You must provide accurate and truthful information during registration</li>
                      <li>You are responsible for maintaining the confidentiality of your account</li>
                      <li>You agree to use our platform in accordance with Islamic values and principles</li>
                    </ul>
                  </section>

                  {/* Section 2 */}
                  <section className="terms-section">
                    <h2 className="section-title">2. User Accounts and Registration</h2>
                    <div className="subsection">
                      <h3 className="subsection-title">Account Creation</h3>
                      <p>To use our services, you must create an account by providing:</p>
                      <ul className="terms-list">
                        <li>Valid email address and phone number</li>
                        <li>Accurate personal information including name, age, and location</li>
                        <li>Profile photo (optional but recommended)</li>
                        <li>Marriage preferences and requirements</li>
                      </ul>
                    </div>
                    
                    <div className="subsection">
                      <h3 className="subsection-title">Account Security</h3>
                      <p>You are responsible for:</p>
                      <ul className="terms-list">
                        <li>Maintaining the security of your login credentials</li>
                        <li>All activities that occur under your account</li>
                        <li>Notifying us immediately of any unauthorized access</li>
                        <li>Keeping your profile information up-to-date and accurate</li>
                      </ul>
                    </div>
                  </section>

                  {/* Section 3 */}
                  <section className="terms-section">
                    <h2 className="section-title">3. Acceptable Use Policy</h2>
                    <p>You agree to use our platform responsibly and in accordance with Islamic principles:</p>
                    <ul className="terms-list">
                      <li><strong>Prohibited Activities:</strong> Harassment, abuse, or inappropriate behavior towards other users</li>
                      <li><strong>Content Guidelines:</strong> No offensive, misleading, or inappropriate content in profiles or messages</li>
                      <li><strong>Respectful Communication:</strong> Maintain respectful and halal communication with other users</li>
                      <li><strong>Privacy Respect:</strong> Do not share other users' personal information without consent</li>
                      <li><strong>Platform Integrity:</strong> Do not attempt to hack, spam, or disrupt our services</li>
                    </ul>
                  </section>

                  {/* Section 4 */}
                  <section className="terms-section">
                    <h2 className="section-title">4. Privacy and Data Protection</h2>
                    <p>
                      We are committed to protecting your privacy and personal information. Our data collection, 
                      use, and protection practices are detailed in our Privacy Policy, which is incorporated 
                      into these Terms by reference.
                    </p>
                    <ul className="terms-list">
                      <li>We collect only necessary information for matchmaking purposes</li>
                      <li>Your personal data is protected with industry-standard security measures</li>
                      <li>We do not sell your personal information to third parties</li>
                      <li>You can request deletion of your data at any time</li>
                    </ul>
                  </section>

                  {/* Section 5 */}
                  <section className="terms-section">
                    <h2 className="section-title">5. Premium Services and Payments</h2>
                    <div className="subsection">
                      <h3 className="subsection-title">Subscription Plans</h3>
                      <p>We offer various premium subscription plans with enhanced features:</p>
                      <ul className="terms-list">
                        <li>Advanced search and filtering options</li>
                        <li>Priority customer support</li>
                        <li>Enhanced profile visibility</li>
                        <li>Unlimited messaging capabilities</li>
                      </ul>
                    </div>
                    
                    <div className="subsection">
                      <h3 className="subsection-title">Payment Terms</h3>
                      <ul className="terms-list">
                        <li>All payments are processed securely through trusted payment gateways</li>
                        <li>Subscription fees are charged in advance</li>
                        <li>Refunds are subject to our refund policy</li>
                        <li>Prices may change with 30 days' notice</li>
                      </ul>
                    </div>
                  </section>

                  {/* Section 6 */}
                  <section className="terms-section">
                    <h2 className="section-title">6. User Content and Intellectual Property</h2>
                    <p>
                      You retain ownership of the content you upload to our platform, but grant us a license 
                      to use it for providing our services.
                    </p>
                    <ul className="terms-list">
                      <li>You are responsible for ensuring you have rights to any content you upload</li>
                      <li>We may remove content that violates these Terms or Islamic principles</li>
                      <li>Our platform and its features are protected by intellectual property laws</li>
                      <li>You may not copy, modify, or distribute our platform without permission</li>
                    </ul>
                  </section>

                  {/* Section 7 */}
                  <section className="terms-section">
                    <h2 className="section-title">7. Termination and Account Suspension</h2>
                    <p>We reserve the right to suspend or terminate accounts that violate these Terms:</p>
                    <ul className="terms-list">
                      <li>Immediate termination for serious violations (harassment, fraud, etc.)</li>
                      <li>Warning system for minor violations</li>
                      <li>Right to appeal suspension decisions</li>
                      <li>Data deletion upon account termination (subject to legal requirements)</li>
                    </ul>
                  </section>

                  {/* Section 8 */}
                  <section className="terms-section">
                    <h2 className="section-title">8. Disclaimers and Limitations</h2>
                    <div className="subsection">
                      <h3 className="subsection-title">Service Availability</h3>
                      <p>
                        While we strive to provide reliable service, we cannot guarantee uninterrupted access 
                        to our platform. We are not responsible for temporary outages or technical issues.
                      </p>
                    </div>
                    
                    <div className="subsection">
                      <h3 className="subsection-title">User Interactions</h3>
                      <p>
                        We facilitate connections but are not responsible for the actions, behavior, or 
                        decisions of other users. Users interact at their own risk and discretion.
                      </p>
                    </div>
                  </section>

                  {/* Section 9 */}
                  <section className="terms-section">
                    <h2 className="section-title">9. Dispute Resolution</h2>
                    <p>
                      Any disputes arising from these Terms or your use of our platform will be resolved 
                      through binding arbitration in accordance with Indian law.
                    </p>
                    <ul className="terms-list">
                      <li>Disputes will be resolved through arbitration rather than court proceedings</li>
                      <li>Arbitration will be conducted in English</li>
                      <li>Each party will bear their own legal costs</li>
                      <li>Arbitration decisions are final and binding</li>
                    </ul>
                  </section>

                  {/* Section 10 */}
                  <section className="terms-section">
                    <h2 className="section-title">10. Contact Information</h2>
                    <p>If you have questions about these Terms, please contact us:</p>
                    <div className="contact-info">
                      <div className="contact-item">
                        <strong>Email:</strong> legal@mehrammatch.com
                      </div>
                      <div className="contact-item">
                        <strong>Phone:</strong> +91-9876543210
                      </div>
                      <div className="contact-item">
                        <strong>Address:</strong> MehramMatch Legal Department, Mumbai, Maharashtra, India
                      </div>
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
