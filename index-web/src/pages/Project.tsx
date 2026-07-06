import { useEffect, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import type { ProjectResponse, DepartmentResponse, DivisionResponse, ProjectRow, PageCountResponse } from '../types.ts'
import { fetchApi, postApi, putApi, deleteApi } from '../services/api.ts'
import { ENDPOINTS } from '../config/api.ts'
import DataTable from '../components/DataTable.tsx'
import EditModal from '../components/EditModal.tsx'
import Loading from '../components/Loading.tsx'
import ErrorState from '../components/ErrorState.tsx'
import Notification from '../components/Notification.tsx'
import ConfirmDialog from '../components/ConfirmDialog.tsx'
import BulkActionBar from '../components/BulkActionBar.tsx'
import Tooltip from '../components/Tooltip.tsx'
import FilterSelect from '../components/FilterSelect.tsx'

const columns = (t: TFunction) => [
  { key: 'name' as const, header: t('table.col_name') },
  { key: 'department' as const, header: t('table.col_department') },
]

function Project() {
  const { t } = useTranslation()
  const [data, setData] = useState<ProjectResponse[]>([])
  const [rows, setRows] = useState<ProjectRow[]>([])
  const [departments, setDepartments] = useState<DepartmentResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(25)
  const [totalPages, setTotalPages] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [creating, setCreating] = useState(false)
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set())
  const [notification, setNotification] = useState<string | null>(null)
  const [notifType, setNotifType] = useState<'success' | 'error'>('success')
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null)
  const [bulkDelete, setBulkDelete] = useState(false)
  const [filterDivisionId, setFilterDivisionId] = useState('')
  const [filterDepartmentId, setFilterDepartmentId] = useState('')
  const [allDivisions, setAllDivisions] = useState<DivisionResponse[]>([])
  const [filterDepartments, setFilterDepartments] = useState<DepartmentResponse[]>([])

  const loadData = useCallback(() => {
    const deptId = filterDepartmentId || null
    const divId = !filterDepartmentId ? filterDivisionId || null : null
    Promise.all([
      fetchApi<ProjectResponse[]>(ENDPOINTS.projects, { departmentId: deptId, divisionId: divId, count: String(pageSize), page: String(page) }),
      fetchApi<DepartmentResponse[]>(ENDPOINTS.departments),
    ])
      .then(([projs, depts]) => {
        setData(projs)
        setDepartments(depts)
        const deptMap = new Map(depts.map((d) => [d.id, d.name]))
        setRows(projs.map((p) => ({
          name: p.name,
          department: deptMap.get(p.departmentId) ?? `ID ${p.departmentId}`,
        })))
        fetchApi<PageCountResponse>(`${ENDPOINTS.projects}/pages`, { departmentId: deptId, divisionId: divId, count: String(pageSize) })
          .then((pages) => setTotalPages(pages.totalPages))
          .catch(() => setTotalPages(0))
      })
      .catch((err) => { console.error(err); setError('SERVER_ERROR') })
      .finally(() => setLoading(false))
  }, [filterDivisionId, filterDepartmentId, page, pageSize])

  useEffect(() => {
    fetchApi<DivisionResponse[]>(ENDPOINTS.divisions)
      .then(setAllDivisions)
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!filterDivisionId) return
    fetchApi<DepartmentResponse[]>(ENDPOINTS.departments, { divisionId: filterDivisionId })
      .then(setFilterDepartments)
      .catch(() => setFilterDepartments([]))
  }, [filterDivisionId])

  function handleDivisionChange(id: string) {
    setFilterDivisionId(id)
    setFilterDepartmentId('')
    setPage(0)
  }

  useEffect(loadData, [loadData])

  function notify(msg: string, type: 'success' | 'error' = 'success') {
    setNotification(msg)
    setNotifType(type)
  }

  async function handleDelete(index: number) {
    setDeleteIndex(index)
  }

  async function confirmDelete() {
    if (deleteIndex === null) return
    const item = data[deleteIndex]
    if (!item) return
    try {
      await deleteApi(`${ENDPOINTS.projects}/${item.id}`)
      notify(t('action.deleted'))
      loadData()
    } catch (err) {
      console.error(err)
      notify(t('action.error'), 'error')
    }
    setDeleteIndex(null)
  }

  async function confirmBulkDelete() {
    const indices = Array.from(selectedIndices)
    try {
      await Promise.all(indices.map((i) => deleteApi(`${ENDPOINTS.projects}/${data[i].id}`)))
      notify(t('action.deleted'))
      setSelectedIndices(new Set())
      loadData()
    } catch (err) {
      console.error(err)
      notify(t('action.error'), 'error')
    }
    setBulkDelete(false)
  }

  async function handleCreate(values: Record<string, string>) {
    try {
      await postApi(ENDPOINTS.projects, {
        name: values.name,
        departmentId: Number(values.departmentId),
      })
      notify(t('action.saved'))
      setCreating(false)
      loadData()
    } catch (err) {
      console.error(err)
      notify(t('action.error'), 'error')
    }
  }

  async function handleEdit(values: Record<string, string>) {
    if (editIndex === null) return
    const item = data[editIndex]
    try {
      await putApi(`${ENDPOINTS.projects}/${item.id}`, {
        name: values.name,
        departmentId: Number(values.departmentId),
      })
      notify(t('action.saved'))
      setEditIndex(null)
      loadData()
    } catch (err) {
      console.error(err)
      notify(t('action.error'), 'error')
    }
  }

  const editItem = editIndex !== null ? data[editIndex] : null
  const deleteItem = deleteIndex !== null ? data[deleteIndex] : null

  return (
    <>
      {notification && (
        <Notification message={notification} type={notifType} onClose={() => setNotification(null)} />
      )}
      {loading && <Loading />}
      {error && !loading && <ErrorState />}
      {!loading && !error && (
        <>
          <DataTable
            title={t('table.title_project')}
            columns={columns(t)}
            data={rows}
            onEdit={(i) => setEditIndex(i)}
            onDelete={handleDelete}
            selectedIndices={selectedIndices}
            onSelectionChange={setSelectedIndices}
            page={page}
            pageSize={pageSize}
            totalPages={totalPages}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            filterBar={
              <>
                <FilterSelect
                  label={t('edit.division')}
                  options={[{ value: '', label: t('table.all') }, ...allDivisions.map((d) => ({ value: String(d.id), label: d.name }))]}
                  value={filterDivisionId}
                  onChange={handleDivisionChange}
                />
                {filterDivisionId && (
                  <FilterSelect
                    label={t('edit.department')}
                    options={[{ value: '', label: t('table.all') }, ...filterDepartments.map((d) => ({ value: String(d.id), label: d.name }))]}
                    value={filterDepartmentId}
                    onChange={(id) => { setFilterDepartmentId(id); setPage(0) }}
                  />
                )}
              </>
            }
          />
          <Tooltip text={t('edit.title_create_project')}>
            <button
              onClick={() => setCreating(true)}
              className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-2xl text-white shadow-2xl transition-colors hover:bg-indigo-500"
            >
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </Tooltip>
          {editItem && (
            <EditModal
              title={t('edit.title_project')}
              fields={[
                { key: 'name', label: t('edit.name'), value: editItem.name },
                {
                  key: 'departmentId',
                  label: t('edit.department'),
                  value: String(editItem.departmentId),
                  searchable: true,
                  options: departments.map((d) => ({
                    value: String(d.id),
                    label: d.name,
                  })),
                },
              ]}
              onSave={handleEdit}
              onClose={() => setEditIndex(null)}
            />
          )}
          {creating && (
            <EditModal
              title={t('edit.title_create_project')}
              fields={[
                { key: 'name', label: t('edit.name'), value: '' },
                {
                  key: 'departmentId',
                  label: t('edit.department'),
                  value: '',
                  searchable: true,
                  options: departments.map((d) => ({
                    value: String(d.id),
                    label: d.name,
                  })),
                },
              ]}
              onSave={handleCreate}
              onClose={() => setCreating(false)}
            />
          )}
          {deleteItem && (
            <ConfirmDialog
              message={t('action.confirm_delete', { name: deleteItem.name })}
              onConfirm={confirmDelete}
              onClose={() => setDeleteIndex(null)}
            />
          )}
          {bulkDelete && (
            <ConfirmDialog
              message={t('action.confirm_delete_selected', { count: selectedIndices.size })}
              onConfirm={confirmBulkDelete}
              onClose={() => setBulkDelete(false)}
            />
          )}
          {selectedIndices.size > 0 && !bulkDelete && (
            <BulkActionBar count={selectedIndices.size} onDelete={() => setBulkDelete(true)} />
          )}
        </>
      )}
    </>
  )
}

export default Project
