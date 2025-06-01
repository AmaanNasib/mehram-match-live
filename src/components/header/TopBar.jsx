import React from 'react'
import "./header.css"

const TopBar = ({name}) => {
  return (
    <div class="top-bar">
    <div class="welcome-text">Welcome to Active Mehram Match</div>
    <div class="top-right">
        <div class="help-line">Help Line +01 112 352 666</div>
        <div class="user-section">
            <div class="notifications">
                <span class="notification-icon">🔔</span>
                <span class="mail-icon">✉️</span>
            </div>
            <div class="user-profile">
                <img src="https://placehold.co/30x30" alt="Profile" class="profile-pic" />
                <span>Hi, KhanSaab</span>
            </div>
            <button class="logout-btn">Logout</button>
        </div>
    </div>
</div>
  )
}

export default TopBar
