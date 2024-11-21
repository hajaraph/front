import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { createService, deleteService, fetchServices } from '../api/Service.jsx';

const TableService = () => {
    const [recherche, setRecherche] = useState('');
    const [donnees, setDonnees] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [nomService, setNomService] = useState('');
    const [errors, setErrors] = useState({ nom: '' });
    const [currentId, setCurrentId] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);

    useEffect(() => {
        const fetchDonnees = async () => {
            try {
                const data = await fetchServices();
                setDonnees(data);
            } catch (error) {
                console.error('Erreur lors de la récupération des données :', error);
            }
        };

        fetchDonnees();
    }, []);

    const filtrerDonnees = (donnee) => {
        if (donnee && donnee.nom_service) {
            return donnee.nom_service.toLowerCase().includes(recherche.toLowerCase());
        }
        return false;
    };

    const handleAddClick = () => {
        setModalVisible(true);
        setCurrentId(null);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setNomService('');
        setErrors({ nom: '' });
    };

    const handleSave = async () => {
        if (!nomService) {
            setErrors({ nom: 'Le nom du service est requis.' });
            return;
        }

        try {
            if (currentId) {
                // Appel à une API pour mettre à jour un service (si nécessaire)
            } else {
                await createService({ nom_service: nomService });
            }
            const data = await fetchServices();
            setDonnees(data);
            handleCloseModal();
        } catch (error) {
            console.error('Erreur lors de l\'ajout ou de la mise à jour du service :', error);
        }
    };

    const handleEditClick = (id, nom_service) => {
        setNomService(nom_service);
        setCurrentId(id);
        setModalVisible(true);
    };

    const handleDeleteClick = (id) => {
        setConfirmDelete(id);
    };

    const handleConfirmDelete = async () => {
        if (confirmDelete) {
            try {
                await deleteService(confirmDelete);
                const data = await fetchServices();
                setDonnees(data);
                setConfirmDelete(null);
            } catch (error) {
                console.error('Erreur lors de la suppression du service :', error);
            }
        }
    };

    return (
        <section className="min-w-full relative p-8 bg-gray-100 rounded-lg shadow-md w-full">
            <div className="flex h-full min-w-full w-full items-center mb-6">
                <input
                    type="text"
                    placeholder="Rechercher..."
                    className="p-3 mr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                    value={recherche}
                    onChange={(e) => setRecherche(e.target.value)}
                />
                <button
                    onClick={handleAddClick}
                    className="bg-sky-500 text-white font-semibold py-2 px-4 rounded-md shadow hover:bg-sky-600 transition duration-300"
                >
                    Ajouter
                </button>
            </div>
            <table className="w-full bg-white rounded-lg shadow-md overflow-hidden h-full">
                <thead className="bg-sky-500 text-white">
                <tr>
                    <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Id</th>
                    <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Nom Service</th>
                    <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Actions</th>
                </tr>
                </thead>
                <tbody>
                {donnees.filter(filtrerDonnees).map((item) => (
                    <tr key={item.id_service} className="hover:bg-gray-100 transition-colors">
                        <td className="text-left py-3 px-4 font-semibold text-sm">{item.id_service}</td>
                        <td className="text-left py-3 px-4 font-semibold text-sm">{item.nom_service}</td>
                        <td className="text-left py-3 px-4 font-semibold text-sm flex space-x-2">
                            <button
                                onClick={() => handleEditClick(item.id_service, item.nom_service)}
                                className="text-blue-500 hover:text-blue-700 transition duration-300"
                            >
                                <FaEdit />
                            </button>
                            <button
                                onClick={() => handleDeleteClick(item.id_service)}
                                className="text-red-500 hover:text-red-700 transition duration-300"
                            >
                                <FaTrashAlt />
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {modalVisible && (
                <div
                    className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50`}
                >
                    <div className="bg-white p-8 rounded-lg shadow-lg w-1/3">
                        <h2 className="text-2xl font-bold mb-6">
                            {currentId ? 'Modifier le Service' : 'Ajouter un Service'}
                        </h2>
                        <div className="mb-4">
                            <label className="block text-sm text-start font-semibold mb-2" htmlFor="nomService">
                                Nom du Service
                            </label>
                            <input
                                id="nomService"
                                type="text"
                                className={`w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                                    errors.nom ? 'border-red-500' : ''
                                }`}
                                value={nomService}
                                onChange={(e) => setNomService(e.target.value)}
                                required
                            />
                            {errors.nom && <p className="text-red-500 text-start text-sm mt-1">{errors.nom}</p>}
                        </div>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={handleCloseModal}
                                className="bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-md hover:bg-gray-400 transition-all duration-300"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleSave}
                                className="bg-sky-500 text-white font-semibold py-2 px-4 rounded-md shadow hover:bg-sky-600 transition-all duration-300"
                            >
                                {currentId ? 'Modifier' : 'Ajouter'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {confirmDelete !== null && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-1/3">
                        <h2 className="text-2xl font-bold mb-4">Confirmer la suppression</h2>
                        <p className="mb-6">Êtes-vous sûr de vouloir supprimer ce service ?</p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setConfirmDelete(null)}
                                className="bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-md hover:bg-gray-400 transition-all duration-300"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className="bg-red-500 text-white font-semibold py-2 px-4 rounded-md shadow hover:bg-red-600 transition-all duration-300"
                            >
                                Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default TableService;
