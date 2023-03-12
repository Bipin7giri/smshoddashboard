import { mdiBookEducation, mdiEye, mdiFaceManProfile, mdiTrashCan } from '@mdi/js'
import React, { ReactElement, useEffect, useState } from 'react'
import {
  useDepartments,
  useSampleClients,
  useSemester,
  useSubjectById,
} from '../../hooks/sampleData'
import { Client, Department, Semester } from '../../interfaces'
import BaseButton from '../../components/BaseButton'
import BaseButtons from '../../components/BaseButtons'
import CardBoxModal from '../../components/CardBoxModal'
import { Modal } from 'antd'
import { useAppSelector } from '../../stores/hooks'
import { Avatar } from 'antd'
import { Select } from 'antd'
import { GetAccessToken } from '../../helper/getAccessToken'
import { api } from '../api/axios'
import moment from 'moment'
import { notification } from 'antd'
import LayoutAuthenticated from '../../layouts/Authenticated'
import CardBox from '../../components/CardBox'
import SectionMain from '../../components/SectionMain'
const { confirm } = Modal
import { Menu, Dropdown } from 'antd'
import { useRouter } from 'next/router'
import CardBoxWidget from '../../components/CardBoxWidget'
const key = 'updatable'
const ClassList = () => {
  const router = useRouter()
  const id = router.query.id

  const { searchData } = useAppSelector((state) => state.search)
  //   const { semesters, isLoading, isError, mutate } = useSemester()
  const { subject, isError, isLoading } = useSubjectById(id)
  useEffect(() => {
    if (!id) {
      return
    }
  }, [])

  const openNotification = (message: string) => {
    notification.open({
      message: message,
    })
  }

  const showConfirm = (id: any) => {
    confirm({
      content: 'Do you want to block this user?',
      onOk() {
        openNotification('OKE')

        // api
        //   .patch('/auth/blockuser', {
        //     userId: id,
        //   })
        //   .then((res) => {
        //     openNotification(res.data.message)
        //     mutate(null)
        //   })
        //   .catch((err) => {
        //     openNotification(err.message)
        //   })
      },
      onCancel() {
        console.log('Cancel')
      },
      okButtonProps: { style: { backgroundColor: 'red', borderColor: 'red' } },
    })
  }

  const perPage = 10

  const [currentPage, setCurrentPage] = useState(0)

  const classPagination = subject?.classId?.slice(
    perPage * currentPage,
    perPage * (currentPage + 1)
  )

  const numPages = subject.classId?.length / perPage

  const pagesList = []

  for (let i = 0; i < numPages; i++) {
    pagesList.push(i)
  }
  const [userById, setUserById] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [isModalInfoActive, setIsModalInfoActive] = useState(false)
  const [isModalTrashActive, setIsModalTrashActive] = useState(false)

  const handleModalAction = () => {
    setIsModalInfoActive(false)
    setIsModalTrashActive(false)
  }

  return (
    <>
      {id && (
        <SectionMain>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-6">
            <CardBoxWidget
              key={subject.id}
              trendLabel="Subject Name"
              trendType="info"
              trendColor="info"
              icon={mdiBookEducation}
              iconColor="info"
              numberSuffix=" Subject"
              label={subject.subject_name}
              number={0}
            />
            <CardBoxWidget
              key={subject.id}
              trendLabel={'Class Code'}
              trendType="info"
              trendColor="info"
              icon={''}
              iconColor="info"
              numberSuffix=" Subject"
              label={subject.classCode}
              number={0}
            />
            <CardBoxWidget
              key={subject.id}
              trendLabel={'Teacher'}
              trendType="info"
              trendColor="info"
              icon={mdiFaceManProfile}
              iconColor="info"
              numberSuffix=" Subject"
              label={subject.teacherId?.firstName + ':' + subject?.teacherId?.lastName}
              number={0}
            />
          </div>
          <CardBoxModal
            // title="Sample modal"
            buttonColor="info"
            buttonLabel="Done"
            isActive={isModalInfoActive}
            onConfirm={handleModalAction}
            onCancel={handleModalAction}
          >
            <div className="flex items-center justify-center">
              <div className="relative w-full group max-w-md min-w-0 mx-auto  mb-6 break-words bg-white border shadow-2xl dark:bg-gray-800 dark:border-gray-700 md:max-w-sm rounded-xl">
                <div className="pb-2">
                  <div className="flex justify-center">
                    <Avatar size={140} src={userById[0]?.avatar} />
                  </div>
                  <div className="mt-2 text-center">
                    <h3 className="mb-1 text-2xl font-bold leading-normal text-gray-700 dark:text-gray-300">
                      {userById[0]?.firstName} {''}
                      {userById[0]?.lastName}
                    </h3>
                    <div className="flex flex-row justify-center w-full mx-auto space-x-2 text-center">
                      <div className="text-sm font-bold tracking-wide text-gray-600 dark:text-gray-300 font-mono text-xl">
                        <ul>
                          <li className="text-sm">Email : {userById[0]?.email}</li>
                          <li className="text-sm">PhoneNumber : {userById[0]?.phoneNumber}</li>
                          <li className="text-sm">Address : {userById[0]?.address}</li>
                          {userById[0]?.hod.length === 1 && (
                            <li className="text-sm">
                              Department Hod : {userById[0]?.hod[0]?.name}
                            </li>
                          )}

                          <li className="text-sm">
                            Roles :{' '}
                            {userById[0]?.roleId?.roles?.map((item: string) => {
                              return (
                                <li className="inline px-1" key={item}>
                                  {item}
                                </li>
                              )
                            })}
                          </li>
                        </ul>
                      </div>
                      {/* End: /typography/_h3.antlers.html */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardBoxModal>

          <table>
            <thead>
              <tr>
                <th>Avatar</th>
                <th>Name</th>
                <th>email</th>
                <th>Address</th>
                <th>Contact</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {classPagination?.map((client: any) => (
                <tr key={client.studentId.id} className="relative">
                  <td data-label="firstname">
                    <Avatar size={40} src={client.studentId.avatar} />
                  </td>
                  <td data-label="firstname">
                    {client.studentId.firstName}
                    {''} {''}
                    {client.studentId.lastName}
                  </td>
                  <td data-label="email">{client.studentId.email}</td>
                  <td data-label="address">{client.studentId.address}</td>
                  <td data-label="email">{client.studentId.phoneNumber}</td>
                  <td data-label="address">
                    <span className="text-gray-700">
                      {moment(client.studentId.createdAt).fromNow()}
                    </span>
                  </td>
                  <td className="before:hidden lg:w-1 whitespace-nowrap">
                    <BaseButtons type="justify-start lg:justify-end" noWrap>
                      <BaseButton
                        color="danger"
                        icon={mdiTrashCan}
                        onClick={() => showConfirm(client.id)}
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
        </SectionMain>
      )}
    </>
  )
}
ClassList.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>
}

export default ClassList
