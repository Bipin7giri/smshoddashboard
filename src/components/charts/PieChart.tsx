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
const PieChart = (data: any) => {
  console.log(data)
  return (
    <>
      {data && (
        <>
          <Pie data={data.data} />
        </>
      )}
    </>
  )
}

export default PieChart
