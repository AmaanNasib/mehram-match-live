import React from 'react';
import './liteProfileCard.css';

const LiteProfileCard = ({ profile, onClick, onFullProfile }) => {
  const placeholder = `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3b82f6">
      <circle cx="12" cy="8" r="5" fill="#bfdbfe"/>
      <path d="M12 14c-4.42 0-8 2.69-8 6v1h16v-1c0-3.31-3.58-6-8-6z" fill="#bfdbfe"/>
    </svg>`
  )}`;

  const imageSrc = (() => {
    const raw = profile?.profile_photo;
    if (!raw) return placeholder;
    if (typeof raw === 'string' && /^https?:\/\//i.test(raw)) return raw;
    const base = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL)
      ? import.meta.env.VITE_API_BASE_URL
      : (process.env.REACT_APP_API_URL || '');
    const normalized = typeof raw === 'string' ? (raw.startsWith('/') ? raw : `/${raw}`) : null;
    return normalized ? `${base || window.location.origin}${normalized}` : placeholder;
  })();

  const openFullProfile = (e) => {
    e.stopPropagation();
    if (onFullProfile) onFullProfile(profile);
    else if (onClick) onClick(profile);
  };

  return (
    <div className="lite-card" onClick={onClick ? () => onClick(profile) : undefined}>
      {/* Agent Verified Ribbon */}
      {profile?.agent_id && (
        <div className="agent-verified-ribbon" style={{
          position: 'absolute',
          top: '8px',
          left: '8px',
          background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '10px',
          fontWeight: '600',
          zIndex: 10,
          boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 12l2 2 4-4"/>
            <circle cx="12" cy="12" r="10"/>
          </svg>
          Agent Verified
        </div>
      )}
      
      <div className="lite-photo">
        <img src={imageSrc} alt="Profile" />
      </div>
      <div className="lite-body">
        <div className="lite-name-row">
          <h3 className="lite-name">{profile?.name?.split(' ')[0] || 'Not Mentioned'}</h3>
          <span className={`lite-badge`}>{(profile?.martial_status || 'Not Mentioned').toUpperCase()}</span>
        </div>

        {/* Age + Full Profile CTA */}
        <div className="lite-age-row">
          <span className="lite-age">{profile?.age ?? 'NA'}</span>
          {/* <button className="lite-cta-vertical" onClick={openFullProfile} aria-label="Full Profile">
            <svg width="24" height="24" viewBox="0 0 14 14" fill="none" stroke="#ff4081">
              <path d="M6.59961 2.60039C6.09128 2.60039 5.62253 2.72539 5.19336 2.97539C4.76419 3.22539 4.42461 3.56497 4.17461 3.99414C3.92461 4.42331 3.79961 4.89206 3.79961 5.40039C3.79961 5.87539 3.91003 6.31706 4.13086 6.72539C4.35169 7.13372 4.65378 7.46706 5.03711 7.72539C4.56211 7.93372 4.13919 8.22122 3.76836 8.58789C3.39753 8.95456 3.11211 9.37539 2.91211 9.85039C2.70378 10.3421 2.59961 10.8587 2.59961 11.4004H3.39961C3.39961 10.8171 3.54336 10.2816 3.83086 9.79414C4.11836 9.30664 4.50586 8.91914 4.99336 8.63164C5.48086 8.34414 6.01628 8.20039 6.59961 8.20039C7.18294 8.20039 7.71836 8.34414 8.20586 8.63164C8.69336 8.91914 9.08086 9.30664 9.36836 9.79414C9.65586 10.2816 9.79961 10.8171 9.79961 11.4004H10.5996C10.5996 10.8587 10.4954 10.3421 10.2871 9.85039C10.0871 9.37539 9.80169 8.95456 9.43086 8.58789C9.06003 8.22122 8.63711 7.93372 8.16211 7.72539C8.54544 7.46706 8.84753 7.13372 9.06836 6.72539C9.28919 6.31706 9.39961 5.87539 9.39961 5.40039C9.39961 4.89206 9.27461 4.42331 9.02461 3.99414C8.77461 3.56497 8.43503 3.22539 8.00586 2.97539C7.57669 2.72539 7.10794 2.60039 6.59961 2.60039Z" fill="#6D6E6F" strokeWidth="0.5"/>
            </svg>
            <span>Full Profile</span>
          </button> */}
        </div>

        {/* Stacked details */}
        <div className="lite-meta vstack">
          <span>{profile?.profession || 'Not Mentioned'}</span>
          <span>{profile?.education || 'Not Mentioned'}</span>
        </div>
      </div>
    </div>
  );
};

export default LiteProfileCard;
