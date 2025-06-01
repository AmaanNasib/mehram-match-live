import React from 'react';
import './TermsCondition.css';

const TermsCondition = () => {
  return (
    <div className="terms-container">
      <div className="terms-header">
        <h1>Terms and Conditions</h1>
        <p className="last-updated">Last Updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="terms-content">
        <section className="term-section">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using MehramMatch ("the Platform"), you agree to comply with these Terms and Conditions ("Terms"). 
            If you disagree with any part of these terms, you must refrain from using the Platform.
          </p>
        </section>

        <section className="term-section">
          <h2>2. Eligibility</h2>
          <ul>
            <li>Users must be at least 18 years old or the legal age of majority in their jurisdiction.</li>
            <li>The Platform is intended for individuals seeking marriage in accordance with Islamic principles.</li>
            <li>By joining, you confirm you are legally permitted to marry under applicable laws.</li>
          </ul>
        </section>

        <section className="term-section">
          <h2>3. User Accounts</h2>
          <ul>
            <li>Provide accurate, current, and complete information during registration.</li>
            <li>Maintain confidentiality of your account credentials.</li>
            <li>Promptly update any changes to your profile information.</li>
          </ul>
        </section>

        <section className="term-section">
          <h2>4. Islamic Principles</h2>
          <p>
            Users agree to respect Islamic values (Quran and Sunnah) in all interactions on the Platform.
          </p>
          <p className="prohibited">
            Prohibited: Any content contradicting Islamic teachings (e.g., promoting alcohol, gambling, indecency).
          </p>
        </section>

        <section className="term-section">
          <h2>5. Prohibited Conduct</h2>
          <p>Users must not:</p>
          <ul>
            <li>Post false, misleading, or offensive content.</li>
            <li>Harass, defame, or discriminate against others.</li>
            <li>Share copyrighted material without authorization.</li>
            <li>Solicit money or engage in commercial activities.</li>
            <li>Use the Platform for illegal purposes or matchmaking outside marriage.</li>
          </ul>
        </section>

        <section className="term-section">
          <h2>6. Profile Guidelines</h2>
          <ul>
            <li>Profiles must reflect genuine marital intentions.</li>
            <li className="prohibited">Prohibited: Married individuals seeking additional spouses without disclosing current marital status.</li>
            <li>Profiles may be removed for violations of these guidelines.</li>
          </ul>
        </section>

        <section className="term-section">
          <h2>7. Privacy</h2>
          <p>
            Personal data is handled in accordance with our <a href="/privacy-policy">Privacy Policy</a>, 
            compliant with applicable regulations (e.g., GDPR).
          </p>
          <p>
            Users are responsible for safeguarding their personal information and interactions.
          </p>
        </section>

        <section className="term-section">
          <h2>8. Intellectual Property</h2>
          <ul>
            <li>All Platform content is owned by MehramMatch.</li>
            <li>Users grant the Platform a non-exclusive license to display their provided content.</li>
          </ul>
        </section>

        <section className="term-section">
          <h2>9. Payments & Subscriptions</h2>
          <ul>
            <li>Premium features may require payment of applicable fees.</li>
            <li>Refunds are subject to our stated refund policies.</li>
            <li>Subscriptions may automatically renew unless canceled by the user.</li>
          </ul>
        </section>

        <section className="term-section">
          <h2>10. Termination</h2>
          <ul>
            <li>The Platform reserves the right to suspend or terminate accounts for breaches of these Terms.</li>
            <li>Users may delete accounts via provided tools; residual data may persist in backup systems.</li>
          </ul>
        </section>

        <section className="term-section">
          <h2>11. Disclaimers</h2>
          <ul>
            <li>The Platform does not guarantee matches or verify all user information.</li>
            <li>Not liable for offline user interactions or damages arising from Platform use.</li>
          </ul>
        </section>

        <section className="term-section">
          <h2>12. Governing Law & Dispute Resolution</h2>
          <ul>
            <li>These Terms are governed by the laws of India.</li>
            <li>Disputes shall be resolved through mediation or arbitration in accordance with Islamic principles.</li>
          </ul>
        </section>

        <section className="term-section">
          <h2>13. Amendments</h2>
          <p>
            These Terms may be updated periodically with appropriate notice. Continued use of the Platform 
            after such changes constitutes acceptance of the modified Terms.
          </p>
        </section>

        <section className="term-section contact-section">
          <h2>14. Contact</h2>
          <p>
            For any questions regarding these Terms and Conditions, please contact us at 
            <a href="mailto:support@mehrammatch.com"> support@mehrammatch.com</a>.
          </p>
          <p className="blessing">
            May your journey toward a blessed union be guided by faith and integrity. 🌙
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsCondition;