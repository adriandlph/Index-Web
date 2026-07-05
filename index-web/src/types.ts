export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

export interface DivisionResponse {
  id: number
  name: string
}

export interface DepartmentResponse {
  id: number
  name: string
  divisionId: number
}

export interface ProjectResponse {
  id: number
  name: string
  departmentId: number
}

export interface ProductResponse {
  id: number
  name: string
  version: string
  publishDate: string
  description: string
  projectId: number
}

export interface DivisionRow {
  name: string
}

export interface DepartmentRow {
  name: string
  division: string
}

export interface ProjectRow {
  name: string
  department: string
}

export interface ProductRow {
  name: string
  version: string
  date: string
  time: string
  description: string
  project: string
}
