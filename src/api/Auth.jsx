import axios from "axios";

const API_URL = 'http://localhost:8000/api'; // URL de l'API backend

export const Auth = async (credentials) => {
    try {
        // Requête d'authentification au backend
        const response = await axios.post(`${API_URL}/connexion`, credentials);

        // Stocker les tokens dans le localStorage
        const { access, refresh } = response.data;
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);

        console.log('Connexion réussie. Tokens stockés dans localStorage.');

        // Retourner les données utilisateur
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        throw error;
    }
};

// Axios Intercepteur pour gérer les requêtes avec les tokens
const apiClient = axios.create({
    baseURL: API_URL,
});

// Ajouter un intercepteur pour insérer le token dans chaque requête
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Intercepteur pour gérer les erreurs de réponse (exemple : token expiré)
apiClient.interceptors.response.use(
    (response) => response, // Si tout va bien, on retourne la réponse
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Rafraîchir le token
                const refreshToken = localStorage.getItem('refresh_token');
                const { data } = await axios.post(`${API_URL}/token/refresh/`, {
                    refresh: refreshToken,
                });

                // Mettre à jour le nouveau token dans localStorage
                localStorage.setItem('access_token', data.access);

                originalRequest.headers['Authorization'] = `Bearer ${data.access}`;
                return apiClient(originalRequest);
            } catch (refreshError) {
                console.error('Le rafraîchissement du token a échoué:', refreshError);
                // Déconnecter l'utilisateur si le rafraîchissement échoue
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/'; // Rediriger vers la page de connexion
            }
        }

        return Promise.reject(error);
    }
);
