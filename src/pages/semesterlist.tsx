import { mdiEye, mdiTrashCan } from '@mdi/js'
import React, { ReactElement, useEffect, useState } from 'react'
import { useDepartments, useSampleClients, useSemester } from '../hooks/sampleData'
import { Client, Department, Semester } from '../interfaces'
import BaseButton from '../components/BaseButton'
import BaseButtons from '../components/BaseButtons'
import CardBoxModal from '../components/CardBoxModal'
import { Modal } from 'antd'
import { useAppSelector } from '../stores/hooks'
import { Avatar } from 'antd'
import { Select } from 'antd'
import { GetAccessToken } from '../helper/getAccessToken'
import { api } from './api/axios'
import moment from 'moment'
import { notification } from 'antd'
import LayoutAuthenticated from '../layouts/Authenticated'
import CardBox from '../components/CardBox'
import SectionMain from '../components/SectionMain'
const { confirm } = Modal
import { Menu, Dropdown } from 'antd'
import { useRouter } from 'next/router'
import Swal from 'sweetalert2'
const key = 'updatable'
import { EditOutlined } from '@ant-design/icons'
const SemesterList = () => {
  const { searchData } = useAppSelector((state) => state.search)
  const { semesters, isLoading, isError, mutate } = useSemester()
  const router = useRouter()
  const openNotification = (message: string) => {
    notification.open({
      message: message,
    })
  }

  const haneUpdate = async (id: any) => {
    const { value: data } = await Swal.fire({
      title: 'Input semester name',
      input: 'text',
      inputLabel: 'Semester Name',
      inputPlaceholder: 'Semester Name',
    })

    if (data) {
      console.log(data)
      api
        .patch(`/hod/semester/${id}`, { name: data })
        .then((res: any) => {
          Swal.fire(`${res.data.message}`)
        })
        .catch((err) => {
          Swal.fire(`${err}`)
        })
    }
  }

  const showConfirm = (id: any) => {
    confirm({
      content: 'Do you want to block this user?',
      onOk() {
        api
          .delete(`/hod/semester/${id}`)
          .then((res) => {
            openNotification(res.data.message)
            mutate(null)
          })
          .catch((err) => {
            openNotification(err.message)
          })
      },
      onCancel() {
        console.log('Cancel')
      },
      okButtonProps: { style: { backgroundColor: 'red', borderColor: 'red' } },
    })
  }

  const perPage = 10

  const [currentPage, setCurrentPage] = useState(0)

  const semesterPagination = semesters?.slice(perPage * currentPage, perPage * (currentPage + 1))

  const numPages = semesters?.length / perPage

  const pagesList = []

  for (let i = 0; i < numPages; i++) {
    pagesList.push(i)
  }
  const [userById, setUserById] = useState([])

  const [isModalInfoActive, setIsModalInfoActive] = useState(false)
  const [isModalTrashActive, setIsModalTrashActive] = useState(false)

  const handleModalAction = () => {
    setIsModalInfoActive(false)
    setIsModalTrashActive(false)
  }

  const [semester, setSemester] = useState([])

  useEffect(() => {
    const data = semesters?.semesterId

    const tempSemester = []
    data?.map((sem) => {
      alert()
      tempSemester.push({ value: sem.id, label: sem.name.toUpperCase() })
    })
    setSemester([...tempSemester])
  }, [])

  const changeRole = async (roleId: string, userId: any) => {
    // api
    //   .patch('auth/users-roles', {
    //     roleId: roleId,
    //     userId: userId,
    //   })
    //   .then((res) => {
    //     openNotification(res?.data?.message)
    //     mutate(null)
    //   })
    //   .catch((err) => {
    //     alert(err)
    //   })
  }
  return (
    <>
      <SectionMain>
        <CardBox className="mb-6" hasTable>
          <table>
            <thead>
              <tr>
                <th>Semester</th>
                <th>Subjects</th>
                <th>Created</th>
                <th>Actions</th>
                {/* <th>email</th>
                <th>Address</th>
                <th>Contact</th>
                <th className="flex justify-center py-5">Role</th>
              
                <th>Actions</th> */}
              </tr>
            </thead>
            {/* {JSON.stringify(semesterPagination)} */}
            <tbody>
              {semesterPagination?.map((semester: Semester) => (
                <tr key={semester.id} className="relative">
                  <td data-label="name">
                    {semester.name}
                    <EditOutlined
                      onClick={() => {
                        haneUpdate(semester.id)
                      }}
                    />
                  </td>
                  <td data-label="email">
                    <div className="flex">
                      <div>
                        <Dropdown
                          overlay={
                            <Menu>
                              {semester.subjects.map((item, id) => {
                                return (
                                  <>
                                    <Menu.Item
                                      onClick={(e) => {
                                        router.push(`/subjects/${item.id}`)
                                        alert(item.id)
                                      }}
                                      key="0"
                                    >
                                      {item.subject_name}
                                    </Menu.Item>
                                  </>
                                )
                              })}
                            </Menu>
                          }
                          trigger={['hover']}
                        >
                          <a
                            className="text-blue-400 hover:cursor-pointer"
                            onClick={(e) => {
                              e.preventDefault()
                            }}
                          >
                            Subject List
                          </a>
                        </Dropdown>
                      </div>
                    </div>
                  </td>
                  <td data-label="address">
                    <span className="text-gray-700">{moment(semester.createdAt).fromNow()}</span>
                  </td>
                  <td className="before:hidden lg:w-1 whitespace-nowrap">
                    <BaseButtons type="justify-start lg:justify-end" noWrap>
                      <BaseButton
                        color="danger"
                        icon={mdiTrashCan}
                        onClick={() => showConfirm(semester.id)}
                        small
                      />
                    </BaseButtons>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800">
            <div className="flex flex-col md:flex-row items-center justify-between py-3 md:py-0">
              <BaseButtons>
                {pagesList.map((page) => (
                  <BaseButton
                    key={page}
                    active={page === currentPage}
                    label={page + 1}
                    color={page === currentPage ? 'lightDark' : 'whiteDark'}
                    small
                    onClick={() => setCurrentPage(page)}
                  />
                ))}
              </BaseButtons>
              <small className="mt-6 md:mt-0">
                Page {currentPage + 1} of {numPages}
              </small>
            </div>
          </div>
        </CardBox>
      </SectionMain>
    </>
  )
}
SemesterList.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>
}

export default SemesterList
