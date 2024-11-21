// src/components/TableConso.jsx
import React, { useState, useEffect } from 'react';
import { fetchOutils, saveOutil, updateOutil, deleteOutil } from '../api/Outils.jsx';
import {FaEdit, FaTrashAlt} from "react-icons/fa";

const TableConso = () => {
    const [recherche, setRecherche] = useState('');
    const [donnees, setDonnees] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [nomOutil, setNomOutil] = useState('');
    const [prixOutil, setPrixOutil] = useState('');
    const [errors, setErrors] = useState({ nom: '', prix: '' });
    const [currentId, setCurrentId] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);

    useEffect(() => {
        const fetchDonnees = async () => {
            try {
                const data = await fetchOutils();
                setDonnees(data);
            } catch (error) {
                console.error('Erreur lors de la récupération des données:', error);
            }
        };

        fetchDonnees();
    }, []);

    const filtrerDonnees = (donnee) => {
        if (donnee && donnee.nomOutils) {
            return donnee.nomOutils.toLowerCase().includes(recherche.toLowerCase());
        }
        return false;
    };


    const handleAddClick = () => {
        setModalVisible(true);
        setCurrentId(null);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setNomOutil('');
        setPrixOutil('');
        setErrors({ nom: '', prix: '' });
    };

    const handleSave = async () => {
        let hasErrors = false;
        const newErrors = { nom: '', prix: '' };

        if (!nomOutil) {
            newErrors.nom = 'Le nom est requis.';
            hasErrors = true;
        }

        if (!prixOutil) {
            newErrors.prix = 'Le prix est requis.';
            hasErrors = true;
        }

        if (hasErrors) {
            setErrors(newErrors);
            return;
        }

        try {
            if (currentId) {
                await updateOutil(currentId, nomOutil, prixOutil);
            } else {
                await saveOutil(nomOutil, prixOutil);
            }
            const data = await fetchOutils();
            setDonnees(data);
            handleCloseModal();
        } catch (error) {
            console.error('Erreur lors de l\'ajout ou de la mise à jour de l\'outil:', error);
        }
    };

    const handlePrixChange = (e) => {
        const value = e.target.value;
        if (/^\d*\.?\d*$/.test(value)) {
            setPrixOutil(value);
        }
    };

    const handleEditClick = (id, nom, prixOutil) => {
        setNomOutil(nom);
        setPrixOutil(prixOutil);
        setCurrentId(id);
        setModalVisible(true);
    };

    const handleDeleteClick = (id) => {
        setConfirmDelete(id);
    };

    const handleConfirmDelete = async () => {
        if (confirmDelete) {
            try {
                await deleteOutil(confirmDelete);
                const data = await fetchOutils();
                setDonnees(data);
                setConfirmDelete(null);
            } catch (error) {
                console.error('Erreur lors de la suppression de l\'outil:', error);
            }
        }
    };

    return (
        <section className="min-w-full relative p-8 bg-gray-100 rounded-lg shadow-md">
            <div className="flex justify-between h-full min-w-full w-full items-center mb-6">
                <input
                    type="text"
                    placeholder="Rechercher..."
                    className="w-full p-3 mr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
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
                    <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Nom</th>
                    <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Prix</th>
                    <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Actions</th>
                </tr>
                </thead>
                <tbody>
                {donnees.filter(filtrerDonnees).map((item) => (
                    <tr key={item.id} className="hover:bg-gray-100 transition-colors">
                        <td className="text-left py-3 px-4 font-semibold text-sm">{item.id}</td>
                        <td className="text-left py-3 px-4 font-semibold text-sm">{item.nomOutils}</td>
                        <td className="text-left py-3 px-4 font-semibold text-sm">{item.prixOutils} Ar</td>
                        <td className="text-left py-3 px-4 font-semibold text-sm flex space-x-2">
                            <button
                                onClick={() => handleEditClick(item.id, item.nom, item.prix)}
                                className="text-blue-500 hover:text-blue-700 transition duration-300"
                            >
                                <FaEdit />
                            </button>
                            <button
                                onClick={() => handleDeleteClick(item.id)}
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
                    className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-500 ease-in-out ${
                        modalVisible ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                    <div
                        className={`bg-white p-8 rounded-lg shadow-lg w-1/3 transform transition-transform duration-500 ease-in-out ${
                            modalVisible ? 'scale-100' : 'scale-75'
                        }`}
                    >
                        <h2 className="text-2xl font-bold mb-6">
                            {currentId ? 'Modifier l\'outil' : 'Ajouter un outil'}
                        </h2>
                        <div className="mb-4">
                            <label className="block text-sm text-start font-semibold mb-2" htmlFor="nomOutil">
                                Nom
                            </label>
                            <input
                                id="nomOutil"
                                type="text"
                                className={`w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                                    errors.nom ? 'border-red-500' : ''
                                }`}
                                value={nomOutil}
                                onChange={(e) => setNomOutil(e.target.value)}
                                required
                            />
                            {errors.nom && <p className="text-red-500 text-start text-sm mt-1">{errors.nom}</p>}
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm text-start font-semibold mb-2" htmlFor="prixOutil">
                                Prix
                            </label>
                            <input
                                id="prixOutil"
                                type="text"
                                className={`w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 transition-all focus:ring-sky-500 ${
                                    errors.prix ? 'border-red-500' : ''
                                }`}
                                value={prixOutil}
                                onChange={handlePrixChange}
                                required
                            />
                            {errors.prix && <p className="text-red-500 text-start text-sm mt-1">{errors.prix}</p>}
                        </div>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={handleCloseModal}
                                className="bg-gray-500 text-white font-semibold py-2 px-4 rounded-md shadow hover:bg-gray-600 transition duration-300"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleSave}
                                className="bg-sky-500 text-white font-semibold py-2 px-4 rounded-md shadow hover:bg-sky-600 transition duration-300"
                            >
                                {currentId ? 'Modifier' : 'Ajouter'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {confirmDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-1/3">
                        <h2 className="text-2xl font-bold mb-6">Confirmer la suppression</h2>
                        <p className="mb-6">Êtes-vous sûr de vouloir supprimer cet outil ?</p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setConfirmDelete(null)}
                                className="bg-gray-500 text-white font-semibold py-2 px-4 rounded-md shadow hover:bg-gray-600 transition duration-300"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className="bg-red-500 text-white font-semibold py-2 px-4 rounded-md shadow hover:bg-red-600 transition duration-300"
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

export default TableConso;
