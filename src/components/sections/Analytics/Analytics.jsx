import React from 'react';
import "./analytics.css";
import profile1 from "../../../images/profile1.svg"
import people from "../../../images/people.svg"
import user1 from "../../../images/Users1.svg"
import user2 from "../../../images/Test1.svg"
import user3 from "../../../images/Chat3.svg"
import user4 from "../../../images/User4.svg"
import user5 from "../../../images/Administrator5.svg"
const Analytics = ({apiData}) => {
    apiData= {
        "active_user": 0,
        "total_visitors": 0,
        "profile_view": 0,
        "message_exchange": 0,
        "agent_interactions": 0
    }
    return (
        <div class="mainAnalytics">
            <div class="analyticsTop">
                <h2 className="text-4xl sm:text-5xl mt-32 font-bold font-['Poppins'] bg-gradient-to-r from-[#FF59B6] to-[#CB3B8B] text-transparent bg-clip-text pb-10">
                    Analytics</h2>

            </div>
            <div class="analyticsBottom">
                <div class="analyticsCard">
                    <div class="analyticsImg" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <img src={user1} style={{ width: "2.5rem" }} alt="" />
                    </div>
                    <h1>{apiData?.total_visitors}+</h1>
                    <p>Website Visitors</p>
                </div>
                <div class="analyticsCard">
                    <div class="analyticsImg" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <img src={user2} style={{ width: "2.5rem" }} alt="" />
                    </div>
                    <h1>{apiData?.profile_view}+</h1>
                    <p>Profile Viewed</p>
                </div>
                <div class="analyticsCard">
                    <div class="analyticsImg" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <img src={user3} style={{ width: "2.5rem" }} alt="" />
                    </div>
                    <h1>{apiData?.message_exchange}+</h1>
                    <p>Message Exchange</p>
                </div>
                <div class="analyticsCard">
                    <div class="analyticsImg" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <img src={user4} style={{ width: "2.5rem" }} alt="" />
                    </div>
                    <h1>{apiData?.active_user}+</h1>
                    <p>Active Users</p>
                </div>
                <div class="analyticsCard">
                    <div class="analyticsImg" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <img src={user5} style={{ width: "2.5rem" }} alt="" />
                    </div>
                    <h1>{apiData?.agent_interactions}+</h1>
                    <p>Agent interactions</p>
                </div>
            </div>
        </div>
    )
}

export default Analytics
