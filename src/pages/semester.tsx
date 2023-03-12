import { mdiChartTimelineVariant, mdiHoopHouse } from '@mdi/js'
// eslint-disable-next-line @next/next/no-document-import-in-page
import React, { useEffect, useState } from 'react'
import type { ReactElement } from 'react'
import BaseButton from '../components/BaseButton'
import CardBox from '../components/CardBox'
import FormField from '../components/FormField'
import SectionMain from '../components/SectionMain'
import SectionTitleLineWithButton from '../components/SectionTitleLineWithButton'
import { getPageTitle } from '../config'
import BaseButtons from '../components/BaseButtons'
import Head from 'next/head'
import BaseDivider from '../components/BaseDivider'
import { Button, message, Steps, theme } from 'antd'
import LayoutAuthenticated from '../layouts/Authenticated'
import { Formik, Form, Field } from 'formik'
import { notification, Select } from 'antd'
import { useSampleClients } from '../hooks/sampleData'
import { api } from './api/axios'
import { GetAccessToken } from '../helper/getAccessToken'
import axios from 'axios'
import { count } from 'console'

export interface searchData {
  abel: string
  value: string
}

interface s {
  // renamed from ITrueFalse
  searchList: searchData[]
}

const Departments = () => {
  const { clients } = useSampleClients()

  const [teacher, setTeacher] = useState('')
  const [semesterName, setSemesterName] = useState('')
  const [subjectName, setSubjectName] = useState('')
  const [semesterId, setSemesterId] = useState()
  const [name, setName] = useState('')
  const [users, setUsers] = useState([])
  const fetchRoles = async () => {
    const res: any = await api('/auth/allusers', {
      headers: {
        Authorization: GetAccessToken() || null,
      },
    })
    const data = res?.data
    console.log(data)
    const tempRoles = []
    data?.map((user) => {
      tempRoles.push({ value: user.id, label: user.email })
    })
    setUsers([...tempRoles])
  }
  useEffect(() => {
    fetchRoles()
  }, [])
  const steps = [
    {
      title: 'Add Semester',
      content: (
        <form>
          <div className="flex justify-center items-center">
            <div className="py-4">
              <label
                htmlFor=""
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Semester Name
              </label>
              <input
                id="semester name"
                onKeyUp={(e: any) => {
                  setSemesterName(e.target.value)
                }}
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="BBA076"
              />
            </div>
          </div>
        </form>
      ),
    },
    {
      title: 'Add Class',
      content: (
        <form>
          <div className="grid gap-6 mb-6 md:grid-cols-2 py-4 px-2">
            <div>
              <label
                htmlFor=""
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Subject Name
              </label>
              <input
                id="subjectname"
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="John"
                onKeyUp={(e: any) => {
                  setSubjectName(e.target.value)
                }}
              />
            </div>
            <div>
              <label
                htmlFor="last_name"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Teacher
              </label>
              <Select
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                showSearch
                placeholder="Search to Select"
                optionFilterProp="children"
                filterOption={(input, option) => (option?.label ?? '').includes(input)}
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? '')
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? '').toLowerCase())
                }
                options={users}
                onChange={(e: any) => {
                  setTeacher(e)
                }}
              />
            </div>
          </div>
        </form>
      ),
    },
    {
      title: 'Last',
      content: 'Last-content',
    },
  ]
  const openNotification = (message: string, color?: string) => {
    if (color) {
      notification.open({
        message: <h1 className="text-red-400">{message}</h1>,
      })
    } else {
      notification.open({
        message: message,
      })
    }
  }

  const { token } = theme.useToken()
  const [current, setCurrent] = useState(0)
  const next = () => {
    alert(current)
    if (current === 0) {
      api
        .post('/hod/semester', {
          name: semesterName,
        })
        .then((res) => {
          setSemesterId(res.data.id)
          setCurrent(current + 1)
          openNotification('successfully added')
          setSemesterName('')
        })
        .catch((err) => {
          setCurrent(current)
          openNotification(err?.response?.data?.details[0]?.message)
        })
    }
    if (current === 1) {
      api
        .post('/hod/subject', {
          subjectName: subjectName,
          teacherId: teacher,
          semesterId: semesterId,
        })
        .then((res) => {
          setCurrent(current + 1)
          openNotification('successfully added')
        })
        .catch((err) => {
          openNotification(err.message)
        })
    }
    setCurrent(current + 1)
  }

  const prev = () => {
    setCurrent(current - 1)
  }
  const items = steps.map((item) => ({ key: item.title, title: item.title }))
  const contentStyle: any = {
    lineHeight: '260px',
    textAlign: 'center',
    color: token.colorTextTertiary,
    backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: `1px dashed ${token.colorBorder}`,
    marginTop: 16,
  }

  return (
    <>
      <Head>
        <title>{getPageTitle('Semester')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title="Semester" main>
          <BaseButton
            href="/semesterlist"
            icon={mdiHoopHouse}
            label="Semester List"
            color="lightDark"
            roundedFull
            small
          />
        </SectionTitleLineWithButton>
        <>
          <Steps current={current} items={items} />
          <div style={contentStyle}>{steps[current].content}</div>
          <div style={{ marginTop: 24 }}>
            {current < steps.length - 1 && (
              <Button className="bg-blue-400 text-white" onClick={() => next()}>
                Next
              </Button>
            )}
            {current === steps.length - 1 && (
              <Button type="ghost" onClick={() => message.success('Processing complete!')}>
                Done
              </Button>
            )}
            {current > 0 && (
              <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                Previous
              </Button>
            )}
          </div>
        </>
      </SectionMain>
    </>
  )
}

Departments.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>
}

export default Departments
