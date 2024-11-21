import React, { useState, useEffect } from 'react';
import {deleteUtilisateur, fetchUtilisateur, saveUtilisateur} from '../api/Utilisateur.jsx';
import {FaEdit, FaTrashAlt} from "react-icons/fa";
import { fetchServices } from "../api/Service.jsx";

const TableUtilisateur = () => {
    const [recherche, setRecherche] = useState('');
    const [utilisateurs, setUtilisateurs] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [nom_utilisateur, setNomUtilisateur] = useState('');
    const [numero_utilisateur, setTelephoneUtilisateur] = useState('');
    const [est_admin, setRoleAdmin] = useState(false); // Gestion du rôle administrateur
    const [errors, setErrors] = useState({ nom: '', telephone: '', service: '', password: '', confirmPassword: '' });
    const [currentId, setCurrentId] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState('');
    const [password, setMotDePasse] = useState('');
    const [password_confirm, setConfirmMotDePasse] = useState('');
    const [modalEditVisible, setModalEditVisible] = useState(false);

    // Charger les utilisateurs depuis l'API
    useEffect(() => {
        const fetchDonnees = async () => {
            try {
                const data = await fetchUtilisateur();
                setUtilisateurs(data);
            } catch (error) {
                console.error('Erreur lors de la récupération des utilisateurs:', error);
            }
        };

        const fetchAllServices = async () => {
            try {
                const data = await fetchServices();
                setServices(data); // Assurez-vous que l'API retourne bien une liste de services
            } catch (error) {
                console.error('Erreur lors de la récupération des services:', error);
            }
        };

        fetchAllServices();
        fetchDonnees();
    }, []);

    const handleCloseModal = () => {
        setModalVisible(false);
        setModalEditVisible(false);
        setNomUtilisateur('');
        setTelephoneUtilisateur('');
        setMotDePasse('');
        setConfirmMotDePasse('');
        setRoleAdmin(false); // Réinitialiser le rôle administrateur à false
        setSelectedService('');
        setErrors({ nom: '', telephone: '', service: '', password: '', confirmPassword: '' });
    };

    const saveUtilisateurs = async () => {
        let hasErrors = false;
        const newErrors = { nom: '', telephone: '', service: '', password: '', confirmPassword: '' };

        // Validation des champs
        if (!nom_utilisateur.trim()) {
            newErrors.nom = 'Le nom est requis.';
            hasErrors = true;
        }
        if (!numero_utilisateur.trim()) {
            newErrors.telephone = 'Le téléphone est requis.';
            hasErrors = true;
        }
        if (!selectedService.trim()) {
            newErrors.service = 'Le service est requis.';
            hasErrors = true;
        }

        // Validation des mots de passe
        if (!password) {
            newErrors.password = 'Le mot de passe est requis.';
            hasErrors = true;
        }
        if (password !== password_confirm) {
            newErrors.confirmPassword = 'Les mots de passe ne correspondent pas.';
            hasErrors = true;
        }

        if (hasErrors) {
            setErrors(newErrors);
            return;
        }

        try {
            await saveUtilisateur({
                id: currentId,
                nom_utilisateur,
                numero_utilisateur,
                est_admin, // Envoi du rôle admin
                service: selectedService, // Ajout du service sélectionné
                password: password,
                password_confirm: password_confirm
            });

            // Mise à jour des utilisateurs après ajout ou modification
            const data = await fetchUtilisateur();
            setUtilisateurs(data);

            handleCloseModal();
        } catch (error) {
            console.error('Erreur lors de la sauvegarde de l\'utilisateur:', error);
            if (error.response && error.response.data) {
                const backendErrors = error.response.data;

                // Parcours des erreurs pour les ajouter à l'état
                const formattedErrors = {
                    nom: backendErrors.nom_utilisateur ? backendErrors.nom_utilisateur.join(', ') : '',
                    telephone: backendErrors.numero_utilisateur ? backendErrors.numero_utilisateur.join(', ') : '',
                    service: backendErrors.service ? backendErrors.service.join(', ') : '',
                    password: backendErrors.password ? backendErrors.password.join(', ') : '',
                    confirmPassword: backendErrors.password_confirm ? backendErrors.password_confirm.join(', ') : '',
                };

                setErrors(formattedErrors);
            } else {
                // Gérer les erreurs générales
                alert("Une erreur s'est produite. Veuillez réessayer.");
            }
        }
    };

    const handleEditUtilisateur = (utilisateur) => {
        setCurrentId(utilisateur.id);
        setNomUtilisateur(utilisateur.nom_utilisateur);
        setTelephoneUtilisateur(utilisateur.numero_utilisateur);
        setSelectedService(utilisateur.service);
        setMotDePasse('');
        setConfirmMotDePasse('');
        setRoleAdmin(utilisateur.est_admin);
        setModalVisible(true);
    };


    const handleDeleteUtilisateur = (id) => {
        setConfirmDelete(id);  // Ouvre le modal avec l'ID de l'utilisateur à supprimer
    };

    const handleConfirmDelete = async () => {
        if (!confirmDelete) return;

        try {
            await deleteUtilisateur(confirmDelete);

            const updatedUtilisateurs = utilisateurs.filter((utilisateur) => utilisateur.id !== confirmDelete);
            setUtilisateurs(updatedUtilisateurs);

            // Fermer le modal
            setConfirmDelete(null);
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'utilisateur:', error);
            setConfirmDelete(null);
        }
    };

    const formatDate = (isoDate) => {
        if (!isoDate) return ""; // Gestion des cas où la date est vide ou invalide

        const date = new Date(isoDate);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Les mois commencent à 0
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");

        return `${day}/${month}/${year} || ${hours}:${minutes}`;
    };

    return (
        <section className="min-w-full max-w-[800px] p-8 bg-gray-100 rounded-lg shadow-md">
            <div className="text-3xl font-semibold uppercase mb-6">
                <p>Gestion Utilisateur</p>
            </div>
            <div className="flex items-center mb-6">
                <input
                    type="text"
                    placeholder="Rechercher un utilisateur..."
                    className="p-3 mr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                    value={recherche}
                    onChange={(e) => setRecherche(e.target.value)}
                />
                <button
                    onClick={() => setModalVisible(true)}
                    className="bg-sky-500 text-white font-semibold py-2 px-4 rounded-md shadow hover:bg-sky-600 transition duration-300"
                >
                    Ajouter
                </button>
            </div>
            <table className="w-full bg-white rounded-lg shadow-md">
                <thead className="bg-sky-500 text-white">
                <tr>
                    <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Id</th>
                    <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Nom d'utilisateur</th>
                    <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Téléphone</th>
                    <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Service</th>
                    <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Rôle</th>
                    <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Date d'inscription</th>
                    <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Action</th>
                </tr>
                </thead>
                <tbody>
                {utilisateurs.map((utilisateur) => (
                    <tr key={utilisateur.id || utilisateur.nom_utilisateur + utilisateur.numero_utilisateur}
                        className="hover:bg-gray-100">
                        <td className="py-3 px-4">{utilisateur.id}</td>
                        <td className="py-3 px-4">{utilisateur.nom_utilisateur}</td>
                        <td className="py-3 px-4">{utilisateur.numero_utilisateur}</td>
                        <td className="py-3 px-4">{utilisateur.service}</td>
                        <td className="py-3 px-4">{utilisateur.est_admin ? 'Admin' : 'Utilisateur'}</td>
                        <td className="py-3 px-4">{formatDate(utilisateur.date_joined)}</td>
                        <td className="py-3 px-4 flex space-x-2">
                            <button
                                onClick={() => {
                                    setModalEditVisible(true);
                                    setNomUtilisateur(utilisateur.nom_utilisateur);
                                    setTelephoneUtilisateur(utilisateur.numero_utilisateur);
                                    setCurrentId(utilisateur.id);
                                }}
                                className="text-blue-500 hover:text-blue-700 transition duration-300"
                            >
                                <FaEdit/>
                            </button>
                            <button
                                onClick={() => handleDeleteUtilisateur(utilisateur.id)}
                                className="text-red-500 hover:text-red-700"
                            >
                                <FaTrashAlt/>
                            </button>

                        </td>
                    </tr>
                ))}
                </tbody>

            </table>

            {modalVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-1/3">
                    <h2 className="text-2xl font-bold mb-6">Ajouter un utilisateur</h2>
                        <div>
                            <label className="block mb-2">Nom d'utilisateur *</label>
                            <input
                                type="text"
                                className={`w-full p-3 border ${errors.nom ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                value={nom_utilisateur}
                                onChange={(e) => setNomUtilisateur(e.target.value)}
                            />
                            {errors.nom && <p className="text-red-500 text-sm">{errors.nom}</p>}

                            <label className="block mb-2 mt-4">Téléphone *</label>
                            <input
                                type="text"
                                className={`w-full p-3 border ${errors.telephone ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                value={numero_utilisateur}
                                onChange={(e) => {
                                    const newValue = e.target.value.replace(/\D/g, '');  // Remplace tout sauf les chiffres
                                    setTelephoneUtilisateur(newValue);
                                }}
                            />
                            {errors.telephone && <p className="text-red-500 text-sm">{errors.telephone}</p>}


                            <label className="block mb-2 mt-4">Service *</label>
                            <select
                                className={`w-full p-3 border ${errors.service ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                value={selectedService}
                                onChange={(e) => setSelectedService(e.target.value)} // Vérifiez ici
                            >
                                <option value="">Sélectionnez un service</option>
                                {services.map((service) => (
                                    <option key={service.id_service} value={service.id_service}>
                                        {service.nom_service}
                                    </option>
                                ))}
                            </select>

                            {errors.service && <p className="text-red-500 text-sm">{errors.service}</p>}

                            <label className="block mb-2 mt-4">Mot de passe *</label>
                            <input
                                type="password"
                                className={`w-full p-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                value={password}
                                onChange={(e) => setMotDePasse(e.target.value)}
                            />
                            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

                            <label className="block mb-2 mt-4">Confirmer le mot de passe *</label>
                            <input
                                type="password"
                                className={`w-full p-3 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                value={password_confirm}
                                onChange={(e) => setConfirmMotDePasse(e.target.value)}
                            />
                            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}

                            <div className="mt-4">
                                <input
                                    type="checkbox"
                                    checked={est_admin}
                                    onChange={(e) => setRoleAdmin(e.target.checked)} // Gestion du rôle admin
                                />
                                <label className="ml-2">Administrateur</label>
                            </div>
                        </div>
                        <div className="flex justify-end mt-6 space-x-4">
                            <button onClick={handleCloseModal} className="bg-gray-500 text-white px-4 py-2 rounded-md">
                                Annuler
                            </button>
                            <button onClick={saveUtilisateurs} className="bg-sky-500 text-white px-4 py-2 rounded-md">
                                {currentId ? 'Enregistrer' : 'Ajouter'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {modalEditVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-1/3">
                        <h2 className="text-2xl font-bold mb-6">Modifier un utilisateur</h2>
                        <div>
                            <label className="block mb-2">Nom d'utilisateur *</label>
                            <input
                                type="text"
                                className={`w-full p-3 border ${errors.nom ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                value={nom_utilisateur}
                                onChange={(e) => setNomUtilisateur(e.target.value)}
                            />
                            {errors.nom && <p className="text-red-500 text-sm">{errors.nom}</p>}

                            <label className="block mb-2 mt-4">Téléphone *</label>
                            <input
                                type="text"
                                className={`w-full p-3 border ${errors.telephone ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                value={numero_utilisateur}
                                onChange={(e) => {
                                    const newValue = e.target.value.replace(/\D/g, '');  // Remplace tout sauf les chiffres
                                    setTelephoneUtilisateur(newValue);
                                }}
                            />
                            {errors.telephone && <p className="text-red-500 text-sm">{errors.telephone}</p>}
                        </div>
                        <div className="flex justify-end mt-6 space-x-4">
                            <button onClick={handleCloseModal} className="bg-gray-500 text-white px-4 py-2 rounded-md">
                                Annuler
                            </button>
                            <button onClick={saveUtilisateurs} className="bg-sky-500 text-white px-4 py-2 rounded-md">
                                Enregistrer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {confirmDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                        <p className="text-lg font-semibold">Voulez-vous vraiment supprimer cet utilisateur ?</p>
                        <div className="flex justify-end mt-4 space-x-4">
                            <button onClick={() => setConfirmDelete(null)} className="bg-gray-500 text-white px-4 py-2 rounded-md">
                                Annuler
                            </button>
                            <button onClick={() => handleConfirmDelete()} className="bg-red-500 text-white px-4 py-2 rounded-md">
                                Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </section>
    );
};

export default TableUtilisateur;
