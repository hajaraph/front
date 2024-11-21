import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import TableService from './components/TableService';
import TableConso from './components/TableConso';
import TableUtilisateur from './components/TableUtilisateur';
import AccueilTable from './components/AccueilTable';
import Authentification from './components/Authenfication';
import PrivateRoute from './components/PrivateRoute';
import Deconnexion from "./components/Deconnexion.jsx";

const App = () => {
    const location = useLocation();
    const token = localStorage.getItem('access_token');

    // Gestion de l'authentification sur la page d'accueil
    if (location.pathname === '/') {
        return token ? (
            <Navigate to="/accueil" />
        ) : (
            <div className="h-screen flex items-center justify-center">
                <Authentification />
            </div>
        );
    }

    // Structure principale
    return (
        <div className="flex h-screen w-screen">
            {/* Barre de navigation */}
            <div className="w-64 bg-gray-800 flex-shrink-0">
                <Navbar />
            </div>
            {/* Contenu principal */}
            <div className="flex-grow bg-gray-100 p-6">
                <Routes>
                    <Route
                        path="/accueil"
                        element={
                            <PrivateRoute>
                                <AccueilTable />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/consommation"
                        element={
                            <PrivateRoute>
                                <TableConso />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/consommable"
                        element={
                            <PrivateRoute>
                                <TableConso />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/service"
                        element={
                            <PrivateRoute>
                                <TableService />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/stock"
                        element={
                            <PrivateRoute>
                                <TableConso />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/utilisateur"
                        element={
                            <PrivateRoute>
                                <TableUtilisateur />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/deconnexion"
                        element={
                            <PrivateRoute>
                                <Deconnexion />
                            </PrivateRoute>
                        }
                    />
                    {/* Redirection par défaut */}
                    <Route path="*" element={<Navigate to="/accueil" />} />
                </Routes>
            </div>
        </div>
    );
};

export default App;
