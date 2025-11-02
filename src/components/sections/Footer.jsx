import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaMapMarkerAlt, FaEnvelope, FaGlobe, FaPhone, FaFacebook, FaInstagram, FaYoutube, FaLinkedin } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Footerr.css"; // Custom CSS for additional styling
import footerLogo from "../../images/footerLogo.png"
import andlogo from "../../images/andlogo.png"
import applogo from "../../images/applogo.png"
import { Link, useNavigate } from 'react-router-dom';


const Footer = () => {
    const navigate = useNavigate();

    // Debug function to test sections
    const testSections = () => {
        const sections = ['how-it-works', 'packages', 'reviews'];
        sections.forEach(sectionId => {
            const element = document.getElementById(sectionId);
            console.log(`Section ${sectionId}:`, element);
        });
    };

    // Test sections on component mount
    useEffect(() => {
        testSections();
    }, []);

    const handleSectionClick = (sectionId) => {
        console.log('Clicking on section:', sectionId);
        
        // Check if we're on the landing page
        if (window.location.pathname === '/') {
            // If on landing page, scroll to section directly
            const element = document.getElementById(sectionId);
            console.log('Element found:', element);
            if (element) {
                // Update URL hash
                window.location.hash = sectionId;
                // Scroll to element with multiple methods for better compatibility
                try {
                    element.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                } catch (error) {
                    // Fallback method
                    const elementTop = element.offsetTop;
                    window.scrollTo({
                        top: elementTop - 100, // Offset for better visibility
                        behavior: 'smooth'
                    });
                }
            } else {
                console.log('Element not found for ID:', sectionId);
                // Try to find element with different methods
                const elementByQuery = document.querySelector(`#${sectionId}`);
                console.log('Element by query selector:', elementByQuery);
            }
        } else {
            // If not on landing page, navigate to landing page with hash
            navigate(`/#${sectionId}`);
        }
    };

    const handleHomeClick = () => {
        // Check if we're on the landing page
        if (window.location.pathname === '/') {
            // If on landing page, scroll to registration form
            const registrationForm = document.getElementById('registration-form');
            if (registrationForm) {
                registrationForm.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            } else {
                // Fallback to top if registration form not found
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        } else {
            // If not on landing page, navigate to landing page with registration form hash
            navigate('/#registration-form');
        }
    };

    return (
        <footer className="footer text-light">
            <Container>
                <Row className="text-center">
                    <Col md={12} className="footer-logo-container">
                        <img src={footerLogo} alt="Mehram Match Logo" className="footer-logo" />
                    </Col>
                </Row>
                <Row className="text-center">
                    <Col md={12}>
                        <p className="footer-text mt-3 mt-md-6 px-3 px-md-0">
                        Finding a life partner should be a blessed journey, not a stressful ordeal. 
                No more stressful or time-consuming searches through countless profiles. 
                MehramMatch provides a safe, respectful platform where Muslims can connect 
                with potential partners who share their values and beliefs. We understand the importance of finding a compatible partner who not only 
                shares your faith but also your vision for a meaningful Islamic marriage. 
                Our platform is designed to encourage Muslims to pursue marriage in a 
                halal and dignified way.
                        </p>
                    </Col>
                </Row>

                <Row className="mt-4">
                    {/* <Row className="footer-contacts-container">
                        <Col md={12} className="text-center">
                            <h5 className="footer-heading">CONTACT</h5>
                            <div className="footer-heading-line"></div>
                        </Col>
                    </Row>
                    <Row className="footer-contacts d-flex flex-wrap justify-content-start">
                        <Col className="footer-contact-item">
                            <h6>Address</h6>
                            <p><FaMapMarkerAlt className="footer-icon" /> 1329 40th St Apt A Orlando, FL</p>
                        </Col>
                        <Col className="footer-contact-item">
                            <h6>Website</h6>
                            <p><FaGlobe className="footer-icon" /> www.mehrammatch.com</p>
                        </Col>
                        <Col className="footer-contact-item">
                            <h6>Email</h6>
                            <p><FaEnvelope className="footer-icon" /> support@mehrammatch.com</p>
                        </Col>
                        <Col className="footer-contact-item">
                            <h6>Phone</h6>
                            <p><FaPhone className="footer-icon" /> +01-321-200-6932</p>
                            <p><FaPhone className="footer-icon" /> +01-321-200-6933</p>
                        </Col>
                    </Row> */}

                    <Row className="mt-4">
                        <Col xs={12} sm={6} md={3} className="footer-section mb-4 mb-md-0">
                            <h5>MAIN MENU</h5>
                            <div className="footer-heading-linee"></div>
                            <ul>
                                <li><span onClick={handleHomeClick} className="footer-link-no-underline" style={{cursor: 'pointer'}}>Home</span></li>
                                <li><span onClick={() => handleSectionClick('how-it-works')} className="footer-link-no-underline" style={{cursor: 'pointer'}}>How It Works</span></li>
                                {/* <li><span onClick={() => handleSectionClick('premium-members')} className="footer-link-no-underline" style={{cursor: 'pointer'}}>Premium Members</span></li> */}
                                <li><span onClick={() => handleSectionClick('packages')} className="footer-link-no-underline" style={{cursor: 'pointer'}}>Packages</span></li>
                                <li><span onClick={() => handleSectionClick('reviews')} className="footer-link-no-underline" style={{cursor: 'pointer'}}>Reviews</span></li>
                            </ul>
                        </Col>
                        <Col xs={12} sm={6} md={3} className="footer-section mb-4 mb-md-0">
                            <h5>Contact Details</h5>
                            <div className="footer-heading-linee"></div>
                            <ul>
                                <li>Email: contact@mehrammatch.com</li>
                            </ul>
                        </Col>
                        <Col xs={12} sm={6} md={3} className="footer-section mb-4 mb-md-0">
  <h5>USEFUL LINKS</h5>
  <div className="footer-heading-linee"></div>
  <ul className="footer-links-list">
    <li className="footer-link-item">
      <span onClick={() => handleSectionClick('faqs')} className="footer-link-no-underline" style={{cursor: 'pointer'}}>FAQ</span>
    </li>
    <li className="footer-link-item">
      <Link to="/terms-conditions" className="footer-link-no-underline">Terms & Conditions</Link>
    </li>
    <li className="footer-link-item">
      <Link to="/privacy-policy" className="footer-link-no-underline" style={{transition: 'all 0.3s ease'}}>Privacy Policy</Link>
    </li>
    {/* <li className="footer-link-item">
      <Link to="/refund-request" className="footer-link-no-underline">Request a Refund</Link>
    </li> */}
  </ul>
</Col>
                        <Col xs={12} sm={12} md={3} className="footer-section mb-4 mb-md-0">
                            <h5>MOBILE</h5>
                            <div className="footer-heading-linee"></div>
                            <div className="d-flex flex-column flex-sm-row gap-2">
                                <img src={andlogo} alt="Google Play" className="store-badge" />
                                <img src={applogo} alt="App Store" className="store-badge" />
                            </div>
                        </Col>
                    </Row>
                </Row>

                <Row className="footer-bottom mt-4">
                    <Col xs={12} md={8} className="text-center text-md-start mb-3 mb-md-0">
                        <p className="mb-0">&copy; 2025 mehrammatch.com | Trademarks and brands are the property of their respective owners.</p>
                    </Col>
                    <Col xs={12} md={4} className="text-center text-md-end">
                        <div className="social-icons">
                            <a
  href="https://www.facebook.com/mehrammatch?mibextid=ZbWKwL"
  target="_blank"
  rel="noopener noreferrer"
>
  <FaFacebook className="social-icon facebook" />
</a>
                            <a
  href="https://www.instagram.com/mehrammatch?igsh=MWpxMXh6eWRlZ3hxMw=="
  target="_blank"
  rel="noopener noreferrer"
>
  <FaInstagram className="social-icon instagram" />
</a>

                            <a
  href="https://youtube.com/@mehrammatch?si=HUR2BfvfiLTidsqm"
  target="_blank"
  rel="noopener noreferrer"
>
  <FaYoutube className="social-icon youtube" />
</a>
                            <a
  href="https://www.linkedin.com/in/mehram-match-70a197358/?originalSubdomain=in"
  target="_blank"
  rel="noopener noreferrer"
>
  <FaLinkedin className="social-icon linkedin" />
</a>
                        </div>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;














// import React from 'react'
// import "./footer.css"
// import footerLogo from "../../images/footerLogo.png"
// import facebook from "../../images/facebook.svg"
// import insta from "../../images/insta2.svg"
// import twitter from "../../images/twitter.svg"
// import linkedin from "../../images/linkedin.svg"

// import playstore from "../../images/icons8-playstore (1).svg"
// import appStore from "../../images/icons8-apple.svg"

// const Footer = () => {
//     return (
//         <>
//             {/* Footer */}
//             {/* <footer className="py-16 md:py-32 bg-transparent text-left">
//                 <div className="max-w-[1200px] mx-auto px-4">
//                     <h2 className="text-2xl md:text-3xl bg-gradient-to-r from-[#FF59B6] to-[#CB3B8B] text-transparent bg-clip-text font-semibold leading-tight mb-6">Contact Us</h2>

//                     <h3 className="text-base md:text-lg text-[#EC80BC] font-semibold mb-2">
//                         Riyadh, King Saud University, College of Computer and Information Sciences
//                     </h3>
//                     <h3 className="text-base md:text-lg text-[#EC80BC] font-semibold mb-2">+91 12345 67890</h3>
//                     <h3 className="text-base md:text-lg text-[#EC80BC] font-semibold mb-2">inquiry@mehrammatch.in</h3>

//                     <svg className="mt-6" width="164" height="28" viewBox="0 0 164 28" fill="none" xmlns="http://www.w3.org/2000/svg">
//                         <path d="M24.8641 8.99713C24.8641 6.93948 23.6482 5.18916 21.8979 4.4142C21.2833 4.14697 20.6152 4 19.9071 4C18.277 4 16.834 4.78831 15.9387 5.99083C15.0302 4.78831 13.5871 4 11.957 4C9.21797 4 7 6.23133 7 8.99713C7 12.578 8.89731 15.317 11.0084 17.1743C12.5717 18.5505 14.2686 19.4457 15.3776 19.8198C15.6849 19.9267 16.1793 19.9267 16.4866 19.8198C18.4889 19.1386 22.3969 16.783 24.0714 12.864" stroke="#EB53A7" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
//                         <path d="M20 15.0024C20 12.7872 21.7765 11 23.9703 11C25.2759 11 26.4317 11.6314 27.1594 12.5945C27.8764 11.6314 29.0322 11 30.3378 11C30.9049 11 31.44 11.1177 31.9323 11.3317C33.3342 11.9524 34.308 13.3543 34.308 15.0024C34.308 20.0107 29.6743 22.9644 27.5981 23.6707C27.352 23.7563 26.956 23.7563 26.7099 23.6707C25.8217 23.3711 24.4626 22.654 23.2105 21.5518C22.5109 20.9364 21.8407 20.2 21.2953 19.3451" stroke="#EB53A7" stroke-width="1.20141" stroke-linecap="round" stroke-linejoin="round" />
//                         <path d="M53.0781 7.70118C52.0625 8.03972 51.278 8.5931 50.7246 9.36133C50.1777 10.123 49.9043 11.0703 49.9043 12.2031C49.9043 12.6328 49.9499 12.9714 50.041 13.2187C50.0605 13.2904 50.0931 13.362 50.1387 13.4336C50.1647 13.4792 50.1777 13.528 50.1777 13.5801C49.5006 13.5801 48.9831 13.4434 48.625 13.1699C48.2344 12.8704 48.0391 12.4017 48.0391 11.7637C48.0391 11.347 48.1237 10.9238 48.293 10.4941C48.4622 10.0645 48.7031 9.64779 49.0156 9.24414C49.3216 8.85352 49.6764 8.48894 50.0801 8.15039C50.4902 7.80534 50.9329 7.50586 51.4082 7.25195C51.8835 6.99154 52.375 6.79297 52.8828 6.65625C53.3971 6.51302 53.9049 6.44141 54.4062 6.44141C54.901 6.44141 55.4056 6.53581 55.9199 6.72461L55.4609 17.2617L59.8652 6.72461H62.7461L60.6465 21.4414H57.7656L59.0449 12.457L55.2852 21.4414H52.541L52.9414 12.418L49.6016 21.4414H48L53.0781 7.70118ZM65.2656 21.5586C64.2825 21.5586 63.5241 21.3112 62.9902 20.8164C62.4238 20.2891 62.1406 19.4785 62.1406 18.3848C62.1406 17.9746 62.1829 17.5189 62.2676 17.0176C62.3457 16.5163 62.4661 16.015 62.6289 15.5137C62.8112 14.9538 63.0423 14.4232 63.3223 13.9219C63.6087 13.4206 63.9407 12.9779 64.3183 12.5937C65.1907 11.7083 66.265 11.2656 67.541 11.2656C68.3548 11.2656 68.9473 11.4609 69.3183 11.8516C69.6048 12.1576 69.748 12.6003 69.748 13.1797C69.748 13.7461 69.6243 14.2799 69.3769 14.7812C69.1295 15.276 68.7878 15.7155 68.3516 16.0996C67.9154 16.4772 67.4206 16.7799 66.8672 17.0078C66.3138 17.2292 65.7409 17.3594 65.1484 17.3984C65.1159 17.737 65.0996 18.0039 65.0996 18.1992C65.0996 18.8503 65.2233 19.2995 65.4707 19.5469C65.6855 19.7682 66.0436 19.8789 66.5449 19.8789C67.2676 19.8789 67.9284 19.6836 68.5273 19.293C68.7812 19.1302 69.0254 18.9381 69.2598 18.7168C69.4941 18.4889 69.7676 18.2025 70.0801 17.8574H70.7637C70.1322 18.9251 69.4062 19.7747 68.5859 20.4062C67.5768 21.1745 66.47 21.5586 65.2656 21.5586ZM65.3047 16.4414C65.6758 16.4154 66.0371 16.3079 66.3887 16.1191C66.7402 15.9303 67.0527 15.6829 67.3262 15.377C67.5996 15.0645 67.8144 14.7161 67.9707 14.332C68.1269 13.9414 68.2051 13.5443 68.2051 13.1406C68.2051 12.8737 68.166 12.6719 68.0879 12.5352C68.0163 12.3919 67.8893 12.3203 67.707 12.3203C67.4661 12.3203 67.222 12.4375 66.9746 12.6719C66.7337 12.9062 66.4993 13.2285 66.2715 13.6387C66.0631 14.0228 65.8743 14.459 65.7051 14.9473C65.5358 15.4355 65.4023 15.9336 65.3047 16.4414ZM77.2969 21.5586C76.47 21.5586 75.8581 21.3242 75.4609 20.8555C75.1159 20.4518 74.9433 19.9342 74.9433 19.3027C74.9433 19.0032 74.9792 18.6549 75.0508 18.2578C75.1289 17.8607 75.2428 17.3496 75.3926 16.7246C75.5423 16.0866 75.653 15.5788 75.7246 15.2012C75.8027 14.8171 75.8418 14.485 75.8418 14.2051C75.8418 13.5215 75.6009 13.1797 75.1191 13.1797C74.7806 13.1797 74.4681 13.3587 74.1816 13.7168C73.9407 14.0228 73.7324 14.459 73.5566 15.0254L72.1992 21.4414H69.3183L72.2187 7.83789L75.1777 7.4375L74.1035 12.4766C74.4941 12.0404 74.9141 11.7344 75.3633 11.5586C75.6953 11.4284 76.0534 11.3633 76.4375 11.3633C77.1146 11.3633 77.6484 11.5391 78.0391 11.8906C78.4557 12.2747 78.6641 12.8509 78.6641 13.6191C78.6641 14.0814 78.5794 14.6836 78.4101 15.4258C78.3646 15.6406 78.2897 15.9629 78.1855 16.3926C77.9967 17.1152 77.86 17.6914 77.7754 18.1211C77.7233 18.3945 77.6973 18.6159 77.6973 18.7852C77.6973 19.0521 77.7559 19.2604 77.873 19.4102C77.9967 19.5534 78.2051 19.625 78.498 19.625C78.8952 19.625 79.2305 19.4622 79.5039 19.1367C79.7122 18.8893 79.9368 18.4629 80.1777 17.8574H81.0176C80.5228 19.3223 79.8978 20.3476 79.1426 20.9336C78.6087 21.3503 77.9935 21.5586 77.2969 21.5586ZM81.5351 11.4414H84.416L84.1621 12.6816C84.6178 12.278 84.9889 11.9915 85.2754 11.8223C85.7181 11.5684 86.151 11.4414 86.5742 11.4414C87.0039 11.4414 87.3489 11.5944 87.6094 11.9004C87.7266 12.0371 87.8144 12.1966 87.873 12.3789C87.9316 12.5547 87.9609 12.7435 87.9609 12.9453C87.9609 13.1276 87.9316 13.3034 87.873 13.4727C87.8144 13.6419 87.7266 13.7949 87.6094 13.9316C87.4792 14.0749 87.3197 14.1888 87.1309 14.2734C86.9486 14.3581 86.7435 14.4004 86.5156 14.4004C86.3398 14.4004 86.1999 14.3711 86.0957 14.3125C85.9915 14.2539 85.9101 14.1693 85.8516 14.0586C85.7995 13.9479 85.7637 13.8405 85.7441 13.7363C85.6855 13.4564 85.6269 13.2708 85.5683 13.1797C85.5228 13.1146 85.4512 13.082 85.3535 13.082C85.0736 13.082 84.8359 13.1406 84.6406 13.2578C84.4453 13.375 84.1979 13.5703 83.8984 13.8437L82.2969 21.4414H79.416L81.5351 11.4414ZM90.0996 21.5586C89.3379 21.5586 88.7226 21.321 88.2539 20.8457C87.707 20.2858 87.4336 19.4525 87.4336 18.3457C87.4336 17.8769 87.4824 17.3822 87.5801 16.8613C87.6712 16.3405 87.8079 15.8262 87.9902 15.3184C88.4069 14.1725 88.9766 13.248 89.6992 12.5449C90.5325 11.7441 91.4928 11.3437 92.5801 11.3437C93.1204 11.3437 93.5241 11.4381 93.791 11.627C94.0644 11.8092 94.2012 12.0534 94.2012 12.3594V12.5059L94.416 11.4414H97.2969L95.8613 18.2383C95.8027 18.4336 95.7734 18.6484 95.7734 18.8828C95.7734 19.4557 96.0469 19.7422 96.5937 19.7422C96.9583 19.7422 97.2904 19.5566 97.5898 19.1855C97.8437 18.873 98.0521 18.4303 98.2148 17.8574H99.0547C98.6966 18.873 98.2637 19.6771 97.7559 20.2695C97.3262 20.7578 96.8411 21.1094 96.3008 21.3242C95.9036 21.4805 95.4837 21.5586 95.041 21.5586C94.4746 21.5586 94.0221 21.4056 93.6836 21.0996C93.3516 20.7871 93.1497 20.3281 93.0781 19.7226C92.7005 20.2565 92.3034 20.6732 91.8867 20.9726C91.3529 21.3633 90.7572 21.5586 90.0996 21.5586ZM91.3984 19.625C91.5482 19.625 91.7044 19.5859 91.8672 19.5078C92.0364 19.4297 92.1992 19.319 92.3555 19.1758C92.707 18.8372 92.9414 18.3978 93.0586 17.8574L94.0156 13.3457C94.0156 13.2806 93.9993 13.2057 93.9668 13.1211C93.9407 13.0299 93.9017 12.9453 93.8496 12.8672C93.6933 12.6784 93.4753 12.584 93.1953 12.584C92.9284 12.584 92.668 12.6719 92.4141 12.8477C92.1667 13.0234 91.9323 13.2676 91.7109 13.5801C91.3203 14.1465 90.998 14.8854 90.7441 15.7969C90.6269 16.2005 90.5391 16.6009 90.4805 16.998C90.4219 17.3887 90.3926 17.7435 90.3926 18.0625C90.3926 18.7266 90.5163 19.1758 90.7637 19.4102C90.8483 19.5013 90.9427 19.5599 91.0469 19.5859C91.151 19.612 91.2682 19.625 91.3984 19.625ZM110.383 21.5586C109.556 21.5586 108.944 21.3242 108.547 20.8555C108.202 20.4518 108.029 19.9342 108.029 19.3027C108.029 19.0032 108.065 18.6549 108.137 18.2578C108.215 17.8607 108.329 17.3496 108.479 16.7246C108.628 16.0866 108.739 15.5788 108.811 15.2012C108.889 14.8171 108.928 14.485 108.928 14.2051C108.928 13.5215 108.687 13.1797 108.205 13.1797C107.867 13.1797 107.554 13.3587 107.268 13.7168C107.027 14.0228 106.818 14.459 106.643 15.0254L105.285 21.4414H102.404L103.869 14.5371C103.908 14.3809 103.928 14.2148 103.928 14.0391C103.928 13.7721 103.885 13.5671 103.801 13.4238C103.69 13.248 103.531 13.1602 103.322 13.1602C102.945 13.1602 102.616 13.3424 102.336 13.707C102.089 14.0195 101.877 14.459 101.701 15.0254L100.344 21.4414H97.4629L99.582 11.4414H102.463L102.248 12.4766C102.639 12.0404 103.065 11.7311 103.527 11.5488C103.892 11.4121 104.279 11.3437 104.689 11.3437C105.249 11.3437 105.695 11.474 106.027 11.7344C106.398 12.0273 106.636 12.4701 106.74 13.0625C107.17 12.3984 107.665 11.9297 108.225 11.6562C108.622 11.4609 109.055 11.3633 109.523 11.3633C110.194 11.3633 110.725 11.5391 111.115 11.8906C111.532 12.2747 111.74 12.8509 111.74 13.6191C111.74 14.0553 111.659 14.6576 111.496 15.4258C111.431 15.7448 111.353 16.0671 111.262 16.3926C111.099 17.0176 110.966 17.5937 110.861 18.1211C110.809 18.3945 110.783 18.6159 110.783 18.7852C110.783 19.0521 110.842 19.2604 110.959 19.4102C111.083 19.5534 111.291 19.625 111.584 19.625C111.981 19.625 112.316 19.4622 112.59 19.1367C112.798 18.8893 113.023 18.4629 113.264 17.8574H114.104C113.609 19.3223 112.984 20.3476 112.229 20.9336C111.695 21.3503 111.079 21.5586 110.383 21.5586ZM119.68 7.70118C118.664 8.03972 117.88 8.5931 117.326 9.36133C116.779 10.123 116.506 11.0703 116.506 12.2031C116.506 12.6328 116.551 12.9714 116.643 13.2187C116.662 13.2904 116.695 13.362 116.74 13.4336C116.766 13.4792 116.779 13.528 116.779 13.5801C116.102 13.5801 115.585 13.4434 115.227 13.1699C114.836 12.8704 114.641 12.4017 114.641 11.7637C114.641 11.347 114.725 10.9238 114.895 10.4941C115.064 10.0645 115.305 9.64779 115.617 9.24414C115.923 8.85352 116.278 8.48894 116.682 8.15039C117.092 7.80534 117.535 7.50586 118.01 7.25195C118.485 6.99154 118.977 6.79297 119.484 6.65625C119.999 6.51302 120.507 6.44141 121.008 6.44141C121.503 6.44141 122.007 6.53581 122.522 6.72461L122.063 17.2617L126.467 6.72461H129.348L127.248 21.4414H124.367L125.647 12.457L121.887 21.4414H119.143L119.543 12.418L116.203 21.4414H114.602L119.68 7.70118ZM131.408 21.5586C130.647 21.5586 130.031 21.321 129.563 20.8457C129.016 20.2858 128.742 19.4525 128.742 18.3457C128.742 17.8769 128.791 17.3822 128.889 16.8613C128.98 16.3405 129.117 15.8262 129.299 15.3184C129.716 14.1725 130.285 13.248 131.008 12.5449C131.841 11.7441 132.801 11.3437 133.889 11.3437C134.429 11.3437 134.833 11.4381 135.1 11.627C135.373 11.8092 135.51 12.0534 135.51 12.3594V12.5059L135.725 11.4414H138.606L137.17 18.2383C137.111 18.4336 137.082 18.6484 137.082 18.8828C137.082 19.4557 137.356 19.7422 137.902 19.7422C138.267 19.7422 138.599 19.5566 138.898 19.1855C139.152 18.873 139.361 18.4303 139.523 17.8574H140.363C140.005 18.873 139.572 19.6771 139.064 20.2695C138.635 20.7578 138.15 21.1094 137.609 21.3242C137.212 21.4805 136.792 21.5586 136.35 21.5586C135.783 21.5586 135.331 21.4056 134.992 21.0996C134.66 20.7871 134.458 20.3281 134.387 19.7226C134.009 20.2565 133.612 20.6732 133.195 20.9726C132.661 21.3633 132.066 21.5586 131.408 21.5586ZM132.707 19.625C132.857 19.625 133.013 19.5859 133.176 19.5078C133.345 19.4297 133.508 19.319 133.664 19.1758C134.016 18.8372 134.25 18.3978 134.367 17.8574L135.324 13.3457C135.324 13.2806 135.308 13.2057 135.275 13.1211C135.249 13.0299 135.21 12.9453 135.158 12.8672C135.002 12.6784 134.784 12.584 134.504 12.584C134.237 12.584 133.977 12.6719 133.723 12.8477C133.475 13.0234 133.241 13.2676 133.02 13.5801C132.629 14.1465 132.307 14.8854 132.053 15.7969C131.936 16.2005 131.848 16.6009 131.789 16.998C131.731 17.3887 131.701 17.7435 131.701 18.0625C131.701 18.7266 131.825 19.1758 132.072 19.4102C132.157 19.5013 132.251 19.5599 132.356 19.5859C132.46 19.612 132.577 19.625 132.707 19.625ZM141.516 21.5586C140.878 21.5586 140.373 21.3698 140.002 20.9922C139.585 20.5755 139.377 19.9668 139.377 19.166C139.377 18.7884 139.429 18.3522 139.533 17.8574L140.734 12.2422H140.07L140.236 11.4414H140.891L141.496 8.67774L144.455 8.27735L143.772 11.4414H144.973L144.816 12.2422H143.615L142.336 18.2383C142.284 18.4075 142.258 18.6224 142.258 18.8828C142.258 19.1562 142.32 19.3483 142.443 19.459C142.574 19.5697 142.782 19.625 143.068 19.625C143.264 19.625 143.453 19.5827 143.635 19.498C143.824 19.4069 143.996 19.2832 144.152 19.1269C144.471 18.8079 144.712 18.3848 144.875 17.8574H145.715C145.357 18.8665 144.908 19.6706 144.367 20.2695C143.911 20.7578 143.397 21.1094 142.824 21.3242C142.408 21.4805 141.971 21.5586 141.516 21.5586ZM147.746 21.5586C146.763 21.5586 146.005 21.3112 145.471 20.8164C144.904 20.2891 144.621 19.4785 144.621 18.3848C144.621 17.9746 144.663 17.5189 144.748 17.0176C144.826 16.5098 144.95 16.0052 145.119 15.5039C145.516 14.2865 146.079 13.3164 146.809 12.5937C147.707 11.7083 148.771 11.2656 150.002 11.2656C150.803 11.2656 151.395 11.4577 151.779 11.8418C152.079 12.1478 152.228 12.5677 152.228 13.1016C152.228 13.5703 152.124 13.9349 151.916 14.1953C151.721 14.4362 151.47 14.5566 151.164 14.5566C150.943 14.5566 150.708 14.4785 150.461 14.3223C150.624 13.8991 150.705 13.5052 150.705 13.1406C150.705 12.8867 150.656 12.6881 150.558 12.5449C150.467 12.3952 150.331 12.3203 150.148 12.3203C149.758 12.3203 149.351 12.6654 148.928 13.3555C148.544 13.9674 148.224 14.7454 147.971 15.6895C147.71 16.6139 147.58 17.4505 147.58 18.1992C147.58 18.8503 147.704 19.2995 147.951 19.5469C148.166 19.7682 148.524 19.8789 149.025 19.8789C149.748 19.8789 150.409 19.6836 151.008 19.293C151.262 19.1302 151.506 18.9381 151.74 18.7168C151.974 18.4889 152.248 18.2025 152.56 17.8574H153.244C152.613 18.9251 151.887 19.7747 151.066 20.4062C150.057 21.1745 148.95 21.5586 147.746 21.5586ZM159.777 21.5586C158.95 21.5586 158.338 21.3242 157.941 20.8555C157.596 20.4518 157.424 19.9342 157.424 19.3027C157.424 19.0032 157.46 18.6549 157.531 18.2578C157.609 17.8607 157.723 17.3496 157.873 16.7246C158.023 16.0866 158.133 15.5788 158.205 15.2012C158.283 14.8171 158.322 14.485 158.322 14.2051C158.322 13.5215 158.081 13.1797 157.6 13.1797C157.261 13.1797 156.948 13.3587 156.662 13.7168C156.421 14.0228 156.213 14.459 156.037 15.0254L154.68 21.4414H151.799L154.699 7.83789L157.658 7.4375L156.584 12.4766C156.974 12.0404 157.394 11.7344 157.844 11.5586C158.176 11.4284 158.534 11.3633 158.918 11.3633C159.595 11.3633 160.129 11.5391 160.519 11.8906C160.936 12.2747 161.144 12.8509 161.144 13.6191C161.144 14.0814 161.06 14.6836 160.891 15.4258C160.845 15.6406 160.77 15.9629 160.666 16.3926C160.477 17.1152 160.34 17.6914 160.256 18.1211C160.204 18.3945 160.178 18.6159 160.178 18.7852C160.178 19.0521 160.236 19.2604 160.353 19.4102C160.477 19.5534 160.685 19.625 160.978 19.625C161.376 19.625 161.711 19.4622 161.984 19.1367C162.193 18.8893 162.417 18.4629 162.658 17.8574H163.498C163.003 19.3223 162.378 20.3476 161.623 20.9336C161.089 21.3503 160.474 21.5586 159.777 21.5586Z" fill="url(#paint0_linear_2508_4836)" />
//                         <defs>
//                             <linearGradient id="paint0_linear_2508_4836" x1="153.988" y1="-0.676277" x2="75.5944" y2="52.4956" gradientUnits="userSpaceOnUse">
//                                 <stop stop-color="#CB3B8B" />
//                                 <stop offset="1" stop-color="#FF59B6" />
//                             </linearGradient>
//                         </defs>
//                     </svg>
                    
//                     <hr className="border-[#EC80BC] mt-12 mb-12" />

//                     <p className="mt-4 text-[#EC80BC] text-base md:text-lg">
//                         &copy; {new Date().getFullYear()} MehramMatch. All rights reserved.
//                     </p>

//                     <p className="mt-8 text-[#EC80BC] text-base md:text-lg">
//                         Designed & Developed by <a href="https://www.usmaniyaz.com">usmaniyaz.com</a>
//                     </p>

//                 </div>
//             </footer> */}


//             <div className="FooterContainer">
//             <div className="inner">
//     <div className="FooterDetails">
//         <div className="FooterLeft">
//             <div className="FooterLeftUpper">
//                 <img src={footerLogo} alt="Logo" />
//             </div>
//             <h4>
//                 One of India's best-known brands and the world's largest matrimonial service, Mehram Match was founded with a simple objective: to help people find happiness. 
//                 The company pioneered online matrimonial services in 1996 and continues to lead the exciting matrimony category.
//             </h4>
//         </div>
//         <div className="FooterRight">
//             <div className="FooterRightOne">
//                 <div className="FooterRightOneUpper">
//                     <h5>Help & Support</h5>
//                     <hr />
//                 </div>
//                 <h4>Contact Us</h4>
//                 <h4>FAQs</h4>
//                 <h4>Success Stories</h4>
//                 <h4>Payment Options</h4>
//                 <h4>Member Demographics</h4>
//             </div>
//             <div className="FooterRightTwo">
//                 <div className="FooterRightTwoUpper">
//                     <h5>Information</h5>
//                     <hr />
//                 </div>
//                 <h4>About Us</h4>
//                 <h4>Privacy Policy</h4>
//                 <h4>Refund Policy</h4>
//                 <h4>Report Misuse</h4>
//                 <h4>Terms & Conditions</h4>
//                 <h4>Blog</h4>
//             </div>
//             <div className="FooterRightThree">
//                 <div className="FooterRightThreeUpper">
//                     <h5>Others</h5>
//                     <hr />
//                 </div>
//                 <h4>Register</h4>
//                 <h4>Login</h4>
//                 <h4>Advertise with Us</h4>
//             </div>
//         </div>
        
//     </div>
//     <hr className='belowLine'/>

//     <div className="FooterLower">
//         <div className="SocialIcon">
//             <div className="ImgOne">
//                 <img src={facebook} alt="Social Icon 1" />
//             </div>
//             <div className="ImgTwo">
//                 <img src={twitter} style={{height : "1.2rem", width : "1.2rem"}} alt="Social Icon 2" />
//             </div>
//             <div className="ImgTwo" >
//                 <img src={linkedin} style={{height : "1rem", width : "1rem"}} alt="Social Icon 3" />
//             </div>
//             <div className="ImgThree">
//                 <img src={insta} style={{height : "1.8rem", width : "1.8rem"}} alt="Social Icon 3" />
//             </div>
//         </div>
//         <div className="Download">
//             <button><img src={playstore} alt="" /> Google Play</button>
//             <button><img src={appStore} alt="" />App Store</button>
//         </div>
//         <div className="copy">
//         <p >&copy; Copyright 2024-25 by Mehram Match. All Rights Reserved.</p>
//         </div>
//     </div>
//     </div>
// </div>
//         </>
//     )
// }

// export default Footer

