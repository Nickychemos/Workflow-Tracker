import axios from "axios"

import type {
  Application,
  ApplicationListItem,
  DecisionValue,
} from "./types"

const baseURL =
  import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8001/api"

export const http = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
})

export interface ApplicationFilters {
  status?: string
  application_type?: string
  search?: string
}

export interface ApplicationCreatePayload {
  applicant_name: string
  applicant_email: string
  company_name: string
  application_type: string
  description?: string
}

export type ApplicationUpdatePayload = Partial<ApplicationCreatePayload>

export interface DecisionPayload {
  decision: DecisionValue
  comment: string
}

export const api = {
  list: async (
    filters: ApplicationFilters = {},
  ): Promise<ApplicationListItem[]> => {
    const { data } = await http.get<ApplicationListItem[]>("/applications/", {
      params: filters,
    })
    return data
  },

  get: async (id: string): Promise<Application> => {
    const { data } = await http.get<Application>(`/applications/${id}/`)
    return data
  },

  create: async (
    payload: ApplicationCreatePayload,
  ): Promise<Application> => {
    const { data } = await http.post<Application>("/applications/", payload)
    return data
  },

  update: async (
    id: string,
    payload: ApplicationUpdatePayload,
  ): Promise<Application> => {
    const { data } = await http.patch<Application>(
      `/applications/${id}/`,
      payload,
    )
    return data
  },

  submit: async (id: string): Promise<Application> => {
    const { data } = await http.post<Application>(
      `/applications/${id}/submit/`,
    )
    return data
  },

  startReview: async (id: string): Promise<Application> => {
    const { data } = await http.post<Application>(
      `/applications/${id}/start-review/`,
    )
    return data
  },

  decide: async (
    id: string,
    payload: DecisionPayload,
  ): Promise<Application> => {
    const { data } = await http.post<Application>(
      `/applications/${id}/decision/`,
      payload,
    )
    return data
  },
}
