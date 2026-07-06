import { useState, type ReactNode } from 'react'
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react'
import ContextMenu from './ContextMenu.tsx'
import Tooltip from './Tooltip.tsx'

type Column<T> = {
  key: keyof T
  header: string
  sortValue?: (row: T) => string
}

type DataTableProps<T> = {
  columns: Column<T>[]
  data: T[]
  title: string
  onEdit?: (index: number) => void
  onDelete?: (index: number) => void
  onHeaderContext?: (key: keyof T, e: React.MouseEvent) => void
  selectedIndices?: Set<number>
  onSelectionChange?: (indices: Set<number>) => void
  page?: number
  pageSize?: number
  totalPages?: number
  onPageChange?: (page: number) => void
  onPageSizeChange?: (size: number) => void
  filterBar?: ReactNode
}

const PAGE_SIZE_OPTIONS = [10, 25, 50]

function DataTable<T>({
  columns,
  data,
  title,
  onEdit,
  onDelete,
  onHeaderContext,
  selectedIndices,
  onSelectionChange,
  page,
  pageSize,
  totalPages,
  onPageChange,
  onPageSizeChange,
  filterBar,
}: DataTableProps<T>) {
  const [menu, setMenu] = useState<{ x: number; y: number; index: number } | null>(null)
  const [sortKey, setSortKey] = useState<keyof T | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [filterOpen, setFilterOpen] = useState(false)

  function handleSort(key: keyof T) {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const col = columns.find((c) => c.key === sortKey)
  const sorted = data
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      if (!sortKey || !col) return 0
      const va = col.sortValue ? col.sortValue(a.item) : String(a.item[sortKey] ?? '')
      const vb = col.sortValue ? col.sortValue(b.item) : String(b.item[sortKey] ?? '')
      const cmp = va.localeCompare(vb)
      return sortDir === 'asc' ? cmp : -cmp
    })

  function handleContext(e: React.MouseEvent, index: number) {
    if (!onEdit && !onDelete) return
    e.preventDefault()
    setMenu({ x: e.clientX, y: e.clientY, index })
  }

  function handleRowClick(e: React.MouseEvent, index: number) {
    if (!onSelectionChange) return

    const isCtrl = e.ctrlKey || e.metaKey
    const isShift = e.shiftKey

    if (isShift && selectedIndices && selectedIndices.size > 0) {
      const sortedIndices = Array.from(selectedIndices).sort((a, b) => a - b)
      const lastSelected = sortedIndices[sortedIndices.length - 1]
      const rangeStart = Math.min(lastSelected, index)
      const rangeEnd = Math.max(lastSelected, index)
      const next = new Set(selectedIndices)
      for (let i = rangeStart; i <= rangeEnd; i++) {
        next.add(i)
      }
      onSelectionChange(next)
    } else if (isCtrl && selectedIndices) {
      const next = new Set(selectedIndices)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      onSelectionChange(next)
    } else {
      if (selectedIndices && selectedIndices.has(index) && selectedIndices.size === 1) {
        onSelectionChange(new Set())
      } else {
        onSelectionChange(new Set([index]))
      }
    }
  }

  function handlePageSizeChange(size: number) {
    onPageSizeChange?.(size)
    onPageChange?.(0)
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white">{title}</h1>
        {filterBar && (
          <Tooltip text="Filters">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className={`rounded-lg p-2 transition-colors hover:bg-gray-800 ${
                filterOpen ? 'bg-gray-800 text-indigo-400' : 'text-gray-300'
              }`}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </button>
          </Tooltip>
        )}
      </div>
      {filterOpen && filterBar && (
        <div className="flex flex-wrap items-center gap-4 mb-4 w-[95%] mx-auto">
          <div className="flex flex-wrap items-center gap-4">
            {filterBar}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400 ml-auto">
            <span>Rows per page:</span>
            <Listbox value={pageSize ?? 25} onChange={handlePageSizeChange}>
              <ListboxButton className="flex items-center gap-1 rounded-lg border border-gray-600 bg-gray-800 px-3 py-1.5 text-sm text-gray-200 transition-colors hover:bg-gray-700 focus:outline-none">
                {pageSize}
                <svg className="h-3 w-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </ListboxButton>
              <ListboxOptions className="z-50 mt-1 rounded-lg border border-gray-600 bg-gray-800 py-1 text-sm shadow-xl" anchor="bottom start">
                {PAGE_SIZE_OPTIONS.map((s) => (
                  <ListboxOption
                    key={s}
                    value={s}
                    className="cursor-pointer px-3 py-1.5 text-gray-300 transition-colors data-[focus]:bg-gray-700 data-[selected]:text-indigo-400"
                  >
                    {s}
                  </ListboxOption>
                ))}
              </ListboxOptions>
            </Listbox>
          </div>
        </div>
      )}
      <div className="overflow-x-auto rounded-lg border border-gray-700">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="bg-gray-800 text-xs uppercase text-gray-400">
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  onClick={() => handleSort(col.key)}
                  onContextMenu={(e) => onHeaderContext?.(col.key, e)}
                  className="cursor-pointer select-none px-4 py-3 font-medium transition-colors hover:text-white"
                >
                  {col.header}
                  {sortKey === col.key && (
                    <span className="ml-1 inline-block">{sortDir === 'asc' ? '\u25B2' : '\u25BC'}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map(({ item, index }) => (
              <tr
                key={index}
                onClick={(e) => handleRowClick(e, index)}
                onContextMenu={(e) => handleContext(e, index)}
                className={`border-b border-gray-700 transition-colors cursor-pointer ${
                  menu?.index === index
                    ? 'bg-indigo-800/40'
                    : selectedIndices?.has(index)
                      ? 'bg-indigo-900/30 hover:bg-indigo-900/40'
                      : 'hover:bg-gray-700'
                }`}
              >
                {columns.map((col) => (
                  <td key={String(col.key)} className="px-4 py-3">
                    {String(item[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {page !== undefined && pageSize !== undefined && onPageChange && (
        <div className="flex items-center justify-between px-4 py-3 text-sm text-gray-400">
          <div />
          <div className="flex items-center gap-3">
            <span>{`Page ${(page ?? 0) + 1}${totalPages != null ? ` of ${totalPages}` : ''}`}</span>
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page === 0}
              className="rounded px-2 py-1 transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={totalPages != null ? page >= totalPages - 1 : false}
              className="rounded px-2 py-1 transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
      {menu && (
        <ContextMenu
          x={menu.x}
          y={menu.y}
          onEdit={onEdit ? () => onEdit(menu.index) : () => {}}
          onDelete={onDelete ? () => onDelete(menu.index) : () => {}}
          onClose={() => setMenu(null)}
        />
      )}
    </div>
  )
}

export type { Column, DataTableProps }
export default DataTable
