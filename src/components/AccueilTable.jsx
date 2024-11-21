import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, Filler } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, Filler, CategoryScale, LinearScale);

const AccueilTable = () => {
    const [totalPrix, setTotalPrix] = useState({
        totalPrix: 0,
        semaine: {},
        mois: {}
    });

    useEffect(() => {
        // Simuler une récupération des données ici
        setTotalPrix({
            totalPrix: 120000,
            semaine: { '2024-11-14': 10000, '2024-11-15': 20000, '2024-11-16': 30000 },
            mois: { 'JANUARY': 40000, 'FEBRUARY': 80000, 'MARCH': 120000 },
        });
    }, []);

    const convertDate = (dateStr) => {
        const dateParts = dateStr.split('-');
        return `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
    };

    const convertMonthToFrench = (month) => {
        const months = {
            'JANUARY': 'Janvier',
            'FEBRUARY': 'Février',
            'MARCH': 'Mars',
            'APRIL': 'Avril',
            'MAY': 'Mai',
            'JUNE': 'Juin',
            'JULY': 'Juillet',
            'AUGUST': 'Août',
            'SEPTEMBER': 'Septembre',
            'OCTOBER': 'Octobre',
            'NOVEMBER': 'Novembre',
            'DECEMBER': 'Décembre',
        };
        return months[month] || month;
    };

    // Semaine
    const dataSemaine = totalPrix.semaine;
    const labelsSemaine = Object.keys(dataSemaine).map(convertDate);
    const dataPrixSemaine = Object.values(dataSemaine);

    const chartDataSemaine = {
        labels: labelsSemaine,
        datasets: [
            {
                label: 'Prix Total / Jour',
                data: dataPrixSemaine,
                borderColor: 'rgba(75,192,192,1)',
                backgroundColor: 'rgba(75,192,192,0.2)',
                fill: true,
            },
        ],
    };

    // Mois
    const dataMois = totalPrix.mois;
    const moisLabels = Object.keys(dataMois).map(convertMonthToFrench);
    const dataPrixMois = Object.values(dataMois);

    const chartDataMois = {
        labels: moisLabels,
        datasets: [
            {
                label: 'Prix Total / Mois',
                data: dataPrixMois,
                borderColor: 'rgba(255,99,132,1)',
                backgroundColor: 'rgba(255,99,132,0.2)',
                fill: true,
            },
        ],
    };

    const chartOptions = {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
            y: {
                title: {
                    display: true,
                    text: 'Prix (Ar)',
                },
            },
        },
    };



    return (
        <div className="flex w-full m-auto">
            {/* Cartes */}
            <div className="w-[100%] flex-row">
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-sky-500 text-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-bold mb-2">Entrant / Jour</h2>
                        <p className="text-3xl font-semibold">{totalPrix.totalPrix} Ar</p>
                    </div>
                    <div className="bg-green-500 text-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-bold mb-2">Entrant / Semaine</h2>
                        <p className="text-3xl font-semibold">{Object.values(dataSemaine).reduce((acc, val) => acc + val, 0)} Ar</p>
                    </div>
                </div>
                {/* Graphiques */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold text-center mb-4">Prix Total par Jour</h2>
                        <div className="h-80">
                            <Line data={chartDataSemaine} options={chartOptions}/>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold text-center mb-4">Prix Total par Mois</h2>
                        <div className="h-80">
                            <Line data={chartDataMois} options={chartOptions}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccueilTable;
