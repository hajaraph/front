// src/api/Outil.jsx
import axios from 'axios';

const API_URL = 'http://localhost:8000/outils';

export const fetchOutils = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des services:', error);
        throw error;
    }
};

export const saveOutil = async (nomOutils, prixOutils) => {
    const response = await axios.post(API_URL, { nomOutils, prixOutils });
    return response.data;
};

export const updateOutil = async (id, nomOutils, prixOutils) => {
    const response = await axios.put(`${API_URL}/update/${id}`, { nomOutils, prixOutils });
    return response.data;
};

export const deleteOutil = async (id) => {
    const response = await axios.delete(`${API_URL}/supprimer/${id}`);
    return response.data;
};
