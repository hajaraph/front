import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token');
    return { Authorization: `Bearer ${token}` };
};

// Récupérer tous les services
export const fetchServices = async () => {
    const response = await axios.get(`${API_URL}/service`, {
        headers: getAuthHeaders(),
    });
    return response.data;
};

// Récupérer un service par ID
export const fetchServiceById = async (id) => {
    const response = await axios.get(`${API_URL}/service/${id}`, {
        headers: getAuthHeaders(),
    });
    return response.data;
};

// Créer un nouveau service
export const createService = async (data) => {
    const response = await axios.post(`${API_URL}/service`, data, {
        headers: getAuthHeaders(),
    });
    return response.data;
};

// Mettre à jour un service
export const updateService = async (id, data) => {
    const response = await axios.put(`${API_URL}/service/update/${id}`, data, {
        headers: getAuthHeaders(),
    });
    return response.data;
};

// Supprimer un service
export const deleteService = async (id) => {
    const response = await axios.delete(`${API_URL}/service/delete/${id}`, {
        headers: getAuthHeaders(),
    });
    return response.status;
};
