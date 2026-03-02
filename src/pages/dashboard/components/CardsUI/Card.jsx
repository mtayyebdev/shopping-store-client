import React from 'react'
import { LuTrendingDown, LuTrendingUp } from 'react-icons/lu';
import {
    Chart as ChartJs,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Tooltip,
    Title,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJs.register(
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Tooltip,
    Title,
    Legend,
)

function Card({ ChartData, Icon, color, title, total, percentage, currency }) {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                enabled: true,
                backgroundColor: '#fff',
                titleColor: '#000',
                bodyColor: '#000',
                borderColor: '#e5e7eb',
                borderWidth: 1,
                padding: 12,
                displayColors: false,
                callbacks: {
                    label: (context) => `${context.parsed.y}`,
                },
            },
        },
        scales: {
            x: {
                display: false, // Hide x-axis
            },
            y: {
                display: false, // Hide y-axis
            },
        },
        animation: {
            duration: 2000,
            easing: 'easeInOutQuart',
        },
    };

    const data = {
        labels: ["", "", "", "", "", "", ""],
        datasets: [
            {
                data: ChartData,
                borderColor: color, // Green color
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 200);
                    gradient.addColorStop(0, 'rgba(16, 185, 129, 0.3)');
                    gradient.addColorStop(1, 'rgba(16, 185, 129, 0.01)');
                    return gradient;
                },
                borderWidth: 3,
                fill: true,
                tension: 0.4, // This creates the smooth curve
                pointRadius: 6,
                pointBackgroundColor: color,
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointHoverRadius: 8,
            },
        ],
    };

    return (
        <div className='min-w-70 min-h-37 bg-white rounded-2xl px-4 py-3 shadow-xl'>
            <div className="flex items-center justify-between">
                <div className="flex gap-3 items-center">
                    <div className="icon bg-clip-border text-[#2275fc] bg-[#f0f6ff] p-3.5" style={{ clipPath: "polygon(100% 50%,75% 93.3%,25% 93.3%,0% 50%,25% 6.7%,75% 6.7%)" }}>
                        <Icon size={25} />
                    </div>
                    <div>
                        <h4 className='text-sm'>{title}</h4>
                        <h2 className='text-2xl font-bold'>{currency}{total}</h2>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {percentage < 0 ? <LuTrendingDown size={20} className='text-red-600' /> : <LuTrendingUp size={20} className='text-green-600' />}
                    <p className='font-semibold'>{percentage}%</p>
                </div>
            </div>
            <div className="chart min-w-60 h-19 relative">
                <Line data={data} options={options} />
            </div>
        </div>
    )
}

export default Card