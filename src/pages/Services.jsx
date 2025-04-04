import { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import Toolbar from "../components/organisms/Toolbar";
import Loader from "../components/organisms/Loader";
import ProfileCard from "../components/organisms/ProfileCard";
import '../styles/pages/Services.css';
import "./../styles/organisms/Tab.css";

import GetAllActiveMedicalServicesFetchAsync from "../api/Services.API/GetAllActiveMedicalServicesFetchAsync";

export default function Services() {

    const location = useLocation();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Consultations');
    const [services, setServices] = useState([]);
    const [consultations, setConsultations] = useState([]);
    const [diagnostics, setDiagnostics] = useState([]);
    const [analyses, setAnalyses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                toggleLoader(true);

                const fetchedServices = await GetAllActiveMedicalServicesFetchAsync();
                setServices(fetchedServices);

                if (fetchedServices.length > 0) {
                    const consultations = fetchedServices.filter(service => service.serviceCategory.categoryName === 'Consultation');
                    const diagnostics = fetchedServices.filter(service => service.serviceCategory.categoryName === 'Diagnostics');
                    const analyses = fetchedServices.filter(service => service.serviceCategory.categoryName === 'Analyses');

                    if (consultations) {
                        setConsultations(consultations);
                    }
                    if (diagnostics) {
                        setDiagnostics(diagnostics);
                    }
                    if (analyses) {
                        setAnalyses(analyses);
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
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
        <>
            <Toolbar pageTitle="Services" />
            {isLoading ? (
                <Loader />
            ) : (
                <div className="page">
                    <ul className="tabs-content">
                        <button
                            className={`tabs-button ${activeTab === 'Consultations' ? 'is-active' : ''}`}
                            onClick={() => handleTabClick('Consultations')}
                        >
                            Consultations
                        </button>
                        <button
                            className={`tabs-button ${activeTab === 'Diagnostics' ? 'is-active' : ''}`}
                            onClick={() => handleTabClick('Diagnostics')}
                        >
                            Diagnostics
                        </button>
                        <button
                            className={`tabs-button ${activeTab === 'Analyses' ? 'is-active' : ''}`}
                            onClick={() => handleTabClick('Analyses')}
                        >
                            Analyses
                        </button>
                    </ul>

                    {services.length === 0 ? (
                        <p className="no-items">Services not found</p>
                    ) : (
                        <div className="tab-content">
                            {activeTab === 'Consultations' && (
                                <div id="Consultations">
                                    <div className="card-container">
                                        {consultations.map((consultation, index) => (
                                            <ProfileCard key={index} className="card" id={consultation.id}>
                                                <div className="profile-content">
                                                    <p>Service Name: {consultation.serviceName}</p>
                                                    <p>Price: {consultation.price}</p>
                                                </div>
                                            </ProfileCard>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'Diagnostics' && (
                                <div id="Diagnostics">
                                    <div className="card-container">
                                        {diagnostics.map((diagnostic, index) => (
                                            <ProfileCard key={index} className="card" id={diagnostic.id}>
                                                <div className="profile-content">
                                                    <p>Service Name: {diagnostic.serviceName}</p>
                                                    <p>Price: {diagnostic.price}</p>
                                                </div>
                                            </ProfileCard>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'Analyses' && (
                                <div id="Analyses">
                                    <div className="card-container">
                                        {analyses.map((analyse, index) => (
                                            <ProfileCard key={index} className="card" id={analyse.id}>
                                                <div className="profile-content">
                                                    <p>Service Name: {analyse.serviceName}</p>
                                                    <p>Price: {analyse.price}</p>
                                                </div>
                                            </ProfileCard>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </>
    );
} 