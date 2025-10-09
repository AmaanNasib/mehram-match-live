import React from 'react';
import "./analytics.css";
import people from "../../../images/people.svg";
import eye from "../../../images/eye.svg";
import chat from "../../../images/Chat3.svg";
import users from "../../../images/Users1.svg";
import handshake from "../../../images/Handshake.svg";
const Analytics = ({ apiData }) => {
    // Backend API data commented out for now - using hardcoded frontend numbers
    // const safe = {
    //     active_user: apiData?.active_user ?? 1247,
    //     total_visitors: apiData?.total_visitors ?? 15680,
    //     profile_view: apiData?.profile_view ?? 8934,
    //     message_exchange: apiData?.message_exchange ?? 3421,
    //     agent_interactions: apiData?.agent_interactions ?? 567,
    // };

    // Hardcoded numbers for frontend display
    const safe = {
        active_user: 1247,
        total_visitors: 15680,
        profile_view: 8934,
        message_exchange: 3421,
        agent_interactions: 567,
    };

    const cards = [
        { key: 'total_visitors', label: 'Website Visitors', icon: people, alt: 'Website Visitors' },
        { key: 'profile_view', label: 'Profile Viewed', icon: eye, alt: 'Profile Viewed' },
        { key: 'message_exchange', label: 'Message Exchange', icon: chat, alt: 'Message Exchange' },
        { key: 'active_user', label: 'Active Users', icon: users, alt: 'Active Users' },
        { key: 'agent_interactions', label: 'Agent interactions', icon: handshake, alt: 'Agent interactions' },
    ];

    return (
        <div className="mainAnalytics px-4 sm:px-6 lg:px-8">
            <div className="analyticsTop">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl mt-16 sm:mt-24 font-bold font-['Poppins'] bg-gradient-to-r from-[#FF59B6] to-[#CB3B8B] text-transparent bg-clip-text pb-6 text-center">
                    Analytics
                </h2>

            </div>
            <div className="analyticsBottom gridWrap">
                {cards.map((c) => (
                    <div key={c.key} className="analyticsCard fancyCard" aria-label={c.label}>
                        <div className="analyticsImg gradientIcon" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <img className="metricIcon" src={c.icon} style={{ width: "2.2rem" }} alt={c.alt} />
                        </div>
                        <div className="metricValue">{safe[c.key]}+ </div>
                        <div className="metricLabel">{c.label}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Analytics
