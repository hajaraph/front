import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaChartBar, FaCogs, FaWarehouse, FaUsers, FaSignOutAlt } from 'react-icons/fa'; // Icônes

const Navbar = () => {
    const location = useLocation();

    // Liste des liens de navigation
    const navLinks = [
        { path: '/accueil', label: 'Tableau de bord', icon: <FaHome /> },
        { path: '/consommation', label: 'Consommation', icon: <FaChartBar /> },
        { path: '/consommable', label: 'Consommable', icon: <FaCogs /> },
        { path: '/service', label: 'Service', icon: <FaCogs /> },
        { path: '/stock', label: 'Stock', icon: <FaWarehouse /> },
        { path: '/utilisateur', label: 'Utilisateur', icon: <FaUsers /> },
        { path: '/deconnexion', label: 'Déconnexion', icon: <FaSignOutAlt /> },
    ];

    return (
        <nav className="bg-sky-500 text-white h-full w-full shadow-lg">
            <div className="flex flex-col items-start justify-start h-full p-6 overflow-y-auto">
                <h1 className="text-3xl font-extrabold mb-8 tracking-wide">Logo</h1>
                <ul className="flex flex-col space-y-4 w-full">
                    {navLinks.map((link) => (
                        <li key={link.path} className="w-full">
                            <Link
                                to={link.path}
                                aria-label={link.label}
                                className={`flex items-center w-full text-left py-2 px-4 rounded-md transition-all duration-300 ease-in-out transform ${
                                    location.pathname === link.path
                                        ? 'bg-white text-sky-800 scale-105'
                                        : 'bg-sky-600 text-white hover:bg-white hover:text-sky-600 hover:scale-105'
                                }`}
                            >
                                <span className="mr-2">{link.icon}</span>
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
