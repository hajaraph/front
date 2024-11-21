import React, { useState } from 'react';
import { Auth } from "../api/Auth.jsx";
import { useNavigate } from 'react-router-dom';

const Authentification = () => {
    const [nomUtilisateur, setNomUtilisateur] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        try {
            // Authentification via l'API
            const data = await Auth({ nom_utilisateur: nomUtilisateur, password });

            console.log('Connexion réussie:', data);

            // Récupération des tokens après stockage
            const accessToken = localStorage.getItem('access_token');
            const refreshToken = localStorage.getItem('refresh_token');

            console.log('Token récupéré après connexion:', accessToken, refreshToken);

            // Redirection vers la page d'accueil
            navigate('/accueil');
        } catch (error) {
            setErrorMessage('Nom d’utilisateur ou mot de passe incorrect.');
        }
    };

    return (
        <div>
            anndrana
        </div>
        <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Connexion</h2>
            {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="nom_utilisateur">Nom d'utilisateur</label>
                    <input
                        type="text"
                        id="nom_utilisateur"
                        value={nomUtilisateur}
                        onChange={(e) => setNomUtilisateur(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="password">Mot de passe</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                    Se connecter
                </button>
            </form>
        </div>
    );
};

export default Authentification;
