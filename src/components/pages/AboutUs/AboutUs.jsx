import React from 'react';
import { Link } from 'react-router-dom';
import './AboutUs.css';
import Navbar from '../../sections/Navbar';
import Footer from '../../sections/Footer';
// Using public folder image
const heroImage = '/blog2.jpg';

const AboutUs = () => {
  return (
    <div className="about-us-page">
      {/* Navbar */}
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <img src={heroImage} alt="MehramMatch Hero" className="hero-image" />
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <div className="container mx-auto px-4">
            <div className="hero-text">
              <h1 className="hero-title">
                Connecting Hearts Through
                <span className="text-gradient"> Islamic Values</span>
              </h1>
              <p className="hero-subtitle">
                Assalamu Alaikum wa Rahmatullahi wa Barakatuh. Welcome to MehramMatch, 
                a Shariah-compliant matrimonial service for Muslims worldwide.
              </p>
              <div className="hero-buttons">
                <Link to="/#registration-form" className="btn-primary">
                  Start Your Journey
                </Link>
                <Link to="/login" className="btn-secondary">
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="section-title">Our Mission</h2>
            <p className="section-subtitle">
              To help Muslims across the world find life partners in a dignified and Shariah-compliant way.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="mission-content">
              <h3 className="content-title">Why MehramMatch?</h3>
              <p className="content-text">
                Finding a life partner should be a blessed journey, not a stressful ordeal. 
                No more stressful or time-consuming searches through countless profiles. 
                MehramMatch provides a safe, respectful platform where Muslims can connect 
                with potential partners who share their values and beliefs.
              </p>
              <p className="content-text">
                We understand the importance of finding a compatible partner who not only 
                shares your faith but also your vision for a meaningful Islamic marriage. 
                Our platform is designed to encourage Muslims to pursue marriage in a 
                halal and dignified way.
              </p>
            </div>
            <div className="mission-visual">
              <div className="visual-card">
                <div className="visual-icon">
                  <svg className="w-16 h-16 text-[#FF59B6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h4 className="visual-title">Halal & Safe</h4>
                <p className="visual-text">Shariah-compliant platform ensuring respectful interactions</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="section-title">Our Features</h2>
            <p className="section-subtitle">
              Built with Islamic values at its core
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="feature-card">
              <div className="feature-icon">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="feature-title">Verified Profiles</h3>
              <p className="feature-text">
                Our team actively detects and removes fake, duplicate, and bot accounts 
                to ensure authentic connections.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="feature-title">Global Community</h3>
              <p className="feature-text">
                MehramMatch connects Muslims worldwide—across India, Pakistan, the Middle East, 
                the UK, USA, and beyond—who share the same Islamic values.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="feature-title">Easy Access</h3>
              <p className="feature-text">
                Connect with potential partners directly from your phone or computer, 
                making your search convenient and accessible.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="vision-section">
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="vision-visual">
              <div className="vision-image">
                <div className="image-placeholder">
                  <svg className="w-24 h-24 text-[#FF59B6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="vision-content">
              <h2 className="section-title text-left">Our Vision</h2>
              <p className="content-text">
                To become the leading Shariah-compliant matrimonial platform that helps 
                millions of Muslims worldwide find their perfect life partners while 
                maintaining the highest standards of Islamic values and community safety.
              </p>
              <p className="content-text">
                We envision a world where every Muslim can find a compatible partner 
                through a platform that respects their faith, values their privacy, 
                and facilitates meaningful connections that lead to blessed marriages.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Promise Section */}
      <section className="promise-section">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="section-title">Our Promise</h2>
            <p className="section-subtitle">
              What you can expect from MehramMatch
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="promise-card">
              <div className="promise-icon">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="promise-title">Authentic Profiles</h3>
              <p className="promise-text">Verified and genuine profiles only</p>
            </div>

            <div className="promise-card">
              <div className="promise-icon">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="promise-title">Privacy First</h3>
              <p className="promise-text">Your personal information is protected</p>
            </div>

            <div className="promise-card">
              <div className="promise-icon">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="promise-title">Halal Platform</h3>
              <p className="promise-text">Shariah-compliant interactions only</p>
            </div>

            <div className="promise-card">
              <div className="promise-icon">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
                </svg>
              </div>
              <h3 className="promise-title">24/7 Support</h3>
              <p className="promise-text">Always here to help you</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container mx-auto px-4 py-16">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Find Your Perfect Match?</h2>
            <p className="cta-subtitle">
              Join thousands of Muslims who have found their life partners through MehramMatch
            </p>
            <div className="cta-buttons">
              <Link to="/#registration-form" className="btn-primary-large">
                Create Your Profile
              </Link>
              <Link to="/login" className="btn-secondary-large">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />  
    </div>
  );
};

export default AboutUs;
