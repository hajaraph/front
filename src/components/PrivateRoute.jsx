import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Assurez-vous que jwt-decode est installé : npm install jwt-decode

const PrivateRoute = ({ children }) => {
    // Récupérer le token depuis localStorage
    const token = localStorage.getItem('access_token');

    if (token) {
        try {
            // Décoder le token JWT
            const decodedToken = jwtDecode(token);

            // Vérifier si le token a expiré
            const isTokenExpired = decodedToken.exp * 1000 < Date.now();
            if (isTokenExpired) {
                // Si le token est expiré, supprimer les tokens du localStorage et rediriger
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                return <Navigate to="/" />;
            }
        } catch (error) {
            // En cas d'erreur de décodage, rediriger vers la page de connexion
            console.error('Erreur lors du décodage du token:', error);
            return <Navigate to="/" />;
        }
    } else {
        // Si aucun token n'est présent, rediriger vers la page de connexion
        return <Navigate to="/" />;
    }

    // Si le token est valide, autoriser l'accès à la route privée
    return children;
};

export default PrivateRoute;
