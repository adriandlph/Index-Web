import { useEffect, useState, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import type { ProductResponse, ProjectResponse, DepartmentResponse, DivisionResponse, ProductRow, PageCountResponse } from '../types.ts'
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
  { key: 'version' as const, header: t('table.col_version') },
  { key: 'date' as const, header: t('table.col_date'), sortValue: (r: ProductRow) => `${r.date}T${r.time}` },
  { key: 'time' as const, header: t('table.col_time'), sortValue: (r: ProductRow) => `${r.date}T${r.time}` },
  { key: 'description' as const, header: t('table.col_description') },
  { key: 'project' as const, header: t('table.col_project') },
]

function Product() {
  const { t } = useTranslation()
  const [data, setData] = useState<ProductResponse[]>([])
  const [projects, setProjects] = useState<ProjectResponse[]>([])
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
  const [dateFormat, setDateFormat] = useState<'DD-MM-YYYY' | 'YYYY-MM-DD'>('DD-MM-YYYY')
  const [filterDivisionId, setFilterDivisionId] = useState('')
  const [filterDepartmentId, setFilterDepartmentId] = useState('')
  const [filterProjectId, setFilterProjectId] = useState('')
  const [allDivisions, setAllDivisions] = useState<DivisionResponse[]>([])
  const [filterDepartments, setFilterDepartments] = useState<DepartmentResponse[]>([])
  const [filterProjects, setFilterProjects] = useState<ProjectResponse[]>([])

  const rows = useMemo(() => {
    const projMap = new Map(projects.map((p) => [p.id, p.name]))
    return data.map((p) => {
      const [rawDate, rawTime] = p.publishDate.includes('T')
        ? p.publishDate.split('T')
        : [p.publishDate, '']
      const date = dateFormat === 'DD-MM-YYYY' && rawDate
        ? rawDate.split('-').reverse().join('-')
        : rawDate
      return {
        name: p.name,
        version: p.version,
        date,
        time: rawTime ? rawTime.split('.')[0] : '',
        description: p.description,
        project: projMap.get(p.projectId) ?? `ID ${p.projectId}`,
      }
    })
  }, [data, projects, dateFormat])

  const loadData = useCallback(() => {
    const projId = filterProjectId || null
    const deptId = !filterProjectId ? filterDepartmentId || null : null
    const divId = !filterProjectId && !filterDepartmentId ? filterDivisionId || null : null
    Promise.all([
      fetchApi<ProductResponse[]>(ENDPOINTS.products, { projectId: projId, departmentId: deptId, divisionId: divId, count: String(pageSize), page: String(page) }),
      fetchApi<ProjectResponse[]>(ENDPOINTS.projects),
    ])
      .then(([prods, projs]) => {
        setData(prods)
        setProjects(projs)
        fetchApi<PageCountResponse>(`${ENDPOINTS.products}/pages`, { projectId: projId, departmentId: deptId, divisionId: divId, count: String(pageSize) })
          .then((pages) => setTotalPages(pages.totalPages))
          .catch(() => setTotalPages(0))
      })
      .catch((err) => { console.error(err); setError('SERVER_ERROR') })
      .finally(() => setLoading(false))
  }, [filterDivisionId, filterDepartmentId, filterProjectId, page, pageSize])

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

  useEffect(() => {
    if (!filterDepartmentId) return
    fetchApi<ProjectResponse[]>(ENDPOINTS.projects, { departmentId: filterDepartmentId })
      .then(setFilterProjects)
      .catch(() => setFilterProjects([]))
  }, [filterDepartmentId])

  function handleDivisionChange(id: string) {
    setFilterDivisionId(id)
    setFilterDepartmentId('')
    setFilterProjectId('')
    setPage(0)
  }

  function handleDepartmentChange(id: string) {
    setFilterDepartmentId(id)
    setFilterProjectId('')
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
      await deleteApi(`${ENDPOINTS.products}/${item.id}`)
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
      await Promise.all(indices.map((i) => deleteApi(`${ENDPOINTS.products}/${data[i].id}`)))
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
      const publishDate = values.date && values.time
        ? `${values.date}T${values.time}`
        : values.date || new Date().toISOString()
      await postApi(ENDPOINTS.products, {
        name: values.name,
        version: values.version,
        publishDate,
        description: values.description,
        projectId: Number(values.projectId),
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
      const publishDate = values.date && values.time
        ? `${values.date}T${values.time}`
        : values.date || item.publishDate
      await putApi(`${ENDPOINTS.products}/${item.id}`, {
        name: values.name,
        version: values.version,
        publishDate,
        description: values.description,
        projectId: Number(values.projectId),
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
            title={t('table.title_product')}
            columns={columns(t)}
            data={rows}
            onEdit={(i) => setEditIndex(i)}
            onDelete={handleDelete}
            onHeaderContext={(key, e) => {
              if (key === 'date') {
                e.preventDefault()
                setDateFormat(dateFormat === 'DD-MM-YYYY' ? 'YYYY-MM-DD' : 'DD-MM-YYYY')
              }
            }}
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
                    onChange={handleDepartmentChange}
                  />
                )}
                {filterDepartmentId && (
                  <FilterSelect
                    label={t('edit.project')}
                    options={[{ value: '', label: t('table.all') }, ...filterProjects.map((p) => ({ value: String(p.id), label: p.name }))]}
                    value={filterProjectId}
                    onChange={(id) => { setFilterProjectId(id); setPage(0) }}
                  />
                )}
              </>
            }
          />
          <Tooltip text={t('edit.title_create_product')}>
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
              title={t('edit.title_product')}
              fields={[
                { key: 'name', label: t('edit.name'), value: editItem.name },
                { key: 'version', label: t('edit.version'), value: editItem.version },
                {
                  key: 'date',
                  label: t('edit.publishDate'),
                  value: editItem.publishDate.includes('T')
                    ? editItem.publishDate.split('T')[0]
                    : editItem.publishDate,
                },
                {
                  key: 'time',
                  label: t('table.col_time'),
                  value: editItem.publishDate.includes('T')
                    ? editItem.publishDate.split('T')[1].split('.')[0]
                    : '',
                },
                {
                  key: 'description',
                  label: t('edit.description'),
                  value: editItem.description,
                },
                {
                  key: 'projectId',
                  label: t('edit.project'),
                  value: String(editItem.projectId),
                  searchable: true,
                  options: projects.map((p) => ({
                    value: String(p.id),
                    label: p.name,
                  })),
                },
              ]}
              onSave={handleEdit}
              onClose={() => setEditIndex(null)}
            />
          )}
          {creating && (
            <EditModal
              title={t('edit.title_create_product')}
              fields={[
                { key: 'name', label: t('edit.name'), value: '' },
                { key: 'version', label: t('edit.version'), value: '' },
                { key: 'date', label: t('edit.publishDate'), value: '' },
                { key: 'time', label: t('table.col_time'), value: '' },
                { key: 'description', label: t('edit.description'), value: '' },
                {
                  key: 'projectId',
                  label: t('edit.project'),
                  value: '',
                  searchable: true,
                  options: projects.map((p) => ({
                    value: String(p.id),
                    label: p.name,
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

export default Product
