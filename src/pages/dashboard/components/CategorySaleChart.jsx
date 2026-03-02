import React from 'react'
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, Tooltip, Legend, Title, CategoryScale, LinearScale, PointElement, LineElement, RadialLinearScale } from 'chart.js';

ChartJS.register(Tooltip, Legend, Title, CategoryScale, LinearScale, PointElement, LineElement, RadialLinearScale);

function CategorySaleChart({ data }) {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: false,
                text: 'Category Sale',
            },
        },
    }
    const pieData = {
        labels: data.labels,
        datasets: data.datasets,
    };

    return (
        <div className='w-full min-h-[400px]'>
            <Pie data={pieData} options={options} />
        </div>
    )
}

export default CategorySaleChart