import useSWR from 'swr'
import { fetcher } from '../pages/api/axios'
// const fetcher = (url: string) => fetch(url).then((res) => res.json())

export const useSampleClients = (search?: string) => {
  const { data, error, mutate } = useSWR(
    `/hod/department/student?search=${encodeURIComponent(search)}`,
    fetcher
  )

  return {
    mutate,
    clients: data?.userId ?? [],
    isLoading: !error && !data,
    isError: error,
  }
}

export const useDepartments = () => {
  const { data, error, mutate } = useSWR('/department', fetcher)
  return {
    mutate,
    departments: data ?? [],
    isLoading: !error && !data,
    isError: error,
  }
}

export const useSemester = () => {
  const { data, error, mutate } = useSWR('/hod/semester', fetcher)
  return {
    mutate,
    semesters: data ?? [],
    isLoading: !error && !data,
    isError: error,
  }
}

export const useSubjectById = (id: any) => {
  const { data, error, mutate } = useSWR(`/hod/subject/${id}`, fetcher)
  return {
    mutate,
    subject: data ?? {},
    isLoading: !error && !data,
    isError: error,
  }
}

export const useSampleTransactions = () => {
  const { data, error } = useSWR('/admin-one-react-tailwind/data-sources/history.json', fetcher)
  return {
    transactions: data?.data ?? [],
    isLoading: !error && !data,
    isError: error,
  }
}
export const useNotificationList = () => {
  const { data, error } = useSWR('/admin/notification', fetcher)
  return {
    notification: data?.data ?? [],
    isLoading: !error && !data,
    isError: error,
  }
}
