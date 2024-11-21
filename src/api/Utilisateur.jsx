import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const fetchUtilisateur = async () => {
    try {
        const response = await axios.get(`${API_URL}/utilisateur`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}` // Token JWT
            }
        });
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
        throw error;
    }
};

export const saveUtilisateur = async (utilisateur) => {
    try {
        console.log('Utilisateur à sauvegarder:', utilisateur);
        const url = utilisateur.id
            ? `${API_URL}/utilisateur/update/${utilisateur.id}` // Modification
            : `${API_URL}/inscrire`; // Création
        const method = utilisateur.id ? 'put' : 'post';

        const response = await axios[method](url, utilisateur, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la sauvegarde de l\'utilisateur:', error);
        throw error;
    }
};

export const deleteUtilisateur = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/utilisateur/delete/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'utilisateur:', error);
        throw error;
    }
};
