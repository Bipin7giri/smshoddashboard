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
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  ArcElement
)
const BarChart = (data: any) => {
  console.log(data)
  return (
    <>
      {data && (
        <>
          <Bar data={data.data} />
        </>
      )}
    </>
  )
}

export default BarChart
