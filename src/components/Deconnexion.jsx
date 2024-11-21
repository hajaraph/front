import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Deconnexion = () => {
    const [showModal, setShowModal] = useState(false);  // Pour contrôler l'affichage du modal
    const navigate = useNavigate();

    // Fonction pour afficher le modal de confirmation
    const handleDeconnexionClick = () => {
        setShowModal(true);
    };

    // Fonction pour confirmer la déconnexion
    const handleConfirmDeconnexion = () => {
        // Effacer les informations d'authentification
        localStorage.removeItem('access_token');
        localStorage.removeItem('id');  // Si vous stockez l'ID utilisateur aussi

        // Rediriger vers la page de connexion
        navigate('/login');
    };

    // Fonction pour annuler la déconnexion
    const handleCancelDeconnexion = () => {
        setShowModal(false);  // Fermer le modal sans rien faire
    };

    return (
        <div>
            <button onClick={handleDeconnexionClick} className="btn-deconnexion">
                Se déconnecter
            </button>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                        <p className="text-lg font-semibold">Voulez-vous vraiment vous déconnecter ?</p>
                        <div className="flex justify-end mt-4 space-x-4">
                            <button
                                onClick={handleCancelDeconnexion}
                                className="bg-gray-500 text-white px-4 py-2 rounded-md"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleConfirmDeconnexion}
                                className="bg-red-500 text-white px-4 py-2 rounded-md"
                            >
                                Oui, se déconnecter
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Deconnexion;
