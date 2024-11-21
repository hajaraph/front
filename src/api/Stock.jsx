import axios from "axios";

const API_URL = 'http://localhost:8000/api';

// Fonction pour récupérer tous les stocks
export const fetchStocks = async () => {
    try {
        const response = await axios.get(`${API_URL}/quantites`);
        console.log('Données reçues:', response.data);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des stocks:', error);
        throw error;
    }
};

// Fonction pour ajouter un nouveau stock
export const saveStock = async (outilsId, quantiteStock, prix) => {
    try {
        const response = await axios.post(`${API_URL}/quantites`, {
            quantiteStock,
            prix,
            outilsid: outilsId
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Erreur lors de l\'ajout du stock:', error.response ? error.response.data : error.message);
        throw new Error('Erreur lors de l\'ajout du stock.');
    }
};

// Fonction pour mettre à jour un stock existant
export const updateStock = async (outilsid, quantiteStock) => {
    try {
        const response = await axios.put(`${API_URL}/quantites/update/${outilsid}`, {
            quantiteStock,
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        throw new Error('Erreur lors de la mise à jour du stock.');
    }
};

// Fonction pour supprimer un stock
export const deleteStock = async (id) => {
    const response = await fetch(`${API_URL}/quantites/supprimer/${id}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error('Erreur lors de la suppression du stock.');
    }

    if (response.status !== 204) {
        return response.json();
    }
    return {};
};
