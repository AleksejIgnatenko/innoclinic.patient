import React, { useState, useEffect } from 'react';
import './../styles/Sidebar.css';
import 'boxicons/css/boxicons.min.css';
import Cookies from 'js-cookie';
import SignInModal from './SignInModal';
import SignUpModal from './SignUpModal';
import { Link } from 'react-router-dom';
import MakeAnAppointmentModal from './MakeAnAppointmentModal';

const Sidebar = ({
    isUserLoggedIn,
    showSignInModal,
    toggleSignInModal,
    showSignUpModal,
    toggleSignUpModal,
    showMakeAnAppointmentModel,
    toggleMakeAnAppointmentModel,
}) => {
    const [showSidebar, setShowSidebar] = useState(false);
    const [currentTheme, setCurrentTheme] = useState(() => {
        return localStorage.getItem('theme') || 'light';
    });

    useEffect(() => {
        const root = document.documentElement;
        root.setAttribute('data-theme', currentTheme);
        localStorage.setItem('theme', currentTheme);
    }, [currentTheme]);

    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    const handleSubMenuClick = (e) => {
        const listItem = e.currentTarget.closest('li');
        if (listItem) {
            listItem.classList.toggle("showMenu");
        }
    };

    const handleLogOut = () => {
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        window.location.href = "/";
    };

    const toggleTheme = () => {
        setCurrentTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
    };

    return (
        <>
            {showSignInModal && <SignInModal onClose={toggleSignInModal} onOpenSignUp={toggleSignUpModal} />}
            {showSignUpModal && <SignUpModal onClose={toggleSignUpModal} onOpenSignIn={toggleSignInModal}/>}
            {showMakeAnAppointmentModel && <MakeAnAppointmentModal onClose={toggleMakeAnAppointmentModel} onOpenSignIn={toggleSignInModal} doctorId={''}/>}
            <div className={`sidebar ${showSidebar ? '' : 'close'}`}>
                <div className="logo-details">
                    <i className='bx bx-menu' onClick={toggleSidebar}></i>
                    <span className="logo_name">DashBoard</span>
                </div>
                <ul className="nav-links">
                    <li>
                        <Link to="/">
                            <i className='bx bx-home'></i>
                            <span className="link_name">Home</span>
                        </Link>
                        <ul className="sub-menu blank">
                            <li><Link to="/" className="link_name">Home</Link></li>
                        </ul>
                    </li>
                    <li>
                        <Link to="/doctors">
                            <i className='bx bx-user-circle'></i>
                            <span className="link_name">Doctors</span>
                        </Link>
                        <ul className="sub-menu blank">
                            <li><Link to="/doctors" className="link_name">Doctors</Link></li>
                        </ul>
                    </li>
                    <li>
                        <div className="icon-link">
                            <Link to="/services">
                                <i className='bx bx-collection'></i>
                                <span className="link_name">Services</span>
                            </Link>
                            <i className='bx bxs-chevron-down arrow' onClick={handleSubMenuClick}></i>
                        </div>
                        <ul className="sub-menu">
                            <li><Link className="link_name" to="/services">Services</Link></li>
                            <li><Link to="/services?tab=Consultations">Consultations</Link></li>
                            <li><Link to="/services?tab=Diagnostics">Diagnostics</Link></li>
                            <li><Link to="/services?tab=Analyses">Analyses</Link></li>
                        </ul>
                    </li>
                    <li>
                        <Link onClick={toggleMakeAnAppointmentModel}>
                            <i className='bx bx-plus'></i>
                            <span className="link_name">Make an appointment</span>
                        </Link>
                        <ul className="sub-menu blank">
                            <li><Link className="link_name" onClick={toggleMakeAnAppointmentModel}>Make an appointment</Link></li>
                        </ul>
                    </li>
                    <li onClick={handleSubMenuClick}>
                        <div className="icon-link">
                            <Link to="/">
                                <i className='bx bx-book-alt'></i>
                                <span className="link_name">Posts</span>
                            </Link>
                            <i className='bx bxs-chevron-down arrow'></i>
                        </div>
                        <ul className="sub-menu">
                            <li><Link className="link_name" to="/">Posts</Link></li>
                            <li><Link to="/">Web Design</Link></li>
                            <li><Link to="/">Login Form</Link></li>
                            <li><Link to="/">Card Design</Link></li>
                        </ul>
                    </li>
                    <li>
                        <Link to="/">
                            <i className='bx bx-line-chart'></i>
                            <span className="link_name">Chart</span>
                        </Link>
                        <ul className="sub-menu blank">
                            <li><Link className="link_name" to="/">Chart</Link></li>
                        </ul>
                    </li>
                    <li onClick={handleSubMenuClick}>
                        <div className="icon-link">
                            <Link to="/">
                                <i className='bx bx-plug'></i>
                                <span className="link_name">Plugins</span>
                            </Link>
                            <i className='bx bxs-chevron-down arrow'></i>
                        </div>
                        <ul className="sub-menu">
                            <li><Link className="link_name" to="/">Plugins</Link></li>
                            <li><Link to="/">UI Face</Link></li>
                            <li><Link to="/">Pigments</Link></li>
                            <li><Link to="/">Box Icons</Link></li>
                        </ul>
                    </li>
                    <li>
                        <Link to="/">
                            <i className='bx bx-compass'></i>
                            <span className="link_name">Explore</span>
                        </Link>
                        <ul className="sub-menu blank">
                            <li><Link className="link_name" to="/">Explore</Link></li>
                        </ul>
                    </li>
                    <li>
                        <Link to="/">
                            <i className='bx bx-history'></i>
                            <span className="link_name">History</span>
                        </Link>
                        <ul className="sub-menu blank">
                            <li><Link className="link_name" to="/">History</Link></li>
                        </ul>
                    </li>
                    <li>
                        <Link onClick={toggleTheme}>
                            {currentTheme === 'light' ? <i className='bx bx-moon'></i> : <i className='bx bx-sun sun'></i>}
                            <span className="link_name">Switching themes</span>
                        </Link>
                        <ul className="sub-menu blank">
                            <li><Link className="link_name" onClick={toggleTheme}>Switching themes</Link></li>
                        </ul>
                    </li>
                    {isUserLoggedIn ? (
                        <li>
                            <div className="profile-details">
                                <Link to="/patientProfile?tab=PersonalInformation">
                                    <div className="profile-content">
                                        <img src="https://th.bing.com/th/id/OIP.audMX4ZGbvT2_GJTx2c4GgAAAA?rs=1&pid=ImgDetMain" alt="profileImg" />
                                    </div>
                                    <div className="name-job">
                                        <div className="profile_name">Farid Vatani</div>
                                        <div className="job">Software Engineer</div>
                                    </div>
                                </Link>
                                <i className='bx bx-log-out' onClick={handleLogOut}></i>
                            </div>
                        </li>
                    ) : (
                        <>
                            <li>
                                <Link onClick={toggleSignInModal}>
                                    <i className='bx bx-log-in'></i>
                                    <span className="link_name">Login</span>
                                </Link>
                                <ul className="sub-menu blank">
                                    <li><Link className="link_name" onClick={toggleSignInModal}>Login</Link></li>
                                </ul>
                            </li>
                            <li>
                                <Link onClick={toggleSignUpModal}>
                                    <i className='bx bx-user-plus'></i>
                                    <span className="link_name">SignUp</span>
                                </Link>
                                <ul className="sub-menu blank">
                                    <li><Link className="link_name" onClick={toggleSignUpModal}>SignUp</Link></li>
                                </ul>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </>
    );
};

export default Sidebar;