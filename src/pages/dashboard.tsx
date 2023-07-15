import { mdiAccountMultiple, mdiBookEducation, mdiListStatus } from '@mdi/js'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import type { ReactElement } from 'react'
import LayoutAuthenticated from '../layouts/Authenticated'
import SectionMain from '../components/SectionMain'
import SectionTitleLineWithButton from '../components/SectionTitleLineWithButton'
import CardBoxWidget from '../components/CardBoxWidget'
import { useDepartments, useSemester, useSemesterStatus } from '../hooks/sampleData'
import { Department, Semester } from '../interfaces'
import CardBox from '../components/CardBox'
import { sampleChartData } from '../components/ChartLineSample/config'
import TableSampleClients from '../components/TableSampleClients'
import { getPageTitle } from '../config'
import { Button, Card, Modal, notification, Upload, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import type { UploadProps } from 'antd'
import { GetAccessToken } from '../helper/getAccessToken'
import Chart from '../components/charts/Charts'


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
  const { isErrorSemesterError,isLoadingSemesterStats,mutate,semestersStats } = useSemesterStatus()
console.log(semestersStats)


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


      <SectionTitleLineWithButton
          icon={mdiListStatus}
          title="System Graphical Status"
        ></SectionTitleLineWithButton>
        <div>
          <Chart data={semestersStats} />
        </div>
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
