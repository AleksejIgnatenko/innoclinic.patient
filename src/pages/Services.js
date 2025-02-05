import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "./../styles/Services.css";
import GetAllServicesByCategoryFetchAsync from '../api/Services.API/GetAllServicesByCategoryFetchAsync';
import ServiceCard from '../components/ServiceCard';
import Loader from '../components/Loader';

function Services() {
    const location = useLocation();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Consultations');
    const [consultations, setConsultations] = useState([]);
    const [diagnostics, setDiagnostics] = useState([]);
    const [analyses, setAnalyses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                toggleLoader(true);

                const fetchedServices = await GetAllServicesByCategoryFetchAsync();
                fetchedServices.forEach(category => {
                    if (category.categoryName === 'Consultation') {
                        setConsultations(category.services);
                    } else if (category.categoryName === 'Diagnostics') {
                        setDiagnostics(category.services);
                    } else if (category.categoryName === 'Analyses') {
                        setAnalyses(category.services);
                    }
                });
            } catch (error) {
                console.error('Error fetching services:', error);
            } finally {
                toggleLoader(false);
            }
        };

        fetchData();
    }, []);

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

    const toggleLoader = (status) => {
        setIsLoading(status);
    };

    return (
        <div className="tabs">
            {isLoading && <Loader />}
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


            {!isLoading && (
                <div className='tabs-container'>
                    <div data-content className={activeTab === 'Consultations' ? 'is-active' : ''} id="Consultations">
                        <h2 className='service-title'>Consultations</h2>
                        <div className='container-service-card'>
                            {consultations.map(item => (
                                <ServiceCard serviceName={item.serviceName} price={item.price} />
                            ))}
                        </div>
                        {/* <div className='container-service-card'>
                        <ServiceCard serviceName={"1"} price={1} />
                        <ServiceCard serviceName={"1"} price={1} />
                        <ServiceCard serviceName={"1"} price={1} />
                        <ServiceCard serviceName={"1"} price={1} />
                        <ServiceCard serviceName={"1"} price={1} />
                    </div> */}
                    </div>

                    <div data-content className={activeTab === 'Diagnostics' ? 'is-active' : ''} id="Diagnostics">
                        <h2 className='service-title'>Diagnostics</h2>
                        <div className='container-service-card'>
                            {diagnostics.map(item => (
                                <ServiceCard serviceName={item.serviceName} price={item.price} />
                            ))}
                        </div>
                    </div>

                    <div data-content className={activeTab === 'Analyses' ? 'is-active' : ''} id="Analyses">
                        <h2 className='service-title'>Analyses</h2>
                        <div className='container-service-card'>
                            {analyses.map(item => (
                                <ServiceCard serviceName={item.serviceName} price={item.price} />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Services;