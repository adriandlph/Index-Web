import { useEffect, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import type { ProductResponse, ProjectResponse, ProductRow } from '../types.ts'
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

const columns = (t: TFunction) => [
  { key: 'name' as const, header: t('table.col_name') },
  { key: 'version' as const, header: t('table.col_version') },
  { key: 'date' as const, header: t('table.col_date') },
  { key: 'time' as const, header: t('table.col_time') },
  { key: 'description' as const, header: t('table.col_description') },
  { key: 'project' as const, header: t('table.col_project') },
]

function Product() {
  const { t } = useTranslation()
  const [data, setData] = useState<ProductResponse[]>([])
  const [rows, setRows] = useState<ProductRow[]>([])
  const [projects, setProjects] = useState<ProjectResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [creating, setCreating] = useState(false)
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set())
  const [notification, setNotification] = useState<string | null>(null)
  const [notifType, setNotifType] = useState<'success' | 'error'>('success')
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null)
  const [bulkDelete, setBulkDelete] = useState(false)

  const loadData = useCallback(() => {
    Promise.all([
      fetchApi<ProductResponse[]>(ENDPOINTS.products),
      fetchApi<ProjectResponse[]>(ENDPOINTS.projects),
    ])
      .then(([prods, projs]) => {
        setData(prods)
        setProjects(projs)
        const projMap = new Map(projs.map((p) => [p.id, p.name]))
        setRows(
          prods.map((p) => {
            const [date, time] = p.publishDate.includes('T')
              ? p.publishDate.split('T')
              : [p.publishDate, '']
            return {
              name: p.name,
              version: p.version,
              date,
              time: time ? time.split('.')[0] : '',
              description: p.description,
              project: projMap.get(p.projectId) ?? `ID ${p.projectId}`,
            }
          }),
        )
      })
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])

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
    } catch {
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
    } catch {
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
    } catch {
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
    } catch {
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
      {error && !loading && <ErrorState message={error} />}
      {!loading && !error && (
        <>
          <DataTable
            title={t('table.title_product')}
            columns={columns(t)}
            data={rows}
            onEdit={(i) => setEditIndex(i)}
            onDelete={handleDelete}
            selectable
            selectedIndices={selectedIndices}
            onSelectionChange={setSelectedIndices}
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
