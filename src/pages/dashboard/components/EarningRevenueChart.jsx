import React from 'react'
import {
    Chart as ChartJs,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Tooltip,
    Title,
    Legend,
    BarElement,
    ArcElement
} from 'chart.js'
import { Bar } from 'react-chartjs-2';


ChartJs.register(
    CategoryScale,
    LinearScale,
    LineElement,
    BarElement,
    PointElement,
    Tooltip,
    Title,
    Legend,
    ArcElement
);

function EarningRevenueChart({ data }) {
    const barChartData = {
        labels: data.labels,
        datasets: data.datasets
    };
    const options = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                position: 'top',
            },
        },
        scales: {
            y: {
                display: false,
            }
        },
    };

    return (
        <Bar data={barChartData} options={options} className='w-full h-full' />
    )
}

export default EarningRevenueChart