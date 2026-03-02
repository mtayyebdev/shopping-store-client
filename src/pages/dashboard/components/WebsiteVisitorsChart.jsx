import React from 'react'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend,Filler } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend,Filler);

function WebsiteVisitorsChart() {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
        },
        animations: {
            tension: {
                duration: 1000,
                easing: 'linear',
                from: 1,
                to: 0,
                loop: true
            }
        },
        scales: {
            y: {
                display: true,
            }
        },
    };
    const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    const data = {
        labels,
        datasets: [
            {
                label: 'Website Visitors',
                data: [65, 59, 80, 81, 56, 55, 40],
                fill: false,
                borderColor: 'rgb(219,68,68)',
                tension: 0.2
            }
        ],
    };
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Website Visitors</h2>
                    <p className="text-sm text-gray-500 mt-1">Real-time analysis of your website traffic</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                        Live: 1,240 online
                    </div>
                    <select className="bg-gray-50 border-none text-sm font-medium rounded-lg focus:ring-0 text-gray-600 px-4 py-2 cursor-pointer outline-0">
                        <option>Last 7 days</option>
                        <option>Last 30 days</option>
                        <option>Last 12 months</option>
                    </select>
                </div>
            </div>

            <div className="w-full h-[400px] relative">
                <Line options={options} data={data} />
            </div>
        </div>
    )
}

export default WebsiteVisitorsChart