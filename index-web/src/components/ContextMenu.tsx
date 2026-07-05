import { useTranslation } from 'react-i18next'
import { Menu, MenuItems, MenuItem } from '@headlessui/react'

type ContextMenuProps = {
  x: number
  y: number
  onEdit: () => void
  onDelete: () => void
  onClose: () => void
}

function ContextMenu({ x, y, onEdit, onDelete }: ContextMenuProps) {
  const { t } = useTranslation()

  return (
    <Menu as="div" className="fixed z-50" style={{ left: x, top: y }}>
      <MenuItems className="w-40 rounded-lg border border-gray-700 bg-gray-800 py-1 shadow-xl">
        <MenuItem>
          <button
            onClick={() => onEdit()}
            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-200 transition-colors data-[focus]:bg-gray-700"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            {t('action.edit')}
          </button>
        </MenuItem>
        <MenuItem>
          <button
            onClick={() => onDelete()}
            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-400 transition-colors data-[focus]:bg-gray-700"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            {t('action.delete')}
          </button>
        </MenuItem>
      </MenuItems>
    </Menu>
  )
}

export default ContextMenu
