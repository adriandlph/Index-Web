import { useEffect, useState, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import type { DepartmentResponse, DivisionResponse, DepartmentRow, PageCountResponse } from '../types.ts'
import { fetchApi, postApi, putApi, deleteApi } from '../services/api.ts'
import { ENDPOINTS } from '../config/api.ts'
import { ROUTES } from '../config/routes.ts'
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
  { key: 'division' as const, header: t('table.col_division') },
]

function Department() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [data, setData] = useState<DepartmentResponse[]>([])
  const [rows, setRows] = useState<DepartmentRow[]>([])
  const [divisions, setDivisions] = useState<DivisionResponse[]>([])
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
  const [filterDivisionId, setFilterDivisionId] = useState(searchParams.get('divisionId') ?? '')

  const loadData = useCallback(() => {
    Promise.all([
      fetchApi<DepartmentResponse[]>(ENDPOINTS.departments, { divisionId: filterDivisionId || null, count: String(pageSize), page: String(page) }),
      fetchApi<DivisionResponse[]>(ENDPOINTS.divisions),
    ])
      .then(([depts, divs]) => {
        setData(depts)
        setDivisions(divs)
        const divMap = new Map(divs.map((d) => [d.id, d.name]))
        setRows(depts.map((d) => ({
          name: d.name,
          division: divMap.get(d.divisionId) ?? `${t('table.id_prefix')} ${d.divisionId}`,
        })))
        fetchApi<PageCountResponse>(`${ENDPOINTS.departments}/pages`, { divisionId: filterDivisionId || null, count: String(pageSize) })
          .then((pages) => setTotalPages(pages.totalPages))
          .catch(() => setTotalPages(0))
      })
      .catch((err) => { console.error(err); setError('SERVER_ERROR') })
      .finally(() => setLoading(false))
  }, [filterDivisionId, page, pageSize, t])

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
      await deleteApi(`${ENDPOINTS.departments}/${item.id}`)
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
      await Promise.all(indices.map((i) => deleteApi(`${ENDPOINTS.departments}/${data[i].id}`)))
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
      await postApi(ENDPOINTS.departments, {
        name: values.name,
        divisionId: Number(values.divisionId),
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
      await putApi(`${ENDPOINTS.departments}/${item.id}`, {
        name: values.name,
        divisionId: Number(values.divisionId),
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
            title={t('table.title_department')}
            columns={columns(t)}
            data={rows}
            onEdit={(i) => setEditIndex(i)}
            onDelete={handleDelete}
            onRowDoubleClick={(i) => navigate(`${ROUTES.project}?divisionId=${data[i].divisionId}&departmentId=${data[i].id}`)}
            selectedIndices={selectedIndices}
            onSelectionChange={setSelectedIndices}
            page={page}
            pageSize={pageSize}
            totalPages={totalPages}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            filterBar={
              <FilterSelect
                label={t('edit.division')}
                options={[{ value: '', label: t('table.all') }, ...divisions.map((d) => ({ value: String(d.id), label: d.name }))]}
                value={filterDivisionId}
                onChange={(id) => { setFilterDivisionId(id); setPage(0); setSearchParams(id ? { divisionId: id } : {}, { replace: true }) }}
              />
            }
          />
          <Tooltip text={t('edit.title_create_department')}>
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
              title={t('edit.title_department')}
              fields={[
                { key: 'name', label: t('edit.name'), value: editItem.name, required: true, placeholder: 'Department name' },
                {
                  key: 'divisionId',
                  label: t('edit.division'),
                  value: String(editItem.divisionId),
                  searchable: true,
                  required: true,
                  placeholder: 'Search division...',
                  options: divisions.map((d) => ({
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
              title={t('edit.title_create_department')}
              fields={[
                { key: 'name', label: t('edit.name'), value: '', required: true, placeholder: 'Department name' },
                {
                  key: 'divisionId',
                  label: t('edit.division'),
                  value: '',
                  searchable: true,
                  required: true,
                  placeholder: 'Search division...',
                  options: divisions.map((d) => ({
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

export default Department
