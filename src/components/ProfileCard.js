import React from 'react';
import './../styles/ProfileCard.css';

const ProfileCard = ({ profile }) => {
    return (
        <div className="profile-wrapper">
            <div className="profile-card active">
                <div className="profile-card-header">
                    <img src="https://i.imgur.com/jMtQiws.jpg" alt="" />
                </div>
                <div className="profile-card-content">
                    <h3>First name: {profile && profile.firstName ? profile.firstName : ''}</h3>
                    <h3>Last name: {profile && profile.lastName ? profile.lastName : ''}</h3>
                    <h3>Middle name: {profile && profile.middleName ? profile.middleName : ''}</h3>
                    <h3>Phone number: {profile && profile.account && profile.account.phoneNumber ? profile.account.phoneNumber : ''}</h3>
                    <h3>Date of birth: {profile && profile.dateOfBirth ? profile.dateOfBirth : ''}</h3>
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;