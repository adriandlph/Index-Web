import { useState } from 'react'
import ContextMenu from './ContextMenu.tsx'

type Column<T> = {
  key: keyof T
  header: string
}

type DataTableProps<T> = {
  columns: Column<T>[]
  data: T[]
  title: string
  onEdit?: (index: number) => void
  onDelete?: (index: number) => void
  selectable?: boolean
  selectedIndices?: Set<number>
  onSelectionChange?: (indices: Set<number>) => void
}

function DataTable<T>({
  columns,
  data,
  title,
  onEdit,
  onDelete,
  selectable,
  selectedIndices,
  onSelectionChange,
}: DataTableProps<T>) {
  const [menu, setMenu] = useState<{ x: number; y: number; index: number } | null>(null)

  function handleContext(e: React.MouseEvent, index: number) {
    if (!onEdit && !onDelete) return
    e.preventDefault()
    setMenu({ x: e.clientX, y: e.clientY, index })
  }

  function toggleIndex(i: number) {
    if (!selectedIndices || !onSelectionChange) return
    const next = new Set(selectedIndices)
    if (next.has(i)) next.delete(i)
    else next.add(i)
    onSelectionChange(next)
  }

  function toggleAll() {
    if (!onSelectionChange) return
    if (selectedIndices && selectedIndices.size === data.length) {
      onSelectionChange(new Set())
    } else {
      onSelectionChange(new Set(data.map((_, i) => i)))
    }
  }

  const allSelected = selectedIndices && selectedIndices.size === data.length && data.length > 0

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-white mb-6">{title}</h1>
      <div className="overflow-x-auto rounded-lg border border-gray-700">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="bg-gray-800 text-xs uppercase text-gray-400">
            <tr>
              {selectable && (
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="h-4 w-4 rounded border-gray-600 bg-gray-700 accent-indigo-500"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th key={String(col.key)} className="px-4 py-3 font-medium">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr
                key={i}
                onContextMenu={(e) => handleContext(e, i)}
                className={`border-b border-gray-700 transition-colors ${
                  selectedIndices?.has(i)
                    ? 'bg-indigo-900/30 hover:bg-indigo-900/40'
                    : 'hover:bg-gray-700'
                }`}
              >
                {selectable && (
                  <td className="w-10 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedIndices?.has(i) ?? false}
                      onChange={() => toggleIndex(i)}
                      className="h-4 w-4 rounded border-gray-600 bg-gray-700 accent-indigo-500"
                    />
                  </td>
                )}
                {columns.map((col) => (
                  <td key={String(col.key)} className="px-4 py-3">
                    {String(row[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
