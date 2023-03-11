import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  ArcElement,
} from 'chart.js'
import { Bar, Doughnut, Pie } from 'react-chartjs-2'
ChartJS.register(ArcElement, Tooltip, Legend)

const DoughnutChart = (data?: any) => {
  return <Doughnut data={data.data} />
}

export default DoughnutChart
