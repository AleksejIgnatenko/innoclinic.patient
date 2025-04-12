import React from 'react';
import '../../styles/organisms/ProfileCard.css';

const ProfileCard = ({ children, onClick }) => {
    const cursorStyle = onClick ? { cursor: 'pointer' } : {};

    return (
        <div className="profile-container" style={cursorStyle} onClick={onClick}>
            {children}
        </div>
    );
};

export default ProfileCard;