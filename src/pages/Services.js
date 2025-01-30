import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import "./../styles/Services.css";

function Services() {
    const location = useLocation();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Consultations');

    useEffect(() => {
        const tab = new URLSearchParams(location.search).get('tab');
        if (tab) {
            setActiveTab(tab);
        }
    }, [location]);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        navigate(`/services?tab=${tab}`); 
    };

    return (
        <div className="tabs">
            <ul className="tabs-content">
                <button
                    className={`tabs__button ${activeTab === 'Consultations' ? 'is-active' : ''}`}
                    onClick={() => handleTabClick('Consultations')}
                >
                    Consultations
                </button>
                <button
                    className={`tabs__button ${activeTab === 'Diagnostics' ? 'is-active' : ''}`}
                    onClick={() => handleTabClick('Diagnostics')}
                >
                    Diagnostics
                </button>
                <button
                    className={`tabs__button ${activeTab === 'Analyses' ? 'is-active' : ''}`}
                    onClick={() => handleTabClick('Analyses')}
                >
                    Analyses
                </button>
            </ul>

            <div className='tabs-container'>
                <div data-content className={activeTab === 'Consultations' ? 'is-active' : ''} id="Consultations">
                    <h2>Consultations</h2>
                </div>

                <div data-content className={activeTab === 'Diagnostics' ? 'is-active' : ''} id="Diagnostics">
                    <h2>Diagnostics</h2>
                </div>

                <div data-content className={activeTab === 'Analyses' ? 'is-active' : ''} id="Analyses">
                    <h2>Analyses</h2>
                </div>
            </div>
        </div>
    );
}

export default Services;