import { mdiAccountMultiple, mdiBookEducation } from '@mdi/js'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import type { ReactElement } from 'react'
import LayoutAuthenticated from '../layouts/Authenticated'
import SectionMain from '../components/SectionMain'
import SectionTitleLineWithButton from '../components/SectionTitleLineWithButton'
import CardBoxWidget from '../components/CardBoxWidget'
import { useDepartments, useSemester } from '../hooks/sampleData'
import { Department, Semester } from '../interfaces'
import CardBox from '../components/CardBox'
import { sampleChartData } from '../components/ChartLineSample/config'
import TableSampleClients from '../components/TableSampleClients'
import { getPageTitle } from '../config'
import { Button, Card, Modal, notification, Upload, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import type { UploadProps } from 'antd'
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
import PieChart from '../components/charts/PieChart'
import DoughnutChart from '../components/charts/DoughnutChart'
import { GetAccessToken } from '../helper/getAccessToken'

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

const openNotification = (message: string) => {
  notification.open({
    message: message,
    description:
      'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
    onClick: () => {
      console.log('Notification Clicked!')
    },
  })
}

const Dashboard = () => {
  const { semesters, isLoading, isError } = useSemester()

  const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July']
  const [data, setData] = useState({
    labels: labels,
    datasets: [
      {
        label: 'Expenses by Month',
        data: [65, 59, 80, 81, 56, 55, 40],
        backgroundColor: ['rgba(225, 99, 132, 2.2)'],
        borderColor: ['rgb(153, 102, 255)'],
        borderWidth: 1,
      },
    ],
  })

  const pieData = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
      {
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  }

  const doughnutData = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
      {
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  }

  useEffect(() => {
    if (isError) {
      openNotification(isError)
    }
  }, [])
  const [chartData, setChartData] = useState(sampleChartData())

  const fillChartData = (e: React.MouseEvent) => {
    e.preventDefault()

    setChartData(sampleChartData())
  }
  const [open, setOpen] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [modalText, setModalText] = useState('Content of the modal')

  const showModal = () => {
    setOpen(true)
  }

  const handleOk = () => {
    setModalText('The modal will be closed after two seconds')
    setConfirmLoading(true)
    setTimeout(() => {
      setOpen(false)
      setConfirmLoading(false)
    }, 2000)
  }

  const handleCancel = () => {
    console.log('Clicked cancel button')
    setOpen(false)
  }

  const props: UploadProps = {
    name: 'students',
    action: 'https://sms-twox.onrender.com/api/hod/addBulkStudent',
    headers: {
      authorization: GetAccessToken(),
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`)
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`)
      }
    },
  }

  return (
    <>
      <Head>
        <title>{getPageTitle('Dashboard')}</title>
      </Head>
      <Modal
        okButtonProps={{
          style: { backgroundColor: 'blue' },
        }}
        title="Add Student"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Upload {...props}>
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
      </Modal>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiBookEducation} title="Department">
          <Button
            className="bg-[#3b82f6] text-white hover:text-white hover:bg-blue-300"
            onClick={showModal}
          >
            Add Bulk Student
          </Button>
        </SectionTitleLineWithButton>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-6">
          {semesters?.map((semester: Semester) => (
            <CardBoxWidget
              key={semester.id}
              trendLabel={semester.name}
              trendType="info"
              trendColor="info"
              icon={mdiBookEducation}
              iconColor="info"
              numberSuffix=" Semester"
              label="Semester"
              number={0}
            />
          ))}
        </div>
        <div className="flex justify-between gap-x-5 items-center w-[300px]">
          <PieChart data={pieData} />
          <Bar data={data} />
          <DoughnutChart data={doughnutData} />
        </div>
        <SectionTitleLineWithButton icon={mdiAccountMultiple} title="Users" />
        <CardBox hasTable>
          <TableSampleClients />
        </CardBox>
      </SectionMain>
      <h1>hihsaidh</h1>
    </>
  )
}

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>
}

export default Dashboard
